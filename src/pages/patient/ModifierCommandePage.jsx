import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCommandeDetail, useModifierCommande } from '../../hooks/useCommandes';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Input from '../../components/atoms/Input';
import Alert from '../../components/atoms/Alert';
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
  const [erreur, setErreur] = useState('');

  const commande = data?.data || data;

  useEffect(() => {
    if (commande) {
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
  }, [commande]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!commande) {
    return <div className="text-center py-20 text-gris">Commande introuvable.</div>;
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
      setErreur('Veuillez saisir votre adresse de livraison');
      return;
    }
    if (!items.length) {
      setErreur('La commande doit contenir au moins un article');
      return;
    }

    setErreur('');

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
      navigate(`/patient/commandes/${id}`);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible de modifier la commande');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/patient/commandes/${id}`} className="inline-flex items-center gap-1 text-sm text-bleu hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour au détail
      </Link>

      <h1 className="text-2xl font-bold text-noir mb-6">Modifier la commande #{id}</h1>

      {erreur && <Alert variant="error" className="mb-4">{erreur}</Alert>}

      <Card className="mb-4">
        <h2 className="font-semibold text-noir mb-4">Articles</h2>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 py-3 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-noir text-sm truncate">{item.designation}</p>
                <p className="text-xs text-gris">{formatMontant(item.prix_unitaire)} / unité</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => modifierQuantite(index, -1)}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantite}</span>
                <button
                  onClick={() => modifierQuantite(index, 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-semibold text-noir text-sm w-24 text-right">
                {formatMontant(item.prix_unitaire * item.quantite)}
              </p>
              <button
                onClick={() => retirerItem(index)}
                className="text-danger hover:text-red-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between">
          <span className="font-semibold text-noir">Total</span>
          <span className="font-bold text-noir">{formatMontant(total)}</span>
        </div>
      </Card>

      <Card className="mb-6">
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
          <div className="mt-4">
            <Input
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
  );
}
