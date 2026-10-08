import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar — Reusable vertical navigation panel.
 *
 * Props:
 *   - items: Array<{label, path, icon?: ReactNode}>
 *   - brand: string              — Header text (default: "Portal")
 *   - isOpen: boolean            — Controls open/closed state (mobile)
 *   - onClose: () => void        — Called when close button or overlay is clicked
 *   - footer: ReactNode          — Optional content at the bottom of sidebar
 *   - className: string          — Additional classes
 */
function Sidebar({
  items = [],
  brand = 'Portal',
  isOpen = false,
  onClose,
  footer,
  className = '',
}) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">{brand}</span>
          {onClose && (
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {footer && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;

