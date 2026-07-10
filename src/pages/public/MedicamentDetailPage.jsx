import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMedicaments } from '../../hooks/useMedicaments';
import { usePanier } from '../../contexts/PanierContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculerDistanceKm } from '../../utils/geo';
import PrixComparaisonTable from '../../components/molecules/PrixComparaisonTable';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import { Pill, LocateFixed } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';

export default function MedicamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useMedicaments({});
  const { ajouterItem } = usePanier();
  const { isConnecte } = useAuth();
  const { position, statut: statutGeoloc, demanderPosition } = useGeolocation();

  const [tri, setTri] = useState('pertinence');
  const [disponibleUniquement, setDisponibleUniquement] = useState(false);
  const [modalConnexionOuvert, setModalConnexionOuvert] = useState(false);

  const medicaments = data?.data || [];
  const medicament = medicaments.find((m) => String(m.id) === String(id));

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
    return <div className="text-center py-20 text-gris">Médicament introuvable.</div>;
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-vert-clair rounded-lg flex items-center justify-center shrink-0">
            <Pill className="w-7 h-7 text-vert" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-noir">{medicament.designation}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gris">
              {medicament.CIP && <span>CIP : {medicament.CIP}</span>}
              {medicament.forme && <span>Forme : {medicament.forme}</span>}
              {medicament.liste && <span>Liste : {medicament.liste}</span>}
              {medicament.TVA && <span>TVA : {medicament.TVA}</span>}
            </div>
            {medicament.prix_de_vente && (
              <p className="mt-2 text-sm">Prix public : <span className="font-semibold">{formatMontant(parseFloat(medicament.prix_de_vente))}</span></p>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-noir mb-4">Disponibilité et prix par pharmacie</h2>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20"
          >
            <option value="pertinence">Trier par</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="distance">Distance (plus proche)</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-gris cursor-pointer">
            <input
              type="checkbox"
              checked={disponibleUniquement}
              onChange={(e) => setDisponibleUniquement(e.target.checked)}
              className="cursor-pointer"
            />
            Disponibles uniquement
          </label>

          {tri === 'distance' && !position && (
            <Button size="sm" variant="outline" onClick={demanderPosition} loading={statutGeoloc === 'chargement'}>
              <LocateFixed className="w-3.5 h-3.5" /> Activer la localisation
            </Button>
          )}
          {tri === 'distance' && statutGeoloc === 'refuse' && (
            <span className="text-xs text-danger">Localisation refusée ou indisponible.</span>
          )}
        </div>

        <Card>
          <PrixComparaisonTable
            comparaisons={comparaisons}
            onAjouterPanier={handleAjouterPanier}
          />
        </Card>
      </div>

      <Modal
        open={modalConnexionOuvert}
        onClose={() => setModalConnexionOuvert(false)}
        title="Connexion requise"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalConnexionOuvert(false)}>Annuler</Button>
            <Button variant="outline" onClick={() => navigate('/register')}>Créer un compte</Button>
            <Button onClick={() => navigate('/login')}>Se connecter</Button>
          </>
        }
      >
        <p className="text-sm text-gris">
          Connectez-vous ou créez un compte pour ajouter ce médicament à votre panier et passer une commande.
        </p>
      </Modal>
    </div>
  );
}
