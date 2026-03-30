import type { Book, Reader, Issuance } from '../types';
import { seedBooks, seedReaders, seedIssuances } from './seed';

const KEYS = {
  books: 'lib_books',
  readers: 'lib_readers',
  issuances: 'lib_issuances',
};

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.books)) save(KEYS.books, seedBooks);
  if (!localStorage.getItem(KEYS.readers)) save(KEYS.readers, seedReaders);
  if (!localStorage.getItem(KEYS.issuances)) save(KEYS.issuances, seedIssuances);
}

// Books
export function getBooks(): Book[] { return load(KEYS.books, seedBooks); }
export function saveBooks(books: Book[]): void { save(KEYS.books, books); }

// Readers
export function getReaders(): Reader[] { return load(KEYS.readers, seedReaders); }
export function saveReaders(readers: Reader[]): void { save(KEYS.readers, readers); }

// Issuances
export function getIssuances(): Issuance[] { return load(KEYS.issuances, seedIssuances); }
export function saveIssuances(issuances: Issuance[]): void { save(KEYS.issuances, issuances); }

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
