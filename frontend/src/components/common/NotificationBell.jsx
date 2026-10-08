import { Bell } from 'lucide-react';

function NotificationBell({ count = 0, dot = false, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 ${className}`}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {dot && count === 0 && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#4F46E5] ring-2 ring-white" />
      )}
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;

