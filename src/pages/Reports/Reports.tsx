import { useState, useRef } from 'react';
import { FileText, Printer } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';
import { api } from '../../data/api';
import { useApi } from '../../data/useApi';

const today = format(new Date(), 'dd.MM.yyyy');
const now = new Date();

type ReportType = 'issuances' | 'overdue' | 'fund' | 'readers' | 'returnedPeriod';

const reportDefs = [
  { id: 'issuances' as ReportType, label: 'Ведомость выдачи книг', icon: '📋', desc: 'Список всех текущих выдач' },
  { id: 'overdue' as ReportType, label: 'Список должников', icon: '⚠️', desc: 'Читатели с просроченными книгами' },
  { id: 'fund' as ReportType, label: 'Инвентаризация книжного фонда', icon: '📚', desc: 'Полный список книг с экземплярами' },
  { id: 'readers' as ReportType, label: 'Список читателей', icon: '👥', desc: 'Регистрационные карточки читателей' },
  { id: 'returnedPeriod' as ReportType, label: 'Акт о возвратах книг', icon: '✅', desc: 'Книги, возвращённые за период' },
];

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { data: books } = useApi(api.getBooks);
  const { data: readers } = useApi(api.getReaders);
  const { data: issuances } = useApi(api.getIssuances);

  const bks = books ?? [], rdrs = readers ?? [], iss = issuances ?? [];

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Отчёт</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Times New Roman',serif;font-size:12pt;padding:20mm}
      h1{font-size:16pt;text-align:center;margin-bottom:4mm}h2{font-size:14pt;text-align:center;font-weight:normal;margin-bottom:8mm}
      .org{text-align:center;font-size:11pt;margin-bottom:2mm}.date{text-align:right;margin-bottom:8mm}
      table{width:100%;border-collapse:collapse;margin-top:4mm}th,td{border:1px solid #000;padding:3mm 4mm;font-size:10pt;vertical-align:top}
      th{background:#f0f0f0;font-weight:bold;text-align:center}.total{margin-top:4mm;text-align:right;font-weight:bold}
      .sign-row{display:flex;justify-content:space-between;margin-top:16mm}.sign-block{width:45%}
      .sign-line{border-bottom:1px solid #000;margin-top:8mm}</style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }

  function renderReport() {
    if (!activeReport) return null;

    if (activeReport === 'issuances') {
      const active = iss.filter(i => i.status !== 'returned').sort((a, b) => a.reader.last_name.localeCompare(b.reader.last_name));
      return <>
        <p className="org">Муниципальная библиотека №18 им. А.И. Куприна, г. Пермь</p>
        <h1>ВЕДОМОСТЬ ВЫДАЧИ КНИГ</h1>
        <p className="org">на {today} г.</p><br />
        <table>
          <thead><tr><th>№</th><th>Читатель</th><th>№ билета</th><th>Книга</th><th>Автор</th><th>Дата выдачи</th><th>Срок возврата</th><th>Статус</th></tr></thead>
          <tbody>
            {active.map((i, n) => (
              <tr key={i.id} style={isAfter(now, parseISO(i.due_date)) ? { background: '#fff3f3' } : {}}>
                <td style={{ textAlign: 'center' }}>{n + 1}</td>
                <td>{i.reader.last_name} {i.reader.first_name} {i.reader.patronymic}</td>
                <td style={{ textAlign: 'center' }}>{i.reader.card_number}</td>
                <td>{i.book.title}</td><td>{i.book.author}</td>
                <td style={{ textAlign: 'center' }}>{format(parseISO(i.issued_at), 'dd.MM.yyyy')}</td>
                <td style={{ textAlign: 'center' }}>{format(parseISO(i.due_date), 'dd.MM.yyyy')}</td>
                <td style={{ textAlign: 'center' }}>{isAfter(now, parseISO(i.due_date)) ? 'ПРОСРОЧЕНА' : 'На руках'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total">Итого: {active.length} книг на руках</p>
        <div className="sign-row">
          <div className="sign-block">Библиотекарь: <div className="sign-line" /></div>
          <div className="sign-block">Заведующий: <div className="sign-line" /></div>
        </div>
      </>;
    }

    if (activeReport === 'overdue') {
      const overdue = iss.filter(i => i.status !== 'returned' && isAfter(now, parseISO(i.due_date)));
      return <>
        <p className="org">Муниципальная библиотека №18 им. А.И. Куприна, г. Пермь</p>
        <h1>СПИСОК ДОЛЖНИКОВ</h1>
        <p className="date">Дата составления: {today}</p>
        <table>
          <thead><tr><th>№</th><th>Читатель</th><th>№ билета</th><th>Телефон</th><th>Книга</th><th>Дата выдачи</th><th>Срок возврата</th><th>Просрочено (дн.)</th></tr></thead>
          <tbody>
            {overdue.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '8mm' }}>Должников нет</td></tr>
              : overdue.map((i, n) => {
                const days = Math.floor((now.getTime() - parseISO(i.due_date).getTime()) / 86400000);
                return <tr key={i.id}>
                  <td style={{ textAlign: 'center' }}>{n + 1}</td>
                  <td>{i.reader.last_name} {i.reader.first_name} {i.reader.patronymic}</td>
                  <td style={{ textAlign: 'center' }}>{i.reader.card_number}</td>
                  <td>{i.reader.phone}</td><td>{i.book.title}</td>
                  <td style={{ textAlign: 'center' }}>{format(parseISO(i.issued_at), 'dd.MM.yyyy')}</td>
                  <td style={{ textAlign: 'center' }}>{format(parseISO(i.due_date), 'dd.MM.yyyy')}</td>
                  <td style={{ textAlign: 'center', color: '#c00', fontWeight: 'bold' }}>{days}</td>
                </tr>;
              })}
          </tbody>
        </table>
        <p className="total">Всего должников: {overdue.length}</p>
        <div className="sign-row">
          <div className="sign-block">Библиотекарь: <div className="sign-line" /></div>
          <div className="sign-block">М.П.</div>
        </div>
      </>;
    }

    if (activeReport === 'fund') {
      return <>
        <p className="org">Муниципальная библиотека №18 им. А.И. Куприна, г. Пермь</p>
        <h1>ИНВЕНТАРНАЯ КНИГА</h1>
        <p className="date">Дата: {today}</p>
        <table>
          <thead><tr><th>№</th><th>ISBN</th><th>Название</th><th>Автор</th><th>Жанр</th><th>Год</th><th>Издательство</th><th>Место</th><th>Всего</th><th>Доступно</th><th>На руках</th></tr></thead>
          <tbody>
            {bks.map((b, i) => (
              <tr key={b.id}>
                <td style={{ textAlign: 'center' }}>{i + 1}</td><td>{b.isbn}</td><td>{b.title}</td><td>{b.author}</td>
                <td>{b.genre}</td><td style={{ textAlign: 'center' }}>{b.year}</td><td>{b.publisher}</td>
                <td style={{ textAlign: 'center' }}>{b.shelf_location}</td>
                <td style={{ textAlign: 'center' }}>{b.total_copies}</td>
                <td style={{ textAlign: 'center' }}>{b.available_copies}</td>
                <td style={{ textAlign: 'center' }}>{b.total_copies - b.available_copies}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>Итого:</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{bks.reduce((s, b) => s + b.total_copies, 0)}</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{bks.reduce((s, b) => s + b.available_copies, 0)}</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{bks.reduce((s, b) => s + (b.total_copies - b.available_copies), 0)}</td>
            </tr>
          </tfoot>
        </table>
        <div className="sign-row">
          <div className="sign-block">Библиотекарь: <div className="sign-line" /></div>
          <div className="sign-block">Заведующий: <div className="sign-line" /></div>
        </div>
      </>;
    }

    if (activeReport === 'readers') {
      const active = rdrs.filter(r => r.is_active);
      return <>
        <p className="org">Муниципальная библиотека №18 им. А.И. Куприна, г. Пермь</p>
        <h1>СПИСОК ЧИТАТЕЛЕЙ</h1>
        <p className="date">Дата составления: {today}</p>
        <table>
          <thead><tr><th>№</th><th>№ билета</th><th>ФИО</th><th>Дата рождения</th><th>Адрес</th><th>Телефон</th><th>Email</th><th>Дата рег.</th></tr></thead>
          <tbody>
            {active.map((r, i) => (
              <tr key={r.id}>
                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                <td style={{ textAlign: 'center' }}>{r.card_number}</td>
                <td>{r.last_name} {r.first_name} {r.patronymic}</td>
                <td style={{ textAlign: 'center' }}>{format(parseISO(r.birth_date), 'dd.MM.yyyy')}</td>
                <td>{r.address}</td><td>{r.phone}</td><td>{r.email}</td>
                <td style={{ textAlign: 'center' }}>{format(parseISO(r.registration_date), 'dd.MM.yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total">Всего активных: {active.length}</p>
        <div className="sign-row">
          <div className="sign-block">Библиотекарь: <div className="sign-line" /></div>
          <div className="sign-block">М.П.</div>
        </div>
      </>;
    }

    if (activeReport === 'returnedPeriod') {
      const returned = iss.filter(i => i.status === 'returned' && i.returned_at)
        .sort((a, b) => (b.returned_at ?? '').localeCompare(a.returned_at ?? ''));
      return <>
        <p className="org">Муниципальная библиотека №18 им. А.И. Куприна, г. Пермь</p>
        <h1>АКТ О ВОЗВРАТАХ КНИГ</h1>
        <p className="date">Дата составления: {today}</p>
        <table>
          <thead><tr><th>№</th><th>Читатель</th><th>№ билета</th><th>Книга</th><th>Автор</th><th>Дата выдачи</th><th>Дата возврата</th><th>Примечание</th></tr></thead>
          <tbody>
            {returned.map((i, n) => (
              <tr key={i.id}>
                <td style={{ textAlign: 'center' }}>{n + 1}</td>
                <td>{i.reader.last_name} {i.reader.first_name[0]}.{i.reader.patronymic[0]}.</td>
                <td style={{ textAlign: 'center' }}>{i.reader.card_number}</td>
                <td>{i.book.title}</td><td>{i.book.author}</td>
                <td style={{ textAlign: 'center' }}>{format(parseISO(i.issued_at), 'dd.MM.yyyy')}</td>
                <td style={{ textAlign: 'center' }}>{i.returned_at ? format(parseISO(i.returned_at), 'dd.MM.yyyy') : '—'}</td>
                <td>{i.notes ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total">Итого возвращено: {returned.length}</p>
        <div className="sign-row">
          <div className="sign-block">Библиотекарь: <div className="sign-line" /></div>
          <div className="sign-block">Заведующий: <div className="sign-line" /></div>
        </div>
      </>;
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Выходные документы</h1>
          <p className="page-subtitle">Формирование отчётов и документации</p>
        </div>
      </div>

      <div className="reports-grid">
        {reportDefs.map(def => (
          <button key={def.id} className={`report-card ${activeReport === def.id ? 'active' : ''}`}
            onClick={() => setActiveReport(def.id)}>
            <span className="report-icon">{def.icon}</span>
            <div className="report-info">
              <div className="report-label">{def.label}</div>
              <div className="report-desc">{def.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {activeReport && (
        <div className="card report-preview-card">
          <div className="report-preview-header">
            <h2 className="card-title"><FileText size={16} />{reportDefs.find(d => d.id === activeReport)?.label}</h2>
            <button className="btn btn-primary" onClick={handlePrint}><Printer size={15} /> Печать / Сохранить</button>
          </div>
          <div className="report-preview" ref={printRef}>{renderReport()}</div>
        </div>
      )}
    </div>
  );
}
