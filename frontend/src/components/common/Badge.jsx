const variantMap = {
  primary: 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20',
  secondary: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
};

const sizeMap = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

function Badge({
  variant = 'primary',
  size = 'sm',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  children,
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantMap[variant]} ${sizeMap[size]}
        ${className}
      `}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${variant === 'primary' ? 'bg-[#4F46E5]' : variant === 'secondary' ? 'bg-[#10B981]' : ''}`} />}
      {children}
      {removable && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity" aria-label="Remove">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Badge;

