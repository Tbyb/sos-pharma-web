import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePanier } from '../../contexts/PanierContext';
import { useCreerCommande } from '../../hooks/useCommandes';
import { useInitierPaiement } from '../../hooks/usePaiement';
import { useGeolocation } from '../../hooks/useGeolocation';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Input from '../../components/atoms/Input';
import { formatMontant } from '../../utils/formatters';
import { geocoderInverse } from '../../utils/geo';
import { MapPin, Truck, Store, Smartphone, CreditCard, LocateFixed } from 'lucide-react';

const MODES_PAIEMENT = [
  { id: 'wave', nom: 'Wave', couleur: '#1DC3F0', icone: Smartphone },
  { id: 'orange_money', nom: 'Orange Money', couleur: '#FF6600', icone: Smartphone },
  { id: 'free_money', nom: 'Free Money', couleur: '#E4032E', icone: Smartphone },
  { id: 'carte', nom: 'Carte bancaire', couleur: '#1A6FBF', icone: CreditCard },
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-noir mb-6">Passer commande</h1>

      <Card className="mb-4">
        <h2 className="font-semibold text-noir mb-4">Récapitulatif</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gris">{item.designation} x{item.quantite}</span>
              <span className="font-medium text-noir">{formatMontant(item.prix * item.quantite)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="font-semibold text-noir">Total</span>
            <span className="font-bold text-noir">{formatMontant(total)}</span>
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold text-noir mb-4">Mode de récupération</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('retrait')}
            className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-colors ${
              mode === 'retrait' ? 'border-vert bg-vert-clair' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Store className={`w-6 h-6 mx-auto mb-2 ${mode === 'retrait' ? 'text-vert' : 'text-gris'}`} />
            <p className="text-sm font-medium">Retrait en pharmacie</p>
          </button>
          <button
            type="button"
            onClick={() => setMode('livraison')}
            className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-colors ${
              mode === 'livraison' ? 'border-vert bg-vert-clair' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Truck className={`w-6 h-6 mx-auto mb-2 ${mode === 'livraison' ? 'text-vert' : 'text-gris'}`} />
            <p className="text-sm font-medium">Livraison à domicile</p>
          </button>
        </div>

        {mode === 'livraison' && (
          <div className="mt-4 space-y-2">
            <Input
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
        <h2 className="font-semibold text-noir mb-4">Mode de paiement</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES_PAIEMENT.map((mp) => (
            <button
              key={mp.id}
              type="button"
              onClick={() => setModePaiement(mp.id)}
              className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-colors ${
                modePaiement === mp.id
                  ? 'border-bleu bg-bleu-clair'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <mp.icone
                className="w-6 h-6 mx-auto mb-2"
                style={{ color: modePaiement === mp.id ? mp.couleur : '#6B7280' }}
              />
              <p className="text-sm font-medium">{mp.nom}</p>
            </button>
          ))}
        </div>
      </Card>

      <Button
        onClick={handleCommander}
        loading={loading}
        className="w-full justify-center"
      >
        Procéder au paiement — {formatMontant(total)}
      </Button>
    </div>
  );
}
