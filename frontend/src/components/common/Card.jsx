const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
const shadowMap = { none: '', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-xl' };

function Card({
  header,
  footer,
  padding = 'md',
  shadow = 'md',
  hover = false,
  border = true,
  className = '',
  children,
}) {
  return (
    <div
      className={`
        bg-white rounded-2xl
        ${border ? 'border border-gray-100' : ''}
        ${shadowMap[shadow]}
        ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-100">
          {header}
        </div>
      )}
      <div className={paddingMap[padding] || paddingMap.md}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;

