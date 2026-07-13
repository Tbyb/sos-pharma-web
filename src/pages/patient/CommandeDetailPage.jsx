import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCommandeDetail, useAnnulerCommande, useSupprimerCommande } from '../../hooks/useCommandes';
import Spinner from '../../components/atoms/Spinner';
import Badge from '../../components/atoms/Badge';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import { formatMontant, formatDate } from '../../utils/formatters';
import { STATUTS_COMMANDE } from '../../utils/constants';
import { ArrowLeft, Package, MapPin, Truck, Store, Ban, Trash2, Edit } from 'lucide-react';

export default function CommandeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCommandeDetail(id);
  const annulerCommande = useAnnulerCommande();
  const supprimerCommande = useSupprimerCommande();

  const [modalAction, setModalAction] = useState(null);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  const commande = data?.data || data;

  if (!commande) {
    return <div className="text-center py-20 text-gris-doux">Commande introuvable.</div>;
  }

  const statutKey = commande.statut_commande || commande.statut;
  const statut = STATUTS_COMMANDE[statutKey] || { label: statutKey, couleur: '#6B7280', fond: '#F3F4F6' };
  const items = commande.items || commande.lignes || [];

  const estEnAttente = statutKey === 'en_attente' || statutKey === 'en_cours';
  const peutAnnuler = ['en_attente', 'en_cours', 'acceptee'].includes(statutKey);
  const peutSupprimer = ['en_attente', 'en_cours', 'refusee', 'livree', 'annulee'].includes(statutKey);

  const handleAnnuler = async () => {
    try {
      await annulerCommande.mutateAsync(id);
      toast.success('Commande annulée.');
      setModalAction(null);
      navigate('/patient/commandes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible d\'annuler cette commande');
    }
  };

  const handleSupprimer = async () => {
    try {
      await supprimerCommande.mutateAsync(id);
      toast.success('Commande supprimée de votre historique.');
      setModalAction(null);
      navigate('/patient/commandes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible de supprimer cette commande');
    }
  };

  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/patient/commandes" className="inline-flex items-center gap-1 text-sm text-vert-medical hover:text-vert-profond transition-colors duration-200 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour aux commandes
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-bleu-nuit">Commande #{commande.id}</h1>
          <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
        </div>

        {statutKey === 'refusee' && commande.motif_refus && (
          <div className="mb-4 px-4 py-3 rounded-[8px] bg-[#FEE2E2] text-[#991B1B] text-sm">
            <span className="font-medium">Motif du refus : </span>{commande.motif_refus}
          </div>
        )}

        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gris-doux">Date</p>
              <p className="font-medium text-bleu-nuit">{formatDate(commande.created_at)}</p>
            </div>
            <div>
              <p className="text-gris-doux">Montant total</p>
              <p className="font-mono font-semibold text-bleu-nuit">{formatMontant(commande.montant_total)}</p>
            </div>
            <div>
              <p className="text-gris-doux">Mode</p>
              <p className="font-medium text-bleu-nuit flex items-center gap-1">
                {commande.mode_recuperation === 'livraison'
                  ? <><Truck className="w-4 h-4" /> Livraison</>
                  : <><Store className="w-4 h-4" /> Retrait en pharmacie</>
                }
              </p>
            </div>
            {commande.livraison?.adresse && (
              <div>
                <p className="text-gris-doux">Adresse</p>
                <p className="font-medium text-bleu-nuit flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {commande.livraison.adresse}
                </p>
              </div>
            )}
          </div>

          {commande.frais_livraison > 0 && (
            <div className="border-t border-gris-bordure mt-4 pt-4 space-y-1.5 text-sm">
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
        </div>

        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6 mb-4">
          <h2 className="font-medium text-bleu-nuit mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Articles
          </h2>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-2 border-b border-gris-bordure last:border-0">
                <div>
                  <p className="font-medium text-bleu-nuit">{item.medicament?.designation || item.designation}</p>
                  <p className="text-xs text-gris-doux font-mono">Qté: {item.quantite} × {formatMontant(item.prix_unitaire)}</p>
                </div>
                <p className="font-mono font-semibold text-bleu-nuit">{formatMontant(item.quantite * item.prix_unitaire)}</p>
              </div>
            ))}
          </div>
        </div>

        {(estEnAttente || peutAnnuler || peutSupprimer) && (
          <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6">
            <h2 className="font-medium text-bleu-nuit mb-3">Actions</h2>
            <div className="flex flex-wrap gap-3">
              {estEnAttente && (
                <button
                  onClick={() => navigate(`/patient/commandes/${id}/modifier`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-vert-medical text-vert-medical hover:bg-vert-menthe transition-colors duration-200 text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
              )}
              {peutAnnuler && (
                <button
                  onClick={() => setModalAction('annuler')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-danger hover:bg-[#B91C1C] text-white transition-colors duration-200 text-sm font-medium"
                >
                  <Ban className="w-4 h-4" />
                  Annuler
                </button>
              )}
              {peutSupprimer && (
                <button
                  onClick={() => setModalAction('supprimer')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-danger hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        )}

        <ConfirmDialog
          open={modalAction === 'annuler'}
          onClose={() => setModalAction(null)}
          onConfirm={handleAnnuler}
          title="Annuler la commande"
          confirmLabel="Oui, annuler"
          loading={annulerCommande.isPending}
          description="Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible."
        />

        <ConfirmDialog
          open={modalAction === 'supprimer'}
          onClose={() => setModalAction(null)}
          onConfirm={handleSupprimer}
          title="Supprimer la commande"
          confirmLabel="Oui, supprimer"
          loading={supprimerCommande.isPending}
          description="Êtes-vous sûr de vouloir supprimer cette commande de votre historique ? Elle ne sera plus visible dans vos commandes."
        />
      </div>
    </div>
  );
}
