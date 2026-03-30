import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { api, type ReaderOut, type ReaderIn } from '../../data/api';
import { useApi } from '../../data/useApi';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import ReaderForm from './ReaderForm';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

export default function ReadersList() {
  const { data: readers, loading, setData } = useApi(api.getReaders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'view'>(null);
  const [selected, setSelected] = useState<ReaderOut | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReaderOut | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (readers ?? []).filter(r =>
      (!q || r.last_name.toLowerCase().includes(q) || r.first_name.toLowerCase().includes(q) ||
        r.card_number.toLowerCase().includes(q) || r.phone.includes(q)) &&
      (!statusFilter || (statusFilter === 'active' ? r.is_active : !r.is_active))
    );
  }, [readers, search, statusFilter]);

  async function handleAdd(data: ReaderIn) {
    const r = await api.createReader(data);
    setData(prev => [...(prev ?? []), r]);
    setModal(null);
  }

  async function handleEdit(data: ReaderIn) {
    if (!selected) return;
    const updated = await api.updateReader(selected.id, data);
    setData(prev => prev?.map(r => r.id === updated.id ? updated : r) ?? []);
    setModal(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await api.deleteReader(deleteTarget.id);
    setData(prev => prev?.filter(r => r.id !== deleteTarget.id) ?? []);
    setDeleteTarget(null);
  }

  const fullName = (r: ReaderOut) => `${r.last_name} ${r.first_name} ${r.patronymic}`.trim();

  if (loading) return <div className="page"><div className="loading">Загрузка...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Читатели</h1>
          <p className="page-subtitle">
            Всего: {readers?.length ?? 0} | Активных: {readers?.filter(r => r.is_active).length ?? 0}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Добавить читателя</button>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="input search-input" placeholder="Поиск по ФИО, номеру билета..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input select-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Все</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>№ билета</th><th>ФИО</th><th>Дата рождения</th><th>Телефон</th><th>Email</th><th>Дата рег.</th><th>Статус</th><th>Действия</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={8} className="empty-row"><Users size={32} /><br/>Не найдено</td></tr>}
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="td-mono">{r.card_number}</td>
                <td className="td-main">{fullName(r)}</td>
                <td>{format(parseISO(r.birth_date), 'dd.MM.yyyy')}</td>
                <td>{r.phone}</td>
                <td>{r.email || '—'}</td>
                <td>{format(parseISO(r.registration_date), 'dd.MM.yyyy')}</td>
                <td><Badge variant={r.is_active ? 'success' : 'neutral'}>{r.is_active ? 'Активен' : 'Неактивен'}</Badge></td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn" onClick={() => { setSelected(r); setModal('view'); }}><Eye size={15} /></button>
                    <button className="icon-btn" onClick={() => { setSelected(r); setModal('edit'); }}><Edit2 size={15} /></button>
                    <button className="icon-btn danger" onClick={() => setDeleteTarget(r)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === 'add' && (
        <Modal title="Добавить читателя" onClose={() => setModal(null)} size="lg">
          <ReaderForm onSubmit={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title="Редактировать читателя" onClose={() => setModal(null)} size="lg">
          <ReaderForm initial={toReaderIn(selected)} onSubmit={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'view' && selected && (
        <Modal title="Карточка читателя" onClose={() => setModal(null)} size="md">
          <div className="detail-grid">
            <div className="detail-row"><span>Читательский билет:</span><span className="td-mono">{selected.card_number}</span></div>
            <div className="detail-row"><span>ФИО:</span><strong>{fullName(selected)}</strong></div>
            <div className="detail-row"><span>Дата рождения:</span><span>{format(parseISO(selected.birth_date), 'dd.MM.yyyy')}</span></div>
            <div className="detail-row"><span>Адрес:</span><span>{selected.address || '—'}</span></div>
            <div className="detail-row"><span>Телефон:</span><span>{selected.phone}</span></div>
            <div className="detail-row"><span>Email:</span><span>{selected.email || '—'}</span></div>
            <div className="detail-row"><span>Дата регистрации:</span><span>{format(parseISO(selected.registration_date), 'dd.MM.yyyy')}</span></div>
            <div className="detail-row"><span>Статус:</span>
              <Badge variant={selected.is_active ? 'success' : 'neutral'}>{selected.is_active ? 'Активен' : 'Неактивен'}</Badge>
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Закрыть</button>
            <button className="btn btn-primary" onClick={() => setModal('edit')}>Редактировать</button>
          </div>
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog title="Удалить читателя" message={`Удалить читателя ${fullName(deleteTarget)}?`}
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmLabel="Удалить" danger />
      )}
    </div>
  );
}

function toReaderIn(r: ReaderOut): ReaderIn {
  return {
    card_number: r.card_number, last_name: r.last_name, first_name: r.first_name,
    patronymic: r.patronymic, birth_date: r.birth_date, address: r.address,
    phone: r.phone, email: r.email, registration_date: r.registration_date, is_active: r.is_active,
  };
}
