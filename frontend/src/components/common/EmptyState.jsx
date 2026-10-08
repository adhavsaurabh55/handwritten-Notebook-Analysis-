import { Inbox } from 'lucide-react';

const sizeMap = { sm: 'py-8', md: 'py-12', lg: 'py-20' };
const iconSizeMap = { sm: 'h-10 w-10', md: 'h-16 w-16', lg: 'h-24 w-24' };
const titleSizeMap = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' };

function EmptyState({
  icon: IconComponent,
  title = 'No data found',
  description,
  action,
  actionLabel,
  onAction,
  size = 'md',
  className = '',
}) {
  const Icon = IconComponent || Inbox;

  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 ${sizeMap[size] || sizeMap.md} ${className}`}>
      <div className={`text-gray-300 mb-4 flex items-center justify-center ${iconSizeMap[size] || iconSizeMap.md}`}>
        {typeof Icon === 'function' ? <Icon className="w-full h-full" /> : Icon}
      </div>
      <h3 className={`${titleSizeMap[size] || titleSizeMap.md} font-semibold text-gray-900`}>{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
      {(action || (actionLabel && onAction)) && (
        <div className="mt-6">
          {action || (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-[#4F46E5] text-white font-semibold text-xs rounded-xl hover:bg-[#4338CA] transition-colors shadow-sm"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
