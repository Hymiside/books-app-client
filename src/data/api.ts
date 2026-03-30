const BASE = "http://localhost:8000/api";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Books
  getBooks: () => req<BookOut[]>("/books/"),
  createBook: (data: BookIn) => req<BookOut>("/books/", { method: "POST", body: JSON.stringify(data) }),
  updateBook: (id: number, data: BookIn) => req<BookOut>(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBook: (id: number) => req<void>(`/books/${id}`, { method: "DELETE" }),

  // Readers
  getReaders: () => req<ReaderOut[]>("/readers/"),
  createReader: (data: ReaderIn) => req<ReaderOut>("/readers/", { method: "POST", body: JSON.stringify(data) }),
  updateReader: (id: number, data: ReaderIn) => req<ReaderOut>(`/readers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteReader: (id: number) => req<void>(`/readers/${id}`, { method: "DELETE" }),

  // Issuances
  getIssuances: () => req<IssuanceOut[]>("/issuances/"),
  createIssuance: (data: IssuanceIn) => req<IssuanceOut>("/issuances/", { method: "POST", body: JSON.stringify(data) }),
  returnBook: (id: number, returned_at: string) =>
    req<IssuanceOut>(`/issuances/${id}/return`, { method: "PATCH", body: JSON.stringify({ returned_at }) }),
};

// --- Types matching backend schemas ---
export interface BookOut {
  id: number;
  isbn: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  publisher: string;
  total_copies: number;
  available_copies: number;
  shelf_location: string;
  description?: string;
  created_at: string;
}

export type BookIn = Omit<BookOut, "id" | "created_at">;

export interface ReaderOut {
  id: number;
  card_number: string;
  last_name: string;
  first_name: string;
  patronymic: string;
  birth_date: string;
  address: string;
  phone: string;
  email: string;
  registration_date: string;
  is_active: boolean;
}

export type ReaderIn = Omit<ReaderOut, "id">;

export interface IssuanceOut {
  id: number;
  book_id: number;
  reader_id: number;
  issued_at: string;
  due_date: string;
  returned_at?: string;
  status: string;
  notes?: string;
  book: BookOut;
  reader: ReaderOut;
}

export interface IssuanceIn {
  book_id: number;
  reader_id: number;
  due_date: string;
  notes?: string;
}
