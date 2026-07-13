import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCommandeDetail, useModifierCommande } from '../../hooks/useCommandes';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import FormInput from '../../components/atoms/FormInput';
import Spinner from '../../components/atoms/Spinner';
import { formatMontant } from '../../utils/formatters';
import { ArrowLeft, MapPin, Truck, Store, Minus, Plus, Trash2 } from 'lucide-react';

export default function ModifierCommandePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCommandeDetail(id);
  const modifierCommande = useModifierCommande();

  const [mode, setMode] = useState('');
  const [adresse, setAdresse] = useState('');
  const [items, setItems] = useState([]);
  const [commandeChargee, setCommandeChargee] = useState(null);

  const commande = data?.data || data;

  // Initialise le formulaire local des que la commande est chargee (une seule fois).
  // Ajustement de state pendant le rendu plutot qu'un effet, cf. la doc React sur
  // "Adjusting some state when a prop changes".
  if (commande && commande !== commandeChargee) {
    setCommandeChargee(commande);
    setMode(commande.mode_recuperation || 'retrait');
    setAdresse(commande.adresse_livraison || '');
    const lignes = commande.items || commande.lignes || [];
    setItems(lignes.map((item) => {
      const medId = item.medicament_id
        || item.id_medicament
        || item.idMedicament
        || (typeof item.medicament === 'object' ? item.medicament?.id : null)
        || item.pivot?.medicament_id;
      const designation = typeof item.medicament === 'string'
        ? item.medicament
        : item.medicament?.designation || item.designation;
      return {
        idMedicament: medId,
        designation,
        quantite: item.quantite,
        prix_unitaire: item.prix_unitaire,
      };
    }));
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!commande) {
    return <div className="text-center py-20 text-gris-doux">Commande introuvable.</div>;
  }

  const statutKey = commande.statut_commande || commande.statut;
  const estEnAttente = statutKey === 'en_attente' || statutKey === 'en_cours';

  if (!estEnAttente) {
    navigate(`/patient/commandes/${id}`);
    return null;
  }

  const modifierQuantite = (index, delta) => {
    setItems((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      const nouvelleQte = item.quantite + delta;
      if (nouvelleQte < 1) return item;
      return { ...item, quantite: nouvelleQte };
    }));
  };

  const retirerItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.prix_unitaire * item.quantite, 0);

  const handleSauvegarder = async () => {
    if (mode === 'livraison' && !adresse.trim()) {
      toast.error('Veuillez saisir votre adresse de livraison');
      return;
    }
    if (!items.length) {
      toast.error('La commande doit contenir au moins un article');
      return;
    }

    const payload = {
      mode_recuperation: mode,
      adresse_livraison: mode === 'livraison' ? adresse : null,
      items: items.map((item) => ({
        idMedicament: item.idMedicament,
        quantite: item.quantite,
      })),
    };

    try {
      await modifierCommande.mutateAsync({ id, data: payload });
      toast.success('Commande modifiée.');
      navigate(`/patient/commandes/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible de modifier la commande');
    }
  };

  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to={`/patient/commandes/${id}`} className="inline-flex items-center gap-1 text-sm text-vert-medical hover:text-vert-profond transition-colors duration-200 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au détail
        </Link>

        <h1 className="font-display text-2xl text-bleu-nuit mb-6">Modifier la commande #{id}</h1>

        <Card className="mb-4">
          <h2 className="font-medium text-bleu-nuit mb-4">Articles</h2>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 py-3 border-b border-gris-bordure last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-bleu-nuit text-sm truncate">{item.designation}</p>
                  <p className="text-xs text-gris-doux font-mono">{formatMontant(item.prix_unitaire)} / unité</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => modifierQuantite(index, -1)}
                    className="w-7 h-7 rounded-full border border-gris-bordure flex items-center justify-center hover:border-vert-medical hover:text-vert-medical transition-colors duration-200 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium font-mono text-bleu-nuit">{item.quantite}</span>
                  <button
                    onClick={() => modifierQuantite(index, 1)}
                    className="w-7 h-7 rounded-full border border-gris-bordure flex items-center justify-center hover:border-vert-medical hover:text-vert-medical transition-colors duration-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-mono font-medium text-bleu-nuit text-sm w-24 text-right">
                  {formatMontant(item.prix_unitaire * item.quantite)}
                </p>
                <button
                  onClick={() => retirerItem(index)}
                  className="text-danger hover:text-[#B91C1C] transition-colors duration-200 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-gris-bordure pt-3 mt-3 flex justify-between">
            <span className="font-medium text-bleu-nuit">{mode === 'livraison' ? 'Sous-total médicaments' : 'Total'}</span>
            <span className="font-mono font-bold text-bleu-nuit">{formatMontant(total)}</span>
          </div>
          {mode === 'livraison' && (
            <p className="text-xs text-gris-doux italic mt-1">
              + frais de livraison, recalculés selon l'adresse indiquée.
            </p>
          )}
        </Card>

        <Card className="mb-6">
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
            <div className="mt-4">
              <FormInput
                label="Adresse de livraison"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Ex: Dakar, Médina, Rue 12..."
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>
          )}
        </Card>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(`/patient/commandes/${id}`)}
            className="flex-1 justify-center"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSauvegarder}
            loading={modifierCommande.isPending}
            className="flex-1 justify-center"
          >
            Sauvegarder les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}
