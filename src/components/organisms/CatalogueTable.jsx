import { useState } from 'react';
import { Pencil, Trash2, Check, X, AlertTriangle, TriangleAlert } from 'lucide-react';
import Skeleton from '../atoms/Skeleton';
import { formatMontant } from '../../utils/formatters';

function niveauStock(quantite) {
  if (quantite <= 5) return 'critique';
  if (quantite <= 20) return 'faible';
  return null;
}

/**
 * @param {{ catalogue: Array, isLoading: boolean, onToggleDisponibilite: (s: object) => void, onModifier: (id: number, data: object) => void, onRetirer: (s: object) => void }} props
 */
export default function CatalogueTable({ catalogue = [], isLoading, onToggleDisponibilite, onModifier, onRetirer }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ prix_unitaire: '', quantite: '' });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="48px" />
        ))}
      </div>
    );
  }

  if (!catalogue.length) {
    return <p className="text-center text-gris-doux py-16">Votre catalogue est vide. Ajoutez un médicament depuis le référentiel.</p>;
  }

  const startEdit = (stock) => {
    setEditingId(stock.id);
    setForm({ prix_unitaire: stock.prix_unitaire, quantite: stock.quantite });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id) => {
    onModifier(id, { prix_unitaire: form.prix_unitaire, quantite: form.quantite });
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-blanc-casse">
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Médicament</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Prix</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Quantité</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Disponible</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogue.map((stock) => {
            const enEdition = editingId === stock.id;
            const niveau = niveauStock(Number(stock.quantite));
            const critique = niveau === 'critique';
            return (
              <tr
                key={stock.id}
                className={`border-t border-gris-bordure hover:bg-blanc-casse transition-colors duration-200 ${
                  niveau ? `border-l-[3px] ${critique ? 'border-l-danger' : 'border-l-orange-corail'}` : ''
                }`}
              >
                <td className="py-2.5 px-4 font-medium text-bleu-nuit">{stock.medicament?.designation}</td>
                <td className="py-2.5 px-4 font-mono text-bleu-nuit">
                  {enEdition ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.prix_unitaire}
                      onChange={(e) => setForm((f) => ({ ...f, prix_unitaire: e.target.value }))}
                      className="w-24 rounded-[6px] border border-gris-bordure px-2 py-1 text-sm font-mono outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
                    />
                  ) : (
                    formatMontant(stock.prix_unitaire)
                  )}
                </td>
                <td className="py-2.5 px-4 font-mono text-bleu-nuit">
                  {enEdition ? (
                    <input
                      type="number"
                      min="0"
                      value={form.quantite}
                      onChange={(e) => setForm((f) => ({ ...f, quantite: e.target.value }))}
                      className="w-20 rounded-[6px] border border-gris-bordure px-2 py-1 text-sm font-mono outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
                    />
                  ) : (
                    <span className="flex items-center gap-1.5">
                      {stock.quantite}
                      {niveau && (
                        <span
                          title={critique ? 'Rupture critique' : 'Stock faible'}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[11px] font-sans font-medium ${
                            critique ? 'bg-[#FEE2E2] text-danger' : 'bg-[#FFF0E9] text-orange-corail'
                          }`}
                        >
                          {critique ? <AlertTriangle className="w-3 h-3" /> : <TriangleAlert className="w-3 h-3" />}
                          {critique ? 'Rupture' : 'Faible'}
                        </span>
                      )}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4">
                  <button
                    onClick={() => onToggleDisponibilite(stock)}
                    title={stock.disponible ? 'Disponible' : 'Indisponible'}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${stock.disponible ? 'bg-vert-medical' : 'bg-gris-bordure'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 flex items-center justify-center ${stock.disponible ? 'translate-x-[22px]' : 'translate-x-0.5'}`}>
                      {stock.disponible && <Check className="w-3 h-3 text-vert-medical" strokeWidth={3} />}
                    </span>
                  </button>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex justify-end gap-1">
                    {enEdition ? (
                      <>
                        <button onClick={() => saveEdit(stock.id)} title="Enregistrer" className="p-1.5 text-gris-doux hover:text-vert-medical transition-colors duration-200 cursor-pointer">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} title="Annuler" className="p-1.5 text-gris-doux hover:text-bleu-nuit transition-colors duration-200 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(stock)} title="Modifier prix/quantité" className="p-1.5 text-gris-doux hover:text-vert-medical transition-colors duration-200 cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => onRetirer(stock)} title="Retirer du catalogue" className="p-1.5 text-gris-doux hover:text-danger transition-colors duration-200 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
