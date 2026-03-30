import { useState } from 'react';
import type { BookOut, ReaderOut } from '../../data/api';
import { addDays, format } from 'date-fns';

interface Props {
  books: BookOut[];
  readers: ReaderOut[];
  onSubmit: (bookId: number, readerId: number, dueDate: string, notes: string) => void;
  onCancel: () => void;
}

export default function IssuanceForm({ books, readers, onSubmit, onCancel }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const defaultDue = format(addDays(new Date(), 21), 'yyyy-MM-dd');

  const [bookId, setBookId] = useState('');
  const [readerId, setReaderId] = useState('');
  const [dueDate, setDueDate] = useState(defaultDue);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableBooks = books.filter(b => b.available_copies > 0);
  const activeReaders = readers.filter(r => r.is_active);

  function validate() {
    const e: Record<string, string> = {};
    if (!bookId) e.bookId = 'Выберите книгу';
    if (!readerId) e.readerId = 'Выберите читателя';
    if (!dueDate || dueDate < today) e.dueDate = 'Дата должна быть в будущем';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(Number(bookId), Number(readerId), dueDate, notes);
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Книга *</label>
        <select className={`input ${errors.bookId ? 'input-error' : ''}`} value={bookId}
          onChange={e => { setBookId(e.target.value); setErrors(er => ({ ...er, bookId: '' })); }}>
          <option value="">— Выберите книгу —</option>
          {availableBooks.map(b => (
            <option key={b.id} value={b.id}>{b.title} — {b.author} (доступно: {b.available_copies})</option>
          ))}
        </select>
        {errors.bookId && <span className="error-msg">{errors.bookId}</span>}
      </div>
      <div className="form-group">
        <label>Читатель *</label>
        <select className={`input ${errors.readerId ? 'input-error' : ''}`} value={readerId}
          onChange={e => { setReaderId(e.target.value); setErrors(er => ({ ...er, readerId: '' })); }}>
          <option value="">— Выберите читателя —</option>
          {activeReaders.map(r => (
            <option key={r.id} value={r.id}>{r.last_name} {r.first_name} {r.patronymic} ({r.card_number})</option>
          ))}
        </select>
        {errors.readerId && <span className="error-msg">{errors.readerId}</span>}
      </div>
      <div className="form-group">
        <label>Срок возврата *</label>
        <input type="date" className={`input ${errors.dueDate ? 'input-error' : ''}`} value={dueDate} min={today}
          onChange={e => { setDueDate(e.target.value); setErrors(er => ({ ...er, dueDate: '' })); }} />
        {errors.dueDate && <span className="error-msg">{errors.dueDate}</span>}
      </div>
      <div className="form-group">
        <label>Примечание</label>
        <textarea className="input textarea" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn-primary" disabled={availableBooks.length === 0}>Выдать книгу</button>
      </div>
    </form>
  );
}
