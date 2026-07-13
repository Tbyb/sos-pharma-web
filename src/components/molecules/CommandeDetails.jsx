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
          <p className="font-medium text-bleu-nuit">Commande #{commande.id}</p>
          <p className="text-xs text-gris-doux mt-0.5">{formatDate(commande.date_commande)}</p>
        </div>
        <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
      </div>

      {commande.statut_commande === 'refusee' && commande.motif_refus && (
        <div className="text-sm bg-[#FEE2E2] rounded-[8px] p-3">
          <span className="font-medium text-[#991B1B]">Motif du refus : </span>
          <span className="text-[#991B1B]">{commande.motif_refus}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-gris-doux">Patient</p>
          <p className="font-medium text-bleu-nuit">{commande.patient?.nom || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gris-doux">Pharmacie</p>
          <p className="font-medium text-bleu-nuit">{commande.pharmacie?.nom || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gris-doux">Mode de récupération</p>
          <p className="font-medium text-bleu-nuit">{MODES_RECUPERATION[commande.mode_recuperation] || commande.mode_recuperation}</p>
        </div>
        <div>
          <p className="text-xs text-gris-doux">Montant total</p>
          <p className="font-mono font-medium text-bleu-nuit">{formatMontant(commande.montant_total)}</p>
        </div>
      </div>

      {commande.frais_livraison > 0 && (
        <div className="text-sm space-y-1.5 -mt-1">
          <div className="flex justify-between">
            <span className="text-gris-doux">Sous-total médicaments</span>
            <span className="font-mono text-bleu-nuit">{formatMontant(commande.montant_medicaments)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris-doux">Frais de livraison</span>
            <span className="font-mono text-bleu-nuit">{formatMontant(commande.frais_livraison)}</span>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-bleu-nuit mb-2">Médicaments</p>
        <div className="overflow-x-auto rounded-[8px] border border-gris-bordure">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-blanc-casse">
                <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Médicament</th>
                <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Qté</th>
                <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Prix unitaire</th>
                <th className="py-2 px-3 font-semibold text-gris-doux text-xs uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody>
              {(commande.items || []).map((item, i) => (
                <tr key={item.idMedicament || i} className="border-t border-gris-bordure">
                  <td className="py-2 px-3 text-bleu-nuit">{item.medicament}</td>
                  <td className="py-2 px-3 font-mono text-bleu-nuit">{item.quantite}</td>
                  <td className="py-2 px-3 font-mono text-bleu-nuit">{formatMontant(item.prix_unitaire)}</td>
                  <td className="py-2 px-3 font-mono text-bleu-nuit">{formatMontant(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {commande.livraison && (
        <div>
          <p className="text-sm font-medium text-bleu-nuit mb-2">Livraison</p>
          <div className="text-sm bg-blanc-casse rounded-[8px] p-3 space-y-1">
            <p><span className="text-gris-doux">Adresse : </span><span className="text-bleu-nuit">{commande.livraison.adresse}</span></p>
            <p><span className="text-gris-doux">Statut : </span><span className="text-bleu-nuit">{commande.livraison.statut}</span></p>
          </div>
        </div>
      )}

      {commande.paiement && (
        <div>
          <p className="text-sm font-medium text-bleu-nuit mb-2">Paiement</p>
          <div className="text-sm bg-blanc-casse rounded-[8px] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gris-doux">Statut</span>
              {(() => {
                const sp = STATUTS_PAIEMENT[commande.paiement.statut_paiement] || { label: commande.paiement.statut_paiement, couleur: '#6B7280', fond: '#F3F4F6' };
                return <Badge couleur={sp.couleur} fond={sp.fond}>{sp.label}</Badge>;
              })()}
            </div>
            <p><span className="text-gris-doux">Montant : </span><span className="font-mono text-bleu-nuit">{formatMontant(commande.paiement.montant)}</span></p>
            <p><span className="text-gris-doux">Mode : </span><span className="text-bleu-nuit">{commande.paiement.mode_paiement}</span></p>
            <p><span className="text-gris-doux">Référence : </span><span className="font-mono text-bleu-nuit">{commande.paiement.reference_transaction}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
