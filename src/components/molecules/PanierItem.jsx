import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';

export default function PanierItem({ item, onModifierQuantite, onRetirer }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gris-bordure last:border-0">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-bleu-nuit text-sm truncate">{item.designation}</h4>
        <p className="text-xs text-gris-doux mt-0.5 font-mono">{formatMontant(item.prix)} / unité</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onModifierQuantite(item.id, item.quantite - 1)}
          className="w-7 h-7 rounded-full border border-gris-bordure flex items-center justify-center hover:border-vert-medical hover:text-vert-medical transition-colors duration-200 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-medium font-mono text-bleu-nuit">{item.quantite}</span>
        <button
          onClick={() => onModifierQuantite(item.id, item.quantite + 1)}
          className="w-7 h-7 rounded-full border border-gris-bordure flex items-center justify-center hover:border-vert-medical hover:text-vert-medical transition-colors duration-200 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="font-mono font-medium text-bleu-nuit text-sm w-24 text-right">
        {formatMontant(item.prix * item.quantite)}
      </p>

      <button
        onClick={() => onRetirer(item.id)}
        className="text-danger hover:text-[#B91C1C] transition-colors duration-200 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
