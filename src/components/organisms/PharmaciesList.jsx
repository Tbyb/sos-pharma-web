import PharmacieAdminCard from '../molecules/PharmacieAdminCard';
import Skeleton from '../atoms/Skeleton';

/**
 * @param {{ pharmacies: Array, isLoading: boolean, onCertifier: Function, onRefuser: Function, onSuspendre: Function, onReactiver: Function }} props
 */
export default function PharmaciesList({ pharmacies = [], isLoading, onCertifier, onRefuser, onSuspendre, onReactiver }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" height="140px" />
        ))}
      </div>
    );
  }

  if (!pharmacies.length) {
    return <p className="text-center text-gris-doux py-16">Aucune pharmacie dans cette catégorie.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pharmacies.map((pharmacie) => (
        <PharmacieAdminCard
          key={pharmacie.id}
          pharmacie={pharmacie}
          onCertifier={onCertifier}
          onRefuser={onRefuser}
          onSuspendre={onSuspendre}
          onReactiver={onReactiver}
        />
      ))}
    </div>
  );
}
