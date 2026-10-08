/**
 * Card — Reusable content container with optional header and footer.
 *
 * Props:
 *   - header: ReactNode       — Rendered at the top (e.g. title, actions)
 *   - footer: ReactNode       — Rendered at the bottom
 *   - padding: "none" | "sm" | "md" | "lg"  (default: "md")
 *   - shadow: "none" | "sm" | "md" | "lg"   (default: "md")
 *   - hover: boolean          — Adds hover elevation effect (default: false)
 *   - className: string       — Additional classes on the outer wrapper
 *   - children: ReactNode
 */

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

function Card({
  header,
  footer,
  padding = 'md',
  shadow = 'md',
  hover = false,
  className = '',
  children,
}) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200
        ${shadowClasses[shadow] || shadowClasses.md}
        ${hover ? 'transition-shadow hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-100">{header}</div>
      )}

      <div className={paddingClasses[padding] || paddingClasses.md}>
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-100">{footer}</div>
      )}
    </div>
  );
}

export default Card;

