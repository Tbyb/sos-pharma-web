import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';
import DisponibiliteBadge from '../atoms/DisponibiliteBadge';
import { formatMontant } from '../../utils/formatters';

/**
 * @param {{ medicament: object }} props
 */
export default function MedicamentCard({ medicament }) {
  const prixMin = medicament.stocks?.length
    ? Math.min(...medicament.stocks.map((s) => parseFloat(s.prix_unitaire)))
    : medicament.prix_de_vente ? parseFloat(medicament.prix_de_vente) : null;

  const nbPharmacies = medicament.stocks?.length || 0;
  const disponible = medicament.stocks?.some((s) => s.disponible) ?? false;

  return (
    <Link
      to={`/medicaments/${medicament.id}`}
      className="block bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:border-vert-medical hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 p-4"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-10 h-10 bg-vert-menthe rounded-[8px] flex items-center justify-center shrink-0">
          <Pill className="w-5 h-5 text-vert-profond" />
        </div>
        <DisponibiliteBadge disponible={disponible} />
      </div>

      <h3 className="font-medium text-bleu-nuit text-[15px] truncate">{medicament.designation}</h3>
      <p className="text-xs text-gris-doux mt-0.5">{medicament.forme || medicament.CIP}</p>

      {prixMin != null && (
        <p className="font-mono font-medium text-bleu-nuit text-sm mt-3">
          À partir de {formatMontant(prixMin)}
        </p>
      )}
      {nbPharmacies > 0 && (
        <p className="text-xs text-gris-doux mt-1">
          Disponible dans {nbPharmacies} pharmacie{nbPharmacies > 1 ? 's' : ''}
        </p>
      )}
    </Link>
  );
}
