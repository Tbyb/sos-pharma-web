import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import { STATUTS_COMMANDE } from '../../utils/constants';
import { formatMontant, formatDate } from '../../utils/formatters';

const MODES_RECUPERATION = { livraison: 'Livraison', retrait: 'Retrait' };

/**
 * @param {{ commandes: Array, isLoading: boolean, onRowClick: (c: object) => void }} props
 */
export default function CommandesTable({ commandes = [], isLoading, onRowClick }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="48px" />
        ))}
      </div>
    );
  }

  if (!commandes.length) {
    return <p className="text-center text-gris-doux py-16">Aucune commande trouvée.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-blanc-casse">
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">N°</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Patient</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Pharmacie</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Montant</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Mode</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Statut</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Date</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => {
            const statut = STATUTS_COMMANDE[commande.statut_commande] || { label: commande.statut_commande, couleur: '#6B7280', fond: '#F3F4F6' };
            return (
              <tr
                key={commande.id}
                onClick={() => onRowClick(commande)}
                className="border-t border-gris-bordure hover:bg-blanc-casse transition-colors duration-200 cursor-pointer"
              >
                <td className="py-2.5 px-4 font-medium text-bleu-nuit">#{commande.id}</td>
                <td className="py-2.5 px-4 text-gris-doux">{commande.patient?.nom || '—'}</td>
                <td className="py-2.5 px-4 text-gris-doux">{commande.pharmacie?.nom || '—'}</td>
                <td className="py-2.5 px-4 font-mono text-bleu-nuit">{formatMontant(commande.montant_total)}</td>
                <td className="py-2.5 px-4 text-gris-doux">{MODES_RECUPERATION[commande.mode_recuperation] || commande.mode_recuperation}</td>
                <td className="py-2.5 px-4">
                  <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
                </td>
                <td className="py-2.5 px-4 text-gris-doux">{formatDate(commande.date_commande)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
