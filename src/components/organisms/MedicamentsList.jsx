import MedicamentCard from '../molecules/MedicamentCard';
import Pagination from '../atoms/Pagination';
import Skeleton from '../atoms/Skeleton';

/**
 * @param {{ medicaments: Array, isLoading: boolean, currentPage: number, totalPages: number, onPageChange: (page: number) => void }} props
 */
export default function MedicamentsList({ medicaments = [], isLoading, currentPage, totalPages, onPageChange }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="card" height="300px" />
        ))}
      </div>
    );
  }

  if (!medicaments.length) {
    return <p className="text-gris-doux text-center py-16">Aucun médicament trouvé pour votre recherche</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {medicaments.map((med) => (
          <MedicamentCard key={med.id} medicament={med} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
