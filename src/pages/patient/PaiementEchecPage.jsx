import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../components/atoms/Button';
import { XCircle } from 'lucide-react';

export default function PaiementEchecPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-blanc-casse flex items-center">
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-danger" />
        </div>
        <h1 className="text-xl font-semibold text-bleu-nuit mb-2">Paiement échoué</h1>
        <p className="text-gris-doux mb-2">
          Le paiement n'a pas pu être finalisé (solde insuffisant, annulation, ou timeout).
        </p>
        {reference && (
          <p className="text-xs font-mono text-gris-doux mb-6">Référence : {reference}</p>
        )}
        <div className="flex gap-3 justify-center mt-4">
          <Button variant="ghost" onClick={() => navigate('/patient/commandes')}>Mes commandes</Button>
          <Button onClick={() => navigate('/patient/panier')}>Réessayer</Button>
        </div>
      </div>
    </div>
  );
}
