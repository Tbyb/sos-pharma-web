import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCommandeDetail, useAnnulerCommande, useSupprimerCommande } from '../../hooks/useCommandes';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Alert from '../../components/atoms/Alert';
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
    return <div className="text-center py-20 text-gris">Commande introuvable.</div>;
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/patient/commandes" className="inline-flex items-center gap-1 text-sm text-bleu hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour aux commandes
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-noir">Commande #{commande.id}</h1>
        <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>
      </div>

      {statutKey === 'refusee' && commande.motif_refus && (
        <Alert variant="error" className="mb-4">
          <span className="font-medium">Motif du refus : </span>{commande.motif_refus}
        </Alert>
      )}

      <Card className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gris">Date</p>
            <p className="font-medium text-noir">{formatDate(commande.created_at)}</p>
          </div>
          <div>
            <p className="text-gris">Montant total</p>
            <p className="font-semibold text-noir">{formatMontant(commande.montant_total)}</p>
          </div>
          <div>
            <p className="text-gris">Mode</p>
            <p className="font-medium text-noir flex items-center gap-1">
              {commande.mode_recuperation === 'livraison'
                ? <><Truck className="w-4 h-4" /> Livraison</>
                : <><Store className="w-4 h-4" /> Retrait en pharmacie</>
              }
            </p>
          </div>
          {commande.adresse_livraison && (
            <div>
              <p className="text-gris">Adresse</p>
              <p className="font-medium text-noir flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {commande.adresse_livraison}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold text-noir mb-3 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Articles
        </h2>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm py-2 border-b last:border-0">
              <div>
                <p className="font-medium text-noir">{item.medicament?.designation || item.designation}</p>
                <p className="text-xs text-gris">Qté: {item.quantite} × {formatMontant(item.prix_unitaire)}</p>
              </div>
              <p className="font-semibold text-noir">{formatMontant(item.quantite * item.prix_unitaire)}</p>
            </div>
          ))}
        </div>
      </Card>

      {(estEnAttente || peutAnnuler || peutSupprimer) && (
        <Card>
          <h2 className="font-semibold text-noir mb-3">Actions</h2>
          <div className="flex flex-wrap gap-3">
            {estEnAttente && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/patient/commandes/${id}/modifier`)}
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
            )}
            {peutAnnuler && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setModalAction('annuler')}
              >
                <Ban className="w-4 h-4" />
                Annuler
              </Button>
            )}
            {peutSupprimer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalAction('supprimer')}
                className="text-danger hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            )}
          </div>
        </Card>
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
  );
}
