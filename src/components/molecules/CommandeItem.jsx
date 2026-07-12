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
      className="block bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:border-vert-medical hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-200 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-vert-menthe rounded-[8px] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-vert-profond" />
          </div>
          <div>
            <p className="font-medium text-bleu-nuit text-sm">Commande #{commande.id}</p>
            {date && <p className="text-xs text-gris-doux mt-0.5">{formatDate(date)}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono font-semibold text-bleu-nuit text-sm">{formatMontant(commande.montant_total)}</p>
            <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
          </div>
          <ChevronRight className="w-4 h-4 text-gris-doux shrink-0" />
        </div>
      </div>
    </Link>
  );
}
