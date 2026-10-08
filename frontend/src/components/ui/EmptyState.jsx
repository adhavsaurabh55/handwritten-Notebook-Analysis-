/**
 * EmptyState — Reusable empty state placeholder.
 *
 * Props:
 *   - icon: ReactNode           — Custom icon/illustration (default: built-in empty box icon)
 *   - title: string             — Heading text (default: "No data found")
 *   - description: string       — Subtext explaining why it's empty
 *   - action: ReactNode         — A button/link for the user to take action
 *   - size: "sm" | "md" | "lg"  (default: "md")
 *   - className: string         — Additional classes
 */

const sizeClasses = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-20',
};

const iconSizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
};

function DefaultIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );
}

function EmptyState({
  icon,
  title = 'No data found',
  description,
  action,
  size = 'md',
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-4 ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <div className={`text-gray-300 mb-4 ${iconSizeClasses[size] || iconSizeClasses.md}`}>
        {icon || <DefaultIcon />}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;

