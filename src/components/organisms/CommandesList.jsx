import CommandeItem from '../molecules/CommandeItem';
import Skeleton from '../atoms/Skeleton';
import Pagination from '../atoms/Pagination';

export default function CommandesList({ commandes, isLoading, currentPage, totalPages, onPageChange }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="card" height="76px" />
        ))}
      </div>
    );
  }

  if (!commandes.length) {
    return <p className="text-center text-gris-doux py-16">Aucune commande pour le moment.</p>;
  }

  return (
    <div>
      <div className="space-y-3">
        {commandes.map((commande) => (
          <CommandeItem key={commande.id} commande={commande} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
