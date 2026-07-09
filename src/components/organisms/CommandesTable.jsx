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
    return <p className="text-center text-gris py-12">Aucune commande trouvée.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gris border-b">
            <th className="py-3 px-4 font-medium">N°</th>
            <th className="py-3 px-4 font-medium">Patient</th>
            <th className="py-3 px-4 font-medium">Pharmacie</th>
            <th className="py-3 px-4 font-medium">Montant</th>
            <th className="py-3 px-4 font-medium">Mode</th>
            <th className="py-3 px-4 font-medium">Statut</th>
            <th className="py-3 px-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => {
            const statut = STATUTS_COMMANDE[commande.statut_commande] || { label: commande.statut_commande, couleur: '#6B7280', fond: '#F3F4F6' };
            return (
              <tr
                key={commande.id}
                onClick={() => onRowClick(commande)}
                className="border-b last:border-0 hover:bg-gris-clair/50 cursor-pointer"
              >
                <td className="py-2.5 px-4 font-medium text-noir">#{commande.id}</td>
                <td className="py-2.5 px-4 text-gris">{commande.patient?.nom || '—'}</td>
                <td className="py-2.5 px-4 text-gris">{commande.pharmacie?.nom || '—'}</td>
                <td className="py-2.5 px-4 text-noir">{formatMontant(commande.montant_total)}</td>
                <td className="py-2.5 px-4 text-gris">{MODES_RECUPERATION[commande.mode_recuperation] || commande.mode_recuperation}</td>
                <td className="py-2.5 px-4">
                  <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
                </td>
                <td className="py-2.5 px-4 text-gris">{formatDate(commande.date_commande)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
