import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useCommandeDetail } from '../../hooks/useCommandes';
import Spinner from '../../components/atoms/Spinner';
import Button from '../../components/atoms/Button';
import TicketPaiement from '../../components/organisms/TicketPaiement';

export default function TicketPaiementPage() {
  const { id } = useParams();
  const { data, isLoading } = useCommandeDetail(id);
  const commande = data?.data || data;

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!commande) {
    return <div className="text-center py-20 text-gris-doux">Commande introuvable.</div>;
  }

  if (commande.paiement?.statut_paiement !== 'complété') {
    return (
      <div className="min-h-screen bg-blanc-casse">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <p className="text-gris-doux mb-6">
            Aucun ticket disponible : le paiement de cette commande n'est pas encore confirmé.
          </p>
          <Link to={`/patient/commandes/${id}`} className="text-vert-medical hover:text-vert-profond text-sm font-medium">
            Retour à la commande
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <Link to={`/patient/commandes/${id}`} className="inline-flex items-center gap-1 text-sm text-vert-medical hover:text-vert-profond transition-colors duration-200">
            <ArrowLeft className="w-4 h-4" />
            Retour à la commande
          </Link>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Imprimer
          </Button>
        </div>

        <TicketPaiement commande={commande} />
      </div>
    </div>
  );
}
