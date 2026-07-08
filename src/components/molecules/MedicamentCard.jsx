import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';

/**
 * @param {{ medicament: object }} props
 */
export default function MedicamentCard({ medicament }) {
  const prixMin = medicament.stocks?.length
    ? Math.min(...medicament.stocks.map((s) => parseFloat(s.prix_unitaire)))
    : medicament.prix_de_vente ? parseFloat(medicament.prix_de_vente) : null;

  const nbPharmacies = medicament.stocks?.length || 0;

  return (
    <Link
      to={`/medicaments/${medicament.id}`}
      className="block bg-white rounded-lg shadow-card p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-vert-clair rounded-lg flex items-center justify-center shrink-0">
          <Pill className="w-5 h-5 text-vert" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-noir text-sm truncate">{medicament.designation}</h3>
          <p className="text-xs text-gris mt-0.5">{medicament.forme || medicament.CIP}</p>
          {prixMin != null && (
            <p className="text-bleu font-semibold text-sm mt-2">
              à partir de {formatMontant(prixMin)}
            </p>
          )}
          {nbPharmacies > 0 && (
            <p className="text-xs text-gris mt-1">Disponible dans {nbPharmacies} pharmacie{nbPharmacies > 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
