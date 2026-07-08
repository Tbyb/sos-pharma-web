import { MapPin, Clock } from 'lucide-react';

/**
 * @param {{ pharmacie: object, onClick?: () => void }} props
 */
export default function PharmacieCard({ pharmacie, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-card p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <h3 className="font-medium text-noir text-sm">{pharmacie.nom}</h3>
      <div className="flex items-center gap-1 mt-2 text-xs text-gris">
        <MapPin className="w-3.5 h-3.5" />
        <span className="truncate">{pharmacie.adresse}</span>
      </div>
      {pharmacie.telephone && (
        <div className="flex items-center gap-1 mt-1 text-xs text-gris">
          <Clock className="w-3.5 h-3.5" />
          <span>{pharmacie.telephone}</span>
        </div>
      )}
    </div>
  );
}
