import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { api } from '../data/api';
import { useApi } from '../data/useApi';
import { format, parseISO, isAfter } from 'date-fns';
import { ru } from 'date-fns/locale';
import Badge from '../components/UI/Badge';

export default function Dashboard() {
  const { data: books } = useApi(api.getBooks);
  const { data: readers } = useApi(api.getReaders);
  const { data: issuances } = useApi(api.getIssuances);
  const today = new Date();

  const stats = useMemo(() => {
    const iss = issuances ?? [];
    const bks = books ?? [];
    const active = iss.filter(i => i.status !== 'returned');
    const overdue = active.filter(i => isAfter(today, parseISO(i.due_date)));
    const returned = iss.filter(i => i.status === 'returned');
    const totalCopies = bks.reduce((s, b) => s + b.total_copies, 0);
    const availableCopies = bks.reduce((s, b) => s + b.available_copies, 0);
    return { active, overdue, returned, totalCopies, availableCopies };
  }, [books, issuances]);

  const recentIssuances = useMemo(() =>
    [...(issuances ?? [])].sort((a, b) => b.issued_at.localeCompare(a.issued_at)).slice(0, 6),
    [issuances]
  );

  const overdueIssuances = useMemo(() =>
    (issuances ?? []).filter(i => i.status !== 'returned' && isAfter(today, parseISO(i.due_date))),
    [issuances]
  );

  const statCards = [
    { label: 'Книг в фонде', value: (books ?? []).length, sub: `${stats.totalCopies} экз.`, icon: BookOpen, color: 'blue', to: '/books' },
    { label: 'Читателей', value: (readers ?? []).filter(r => r.is_active).length, sub: 'активных', icon: Users, color: 'green', to: '/readers' },
    { label: 'Выдано сейчас', value: stats.active.length, sub: 'активных выдач', icon: ArrowLeftRight, color: 'purple', to: '/issuances' },
    { label: 'Просрочено', value: stats.overdue.length, sub: 'требуют возврата', icon: AlertTriangle, color: 'red', to: '/issuances' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Главная страница</h1>
          <p className="page-subtitle">
            Муниципальная библиотека №18 им. А.И. Куприна — {format(new Date(), 'd MMMM yyyy', { locale: ru })}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map(card => (
          <Link key={card.label} to={card.to} className="stat-card">
            <div className={`stat-icon stat-icon-${card.color}`}><card.icon size={22} /></div>
            <div className="stat-info">
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-sub">{card.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><Clock size={16} />Последние выдачи</h2>
            <Link to="/issuances" className="card-link">Все выдачи →</Link>
          </div>
          <table className="table">
            <thead><tr><th>Книга</th><th>Читатель</th><th>Дата выдачи</th><th>Статус</th></tr></thead>
            <tbody>
              {recentIssuances.map(iss => (
                <tr key={iss.id}>
                  <td className="td-main">{iss.book.title}</td>
                  <td>{iss.reader.last_name} {iss.reader.first_name[0]}.</td>
                  <td>{format(parseISO(iss.issued_at), 'dd.MM.yyyy')}</td>
                  <td>
                    <Badge variant={iss.status === 'returned' ? 'success' : isAfter(today, parseISO(iss.due_date)) ? 'danger' : 'info'}>
                      {iss.status === 'returned' ? 'Возвращена' : isAfter(today, parseISO(iss.due_date)) ? 'Просрочена' : 'На руках'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><AlertTriangle size={16} style={{ color: '#ef4444' }} />Просроченные выдачи</h2>
            {overdueIssuances.length > 0 && <span className="badge badge-danger">{overdueIssuances.length}</span>}
          </div>
          {overdueIssuances.length === 0 ? (
            <div className="empty-state">
              <TrendingUp size={40} style={{ color: '#22c55e', margin: '0 auto 0.5rem' }} />
              <p>Просроченных выдач нет</p>
            </div>
          ) : (
            <table className="table">
              <thead><tr><th>Читатель</th><th>Книга</th><th>Срок возврата</th><th>Телефон</th></tr></thead>
              <tbody>
                {overdueIssuances.map(iss => (
                  <tr key={iss.id} className="tr-danger">
                    <td className="td-main">{iss.reader.last_name} {iss.reader.first_name[0]}.</td>
                    <td>{iss.book.title}</td>
                    <td style={{ color: '#ef4444', fontWeight: 600 }}>{format(parseISO(iss.due_date), 'dd.MM.yyyy')}</td>
                    <td>{iss.reader.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="dashboard-grid-3">
        <div className="card">
          <div className="card-header"><h2 className="card-title">Книжный фонд</h2></div>
          <div className="fund-stats">
            <div className="fund-stat"><span className="fund-stat-value">{stats.totalCopies}</span><span className="fund-stat-label">Всего</span></div>
            <div className="fund-stat"><span className="fund-stat-value" style={{ color: '#22c55e' }}>{stats.availableCopies}</span><span className="fund-stat-label">Доступно</span></div>
            <div className="fund-stat"><span className="fund-stat-value" style={{ color: '#f59e0b' }}>{stats.totalCopies - stats.availableCopies}</span><span className="fund-stat-label">Выдано</span></div>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: stats.totalCopies ? `${((stats.totalCopies - stats.availableCopies) / stats.totalCopies) * 100}%` : '0%' }} />
          </div>
          <p className="progress-label">
            {stats.totalCopies ? Math.round(((stats.totalCopies - stats.availableCopies) / stats.totalCopies) * 100) : 0}% фонда на руках
          </p>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">Популярные жанры</h2></div>
          <div className="genre-list">
            {Object.entries((books ?? []).reduce<Record<string, number>>((acc, b) => {
              acc[b.genre] = (acc[b.genre] || 0) + 1; return acc;
            }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([genre, count]) => (
              <div key={genre} className="genre-item">
                <span>{genre}</span><span className="genre-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">Активность</h2></div>
          <div className="activity-list">
            {[
              { dot: 'dot-blue', label: 'Выдач всего', value: (issuances ?? []).length },
              { dot: 'dot-green', label: 'Возвратов', value: stats.returned.length },
              { dot: 'dot-purple', label: 'На руках', value: stats.active.length },
              { dot: 'dot-red', label: 'Просрочено', value: stats.overdue.length },
            ].map(item => (
              <div key={item.label} className="activity-item">
                <span className={`activity-dot ${item.dot}`} />
                <div>
                  <div className="activity-label">{item.label}</div>
                  <div className="activity-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
