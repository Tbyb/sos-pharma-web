import Badge from '../atoms/Badge';
import { STATUTS_COMMANDE, STATUTS_PAIEMENT } from '../../utils/constants';
import { formatMontant, formatDate } from '../../utils/formatters';

const MODES_RECUPERATION = { livraison: 'Livraison', retrait: 'Retrait en pharmacie' };

/**
 * @param {{ commande: object }} props
 */
export default function CommandeDetails({ commande }) {
  const statut = STATUTS_COMMANDE[commande.statut_commande] || { label: commande.statut_commande, couleur: '#6B7280', fond: '#F3F4F6' };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-noir">Commande #{commande.id}</p>
          <p className="text-xs text-gris mt-0.5">{formatDate(commande.date_commande)}</p>
        </div>
        <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
      </div>

      {commande.statut_commande === 'refusee' && commande.motif_refus && (
        <div className="text-sm bg-red-50 border border-red-100 rounded-lg p-3">
          <span className="font-medium text-noir">Motif du refus : </span>
          <span className="text-gris">{commande.motif_refus}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-gris">Patient</p>
          <p className="font-medium text-noir">{commande.patient?.nom || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gris">Pharmacie</p>
          <p className="font-medium text-noir">{commande.pharmacie?.nom || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gris">Mode de récupération</p>
          <p className="font-medium text-noir">{MODES_RECUPERATION[commande.mode_recuperation] || commande.mode_recuperation}</p>
        </div>
        <div>
          <p className="text-xs text-gris">Montant total</p>
          <p className="font-medium text-noir">{formatMontant(commande.montant_total)}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-noir mb-2">Médicaments</p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gris bg-gris-clair">
                <th className="py-2 px-3 font-medium">Médicament</th>
                <th className="py-2 px-3 font-medium">Qté</th>
                <th className="py-2 px-3 font-medium">Prix unitaire</th>
                <th className="py-2 px-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {(commande.items || []).map((item, i) => (
                <tr key={item.idMedicament || i} className="border-t">
                  <td className="py-2 px-3 text-noir">{item.medicament}</td>
                  <td className="py-2 px-3">{item.quantite}</td>
                  <td className="py-2 px-3">{formatMontant(item.prix_unitaire)}</td>
                  <td className="py-2 px-3">{formatMontant(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {commande.livraison && (
        <div>
          <p className="text-sm font-semibold text-noir mb-2">Livraison</p>
          <div className="text-sm bg-gris-clair/50 rounded-lg p-3 space-y-1">
            <p><span className="text-gris">Adresse : </span>{commande.livraison.adresse}</p>
            <p><span className="text-gris">Statut : </span>{commande.livraison.statut}</p>
          </div>
        </div>
      )}

      {commande.paiement && (
        <div>
          <p className="text-sm font-semibold text-noir mb-2">Paiement</p>
          <div className="text-sm bg-gris-clair/50 rounded-lg p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gris">Statut</span>
              {(() => {
                const sp = STATUTS_PAIEMENT[commande.paiement.statut_paiement] || { label: commande.paiement.statut_paiement, couleur: '#6B7280', fond: '#F3F4F6' };
                return <Badge couleur={sp.couleur} fond={sp.fond}>{sp.label}</Badge>;
              })()}
            </div>
            <p><span className="text-gris">Montant : </span>{formatMontant(commande.paiement.montant)}</p>
            <p><span className="text-gris">Mode : </span>{commande.paiement.mode_paiement}</p>
            <p><span className="text-gris">Référence : </span>{commande.paiement.reference_transaction}</p>
          </div>
        </div>
      )}
    </div>
  );
}
