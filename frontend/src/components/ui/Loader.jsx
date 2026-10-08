/**
 * Loader — Reusable loading indicator.
 *
 * Props:
 *   - size: "sm" | "md" | "lg"      (default: "md")
 *   - variant: "spinner" | "dots" | "bar"   (default: "spinner")
 *   - overlay: boolean              — Full-screen semi-transparent overlay (default: false)
 *   - text: string                  — Optional text below the loader
 *   - className: string             — Additional classes
 */

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

function Spinner({ size, text, className }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          animate-spin rounded-full border-indigo-600 border-t-transparent
          ${sizeClasses[size] || sizeClasses.md}
        `}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

function Dots({ size, text, className }) {
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-3 w-3' : 'h-2 w-2';

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${dotSize} bg-indigo-600 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

function Bar({ size, text, className }) {
  const barHeight = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2' : 'h-1.5';

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`w-full max-w-xs bg-gray-200 rounded-full overflow-hidden ${barHeight}`}>
        <div
          className={`${barHeight} bg-indigo-600 rounded-full animate-pulse`}
          style={{ width: '60%' }}
        />
      </div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

function Loader({
  size = 'md',
  variant = 'spinner',
  overlay = false,
  text,
  className = '',
}) {
  const loader =
    variant === 'dots' ? (
      <Dots size={size} text={text} className={className} />
    ) : variant === 'bar' ? (
      <Bar size={size} text={text} className={className} />
    ) : (
      <Spinner size={size} text={text} className={className} />
    );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return loader;
}

export default Loader;

