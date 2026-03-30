import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, Eye } from 'lucide-react';
import { api, type BookOut, type BookIn } from '../../data/api';
import { useApi } from '../../data/useApi';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import BookForm from './BookForm';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

export default function BooksList() {
  const { data: books, loading, setData } = useApi(api.getBooks);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'view'>(null);
  const [selected, setSelected] = useState<BookOut | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BookOut | null>(null);

  const genres = useMemo(() => [...new Set((books ?? []).map(b => b.genre))].sort(), [books]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (books ?? []).filter(b =>
      (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q)) &&
      (!genreFilter || b.genre === genreFilter)
    );
  }, [books, search, genreFilter]);

  async function handleAdd(data: BookIn) {
    const book = await api.createBook(data);
    setData(prev => [...(prev ?? []), book]);
    setModal(null);
  }

  async function handleEdit(data: BookIn) {
    if (!selected) return;
    const updated = await api.updateBook(selected.id, data);
    setData(prev => prev?.map(b => b.id === updated.id ? updated : b) ?? []);
    setModal(null);
    setSelected(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await api.deleteBook(deleteTarget.id);
    setData(prev => prev?.filter(b => b.id !== deleteTarget.id) ?? []);
    setDeleteTarget(null);
  }

  const availBadge = (b: BookOut) => {
    if (b.available_copies === 0) return <Badge variant="danger">Нет в наличии</Badge>;
    if (b.available_copies < b.total_copies * 0.4) return <Badge variant="warning">{b.available_copies} из {b.total_copies}</Badge>;
    return <Badge variant="success">{b.available_copies} из {b.total_copies}</Badge>;
  };

  if (loading) return <div className="page"><div className="loading">Загрузка...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Каталог книг</h1>
          <p className="page-subtitle">Всего: {books?.length ?? 0} наименований</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          <Plus size={16} /> Добавить книгу
        </button>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="input search-input" placeholder="Поиск по названию, автору, ISBN..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input select-filter" value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">Все жанры</option>
          {genres.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ISBN</th><th>Название</th><th>Автор</th><th>Жанр</th><th>Год</th>
              <th>Издательство</th><th>Полка</th><th>Экземпляры</th><th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="empty-row"><BookOpen size={32} /><br/>Книги не найдены</td></tr>
            )}
            {filtered.map(book => (
              <tr key={book.id}>
                <td className="td-mono">{book.isbn}</td>
                <td className="td-main">{book.title}</td>
                <td>{book.author}</td>
                <td><Badge variant="neutral">{book.genre}</Badge></td>
                <td>{book.year}</td>
                <td>{book.publisher}</td>
                <td className="td-mono">{book.shelf_location}</td>
                <td>{availBadge(book)}</td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn" onClick={() => { setSelected(book); setModal('view'); }}><Eye size={15} /></button>
                    <button className="icon-btn" onClick={() => { setSelected(book); setModal('edit'); }}><Edit2 size={15} /></button>
                    <button className="icon-btn danger" onClick={() => setDeleteTarget(book)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === 'add' && (
        <Modal title="Добавить книгу" onClose={() => setModal(null)} size="lg">
          <BookForm onSubmit={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title="Редактировать книгу" onClose={() => setModal(null)} size="lg">
          <BookForm initial={toBookFormData(selected)} onSubmit={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'view' && selected && (
        <Modal title="Информация о книге" onClose={() => setModal(null)} size="md">
          <div className="detail-grid">
            <div className="detail-row"><span>ISBN:</span><span className="td-mono">{selected.isbn}</span></div>
            <div className="detail-row"><span>Название:</span><strong>{selected.title}</strong></div>
            <div className="detail-row"><span>Автор:</span><span>{selected.author}</span></div>
            <div className="detail-row"><span>Жанр:</span><Badge variant="neutral">{selected.genre}</Badge></div>
            <div className="detail-row"><span>Год:</span><span>{selected.year}</span></div>
            <div className="detail-row"><span>Издательство:</span><span>{selected.publisher}</span></div>
            <div className="detail-row"><span>Место хранения:</span><span className="td-mono">{selected.shelf_location}</span></div>
            <div className="detail-row"><span>Экземпляров:</span><span>{selected.total_copies} (доступно: {selected.available_copies})</span></div>
            {selected.description && <div className="detail-row full"><span>Описание:</span><span>{selected.description}</span></div>}
          </div>
          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Закрыть</button>
            <button className="btn btn-primary" onClick={() => setModal('edit')}>Редактировать</button>
          </div>
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog title="Удалить книгу" message={`Удалить книгу «${deleteTarget.title}»?`}
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmLabel="Удалить" danger />
      )}
    </div>
  );
}

function toBookFormData(b: BookOut): BookIn {
  return {
    isbn: b.isbn, title: b.title, author: b.author, genre: b.genre,
    year: b.year, publisher: b.publisher, total_copies: b.total_copies,
    available_copies: b.available_copies, shelf_location: b.shelf_location,
    description: b.description,
  };
}
