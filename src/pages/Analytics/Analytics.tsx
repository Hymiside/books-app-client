import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { api } from '../../data/api';
import { useApi } from '../../data/useApi';
import { format, parseISO, isAfter, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Analytics() {
  const { data: books } = useApi(api.getBooks);
  const { data: readers } = useApi(api.getReaders);
  const { data: issuances } = useApi(api.getIssuances);
  const bks = books ?? [], rdrs = readers ?? [], iss = issuances ?? [];
  const today = new Date();

  const genreData = useMemo(() => {
    const map: Record<string, number> = {};
    bks.forEach(b => { map[b.genre] = (map[b.genre] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [bks]);

  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(today, 5 - i);
      const start = startOfMonth(date), end = endOfMonth(date);
      return {
        month: format(date, 'MMM', { locale: ru }),
        'Выдано': iss.filter(i => isWithinInterval(parseISO(i.issued_at), { start, end })).length,
        'Возвращено': iss.filter(i => i.returned_at && isWithinInterval(parseISO(i.returned_at), { start, end })).length,
      };
    });
  }, [iss]);

  const topBooks = useMemo(() => {
    const map: Record<number, number> = {};
    iss.forEach(i => { map[i.book_id] = (map[i.book_id] || 0) + 1; });
    return Object.entries(map)
      .map(([id, count]) => ({ book: bks.find(b => b.id === Number(id)), count }))
      .filter(x => x.book).sort((a, b) => b.count - a.count).slice(0, 5)
      .map(x => ({ name: x.book!.title, Выдач: x.count }));
  }, [iss, bks]);

  const topReaders = useMemo(() => {
    const map: Record<number, number> = {};
    iss.forEach(i => { map[i.reader_id] = (map[i.reader_id] || 0) + 1; });
    return Object.entries(map)
      .map(([id, count]) => ({ reader: rdrs.find(r => r.id === Number(id)), count }))
      .filter(x => x.reader).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [iss, rdrs]);

  const availabilityData = useMemo(() => [
    { name: 'Доступно', value: bks.reduce((s, b) => s + b.available_copies, 0) },
    { name: 'На руках', value: bks.reduce((s, b) => s + (b.total_copies - b.available_copies), 0) },
  ], [bks]);

  const statusData = useMemo(() => {
    const overdue = iss.filter(i => i.status !== 'returned' && isAfter(today, parseISO(i.due_date)));
    const active = iss.filter(i => i.status === 'active' && !isAfter(today, parseISO(i.due_date)));
    const returned = iss.filter(i => i.status === 'returned');
    return [{ name: 'На руках', value: active.length }, { name: 'Возвращено', value: returned.length }, { name: 'Просрочено', value: overdue.length }];
  }, [iss]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Аналитика</h1>
          <p className="page-subtitle">Статистика работы библиотеки</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card analytics-card-wide">
          <div className="card-header"><h2 className="card-title">Выдача по месяцам (последние 6 мес.)</h2></div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" /><YAxis allowDecimals={false} />
              <Tooltip /><Legend />
              <Bar dataKey="Выдано" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Возвращено" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">Жанры книг</h2></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={genreData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}>
                {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">Состояние фонда</h2></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={availabilityData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value"
                label={({ name, value }: { name?: string; value?: number }) => `${name}: ${value}`}>
                <Cell fill="#22c55e" /><Cell fill="#f59e0b" />
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card analytics-card-wide">
          <div className="card-header"><h2 className="card-title">Топ-5 популярных книг</h2></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topBooks} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12 }}
                tickFormatter={v => v.length > 20 ? v.slice(0, 20) + '…' : v} />
              <Tooltip formatter={(v) => [v, 'Выдач']} />
              <Bar dataKey="Выдач" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">Самые активные читатели</h2></div>
          <div className="top-readers-list">
            {topReaders.map((item, i) => (
              <div key={item.reader!.id} className="top-reader-item">
                <span className="top-reader-rank">{i + 1}</span>
                <div className="top-reader-info">
                  <div className="top-reader-name">{item.reader!.last_name} {item.reader!.first_name} {item.reader!.patronymic}</div>
                  <div className="top-reader-card">{item.reader!.card_number}</div>
                </div>
                <span className="top-reader-count">{item.count} кн.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">Статус выдач</h2></div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                label={({ name, value }: { name?: string; value?: number }) => `${name}: ${value}`}>
                <Cell fill="#6366f1" /><Cell fill="#22c55e" /><Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header"><h2 className="card-title">Сводная статистика</h2></div>
        <div className="summary-grid">
          {[
            { value: bks.length, label: 'Наименований книг' },
            { value: bks.reduce((s, b) => s + b.total_copies, 0), label: 'Всего экземпляров' },
            { value: rdrs.length, label: 'Читателей зарегистрировано' },
            { value: rdrs.filter(r => r.is_active).length, label: 'Активных читателей' },
            { value: iss.length, label: 'Всего выдач' },
            { value: `${iss.length ? Math.round(iss.filter(i => i.status === 'returned').length / iss.length * 100) : 0}%`, label: 'Процент возвратов' },
          ].map(item => (
            <div key={item.label} className="summary-item">
              <div className="summary-value">{item.value}</div>
              <div className="summary-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
