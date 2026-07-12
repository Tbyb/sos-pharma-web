import { Eye } from 'lucide-react';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import { STATUTS_COMMANDE, STATUTS_PAIEMENT } from '../../utils/constants';
import { formatMontant, formatDate } from '../../utils/formatters';

const MODES_RECUPERATION = { livraison: 'Livraison', retrait: 'Retrait en pharmacie' };

/**
 * @param {{ commande: object, onAccepter: (c: object) => void, onRefuser: (c: object) => void, onMarquerPrete: (c: object) => void, onVoirDetails: (c: object) => void, loading?: boolean }} props
 */
export default function CommandePharmacienCard({ commande, onAccepter, onRefuser, onMarquerPrete, onVoirDetails, loading }) {
  const statut = STATUTS_COMMANDE[commande.statut_commande] || { label: commande.statut_commande, couleur: '#6B7280', fond: '#F3F4F6' };
  const items = commande.items || [];

  const statutPaiement = commande.paiement?.statut_paiement;
  const paiementConfig = statutPaiement
    ? STATUTS_PAIEMENT[statutPaiement] || { label: statutPaiement, couleur: '#6B7280', fond: '#F3F4F6' }
    : null;
  const estPayee = statutPaiement === 'complété';

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-bleu-nuit">Commande #{commande.id}</p>
          <p className="text-xs text-gris-doux mt-0.5">{formatDate(commande.date_commande)} • {commande.patient?.nom || '—'}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
          {paiementConfig && (
            <Badge couleur={paiementConfig.couleur} fond={paiementConfig.fond}>
              Paiement : {paiementConfig.label}
            </Badge>
          )}
        </div>
      </div>

      <ul className="mt-3 text-sm text-gris-doux space-y-0.5">
        {items.map((item, i) => (
          <li key={item.idMedicament || i}>{item.quantite} × {item.medicament}</li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gris-bordure text-sm">
        <span className="text-gris-doux">{MODES_RECUPERATION[commande.mode_recuperation] || commande.mode_recuperation}</span>
        <span className="font-mono font-semibold text-bleu-nuit">{formatMontant(commande.montant_total)}</span>
      </div>

      <div className="flex items-center justify-between gap-2 mt-3">
        <Button size="sm" variant="ghost" onClick={() => onVoirDetails(commande)}>
          <Eye className="w-4 h-4" /> Détails
        </Button>

        {(commande.statut_commande === 'en_attente' || commande.statut_commande === 'acceptee') && (
          <div className="flex gap-2">
            {commande.statut_commande === 'en_attente' && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={loading}
                  disabled={!estPayee}
                  title={estPayee ? undefined : 'Paiement non confirmé'}
                  onClick={() => onAccepter(commande)}
                >
                  Accepter
                </Button>
                <Button size="sm" variant="danger" loading={loading} onClick={() => onRefuser(commande)}>Refuser</Button>
              </>
            )}
            {commande.statut_commande === 'acceptee' && (
              <Button size="sm" variant="outline" loading={loading} onClick={() => onMarquerPrete(commande)}>Marquer prête</Button>
            )}
          </div>
        )}
      </div>

      {commande.statut_commande === 'en_attente' && !estPayee && (
        <p className="text-xs text-orange-corail mt-2">Le paiement doit être confirmé avant acceptation.</p>
      )}
    </Card>
  );
}
