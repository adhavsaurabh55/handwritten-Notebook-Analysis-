import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  UserCircle,
  Bell,
  CheckCircle,
  Clock,
  Brain,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// ─── Mock notifications ─────────────────────────────────────────
// TODO: Replace with → GET /api/students/me/notifications
const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    icon: CheckCircle,
    iconBg: 'bg-green-50 text-green-600',
    message: 'Your Mathematics notebook has been evaluated.',
    time: '2 hours ago',
    read: false,
    submissionId: 'sub-001',
  },
  {
    id: 'n-2',
    icon: Brain,
    iconBg: 'bg-[#4F46E5]/8 text-[#4F46E5]',
    message: 'AI feedback is now available for your latest submission.',
    time: '5 hours ago',
    read: false,
    submissionId: 'sub-001',
  },
  {
    id: 'n-3',
    icon: Clock,
    iconBg: 'bg-amber-50 text-amber-600',
    message: 'Your Science notebook is being processed.',
    time: '1 day ago',
    read: false,
    submissionId: null,
  },
  {
    id: 'n-4',
    icon: TrendingUp,
    iconBg: 'bg-emerald-50 text-emerald-600',
    message: 'Your performance improved by 10% this month!',
    time: '2 days ago',
    read: true,
    submissionId: null,
  },
  {
    id: 'n-5',
    icon: AlertCircle,
    iconBg: 'bg-amber-50 text-amber-600',
    message: 'Upcoming deadline: Physics notebook submission.',
    time: '3 days ago',
    read: true,
    submissionId: null,
  },
];

// ─── Hook: close on outside click or Escape ────────────────────
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

// ─── Notification Dropdown ──────────────────────────────────────
function NotificationDropdown() {
  const navigate = useNavigate();
  const { open, toggle, close, ref } = useDropdown();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleNotifClick(notif) {
    // Mark this one read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
    );
    if (notif.submissionId) {
      navigate(`/student/results?id=${notif.submissionId}`);
    }
    close();
  }

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={toggle}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-900/10 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#4F46E5]" />
              <span className="text-sm font-semibold text-gray-900">Notifications</span>
              {unread > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#4F46E5] text-[10px] font-bold text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={close}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <button
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                    ${!notif.read ? 'bg-[#4F46E5]/[0.02]' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${notif.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1.5 ml-1">
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-[#4F46E5] mt-1" />
                    )}
                    {notif.submissionId && (
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60">
            <p className="text-xs text-gray-400 text-center">
              {unread === 0 ? 'You\'re all caught up 🎉' : `${unread} unread notification${unread > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Avatar / Profile Dropdown ──────────────────────────────────
function AvatarDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { open, toggle, close, ref } = useDropdown();

  const displayName = user?.name || 'Student';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  function handleNav(path) {
    navigate(path);
    close();
  }

  function handleLogout() {
    logout();
    navigate('/login');
    close();
  }

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      description: 'View and edit your profile',
      onClick: () => handleNav('/student/profile'),
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={toggle}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center text-sm font-bold text-white ring-2 ring-white hover:ring-[#4F46E5]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 shadow-sm"
      >
        {initials}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-900/10 z-50 overflow-hidden"
        >
          {/* User info header */}
          <div className="px-4 py-3.5 border-b border-gray-100 bg-gradient-to-br from-[#4F46E5]/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                {displayEmail && (
                  <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {menuItems.map(({ icon: Icon, label, description, onClick }) => (
              <button
                key={label}
                role="menuitem"
                onClick={onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 group"
              >
                <div className="h-7 w-7 rounded-lg bg-[#4F46E5]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#4F46E5]/12 transition-colors">
                  <Icon className="h-3.5 w-3.5 text-[#4F46E5]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1.5">
            <button
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50 group"
            >
              <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                <LogOut className="h-3.5 w-3.5 text-red-600" />
              </div>
              <p className="text-sm font-medium text-red-600">Logout</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar nav items ──────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard', path: '/student', icon: LayoutDashboard, exact: true },
  { label: 'Upload Notebook', path: '/student/upload', icon: Upload },
  { label: 'Results', path: '/student/results', icon: FileText },
  { label: 'Performance History', path: '/student/performance', icon: BarChart3 },
  { label: 'Profile', path: '/student/profile', icon: UserCircle },
];

// ─── Main Layout ────────────────────────────────────────────────
function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <span className="text-lg font-bold text-gray-900">Student Portal</span>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
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
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 rounded-lg p-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* Right-side controls */}
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <AvatarDropdown />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
