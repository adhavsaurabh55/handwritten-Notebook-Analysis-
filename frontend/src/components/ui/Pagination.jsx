import { useMemo } from 'react';
import Button from './Button';

/**
 * Pagination — Reusable page navigation.
 *
 * Props:
 *   - currentPage: number        — 1-indexed current page (required)
 *   - totalPages: number         — Total number of pages (required)
 *   - onPageChange: (page: number) => void   — Called when page changes (required)
 *   - siblingCount: number       — Number of sibling pages visible around current (default: 1)
 *   - showFirstLast: boolean     — Show First/Last buttons (default: true)
 *   - size: "sm" | "md"         — Controls button size (default: "md")
 *   - className: string          — Additional classes
 */

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  size = 'md',
  className = '',
}) {
  const btnSize = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  // Generate the range of page numbers to display
  const pageNumbers = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 dots

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [1, '...', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [1, '...', ...middleRange, '...', totalPages];
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  const baseBtnClass = `inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${btnSize}`;
  const activeBtnClass = 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700';

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Pagination">
      {/* First */}
      {showFirstLast && (
        <button
          className={baseBtnClass}
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Previous */}
      <button
        className={baseBtnClass}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className={`${btnSize} text-gray-400 select-none`}>
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            className={`${baseBtnClass} ${page === currentPage ? activeBtnClass : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        className={baseBtnClass}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Last */}
      {showFirstLast && (
        <button
          className={baseBtnClass}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Page info */}
      <span className="ml-2 text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
}

export default Pagination;

