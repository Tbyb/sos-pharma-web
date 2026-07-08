import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @param {{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }} props
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded hover:bg-gris-clair disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1 rounded text-sm hover:bg-gris-clair cursor-pointer">1</button>
          {start > 2 && <span className="px-1 text-gris">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded text-sm cursor-pointer ${page === currentPage ? 'bg-bleu text-white' : 'hover:bg-gris-clair'}`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-gris">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 rounded text-sm hover:bg-gris-clair cursor-pointer">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded hover:bg-gris-clair disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
