import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
        aria-label="Önceki sayfa"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-sm font-medium text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentPage === page
                  ? 'bg-[#D47800] text-white shadow-md'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
        aria-label="Sonraki sayfa"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-600">
        <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
        {' - '}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span>
        {' / '}
        <span className="font-medium">{totalItems}</span>
        {' ürün'}
      </div>
    </div>
  );
};

export default Pagination;

