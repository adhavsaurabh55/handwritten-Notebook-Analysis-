import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

function Breadcrumb({ items = [], showHome = true, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-sm ${className}`}>
      {showHome && (
        <>
          <Link to="/" className="text-gray-400 hover:text-[#4F46E5] transition-colors p-0.5">
            <Home className="h-4 w-4" />
          </Link>
          {items.length > 0 && <ChevronRight className="h-4 w-4 text-gray-300" />}
        </>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.path || item.label} className="flex items-center gap-1">
            {isLast ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : item.path ? (
              <Link to={item.path} className="text-gray-500 hover:text-[#4F46E5] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 text-gray-300" />}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;

