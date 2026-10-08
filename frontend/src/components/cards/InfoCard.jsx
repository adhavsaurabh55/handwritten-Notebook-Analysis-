import { Info, ArrowRight } from 'lucide-react';

function InfoCard({
  title,
  description,
  items = [],
  icon,
  color = 'blue',
  action,
  className = '',
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-violet-50 text-violet-600 border-violet-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${colorMap[color] || colorMap.blue}`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          {items.length > 0 && (
            <ul className="mt-3 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {action && (
            <button onClick={action} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
              {action.label || 'View details'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoCard;

