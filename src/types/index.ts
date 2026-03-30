export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  description?: string;
  createdAt: string;
}

export interface Reader {
  id: string;
  cardNumber: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  registrationDate: string;
  isActive: boolean;
}

export type IssuanceStatus = 'active' | 'returned' | 'overdue';

export interface Issuance {
  id: string;
  bookId: string;
  readerId: string;
  issuedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: IssuanceStatus;
  notes?: string;
}

export interface IssuanceWithDetails extends Issuance {
  book: Book;
  reader: Reader;
}
