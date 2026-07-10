import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import { STATUTS_PAIEMENT } from '../../utils/constants';
import { formatMontant, formatDate } from '../../utils/formatters';

const MODES_LABELS = {
  orange_money: 'Orange Money',
  wave: 'Wave',
  virement: 'Virement',
  stripe: 'Carte (Stripe)',
};

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
    return <p className="text-center text-gris py-12">Aucune transaction trouvée.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gris border-b">
            <th className="py-3 px-4 font-medium">Référence</th>
            <th className="py-3 px-4 font-medium">Commande</th>
            <th className="py-3 px-4 font-medium">Patient</th>
            <th className="py-3 px-4 font-medium">Montant</th>
            <th className="py-3 px-4 font-medium">Mode</th>
            <th className="py-3 px-4 font-medium">Statut</th>
            <th className="py-3 px-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const statut = STATUTS_PAIEMENT[t.statut_paiement] || { label: t.statut_paiement, couleur: '#6B7280', fond: '#F3F4F6' };
            return (
              <tr key={t.id} className="border-b last:border-0 hover:bg-gris-clair/50">
                <td className="py-2.5 px-4 font-mono text-xs text-noir">{t.reference_transaction}</td>
                <td className="py-2.5 px-4 text-gris">#{t.commande_id}</td>
                <td className="py-2.5 px-4 text-gris">{t.patient?.nom || '—'}</td>
                <td className="py-2.5 px-4 font-medium text-noir">{formatMontant(t.montant)}</td>
                <td className="py-2.5 px-4 text-gris">{MODES_LABELS[t.mode_paiement] || t.mode_paiement}</td>
                <td className="py-2.5 px-4">
                  <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
                </td>
                <td className="py-2.5 px-4 text-gris">{formatDate(t.date_paiement)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
