import { Link } from 'react-router-dom';
import { MapPin, ShoppingCart, Navigation } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

/**
 * @param {{ comparaisons: Array, onAjouterPanier?: (item: object) => void }} props
 */
export default function PrixComparaisonTable({ comparaisons = [], onAjouterPanier }) {
  if (!comparaisons.length) {
    return <p className="text-gris text-sm text-center py-8">Aucune pharmacie ne propose ce médicament actuellement.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium text-gris">Pharmacie</th>
            <th className="pb-3 font-medium text-gris">Prix</th>
            <th className="pb-3 font-medium text-gris">Disponibilité</th>
            <th className="pb-3 font-medium text-gris"></th>
          </tr>
        </thead>
        <tbody>
          {comparaisons.map((item, index) => (
            <tr key={index} className="border-b last:border-0">
              <td className="py-3">
                <p className="font-medium text-noir">{item.pharmacie_nom}</p>
                <p className="text-xs text-gris flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {item.pharmacie_adresse}
                </p>
                {item.pharmacie_id && (
                  <Link
                    to={`/pharmacies?id=${item.pharmacie_id}`}
                    className="inline-flex items-center gap-1 text-xs text-bleu hover:underline mt-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Voir sur la carte
                  </Link>
                )}
              </td>
              <td className="py-3 font-semibold text-noir">
                {formatMontant(item.prix)}
              </td>
              <td className="py-3">
                <Badge
                  couleur={item.disponible ? '#16A34A' : '#DC2626'}
                  fond={item.disponible ? '#DCFCE7' : '#FEE2E2'}
                >
                  {item.disponible ? 'En stock' : 'Rupture'}
                </Badge>
              </td>
              <td className="py-3">
                {item.disponible && onAjouterPanier && (
                  <Button
                    size="sm"
                    onClick={() => onAjouterPanier(item)}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Ajouter
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
