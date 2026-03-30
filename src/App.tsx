import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import BooksList from './pages/Books/BooksList';
import ReadersList from './pages/Readers/ReadersList';
import IssuancesList from './pages/Issuances/IssuancesList';
import Analytics from './pages/Analytics/Analytics';
import Reports from './pages/Reports/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BooksList />} />
          <Route path="readers" element={<ReadersList />} />
          <Route path="issuances" element={<IssuancesList />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
