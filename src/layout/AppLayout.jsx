import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Target, AlertTriangle } from 'lucide-react';

export default function AppLayout() {
  // Функция для стилизации активной вкладки
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-teal-50 text-teal-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Левый Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">ROSPHARM GR</h1>
          <p className="text-sm text-slate-500 mt-1">Dashboard</p>
          <p className="text-xs text-slate-400 mt-2">Biopharma Localization Project</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/overview" className={navLinkClass}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Обзор
          </NavLink>
          
          <NavLink to="/goals" className={navLinkClass}>
            <Target className="w-5 h-5 mr-3" />
            Цели и KPI
          </NavLink>
          
          <NavLink to="/risks" className={navLinkClass}>
            <AlertTriangle className="w-5 h-5 mr-3" />
            Риски
          </NavLink>
        </nav>
      </div>

      {/* Основная область контента (сюда грузятся страницы) */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}