import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pill, ShoppingCart } from 'lucide-react';
import { usePanier } from '../../contexts/PanierContext';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../atoms/Modal';
import { formatMontant } from '../../utils/formatters';

/**
 * @param {{ medicament: object }} props
 */
export default function MedicamentCard({ medicament }) {
  const navigate = useNavigate();
  const { ajouterItem } = usePanier();
  const { isConnecte } = useAuth();
  const [modalConnexionOuvert, setModalConnexionOuvert] = useState(false);

  const stocksDisponibles = (medicament.stocks || []).filter((s) => s.disponible);
  const meilleureOffre = stocksDisponibles.length
    ? stocksDisponibles.reduce((min, s) => (parseFloat(s.prix_unitaire) < parseFloat(min.prix_unitaire) ? s : min))
    : null;

  const prix = meilleureOffre
    ? parseFloat(meilleureOffre.prix_unitaire)
    : (medicament.prix_de_vente ? parseFloat(medicament.prix_de_vente) : null);

  const disponible = stocksDisponibles.length > 0;
  const nbPharmacies = medicament.stocks?.length || 0;

  const handleAjoutRapide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!meilleureOffre) return;

    if (!isConnecte()) {
      setModalConnexionOuvert(true);
      return;
    }

    ajouterItem(
      { id: medicament.id, designation: medicament.designation },
      meilleureOffre.pharmacie?.id,
      parseFloat(meilleureOffre.prix_unitaire)
    );
    toast.success(`${medicament.designation} ajouté au panier.`);
  };

  return (
    <>
      <div className="group bg-white rounded-[12px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:border-vert-medical hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 overflow-hidden">
        <Link to={`/medicaments/${medicament.id}`} className="block">
          <div className="relative aspect-square bg-blanc-casse overflow-hidden">
            {medicament.photo_url ? (
              <img
                src={medicament.photo_url}
                alt={medicament.designation}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-vert-menthe">
                <Pill className="w-12 h-12 text-vert-profond" />
              </div>
            )}
            <span
              className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide shadow-[0_1px_4px_rgba(0,0,0,0.12)] ${
                disponible ? 'bg-white/95 text-vert-profond' : 'bg-white/95 text-danger'
              }`}
            >
              {disponible ? 'En stock' : 'Indisponible'}
            </span>
          </div>

          <div className="px-4 pt-3">
            <h3 className="font-medium text-bleu-nuit text-[15px] truncate">{medicament.designation}</h3>
            <p className="text-xs text-gris-doux mt-0.5 truncate">
              {medicament.categorie || (nbPharmacies > 0 ? `Disponible dans ${nbPharmacies} pharmacie${nbPharmacies > 1 ? 's' : ''}` : ' ')}
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between px-4 pb-4 pt-3">
          {prix != null ? (
            <p className="font-mono font-semibold text-vert-profond text-base">{formatMontant(prix)}</p>
          ) : (
            <span className="text-xs text-gris-doux">Prix indisponible</span>
          )}
          {meilleureOffre && (
            <button
              onClick={handleAjoutRapide}
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
              className="shrink-0 w-9 h-9 rounded-full bg-vert-medical hover:bg-vert-profond text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
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
    </>
  );
}
