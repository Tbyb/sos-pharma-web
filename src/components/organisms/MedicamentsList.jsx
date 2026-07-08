import MedicamentCard from '../molecules/MedicamentCard';
import Pagination from '../atoms/Pagination';
import Skeleton from '../atoms/Skeleton';

/**
 * @param {{ medicaments: Array, isLoading: boolean, currentPage: number, totalPages: number, onPageChange: (page: number) => void }} props
 */
export default function MedicamentsList({ medicaments = [], isLoading, currentPage, totalPages, onPageChange }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" height="100px" />
        ))}
      </div>
    );
  }

  if (!medicaments.length) {
    return <p className="text-gris text-center py-12">Aucun médicament trouvé.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicaments.map((med) => (
          <MedicamentCard key={med.id} medicament={med} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
