import { forwardRef } from 'react';

const TextArea = forwardRef(function TextArea(
  { label, error, helperText, id, rows = 4, className = '', textareaClassName = '', ...rest },
  ref,
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`
          w-full px-4 py-2.5 border text-sm rounded-xl resize-vertical
          focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all
          placeholder:text-gray-400
          ${error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50/30 text-red-900'
            : 'border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]/20 bg-white text-gray-900'
          }
          ${textareaClassName}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-500 flex items-center gap-1" role="alert">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

export default TextArea;

