const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const statusSizeMap = { xs: 'h-1.5 w-1.5', sm: 'h-2 w-2', md: 'h-2.5 w-2.5', lg: 'h-3 w-3', xl: 'h-3.5 w-3.5' };

function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  status,
  className = '',
}) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const statusColors = {
    online: 'bg-[#10B981]',
    offline: 'bg-gray-300',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-gray-100`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex items-center justify-center font-semibold text-white ring-2 ring-white shadow-sm`}
          aria-label={name || 'Avatar'}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeMap[size]} rounded-full ring-2 ring-white ${statusColors[status] || statusColors.online}`}
        />
      )}
    </div>
  );
}

export default Avatar;

