import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import Badge from '../atoms/Badge';
import { formatMontant, formatDate } from '../../utils/formatters';
import { STATUTS_COMMANDE } from '../../utils/constants';

export default function CommandeItem({ commande }) {
  const statutKey = commande.statut_commande || commande.statut;
  const statut = STATUTS_COMMANDE[statutKey] || { label: statutKey, couleur: '#6B7280', fond: '#F3F4F6' };
  const date = commande.date_commande || commande.created_at;

  return (
    <Link
      to={`/patient/commandes/${commande.id}`}
      className="block bg-white rounded-lg shadow-card p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bleu/10 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-bleu" />
          </div>
          <div>
            <p className="font-medium text-noir text-sm">Commande #{commande.id}</p>
            {date && <p className="text-xs text-gris mt-0.5">{formatDate(date)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-noir text-sm">{formatMontant(commande.montant_total)}</p>
            <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
          </div>
          <ChevronRight className="w-4 h-4 text-gris" />
        </div>
      </div>
    </Link>
  );
}
