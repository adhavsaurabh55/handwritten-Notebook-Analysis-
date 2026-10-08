import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary: 'bg-[#4F46E5] text-white hover:bg-[#4338CA] focus:ring-[#4F46E5]/30 shadow-lg shadow-[#4F46E5]/15',
  secondary: 'bg-[#10B981] text-white hover:bg-[#059669] focus:ring-[#10B981]/30 shadow-lg shadow-[#10B981]/15',
  outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 shadow-lg shadow-red-600/15',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200',
  link: 'text-[#4F46E5] hover:text-[#4338CA] underline-offset-2 hover:underline focus:ring-[#4F46E5]/30',
};

const sizeClasses = {
  xs: 'px-2.5 py-1 text-xs rounded-lg',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-3.5 text-lg rounded-xl',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled = false, fullWidth = false, type = 'button', icon, className = '', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
});

export default Button;

