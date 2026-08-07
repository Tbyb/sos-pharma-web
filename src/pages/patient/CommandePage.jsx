import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePanier } from '../../contexts/PanierContext';
import { useCreerCommande, useEstimerLivraison } from '../../hooks/useCommandes';
import { useInitierPaiement } from '../../hooks/usePaiement';
import { useGeolocation } from '../../hooks/useGeolocation';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import FormInput from '../../components/atoms/FormInput';
import { formatMontant } from '../../utils/formatters';
import { geocoderInverse } from '../../utils/geo';
import { MapPin, Truck, Store, LocateFixed, Loader2 } from 'lucide-react';

export default function CommandePage() {
  const { items, total, pharmacieId } = usePanier();
  const navigate = useNavigate();
  const creerCommande = useCreerCommande();
  const initierPaiement = useInitierPaiement();
  const estimerLivraison = useEstimerLivraison();

  const [mode, setMode] = useState('retrait');
  const [adresse, setAdresse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chargementAdresse, setChargementAdresse] = useState(false);
  const [fraisLivraison, setFraisLivraison] = useState(null);

  const { statut: statutGeoloc, demanderPosition } = useGeolocation();

  // Estime le frais de livraison des que l'adresse est stable (debounce),
  // pour l'afficher avant validation sans spammer le geocodage a chaque frappe.
  // L'adresse trop courte / mode retrait n'annule pas activement l'estimation
  // precedente : l'affichage se base sur adresseEstimable (derive plus bas),
  // qui la masque simplement le temps qu'une nouvelle estimation arrive.
  const adresseEstimable = mode === 'livraison' && adresse.trim().length >= 8 && !!pharmacieId;

  useEffect(() => {
    if (!adresseEstimable) return;

    const timer = setTimeout(() => {
      estimerLivraison.mutate(
        { idPharmacie: pharmacieId, adresse_livraison: adresse.trim() },
        {
          onSuccess: (res) => setFraisLivraison(res.data?.frais_livraison ?? null),
          onError: () => setFraisLivraison(null),
        }
      );
    }, 700);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adresseEstimable, adresse, pharmacieId]);

  const fraisAffiche = adresseEstimable ? fraisLivraison : null;

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
      const commande = resCommande.data || resCommande;
      const commandeId = commande.id;

      const resPaiement = await initierPaiement.mutateAsync({ idCommande: commandeId });
      const urlPaiement = resPaiement.data?.url_paiement || resPaiement.url_paiement;

      if (!urlPaiement) {
        throw new Error("Impossible d'obtenir l'URL de paiement.");
      }

      window.location.href = urlPaiement;
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
              <span className="font-medium text-bleu-nuit">{mode === 'livraison' ? 'Sous-total médicaments' : 'Total'}</span>
              <span className="font-mono font-bold text-bleu-nuit">{formatMontant(total)}</span>
            </div>

            {mode === 'livraison' && (
              <div className="flex justify-between text-sm">
                <span className="text-gris-doux flex items-center gap-1.5">
                  Frais de livraison
                  {estimerLivraison.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                </span>
                {fraisAffiche !== null ? (
                  <span className="font-mono font-medium text-bleu-nuit">{formatMontant(fraisAffiche)}</span>
                ) : (
                  <span className="text-gris-doux italic text-xs">
                    {estimerLivraison.isPending ? 'calcul en cours…' : 'saisissez votre adresse'}
                  </span>
                )}
              </div>
            )}

            {mode === 'livraison' && fraisAffiche !== null && (
              <div className="border-t border-gris-bordure pt-2 mt-1 flex justify-between">
                <span className="font-medium text-bleu-nuit">Total estimé</span>
                <span className="font-mono font-bold text-bleu-nuit">{formatMontant(total + fraisAffiche)}</span>
              </div>
            )}
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

        <p className="text-xs text-gris-doux text-center mb-3">
           mode de paiement disponible (Wave, Orange Money, Free Money ou carte)
        </p>

        <Button
          onClick={handleCommander}
          loading={loading}
          className="w-full justify-center"
        >
          {mode === 'livraison'
            ? (fraisAffiche !== null ? `Valider la commande — ${formatMontant(total + fraisAffiche)}` : 'Valider la commande')
            : `Valider la commande — ${formatMontant(total)}`}
        </Button>
      </div>
    </div>
  );
}
