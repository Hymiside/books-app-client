import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight,
  BarChart2, FileText, ChevronRight
} from 'lucide-react';

const links = [
  { to: '/', label: 'Главная', icon: LayoutDashboard, end: true },
  { to: '/books', label: 'Книги', icon: BookOpen },
  { to: '/readers', label: 'Читатели', icon: Users },
  { to: '/issuances', label: 'Выдача книг', icon: ArrowLeftRight },
  { to: '/analytics', label: 'Аналитика', icon: BarChart2 },
  { to: '/reports', label: 'Документы', icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <BookOpen size={22} />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">Библиотека</span>
          <span className="sidebar-logo-subtitle">им. А.И. Куприна №18</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} className="nav-icon" />
            <span>{label}</span>
            <ChevronRight size={14} className="nav-chevron" />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>МБУ «Библиотека №18»</span>
        <span>г. Пермь</span>
      </div>
    </aside>
  );
}
