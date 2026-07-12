import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { usePanier } from '../../contexts/PanierContext';
import PanierItem from '../../components/molecules/PanierItem';
import { formatMontant } from '../../utils/formatters';

export default function PanierPage() {
  const { items, total, modifierQuantite, retirerItem, viderPanier } = usePanier();

  if (!items.length) {
    return (
      <div className="min-h-screen bg-blanc-casse">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-vert-menthe rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-vert-profond" />
          </div>
          <h2 className="text-xl font-semibold text-bleu-nuit mb-2">Votre panier est vide</h2>
          <p className="text-gris-doux mb-6">Recherchez des médicaments et ajoutez-les à votre panier</p>
          <Link
            to="/medicaments"
            className="inline-block px-5 py-2.5 rounded-[6px] bg-vert-medical hover:bg-vert-profond text-white font-medium transition-colors duration-200"
          >
            Rechercher des médicaments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blanc-casse">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-bleu-nuit">Mon panier</h1>
          <button
            onClick={viderPanier}
            className="flex items-center gap-1.5 text-sm text-danger hover:text-[#B91C1C] transition-colors duration-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Vider le panier
          </button>
        </div>

        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6">
          {items.map((item) => (
            <PanierItem
              key={item.id}
              item={item}
              onModifierQuantite={modifierQuantite}
              onRetirer={retirerItem}
            />
          ))}
        </div>

        <div className="bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-gris-doux">Total</span>
            <span className="font-mono text-xl font-semibold text-bleu-nuit">{formatMontant(total)}</span>
          </div>
          <Link
            to="/patient/commander"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[6px] bg-vert-medical hover:bg-vert-profond text-white font-medium transition-colors duration-200"
          >
            Commander
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
