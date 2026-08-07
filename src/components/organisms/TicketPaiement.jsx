import { ShieldPlus, CheckCircle2, Store, Truck, MapPin, Phone } from 'lucide-react';
import { formatMontant, formatDate } from '../../utils/formatters';
import { MODES_PAIEMENT } from '../../utils/constants';

/**
 * Ticket de paiement : preuve imprimable/consultable d'une commande payée.
 * Sert de justificatif au patient, notamment pour récupérer sa commande en
 * pharmacie (mode "retrait").
 *
 * @param {{ commande: object }} props
 */
export default function TicketPaiement({ commande }) {
  const paiement = commande.paiement;
  const items = commande.items || [];
  const enRetrait = commande.mode_recuperation === 'retrait';

  return (
    <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-8 print:shadow-none print:border-0">
      <div className="flex items-center justify-between mb-6">
        <span className="flex items-center gap-2 text-vert-profond font-medium text-lg">
          <ShieldPlus className="w-6 h-6" />
          SOS-Pharma
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vert-menthe text-vert-profond text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Payé
        </span>
      </div>

      <div className="text-center mb-6">
        <h1 className="font-display text-xl text-bleu-nuit">Ticket de paiement</h1>
        <p className="text-sm text-gris-doux font-mono">Commande #{commande.id}</p>
      </div>

      {enRetrait && (
        <div className="mb-6 px-4 py-3 rounded-[8px] bg-vert-menthe/50 border border-vert-medical/30 text-vert-profond text-sm text-center">
          Présentez ce ticket (ou son numéro de commande) à la pharmacie pour récupérer votre commande.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-6 border-b border-dashed border-gris-bordure">
        <div>
          <p className="text-gris-doux">Date d'achat</p>
          <p className="font-medium text-bleu-nuit">{formatDate(commande.date_commande)}</p>
        </div>
        <div>
          <p className="text-gris-doux">Mode</p>
          <p className="font-medium text-bleu-nuit flex items-center gap-1">
            {enRetrait ? <><Store className="w-4 h-4" /> Retrait en pharmacie</> : <><Truck className="w-4 h-4" /> Livraison</>}
          </p>
        </div>
        {commande.patient?.nom && (
          <div>
            <p className="text-gris-doux">Client</p>
            <p className="font-medium text-bleu-nuit">{commande.patient.nom}</p>
          </div>
        )}
        {commande.pharmacie?.nom && (
          <div>
            <p className="text-gris-doux">Pharmacie</p>
            <p className="font-medium text-bleu-nuit">{commande.pharmacie.nom}</p>
            {commande.pharmacie.adresse && (
              <p className="text-xs text-gris-doux flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" /> {commande.pharmacie.adresse}
              </p>
            )}
            {commande.pharmacie.telephone && (
              <p className="text-xs text-gris-doux flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 shrink-0" /> {commande.pharmacie.telephone}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 pb-6 border-b border-dashed border-gris-bordure">
        <h2 className="text-xs text-gris-doux uppercase tracking-wide mb-3">Articles</h2>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <div className="min-w-0">
                <p className="font-medium text-bleu-nuit truncate">{item.medicament?.designation || item.designation || item.medicament}</p>
                <p className="text-xs text-gris-doux font-mono">Qté : {item.quantite} × {formatMontant(item.prix_unitaire)}</p>
              </div>
              <p className="font-mono font-semibold text-bleu-nuit shrink-0 ml-3">{formatMontant(item.total ?? item.quantite * item.prix_unitaire)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-dashed border-gris-bordure space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gris-doux">Sous-total médicaments</span>
          <span className="font-mono text-bleu-nuit">{formatMontant(commande.montant_medicaments)}</span>
        </div>
        {commande.frais_livraison > 0 && (
          <div className="flex justify-between">
            <span className="text-gris-doux">Frais de livraison</span>
            <span className="font-mono text-bleu-nuit">{formatMontant(commande.frais_livraison)}</span>
          </div>
        )}
        <div className="flex justify-between pt-1.5 border-t border-gris-bordure">
          <span className="font-medium text-bleu-nuit">Total payé</span>
          <span className="font-mono font-bold text-vert-profond text-base">{formatMontant(commande.montant_total)}</span>
        </div>
      </div>

      {paiement && (
        <div className="text-sm space-y-1.5">
          <h2 className="text-xs text-gris-doux uppercase tracking-wide mb-2">Détails du paiement</h2>
          <div className="flex justify-between">
            <span className="text-gris-doux">Référence</span>
            <span className="font-mono text-bleu-nuit">{paiement.reference_transaction || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris-doux">Mode de paiement</span>
            <span className="text-bleu-nuit">{MODES_PAIEMENT[paiement.mode_paiement] || paiement.mode_paiement || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris-doux">Date de paiement</span>
            <span className="text-bleu-nuit">{formatDate(paiement.date_paiement)}</span>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gris-doux mt-8">Merci d'avoir choisi SOS-Pharma.</p>
    </div>
  );
}
