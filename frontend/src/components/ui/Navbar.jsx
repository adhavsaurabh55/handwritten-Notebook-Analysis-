import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar — Reusable navigation bar.
 *
 * Props:
 *   - brand: string              — Brand/logo text (default: "Brand Name")
 *   - brandLink: string          — Link for brand (default: "/")
 *   - navItems: Array<{label, path}>  — Navigation links
 *   - rightContent: ReactNode    — Optional element(s) rendered on the right (e.g. avatar, logout)
 *   - transparent: boolean       — Use transparent background (default: false)
 *   - className: string          — Additional classes
 */
function Navbar({
  brand = 'Brand Name',
  brandLink = '/',
  navItems = [],
  rightContent,
  transparent = false,
  className = '',
}) {
  const location = useLocation();

  return (
    <nav
      className={`w-full ${
        transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to={brandLink} className="flex-shrink-0 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
          {brand}
        </Link>

        {/* Nav Links */}
        {navItems.length > 0 && (
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right content (avatar, logout, etc.) */}
        {rightContent && (
          <div className="flex items-center space-x-3">{rightContent}</div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

