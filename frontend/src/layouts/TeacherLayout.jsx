import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Eye,
  BarChart3,
  ShieldAlert,
  FileText,
  Bell,
  LogOut,
  User,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) close();
    }
    function handleKey(e) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, close]);

  return { open, toggle, close, ref };
}

function TeacherAvatarDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { open, toggle, close, ref } = useDropdown();

  const displayName = user?.name || 'Teacher';
  const displayEmail = user?.email || 'teacher@example.com';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  function handleLogout() {
    logout();
    navigate('/login');
    close();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        aria-label="Open profile menu"
        className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center text-xs font-bold text-white ring-2 ring-white hover:ring-[#4F46E5]/30 transition-all focus:outline-none shadow-sm"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden">
          {/* User info header */}
          <div className="px-4 py-3.5 border-b border-gray-100 bg-gradient-to-br from-[#4F46E5]/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#4F46E5]/10 text-[10px] font-bold text-[#4F46E5]">
                  Teacher Portal
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 rounded-xl transition-colors text-red-600 font-medium text-sm group"
            >
              <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/teacher', icon: LayoutDashboard, exact: true },
  { label: 'Bulk Upload', path: '/teacher/bulk-upload', icon: Upload },
  { label: 'Student Results', path: '/teacher/student-results', icon: Eye },
  { label: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
  { label: 'Plagiarism', path: '/teacher/plagiarism', icon: ShieldAlert },
  { label: 'Reports', path: '/teacher/reports', icon: FileText },
];

function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const displayName = user?.name || 'Teacher';
  const displayEmail = user?.email || '';

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center text-white shadow-md shadow-[#4F46E5]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 block leading-tight">Teacher Portal</span>
              <span className="text-[10px] text-gray-400 font-medium">NotebookAI Classroom</span>
            </div>
          </div>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Logged in Teacher Info Card in Sidebar */}
        <div className="mx-3 mt-4 p-3 rounded-2xl bg-[#4F46E5]/5 border border-[#4F46E5]/10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-sm">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
            <p className="text-[11px] text-gray-500 truncate">{displayEmail || 'Teacher Account'}</p>
          </div>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ label, path, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors
                ${isActive
                  ? 'bg-[#4F46E5]/8 text-[#4F46E5]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <TeacherAvatarDropdown />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;
