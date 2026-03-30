import { useState, useMemo } from 'react';
import { Plus, Search, RotateCcw, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';
import { api, type IssuanceOut } from '../../data/api';
import { useApi } from '../../data/useApi';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import IssuanceForm from './IssuanceForm';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

export default function IssuancesList() {
  const { data: issuances, loading, setData } = useApi(api.getIssuances);
  const { data: books } = useApi(api.getBooks);
  const { data: readers } = useApi(api.getReaders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [returnTarget, setReturnTarget] = useState<IssuanceOut | null>(null);

  const today = new Date();

  const enriched = useMemo(() =>
    (issuances ?? []).map(iss => ({
      ...iss,
      isOverdue: iss.status !== 'returned' && isAfter(today, parseISO(iss.due_date)),
    })),
    [issuances]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter(iss => {
      const matchSearch = !q || iss.book.title.toLowerCase().includes(q) ||
        iss.reader.last_name.toLowerCase().includes(q) || iss.reader.card_number.toLowerCase().includes(q);
      const matchStatus = !statusFilter ||
        (statusFilter === 'active' && iss.status === 'active' && !iss.isOverdue) ||
        (statusFilter === 'overdue' && iss.isOverdue) ||
        (statusFilter === 'returned' && iss.status === 'returned');
      return matchSearch && matchStatus;
    });
  }, [enriched, search, statusFilter]);

  async function handleIssue(bookId: number, readerId: number, dueDate: string, notes: string) {
    const iss = await api.createIssuance({ book_id: bookId, reader_id: readerId, due_date: dueDate, notes: notes || undefined });
    setData(prev => [iss, ...(prev ?? [])]);
    setShowAdd(false);
  }

  async function handleReturn() {
    if (!returnTarget) return;
    const updated = await api.returnBook(returnTarget.id, new Date().toISOString().slice(0, 10));
    setData(prev => prev?.map(i => i.id === updated.id ? updated : i) ?? []);
    setReturnTarget(null);
  }

  const counts = useMemo(() => ({
    active: enriched.filter(i => i.status === 'active' && !i.isOverdue).length,
    overdue: enriched.filter(i => i.isOverdue).length,
    returned: enriched.filter(i => i.status === 'returned').length,
  }), [enriched]);

  if (loading) return <div className="page"><div className="loading">Загрузка...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Выдача книг</h1>
          <p className="page-subtitle">Всего выдач: {issuances?.length ?? 0}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Выдать книгу</button>
      </div>

      <div className="issuance-tabs">
        {[
          { key: '', label: 'Все', count: issuances?.length ?? 0 },
          { key: 'active', label: 'На руках', count: counts.active },
          { key: 'overdue', label: 'Просрочено', count: counts.overdue, danger: true },
          { key: 'returned', label: 'Возвращены', count: counts.returned },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${t.danger && statusFilter === t.key ? '' : ''} ${statusFilter === t.key ? 'active' : ''} ${t.danger ? 'tab-btn-danger' : ''}`}
            onClick={() => setStatusFilter(t.key)}>
            {t.danger && <AlertTriangle size={14} />}{t.label} <span className="tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="input search-input" placeholder="Поиск по книге, читателю..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Книга</th><th>Читатель</th><th>Дата выдачи</th><th>Срок возврата</th><th>Возвращена</th><th>Статус</th><th>Действия</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="empty-row"><ArrowLeftRight size={32} /><br/>Нет записей</td></tr>}
            {filtered.map(iss => (
              <tr key={iss.id} className={iss.isOverdue ? 'tr-danger' : ''}>
                <td className="td-main">{iss.book.title}<br/><small style={{ color: '#6b7280' }}>{iss.book.author}</small></td>
                <td>{iss.reader.last_name} {iss.reader.first_name[0]}.<br/><small style={{ color: '#6b7280' }}>{iss.reader.card_number}</small></td>
                <td>{format(parseISO(iss.issued_at), 'dd.MM.yyyy')}</td>
                <td style={{ color: iss.isOverdue ? '#ef4444' : 'inherit', fontWeight: iss.isOverdue ? 600 : 400 }}>
                  {format(parseISO(iss.due_date), 'dd.MM.yyyy')}
                </td>
                <td>{iss.returned_at ? format(parseISO(iss.returned_at), 'dd.MM.yyyy') : '—'}</td>
                <td>
                  <Badge variant={iss.status === 'returned' ? 'success' : iss.isOverdue ? 'danger' : 'info'}>
                    {iss.status === 'returned' ? 'Возвращена' : iss.isOverdue ? 'Просрочена' : 'На руках'}
                  </Badge>
                </td>
                <td>
                  {iss.status !== 'returned' && (
                    <button className="btn btn-sm btn-success" onClick={() => setReturnTarget(iss)}>
                      <RotateCcw size={13} /> Вернуть
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && books && readers && (
        <Modal title="Выдать книгу" onClose={() => setShowAdd(false)} size="md">
          <IssuanceForm books={books} readers={readers} onSubmit={handleIssue} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      {returnTarget && (
        <ConfirmDialog title="Принять возврат"
          message={`Подтвердить возврат «${returnTarget.book.title}» от ${returnTarget.reader.last_name}?`}
          onConfirm={handleReturn} onCancel={() => setReturnTarget(null)} confirmLabel="Подтвердить" />
      )}
    </div>
  );
}
