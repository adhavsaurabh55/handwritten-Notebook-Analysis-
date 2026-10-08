import { forwardRef } from 'react';

/**
 * Input — Reusable form input with label and error handling.
 *
 * Props:
 *   - label: string               — Label text displayed above input
 *   - error: string               — Error message displayed below input
 *   - id: string                  — HTML id (auto-generated from label if not provided)
 *   - className: string           — Additional classes on the outer wrapper
 *   - inputClassName: string      — Additional classes on the <input> element
 *   - ...rest                     — Spread onto the <input> element (name, type, value, onChange, placeholder, etc.)
 */

const Input = forwardRef(function Input(
  {
    label,
    error,
    id,
    className = '',
    inputClassName = '',
    ...rest
  },
  ref,
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:border-indigo-500
          transition-colors
          ${
            error
              ? 'border-red-300 focus:ring-red-500 text-red-900'
              : 'border-gray-300 focus:ring-indigo-500 text-gray-900'
          }
          ${inputClassName}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;

