import { useState } from 'react';
import type { ReaderIn } from '../../data/api';

interface Props {
  initial?: Partial<ReaderIn>;
  onSubmit: (data: ReaderIn) => void;
  onCancel: () => void;
}

export default function ReaderForm({ initial = {}, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    card_number: initial.card_number ?? '',
    last_name: initial.last_name ?? '',
    first_name: initial.first_name ?? '',
    patronymic: initial.patronymic ?? '',
    birth_date: initial.birth_date ?? '',
    address: initial.address ?? '',
    phone: initial.phone ?? '',
    email: initial.email ?? '',
    registration_date: initial.registration_date ?? new Date().toISOString().slice(0, 10),
    is_active: initial.is_active ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function validate() {
    const e: typeof errors = {};
    if (!form.card_number.trim()) e.card_number = 'Обязательное поле';
    if (!form.last_name.trim()) e.last_name = 'Обязательное поле';
    if (!form.first_name.trim()) e.first_name = 'Обязательное поле';
    if (!form.birth_date) e.birth_date = 'Обязательное поле';
    if (!form.phone.trim()) e.phone = 'Обязательное поле';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  }

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      setErrors(er => ({ ...er, [key]: undefined }));
    },
    className: `input ${errors[key] ? 'input-error' : ''}`,
  });

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <div className="form-group">
          <label>Номер билета *</label>
          <input {...field('card_number')} placeholder="ЧБ-0001" />
          {errors.card_number && <span className="error-msg">{errors.card_number}</span>}
        </div>
        <div className="form-group">
          <label>Дата регистрации</label>
          <input type="date" {...field('registration_date')} />
        </div>
      </div>
      <div className="form-row form-row-3">
        <div className="form-group">
          <label>Фамилия *</label>
          <input {...field('last_name')} />
          {errors.last_name && <span className="error-msg">{errors.last_name}</span>}
        </div>
        <div className="form-group">
          <label>Имя *</label>
          <input {...field('first_name')} />
          {errors.first_name && <span className="error-msg">{errors.first_name}</span>}
        </div>
        <div className="form-group">
          <label>Отчество</label>
          <input {...field('patronymic')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Дата рождения *</label>
          <input type="date" {...field('birth_date')} />
          {errors.birth_date && <span className="error-msg">{errors.birth_date}</span>}
        </div>
        <div className="form-group">
          <label>Телефон *</label>
          <input {...field('phone')} />
          {errors.phone && <span className="error-msg">{errors.phone}</span>}
        </div>
      </div>
      <div className="form-group">
        <label>Адрес</label>
        <input {...field('address')} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" {...field('email')} />
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" checked={form.is_active}
            onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
          Активный читатель
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn-primary">Сохранить</button>
      </div>
    </form>
  );
}
