import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0 
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Afficher avec ellipses
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-gray-600">
        Affichage de {startItem} à {endItem} sur {totalItems} résultat{totalItems > 1 ? 's' : ''}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Bouton précédent */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page précédente"
        >
          <FiChevronLeft />
        </button>

        {/* Numéros de page */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  page === currentPage
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Bouton suivant */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page suivante"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

