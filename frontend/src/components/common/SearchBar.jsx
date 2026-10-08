import { Search, X } from 'lucide-react';
import { forwardRef } from 'react';

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, onClear, placeholder = 'Search...', className = '', inputClassName = '', ...rest },
  ref,
) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4.5 w-4.5 text-gray-400" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-10 py-2.5 border border-gray-200 text-sm rounded-xl
          bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]
          transition-all placeholder:text-gray-400
          ${inputClassName}
        `}
        {...rest}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

export default SearchBar;

