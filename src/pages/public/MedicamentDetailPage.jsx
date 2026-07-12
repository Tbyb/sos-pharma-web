import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMedicamentDetail } from '../../hooks/useMedicaments';
import { usePanier } from '../../contexts/PanierContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculerDistanceKm } from '../../utils/geo';
import PrixComparaisonTable from '../../components/molecules/PrixComparaisonTable';
import Spinner from '../../components/atoms/Spinner';
import Modal from '../../components/atoms/Modal';
import { Pill, LocateFixed } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';

export default function MedicamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useMedicamentDetail(id);
  const { ajouterItem } = usePanier();
  const { isConnecte } = useAuth();
  const { position, statut: statutGeoloc, demanderPosition } = useGeolocation();

  const [tri, setTri] = useState('pertinence');
  const [disponibleUniquement, setDisponibleUniquement] = useState(false);
  const [modalConnexionOuvert, setModalConnexionOuvert] = useState(false);

  const medicament = data?.data;

  const comparaisons = useMemo(() => {
    if (!medicament) return [];

    let items = (medicament.stocks || []).map((stock) => ({
      pharmacie_id: stock.pharmacie_id || stock.pharmacie?.id,
      pharmacie_nom: stock.pharmacie?.nomPharmacie || stock.pharmacie_nom,
      pharmacie_adresse: stock.pharmacie?.addresse || stock.pharmacie_adresse,
      prix: parseFloat(stock.prix_unitaire),
      disponible: stock.disponible === 1 || stock.disponible === true,
      quantite: stock.quantite,
      latitude: stock.pharmacie?.latitude ? parseFloat(stock.pharmacie.latitude) : null,
      longitude: stock.pharmacie?.longitude ? parseFloat(stock.pharmacie.longitude) : null,
    }));

    if (disponibleUniquement) {
      items = items.filter((i) => i.disponible);
    }

    if (tri === 'distance' && position) {
      items = items.map((i) => ({
        ...i,
        distanceKm: i.latitude != null && i.longitude != null
          ? calculerDistanceKm(position.latitude, position.longitude, i.latitude, i.longitude)
          : null,
      }));
    }

    const trier = {
      prix_asc: (a, b) => a.prix - b.prix,
      prix_desc: (a, b) => b.prix - a.prix,
      distance: (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity),
    }[tri];

    return trier ? [...items].sort(trier) : items;
  }, [medicament, tri, disponibleUniquement, position]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!medicament) {
    return <div className="text-center py-20 text-gris-doux">Médicament introuvable.</div>;
  }

  const handleAjouterPanier = (item) => {
    if (!isConnecte()) {
      setModalConnexionOuvert(true);
      return;
    }
    ajouterItem(
      { id: medicament.id, designation: medicament.designation },
      item.pharmacie_id,
      item.prix
    );
  };

  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-vert-menthe rounded-[8px] flex items-center justify-center shrink-0">
              <Pill className="w-7 h-7 text-vert-profond" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-bleu-nuit">{medicament.designation}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gris-doux">
                {medicament.CIP && <span className="font-mono">CIP : {medicament.CIP}</span>}
                {medicament.forme && <span>Forme : {medicament.forme}</span>}
                {medicament.liste && <span>Liste : {medicament.liste}</span>}
                {medicament.TVA && <span>TVA : {medicament.TVA}%</span>}
              </div>
              {medicament.prix_de_vente && (
                <p className="mt-2 text-sm text-bleu-nuit">
                  Prix public : <span className="font-mono font-semibold">{formatMontant(parseFloat(medicament.prix_de_vente))}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-2xl text-bleu-nuit mb-4">Disponibilité et prix par pharmacie</h2>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value)}
              className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
            >
              <option value="pertinence">Trier par</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="distance">Distance (plus proche)</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-gris-doux cursor-pointer">
              <input
                type="checkbox"
                checked={disponibleUniquement}
                onChange={(e) => setDisponibleUniquement(e.target.checked)}
                className="cursor-pointer accent-vert-medical"
              />
              Disponibles uniquement
            </label>

            {tri === 'distance' && !position && (
              <button
                onClick={demanderPosition}
                disabled={statutGeoloc === 'chargement'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border border-vert-medical text-vert-medical hover:bg-vert-menthe transition-colors duration-200 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                {statutGeoloc === 'chargement' ? 'Localisation...' : 'Activer la localisation'}
              </button>
            )}
            {tri === 'distance' && statutGeoloc === 'refuse' && (
              <span className="text-xs text-danger">Localisation refusée ou indisponible.</span>
            )}
          </div>

          <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6">
            <PrixComparaisonTable
              comparaisons={comparaisons}
              onAjouterPanier={handleAjouterPanier}
            />
          </div>
        </div>
      </div>

      <Modal
        open={modalConnexionOuvert}
        onClose={() => setModalConnexionOuvert(false)}
        title="Connexion requise"
        footer={
          <>
            <button
              onClick={() => setModalConnexionOuvert(false)}
              className="px-5 py-2.5 rounded-[6px] text-gris-doux hover:bg-blanc-casse transition-colors duration-200 text-sm font-medium"
            >
              Annuler
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 rounded-[6px] border border-vert-medical text-vert-medical hover:bg-vert-menthe transition-colors duration-200 text-sm font-medium"
            >
              Créer un compte
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-[6px] bg-vert-medical hover:bg-vert-profond text-white transition-colors duration-200 text-sm font-medium"
            >
              Se connecter
            </button>
          </>
        }
      >
        <p className="text-sm text-gris-doux">
          Connectez-vous ou créez un compte pour ajouter ce médicament à votre panier et passer une commande.
        </p>
      </Modal>
    </div>
  );
}
