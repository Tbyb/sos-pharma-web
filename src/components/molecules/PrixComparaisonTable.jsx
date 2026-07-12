import { Link } from 'react-router-dom';
import { MapPin, ShoppingCart, Navigation } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';
import { formatDistanceKm } from '../../utils/geo';
import DisponibiliteBadge from '../atoms/DisponibiliteBadge';

/**
 * @param {{ comparaisons: Array, onAjouterPanier?: (item: object) => void }} props
 */
export default function PrixComparaisonTable({ comparaisons = [], onAjouterPanier }) {
  if (!comparaisons.length) {
    return <p className="text-gris-doux text-sm text-center py-8">Aucune pharmacie ne propose ce médicament actuellement.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gris-bordure text-left">
            <th className="pb-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Pharmacie</th>
            <th className="pb-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Prix</th>
            <th className="pb-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Disponibilité</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {comparaisons.map((item, index) => (
            <tr key={index} className="border-b border-gris-bordure last:border-0 hover:bg-blanc-casse transition-colors duration-200">
              <td className="py-3">
                <p className="font-medium text-bleu-nuit">{item.pharmacie_nom}</p>
                <p className="text-xs text-gris-doux flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {item.pharmacie_adresse}
                  {item.distanceKm != null && <span className="text-vert-medical">· {formatDistanceKm(item.distanceKm)}</span>}
                </p>
                {item.pharmacie_id && (
                  <Link
                    to={`/pharmacies?id=${item.pharmacie_id}`}
                    className="inline-flex items-center gap-1 text-xs text-vert-medical hover:text-vert-profond transition-colors duration-200 mt-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Voir sur la carte
                  </Link>
                )}
              </td>
              <td className="py-3 font-mono font-medium text-bleu-nuit">
                {formatMontant(item.prix)}
              </td>
              <td className="py-3">
                <DisponibiliteBadge disponible={item.disponible} />
              </td>
              <td className="py-3">
                {item.disponible && onAjouterPanier && (
                  <button
                    onClick={() => onAjouterPanier(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-vert-medical hover:bg-vert-profond text-white text-xs font-medium transition-colors duration-200"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Ajouter
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
