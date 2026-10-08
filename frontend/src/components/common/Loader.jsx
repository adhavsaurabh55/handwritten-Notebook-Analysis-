import { Loader2, Activity } from 'lucide-react';

const sizeMap = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' };
const textSizeMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

function Spinner({ size, text, className }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-[#4F46E5]`} role="status" aria-label="Loading" />
      {text && <p className={`${textSizeMap[size]} text-gray-500`}>{text}</p>}
    </div>
  );
}

function Dots({ size, text, className }) {
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : size === 'lg' ? 'h-3 w-3' : 'h-2 w-2';
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${dotSize} bg-[#4F46E5] rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      {text && <p className={`${textSizeMap[size]} text-gray-500`}>{text}</p>}
    </div>
  );
}

function Skeleton({ count = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  );
}

function Loader({ size = 'md', variant = 'spinner', overlay = false, text, className = '' }) {
  const loader = variant === 'dots' ? <Dots size={size} text={text} className={className} />
    : variant === 'skeleton' ? <Skeleton />
    : <Spinner size={size} text={text} className={className} />;

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        {loader}
      </div>
    );
  }
  return loader;
}

export { Skeleton };
export default Loader;

