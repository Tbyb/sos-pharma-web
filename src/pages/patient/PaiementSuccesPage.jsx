import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { verifierPaiementAPI } from '../../api/paiements.api';
import Button from '../../components/atoms/Button';
import Spinner from '../../components/atoms/Spinner';
import { CheckCircle, Clock, Receipt } from 'lucide-react';

export default function PaiementSuccesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('ref');

  const { data, isLoading } = useQuery({
    queryKey: ['paiement-statut', reference],
    queryFn: () => verifierPaiementAPI(reference).then((res) => res.data),
    enabled: !!reference,
    refetchInterval: (query) => (query.state.data?.data?.statut === 'en_attente' ? 2000 : false),
  });

  const statut = data?.data?.statut;
  const idCommande = data?.data?.idCommande;
  const confirme = statut === 'complété';

  return (
    <div className="min-h-screen bg-blanc-casse flex items-center">
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        {isLoading || !statut || statut === 'en_attente' ? (
          <>
            <div className="w-16 h-16 bg-vert-menthe rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-vert-profond animate-pulse" />
            </div>
            <h1 className="text-xl font-semibold text-bleu-nuit mb-2">Confirmation en cours…</h1>
            <p className="text-gris-doux mb-6">
              Votre paiement a été effectué, nous attendons la confirmation de PayTech.
              Cela ne prend que quelques secondes.
            </p>
            <Spinner size="md" className="mx-auto" />
          </>
        ) : confirme ? (
          <>
            <div className="w-16 h-16 bg-vert-menthe rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-vert-profond" />
            </div>
            <h1 className="text-xl font-semibold text-bleu-nuit mb-2">Paiement confirmé !</h1>
            <p className="text-gris-doux mb-6">
              Votre commande {idCommande ? `#${idCommande}` : ''} a été payée avec succès.
            </p>
            <div className="flex flex-col gap-2">
              {idCommande && (
                <Button onClick={() => navigate(`/patient/commandes/${idCommande}/ticket`)}>
                  <Receipt className="w-4 h-4" /> Voir mon ticket de paiement
                </Button>
              )}
              <Button
                variant={idCommande ? 'ghost' : 'primary'}
                onClick={() => navigate(idCommande ? `/patient/commandes/${idCommande}` : '/patient/commandes')}
              >
                Voir ma commande
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-bleu-nuit mb-2">Statut : {statut}</h1>
            <p className="text-gris-doux mb-6">
              La confirmation prend plus de temps que prévu. Vérifiez le statut depuis vos commandes.
            </p>
            <Button onClick={() => navigate('/patient/commandes')}>Voir mes commandes</Button>
          </>
        )}
      </div>
    </div>
  );
}
