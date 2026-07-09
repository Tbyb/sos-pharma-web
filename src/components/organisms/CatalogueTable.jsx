import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import Skeleton from '../atoms/Skeleton';
import Button from '../atoms/Button';
import { formatMontant } from '../../utils/formatters';

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
    return <p className="text-center text-gris py-12">Votre catalogue est vide. Ajoutez un médicament depuis le référentiel.</p>;
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
    <div className="overflow-x-auto bg-white rounded-lg shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gris border-b">
            <th className="py-3 px-4 font-medium">Médicament</th>
            <th className="py-3 px-4 font-medium">Prix</th>
            <th className="py-3 px-4 font-medium">Quantité</th>
            <th className="py-3 px-4 font-medium">Disponible</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogue.map((stock) => {
            const enEdition = editingId === stock.id;
            return (
              <tr key={stock.id} className="border-b last:border-0 hover:bg-gris-clair/50">
                <td className="py-2.5 px-4 font-medium text-noir">{stock.medicament?.designation}</td>
                <td className="py-2.5 px-4">
                  {enEdition ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.prix_unitaire}
                      onChange={(e) => setForm((f) => ({ ...f, prix_unitaire: e.target.value }))}
                      className="w-24 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20"
                    />
                  ) : (
                    formatMontant(stock.prix_unitaire)
                  )}
                </td>
                <td className="py-2.5 px-4">
                  {enEdition ? (
                    <input
                      type="number"
                      min="0"
                      value={form.quantite}
                      onChange={(e) => setForm((f) => ({ ...f, quantite: e.target.value }))}
                      className="w-20 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20"
                    />
                  ) : (
                    stock.quantite
                  )}
                </td>
                <td className="py-2.5 px-4">
                  <button
                    onClick={() => onToggleDisponibilite(stock)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${stock.disponible ? 'bg-vert' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${stock.disponible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex justify-end gap-1">
                    {enEdition ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => saveEdit(stock.id)} title="Enregistrer">
                          <Check className="w-4 h-4 text-succes" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit} title="Annuler">
                          <X className="w-4 h-4 text-gris" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => startEdit(stock)} title="Modifier prix/quantité">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onRetirer(stock)} title="Retirer du catalogue">
                      <Trash2 className="w-4 h-4 text-danger" />
                    </Button>
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
