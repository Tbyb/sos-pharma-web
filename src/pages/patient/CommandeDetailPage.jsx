import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCommandeDetail, useAnnulerCommande, useSupprimerCommande } from '../../hooks/useCommandes';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
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
  const [erreur, setErreur] = useState('');

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
    setErreur('');
    try {
      await annulerCommande.mutateAsync(id);
      setModalAction(null);
      navigate('/patient/commandes');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible d\'annuler cette commande');
    }
  };

  const handleSupprimer = async () => {
    setErreur('');
    try {
      await supprimerCommande.mutateAsync(id);
      setModalAction(null);
      navigate('/patient/commandes');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible de supprimer cette commande');
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

      {erreur && <Alert variant="error" className="mb-4">{erreur}</Alert>}

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

      <Modal
        open={modalAction === 'annuler'}
        onClose={() => setModalAction(null)}
        title="Annuler la commande"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalAction(null)}>Non, garder</Button>
            <Button variant="danger" onClick={handleAnnuler} loading={annulerCommande.isPending}>
              Oui, annuler
            </Button>
          </>
        }
      >
        <p className="text-gris">
          Êtes-vous sûr de vouloir annuler la commande #{commande.id} ?
          Cette action est irréversible.
        </p>
      </Modal>

      <Modal
        open={modalAction === 'supprimer'}
        onClose={() => setModalAction(null)}
        title="Supprimer la commande"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalAction(null)}>Non, garder</Button>
            <Button variant="danger" onClick={handleSupprimer} loading={supprimerCommande.isPending}>
              Oui, supprimer
            </Button>
          </>
        }
      >
        <p className="text-gris">
          Êtes-vous sûr de vouloir supprimer la commande #{commande.id} de votre historique ?
          Elle ne sera plus visible dans vos commandes.
        </p>
      </Modal>
    </div>
  );
}
