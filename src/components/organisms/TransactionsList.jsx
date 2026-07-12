import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import { STATUTS_PAIEMENT, MODES_PAIEMENT } from '../../utils/constants';
import { formatMontant, formatDate } from '../../utils/formatters';

/**
 * @param {{ transactions: Array, isLoading: boolean }} props
 */
export default function TransactionsList({ transactions = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="48px" />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return <p className="text-center text-gris-doux py-16">Aucune transaction trouvée.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-blanc-casse">
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Référence</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Commande</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Patient</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Montant</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Mode</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Statut</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const statut = STATUTS_PAIEMENT[t.statut_paiement] || { label: t.statut_paiement, couleur: '#6B7280', fond: '#F3F4F6' };
            return (
              <tr key={t.id} className="border-t border-gris-bordure hover:bg-blanc-casse transition-colors duration-200">
                <td className="py-2.5 px-4 font-mono text-xs text-bleu-nuit">{t.reference_transaction}</td>
                <td className="py-2.5 px-4 text-gris-doux">#{t.commande_id}</td>
                <td className="py-2.5 px-4 text-gris-doux">{t.patient?.nom || '—'}</td>
                <td className="py-2.5 px-4 font-mono font-medium text-bleu-nuit">{formatMontant(t.montant)}</td>
                <td className="py-2.5 px-4 text-gris-doux">{MODES_PAIEMENT[t.mode_paiement] || t.mode_paiement}</td>
                <td className="py-2.5 px-4">
                  <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
                </td>
                <td className="py-2.5 px-4 text-gris-doux">{formatDate(t.date_paiement)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
