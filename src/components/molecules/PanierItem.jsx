import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatMontant } from '../../utils/formatters';

export default function PanierItem({ item, onModifierQuantite, onRetirer }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-noir text-sm truncate">{item.designation}</h4>
        <p className="text-xs text-gris mt-0.5">{formatMontant(item.prix)} / unité</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onModifierQuantite(item.id, item.quantite - 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantite}</span>
        <button
          onClick={() => onModifierQuantite(item.id, item.quantite + 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="font-semibold text-noir text-sm w-24 text-right">
        {formatMontant(item.prix * item.quantite)}
      </p>

      <button
        onClick={() => onRetirer(item.id)}
        className="text-danger hover:text-red-700 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
