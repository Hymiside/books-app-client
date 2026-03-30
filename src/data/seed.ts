import type { Book, Reader, Issuance } from '../types';

export const seedBooks: Book[] = [
  { id: '1', isbn: '978-5-389-06178-4', title: 'Поединок', author: 'Куприн А.И.', genre: 'Роман', year: 2015, publisher: 'Азбука', totalCopies: 5, availableCopies: 3, shelfLocation: 'А-1-01', description: 'Повесть о жизни армейских офицеров', createdAt: '2023-01-10' },
  { id: '2', isbn: '978-5-389-07234-1', title: 'Гранатовый браслет', author: 'Куприн А.И.', genre: 'Повесть', year: 2018, publisher: 'Азбука', totalCopies: 4, availableCopies: 2, shelfLocation: 'А-1-02', description: 'Повесть о безответной любви', createdAt: '2023-01-10' },
  { id: '3', isbn: '978-5-389-08901-1', title: 'Олеся', author: 'Куприн А.И.', genre: 'Повесть', year: 2019, publisher: 'Азбука', totalCopies: 3, availableCopies: 3, shelfLocation: 'А-1-03', description: 'Повесть о девушке из лесной глуши', createdAt: '2023-01-10' },
  { id: '4', isbn: '978-5-17-077348-8', title: 'Война и мир', author: 'Толстой Л.Н.', genre: 'Роман-эпопея', year: 2020, publisher: 'АСТ', totalCopies: 6, availableCopies: 4, shelfLocation: 'Т-2-01', description: 'Эпический роман о наполеоновских войнах', createdAt: '2023-02-05' },
  { id: '5', isbn: '978-5-699-12345-6', title: 'Преступление и наказание', author: 'Достоевский Ф.М.', genre: 'Роман', year: 2017, publisher: 'Эксмо', totalCopies: 5, availableCopies: 1, shelfLocation: 'Д-3-01', description: 'Психологический роман', createdAt: '2023-02-10' },
  { id: '6', isbn: '978-5-699-54321-0', title: 'Мастер и Маргарита', author: 'Булгаков М.А.', genre: 'Роман', year: 2021, publisher: 'Эксмо', totalCopies: 7, availableCopies: 5, shelfLocation: 'Б-4-01', description: 'Роман о добре и зле', createdAt: '2023-03-15' },
  { id: '7', isbn: '978-5-389-03402-3', title: 'Евгений Онегин', author: 'Пушкин А.С.', genre: 'Поэма', year: 2016, publisher: 'Азбука', totalCopies: 4, availableCopies: 4, shelfLocation: 'П-5-01', description: 'Роман в стихах', createdAt: '2023-03-20' },
  { id: '8', isbn: '978-5-04-089765-2', title: 'Мёртвые души', author: 'Гоголь Н.В.', genre: 'Поэма', year: 2019, publisher: 'Эксмо', totalCopies: 3, availableCopies: 2, shelfLocation: 'Г-6-01', description: 'Поэма о похождениях Чичикова', createdAt: '2023-04-01' },
  { id: '9', isbn: '978-5-17-112233-4', title: 'Три сестры', author: 'Чехов А.П.', genre: 'Пьеса', year: 2022, publisher: 'АСТ', totalCopies: 2, availableCopies: 2, shelfLocation: 'Ч-7-01', description: 'Пьеса о провинциальной жизни', createdAt: '2023-04-15' },
  { id: '10', isbn: '978-5-389-05678-0', title: 'Анна Каренина', author: 'Толстой Л.Н.', genre: 'Роман', year: 2020, publisher: 'Азбука', totalCopies: 4, availableCopies: 0, shelfLocation: 'Т-2-02', description: 'Трагический роман о судьбе женщины', createdAt: '2023-05-01' },
  { id: '11', isbn: '978-5-699-87654-3', title: 'Идиот', author: 'Достоевский Ф.М.', genre: 'Роман', year: 2018, publisher: 'Эксмо', totalCopies: 3, availableCopies: 3, shelfLocation: 'Д-3-02', createdAt: '2023-05-10' },
  { id: '12', isbn: '978-5-17-099887-6', title: 'Вишнёвый сад', author: 'Чехов А.П.', genre: 'Пьеса', year: 2021, publisher: 'АСТ', totalCopies: 2, availableCopies: 1, shelfLocation: 'Ч-7-02', createdAt: '2023-06-01' },
];

export const seedReaders: Reader[] = [
  { id: '1', cardNumber: 'ЧБ-0001', lastName: 'Иванова', firstName: 'Мария', patronymic: 'Петровна', birthDate: '1985-03-15', address: 'г. Пермь, ул. Ленина, д. 10, кв. 5', phone: '+7 (342) 201-11-11', email: 'ivanova@mail.ru', registrationDate: '2020-09-01', isActive: true },
  { id: '2', cardNumber: 'ЧБ-0002', lastName: 'Петров', firstName: 'Алексей', patronymic: 'Николаевич', birthDate: '1990-07-22', address: 'г. Пермь, ул. Пушкина, д. 3, кв. 12', phone: '+7 (342) 202-22-22', email: 'petrov@gmail.com', registrationDate: '2021-01-15', isActive: true },
  { id: '3', cardNumber: 'ЧБ-0003', lastName: 'Сидорова', firstName: 'Елена', patronymic: 'Владимировна', birthDate: '2000-11-30', address: 'г. Пермь, ул. Советская, д. 45, кв. 8', phone: '+7 (342) 203-33-33', email: 'sidorova@yandex.ru', registrationDate: '2022-03-10', isActive: true },
  { id: '4', cardNumber: 'ЧБ-0004', lastName: 'Козлов', firstName: 'Дмитрий', patronymic: 'Сергеевич', birthDate: '1978-05-18', address: 'г. Пермь, ул. Мира, д. 7, кв. 22', phone: '+7 (342) 204-44-44', email: 'kozlov@mail.ru', registrationDate: '2019-06-20', isActive: true },
  { id: '5', cardNumber: 'ЧБ-0005', lastName: 'Новикова', firstName: 'Ольга', patronymic: 'Андреевна', birthDate: '1995-09-05', address: 'г. Пермь, ул. Комсомольская, д. 15, кв. 3', phone: '+7 (342) 205-55-55', email: 'novikova@inbox.ru', registrationDate: '2022-09-01', isActive: true },
  { id: '6', cardNumber: 'ЧБ-0006', lastName: 'Морозов', firstName: 'Игорь', patronymic: 'Александрович', birthDate: '1988-12-01', address: 'г. Пермь, ул. Екатерининская, д. 88, кв. 14', phone: '+7 (342) 206-66-66', email: 'morozov@gmail.com', registrationDate: '2021-05-12', isActive: true },
  { id: '7', cardNumber: 'ЧБ-0007', lastName: 'Волкова', firstName: 'Татьяна', patronymic: 'Ивановна', birthDate: '2003-02-14', address: 'г. Пермь, ул. Луначарского, д. 33, кв. 7', phone: '+7 (342) 207-77-77', email: 'volkova@mail.ru', registrationDate: '2023-01-08', isActive: true },
  { id: '8', cardNumber: 'ЧБ-0008', lastName: 'Соколов', firstName: 'Павел', patronymic: 'Геннадьевич', birthDate: '1972-08-27', address: 'г. Пермь, ул. Газеты Звезда, д. 51, кв. 19', phone: '+7 (342) 208-88-88', email: 'sokolov@yandex.ru', registrationDate: '2018-11-30', isActive: false },
  { id: '9', cardNumber: 'ЧБ-0009', lastName: 'Лебедева', firstName: 'Наталья', patronymic: 'Михайловна', birthDate: '1993-04-09', address: 'г. Пермь, ул. Революции, д. 22, кв. 11', phone: '+7 (342) 209-99-99', email: 'lebedeva@inbox.ru', registrationDate: '2023-04-01', isActive: true },
  { id: '10', cardNumber: 'ЧБ-0010', lastName: 'Никитин', firstName: 'Сергей', patronymic: 'Владимирович', birthDate: '1981-06-16', address: 'г. Пермь, пр. Парковый, д. 2, кв. 34', phone: '+7 (342) 210-10-10', email: 'nikitin@mail.ru', registrationDate: '2020-02-14', isActive: true },
];

export const seedIssuances: Issuance[] = [
  { id: '1', bookId: '1', readerId: '1', issuedAt: '2026-03-01', dueDate: '2026-03-22', status: 'active' },
  { id: '2', bookId: '2', readerId: '2', issuedAt: '2026-02-15', dueDate: '2026-03-08', status: 'overdue' },
  { id: '3', bookId: '5', readerId: '3', issuedAt: '2026-03-10', dueDate: '2026-03-31', status: 'active' },
  { id: '4', bookId: '10', readerId: '4', issuedAt: '2026-03-05', dueDate: '2026-03-26', status: 'active' },
  { id: '5', bookId: '10', readerId: '5', issuedAt: '2026-03-12', dueDate: '2026-04-02', status: 'active' },
  { id: '6', bookId: '4', readerId: '6', issuedAt: '2026-03-15', dueDate: '2026-04-05', status: 'active' },
  { id: '7', bookId: '6', readerId: '7', issuedAt: '2026-02-10', dueDate: '2026-03-03', returnedAt: '2026-03-02', status: 'returned' },
  { id: '8', bookId: '3', readerId: '8', issuedAt: '2026-01-20', dueDate: '2026-02-10', returnedAt: '2026-02-09', status: 'returned' },
  { id: '9', bookId: '8', readerId: '9', issuedAt: '2026-03-20', dueDate: '2026-04-10', status: 'active' },
  { id: '10', bookId: '12', readerId: '10', issuedAt: '2026-01-05', dueDate: '2026-01-26', returnedAt: '2026-01-25', status: 'returned' },
  { id: '11', bookId: '5', readerId: '1', issuedAt: '2026-02-01', dueDate: '2026-02-22', returnedAt: '2026-02-20', status: 'returned' },
  { id: '12', bookId: '10', readerId: '6', issuedAt: '2025-12-01', dueDate: '2025-12-22', returnedAt: '2025-12-21', status: 'returned' },
];
