import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useConfirmerPaiement } from '../../hooks/usePaiement';
import { usePanier } from '../../contexts/PanierContext';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import { formatMontant } from '../../utils/formatters';
import { MODES_PAIEMENT } from '../../utils/constants';
import { CreditCard, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

export default function PaiementPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { viderPanier } = usePanier();
  const confirmerPaiement = useConfirmerPaiement();

  const { reference, montant, modePaiement = 'wave' } = location.state || {};
  const nomPaiement = MODES_PAIEMENT[modePaiement] || modePaiement;
  const [etape, setEtape] = useState('attente');
  const [erreur, setErreur] = useState('');

  if (!reference) {
    navigate('/patient/commandes');
    return null;
  }

  const handleConfirmer = async () => {
    setEtape('traitement');
    setErreur('');

    try {
      await confirmerPaiement.mutateAsync(reference);
      viderPanier();
      setEtape('succes');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Le paiement a échoué. Veuillez réessayer.');
      setEtape('echec');
    }
  };

  const handleAnnuler = () => {
    navigate(`/patient/commandes/${id}`);
  };

  if (etape === 'succes') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-succes" />
        </div>
        <h1 className="text-xl font-bold text-noir mb-2">Paiement confirmé !</h1>
        <p className="text-gris mb-6">
          Votre commande #{id} a été payée avec succès. Vous pouvez suivre son avancement.
        </p>
        <Button onClick={() => navigate(`/patient/commandes/${id}`)}>
          Voir ma commande
        </Button>
      </div>
    );
  }

  if (etape === 'echec') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-danger" />
        </div>
        <h1 className="text-xl font-bold text-noir mb-2">Paiement échoué</h1>
        <p className="text-gris mb-2">{erreur}</p>
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="ghost" onClick={handleAnnuler}>Retour</Button>
          <Button onClick={() => setEtape('attente')}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-noir mb-6 text-center">Paiement</h1>

      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-bleu-clair rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-bleu" />
          </div>
          <div>
            <p className="text-sm text-gris">Montant à payer</p>
            <p className="text-xl font-bold text-noir">{formatMontant(montant)}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gris">Commande</span>
            <span className="font-medium text-noir">#{id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris">Référence paiement</span>
            <span className="font-medium text-noir font-mono text-xs">{reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris">Mode</span>
            <span className="font-medium text-noir">{nomPaiement}</span>
          </div>
        </div>
      </Card>

      <div className="flex items-start gap-2 mb-6 p-3 bg-vert-clair rounded-lg">
        <ShieldCheck className="w-5 h-5 text-vert shrink-0 mt-0.5" />
        <p className="text-xs text-vert-fonce">
          Paiement sécurisé. En confirmant, le montant sera débité de votre compte {nomPaiement}.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleConfirmer}
          loading={etape === 'traitement'}
          className="w-full justify-center"
        >
          Confirmer le paiement — {formatMontant(montant)}
        </Button>
        <Button
          variant="ghost"
          onClick={handleAnnuler}
          disabled={etape === 'traitement'}
          className="w-full justify-center"
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}
