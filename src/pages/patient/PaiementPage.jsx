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

  const { reference, montant, montantMedicaments, fraisLivraison = 0, modePaiement = 'wave' } = location.state || {};
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
      <div className="min-h-screen bg-blanc-casse flex items-center">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-vert-menthe rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-vert-profond" />
          </div>
          <h1 className="text-xl font-semibold text-bleu-nuit mb-2">Paiement confirmé !</h1>
          <p className="text-gris-doux mb-6">
            Votre commande #{id} a été payée avec succès. Vous pouvez suivre son avancement.
          </p>
          <Button onClick={() => navigate(`/patient/commandes/${id}`)}>
            Voir ma commande
          </Button>
        </div>
      </div>
    );
  }

  if (etape === 'echec') {
    return (
      <div className="min-h-screen bg-blanc-casse flex items-center">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-danger" />
          </div>
          <h1 className="text-xl font-semibold text-bleu-nuit mb-2">Paiement échoué</h1>
          <p className="text-gris-doux mb-2">{erreur}</p>
          <div className="flex gap-3 justify-center mt-6">
            <Button variant="ghost" onClick={handleAnnuler}>Retour</Button>
            <Button onClick={() => setEtape('attente')}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="font-display text-2xl text-bleu-nuit mb-6 text-center">Paiement</h1>

        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#E3F2FD] rounded-[8px] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-bleu-nuit" />
            </div>
            <div>
              <p className="text-sm text-gris-doux">Montant à payer</p>
              <p className="font-mono text-xl font-bold text-bleu-nuit">{formatMontant(montant)}</p>
            </div>
          </div>

          <div className="border-t border-gris-bordure pt-4 space-y-2 text-sm">
            {fraisLivraison > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gris-doux">Médicaments</span>
                  <span className="font-mono text-bleu-nuit">{formatMontant(montantMedicaments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gris-doux">Frais de livraison</span>
                  <span className="font-mono text-bleu-nuit">{formatMontant(fraisLivraison)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-gris-doux">Commande</span>
              <span className="font-medium text-bleu-nuit">#{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gris-doux">Référence paiement</span>
              <span className="font-medium text-bleu-nuit font-mono text-xs">{reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gris-doux">Mode</span>
              <span className="font-medium text-bleu-nuit">{nomPaiement}</span>
            </div>
          </div>
        </Card>

        <div className="flex items-start gap-2 mb-6 p-3 bg-vert-menthe rounded-[8px]">
          <ShieldCheck className="w-5 h-5 text-vert-profond shrink-0 mt-0.5" />
          <p className="text-xs text-vert-profond">
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
    </div>
  );
}
