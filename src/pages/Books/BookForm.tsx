import { useState } from 'react';
import type { BookIn } from '../../data/api';

interface Props {
  initial?: Partial<BookIn>;
  onSubmit: (data: BookIn) => void;
  onCancel: () => void;
}

const genres = ['Роман', 'Повесть', 'Рассказ', 'Поэма', 'Пьеса', 'Роман-эпопея', 'Стихи', 'Публицистика', 'Научная литература', 'Детектив', 'Фантастика', 'Детская литература', 'Биография', 'Другое'];

export default function BookForm({ initial = {}, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    isbn: initial.isbn ?? '',
    title: initial.title ?? '',
    author: initial.author ?? '',
    genre: initial.genre ?? 'Роман',
    year: initial.year ?? new Date().getFullYear(),
    publisher: initial.publisher ?? '',
    total_copies: initial.total_copies ?? 1,
    available_copies: initial.available_copies ?? 1,
    shelf_location: initial.shelf_location ?? '',
    description: initial.description ?? '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function validate() {
    const e: typeof errors = {};
    if (!form.isbn.trim()) e.isbn = 'Обязательное поле';
    if (!form.title.trim()) e.title = 'Обязательное поле';
    if (!form.author.trim()) e.author = 'Обязательное поле';
    if (!form.publisher.trim()) e.publisher = 'Обязательное поле';
    if (!form.shelf_location.trim()) e.shelf_location = 'Обязательное поле';
    if (form.total_copies < 1) e.total_copies = 'Минимум 1';
    if (form.available_copies < 0 || form.available_copies > form.total_copies) e.available_copies = 'Не может превышать общее количество';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, description: form.description || undefined });
  }

  const field = (key: keyof typeof form) => ({
    value: form[key] as string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setForm(f => ({ ...f, [key]: val }));
      setErrors(er => ({ ...er, [key]: undefined }));
    },
    className: `input ${errors[key] ? 'input-error' : ''}`,
  });

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <div className="form-group">
          <label>ISBN *</label>
          <input {...field('isbn')} placeholder="978-5-..." />
          {errors.isbn && <span className="error-msg">{errors.isbn}</span>}
        </div>
        <div className="form-group">
          <label>Место на полке *</label>
          <input {...field('shelf_location')} placeholder="А-1-01" />
          {errors.shelf_location && <span className="error-msg">{errors.shelf_location}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>Название *</label>
        <input {...field('title')} />
        {errors.title && <span className="error-msg">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label>Автор *</label>
        <input {...field('author')} placeholder="Фамилия И.О." />
        {errors.author && <span className="error-msg">{errors.author}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Жанр</label>
          <select {...field('genre')} className="input">{genres.map(g => <option key={g}>{g}</option>)}</select>
        </div>
        <div className="form-group">
          <label>Год</label>
          <input type="number" {...field('year')} min={1800} max={2100} />
        </div>
      </div>
      <div className="form-group">
        <label>Издательство *</label>
        <input {...field('publisher')} />
        {errors.publisher && <span className="error-msg">{errors.publisher}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Всего экземпляров *</label>
          <input type="number" {...field('total_copies')} min={1} />
          {errors.total_copies && <span className="error-msg">{errors.total_copies}</span>}
        </div>
        <div className="form-group">
          <label>Доступно *</label>
          <input type="number" {...field('available_copies')} min={0} max={form.total_copies} />
          {errors.available_copies && <span className="error-msg">{errors.available_copies}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>Описание</label>
        <textarea {...field('description')} className="input textarea" rows={3} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn-primary">Сохранить</button>
      </div>
    </form>
  );
}
