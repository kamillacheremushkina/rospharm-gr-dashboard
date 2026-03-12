import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Target, AlertTriangle } from "lucide-react";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-teal-50 text-teal-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-30 flex items-center justify-between p-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-xl text-slate-700"
        >
          ☰
        </button>

        <h1 className="text-sm font-semibold text-slate-800">
          ROSPHARM
        </h1>

        <div />
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-full md:w-64 bg-white border-r border-slate-200 flex flex-col z-40 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* CLOSE BUTTON */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-xl text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">ROSPHARM GR</h1>
          <p className="text-sm text-slate-500 mt-1">Dashboard</p>
          <p className="text-xs text-slate-400 mt-2">
            Biopharma Localization Project
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/overview"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Основные показатели
          </NavLink>

          <NavLink
            to="/goals"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            <Target className="w-5 h-5 mr-3" />
            Цели
          </NavLink>

          <NavLink
            to="/risks"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            <AlertTriangle className="w-5 h-5 mr-3" />
            Риски
          </NavLink>
        </nav>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>

    </div>
  );
}