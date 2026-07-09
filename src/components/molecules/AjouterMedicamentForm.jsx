import { useState } from 'react';
import { useReferentielPharmacien } from '../../hooks/useMedicaments';
import SearchBar from './SearchBar';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Skeleton from '../atoms/Skeleton';

/**
 * @param {{ onSubmit: (data: object) => void, onCancel: () => void, loading?: boolean }} props
 */
export default function AjouterMedicamentForm({ onSubmit, onCancel, loading }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ quantite: '', prix_unitaire: '' });

  const { data, isLoading } = useReferentielPharmacien({ search: search || undefined });
  const medicaments = data?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onSubmit({ idMedicament: selected.id, quantite: form.quantite, prix_unitaire: form.prix_unitaire });
  };

  if (selected) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-gris-clair rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium text-noir text-sm">{selected.designation}</p>
            <p className="text-xs text-gris">CIP {selected.CIP}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(null)}>Changer</Button>
        </div>
        <Input
          label="Quantité"
          type="number"
          min="1"
          value={form.quantite}
          onChange={(e) => setForm((f) => ({ ...f, quantite: e.target.value }))}
          required
        />
        <Input
          label="Prix unitaire (FCFA)"
          type="number"
          min="0"
          step="0.01"
          value={form.prix_unitaire}
          onChange={(e) => setForm((f) => ({ ...f, prix_unitaire: e.target.value }))}
          required
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button type="submit" loading={loading}>Ajouter au catalogue</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-3">
      <SearchBar onSearch={setSearch} placeholder="Rechercher un médicament par nom ou CIP..." />
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="40px" />)}
        </div>
      ) : medicaments.length ? (
        <div className="max-h-72 overflow-y-auto space-y-1">
          {medicaments.map((med) => (
            <button
              key={med.id}
              onClick={() => setSelected(med)}
              className="w-full text-left p-3 rounded-lg hover:bg-gris-clair transition-colors cursor-pointer"
            >
              <p className="font-medium text-noir text-sm">{med.designation}</p>
              <p className="text-xs text-gris">CIP {med.CIP} • {med.liste}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gris text-center py-6">Aucun médicament trouvé.</p>
      )}
    </div>
  );
}
