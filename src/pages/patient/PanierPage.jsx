import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { usePanier } from '../../contexts/PanierContext';
import PanierItem from '../../components/molecules/PanierItem';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import { formatMontant } from '../../utils/formatters';

export default function PanierPage() {
  const { items, total, modifierQuantite, retirerItem, viderPanier } = usePanier();

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <ShoppingCart className="w-16 h-16 text-gris mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-noir mb-2">Votre panier est vide</h2>
        <p className="text-gris mb-6">Recherchez des médicaments et ajoutez-les à votre panier</p>
        <Link to="/">
          <Button>Rechercher des médicaments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-noir">Mon panier</h1>
        <button
          onClick={viderPanier}
          className="flex items-center gap-1 text-sm text-danger hover:text-red-700 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Vider le panier
        </button>
      </div>

      <Card>
        {items.map((item) => (
          <PanierItem
            key={item.id}
            item={item}
            onModifierQuantite={modifierQuantite}
            onRetirer={retirerItem}
          />
        ))}
      </Card>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-gris">Total</span>
          <span className="text-xl font-bold text-noir">{formatMontant(total)}</span>
        </div>
        <Link to="/patient/commander" className="block mt-4">
          <Button className="w-full justify-center">
            Commander
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
