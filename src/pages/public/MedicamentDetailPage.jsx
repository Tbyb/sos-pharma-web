import { useParams } from 'react-router-dom';
import { useMedicaments } from '../../hooks/useMedicaments';
import { usePanier } from '../../contexts/PanierContext';
import { useAuth } from '../../contexts/AuthContext';
import PrixComparaisonTable from '../../components/molecules/PrixComparaisonTable';
import Spinner from '../../components/atoms/Spinner';
import Card from '../../components/atoms/Card';
import { Pill } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';

export default function MedicamentDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useMedicaments({});
  const { ajouterItem } = usePanier();
  const { isConnecte } = useAuth();

  const medicaments = data?.data || [];
  const medicament = medicaments.find((m) => String(m.id) === String(id));

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!medicament) {
    return <div className="text-center py-20 text-gris">Médicament introuvable.</div>;
  }

  const comparaisons = (medicament.stocks || []).map((stock) => ({
    pharmacie_id: stock.pharmacie?.id,
    pharmacie_nom: stock.pharmacie?.nomPharmacie,
    pharmacie_adresse: stock.pharmacie?.addresse,
    prix: parseFloat(stock.prix_unitaire),
    disponible: stock.disponible === 1,
    quantite: stock.quantite,
  }));

  const handleAjouterPanier = (item) => {
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
        <Card>
          <PrixComparaisonTable
            comparaisons={comparaisons}
            onAjouterPanier={isConnecte() ? handleAjouterPanier : undefined}
          />
        </Card>
      </div>
    </div>
  );
}
