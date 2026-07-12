import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePanier } from '../../contexts/PanierContext';
import { useCreerCommande } from '../../hooks/useCommandes';
import { useInitierPaiement } from '../../hooks/usePaiement';
import { useGeolocation } from '../../hooks/useGeolocation';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import FormInput from '../../components/atoms/FormInput';
import { formatMontant } from '../../utils/formatters';
import { geocoderInverse } from '../../utils/geo';
import { MapPin, Truck, Store, Smartphone, CreditCard, LocateFixed } from 'lucide-react';

const MODES_PAIEMENT = [
  { id: 'wave', nom: 'Wave', icone: Smartphone },
  { id: 'orange_money', nom: 'Orange Money', icone: Smartphone },
  { id: 'free_money', nom: 'Free Money', icone: Smartphone },
  { id: 'carte', nom: 'Carte bancaire', icone: CreditCard },
];

export default function CommandePage() {
  const { items, total, pharmacieId } = usePanier();
  const navigate = useNavigate();
  const creerCommande = useCreerCommande();
  const initierPaiement = useInitierPaiement();

  const [mode, setMode] = useState('retrait');
  const [modePaiement, setModePaiement] = useState('wave');
  const [adresse, setAdresse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chargementAdresse, setChargementAdresse] = useState(false);

  const { statut: statutGeoloc, demanderPosition } = useGeolocation();

  const handleDemanderPosition = () => {
    demanderPosition({
      onSuccess: (coords) => {
        setChargementAdresse(true);
        geocoderInverse(coords.latitude, coords.longitude)
          .then((adresseTrouvee) => {
            if (adresseTrouvee) setAdresse(adresseTrouvee);
          })
          .catch(() => toast.error("Impossible de récupérer l'adresse depuis votre position. Saisissez-la manuellement."))
          .finally(() => setChargementAdresse(false));
      },
    });
  };

  if (!items.length) {
    navigate('/patient/panier');
    return null;
  }

  const handleCommander = async () => {
    if (mode === 'livraison' && !adresse.trim()) {
      toast.error('Veuillez saisir votre adresse de livraison');
      return;
    }

    setLoading(true);

    try {
      const commandeData = {
        idPharmacie: pharmacieId,
        mode_recuperation: mode,
        items: items.map((item) => ({
          idMedicament: item.id,
          quantite: item.quantite,
        })),
      };
      if (mode === 'livraison') {
        commandeData.adresse_livraison = adresse;
      }

      const resCommande = await creerCommande.mutateAsync(commandeData);
      const commandeId = resCommande.data?.id || resCommande.id;

      const resPaiement = await initierPaiement.mutateAsync({
        idCommande: commandeId,
        mode_paiement: modePaiement,
      });

      const urlPaiement = resPaiement.data?.url_paiement || resPaiement.url_paiement;
      const reference = resPaiement.data?.reference || resPaiement.reference;

      if (urlPaiement && !urlPaiement.includes('/simulation')) {
        window.location.href = urlPaiement;
        return;
      }

      navigate(`/patient/paiement/${commandeId}`, {
        state: { reference, montant: total, modePaiement },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Une erreur est survenue lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl text-bleu-nuit mb-6">Passer commande</h1>

        <Card className="mb-4">
          <h2 className="font-medium text-bleu-nuit mb-4">Récapitulatif</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gris-doux">{item.designation} x{item.quantite}</span>
                <span className="font-mono font-medium text-bleu-nuit">{formatMontant(item.prix * item.quantite)}</span>
              </div>
            ))}
            <div className="border-t border-gris-bordure pt-2 mt-2 flex justify-between">
              <span className="font-medium text-bleu-nuit">Total</span>
              <span className="font-mono font-bold text-bleu-nuit">{formatMontant(total)}</span>
            </div>
          </div>
        </Card>

        <Card className="mb-4">
          <h2 className="font-medium text-bleu-nuit mb-4">Mode de récupération</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('retrait')}
              className={`p-4 rounded-[8px] border-2 text-center cursor-pointer transition-colors duration-200 ${
                mode === 'retrait' ? 'border-vert-medical bg-vert-menthe' : 'border-gris-bordure hover:border-vert-medical/50'
              }`}
            >
              <Store className={`w-6 h-6 mx-auto mb-2 ${mode === 'retrait' ? 'text-vert-medical' : 'text-gris-doux'}`} />
              <p className="text-sm font-medium text-bleu-nuit">Retrait en pharmacie</p>
            </button>
            <button
              type="button"
              onClick={() => setMode('livraison')}
              className={`p-4 rounded-[8px] border-2 text-center cursor-pointer transition-colors duration-200 ${
                mode === 'livraison' ? 'border-vert-medical bg-vert-menthe' : 'border-gris-bordure hover:border-vert-medical/50'
              }`}
            >
              <Truck className={`w-6 h-6 mx-auto mb-2 ${mode === 'livraison' ? 'text-vert-medical' : 'text-gris-doux'}`} />
              <p className="text-sm font-medium text-bleu-nuit">Livraison à domicile</p>
            </button>
          </div>

          {mode === 'livraison' && (
            <div className="mt-4 space-y-2">
              <FormInput
                label="Adresse de livraison"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Ex: Dakar, Médina, Rue 12..."
                icon={<MapPin className="w-4 h-4" />}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemanderPosition}
                loading={statutGeoloc === 'chargement' || chargementAdresse}
              >
                <LocateFixed className="w-3.5 h-3.5" /> Utiliser ma position actuelle
              </Button>
              {statutGeoloc === 'refuse' && (
                <p className="text-xs text-danger">Localisation refusée ou indisponible. Saisissez l'adresse manuellement.</p>
              )}
            </div>
          )}
        </Card>

        <Card className="mb-6">
          <h2 className="font-medium text-bleu-nuit mb-4">Mode de paiement</h2>
          <div className="grid grid-cols-2 gap-3">
            {MODES_PAIEMENT.map((mp) => (
              <button
                key={mp.id}
                type="button"
                onClick={() => setModePaiement(mp.id)}
                className={`p-4 rounded-[8px] border-2 text-center cursor-pointer transition-colors duration-200 ${
                  modePaiement === mp.id
                    ? 'border-vert-medical bg-vert-menthe'
                    : 'border-gris-bordure hover:border-vert-medical/50'
                }`}
              >
                <mp.icone className={`w-6 h-6 mx-auto mb-2 ${modePaiement === mp.id ? 'text-vert-medical' : 'text-gris-doux'}`} />
                <p className="text-sm font-medium text-bleu-nuit">{mp.nom}</p>
              </button>
            ))}
          </div>
        </Card>

        <Button
          onClick={handleCommander}
          loading={loading}
          className="w-full justify-center"
        >
          Valider la commande — {formatMontant(total)}
        </Button>
      </div>
    </div>
  );
}
