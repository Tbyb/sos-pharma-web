import { useState } from 'react';
import { useReferentielPharmacien } from '../../hooks/useMedicaments';
import SearchBar from './SearchBar';
import FormInput from '../atoms/FormInput';
import Button from '../atoms/Button';
import Skeleton from '../atoms/Skeleton';

const LISTES = ['Liste I', 'Liste II', 'Liste III', 'Hors liste'];
const TAUX_TVA = ['18%', '0%'];

const MODES = [
  { value: 'recherche', label: 'Depuis le référentiel' },
  { value: 'nouveau', label: 'Nouveau médicament' },
];

/**
 * @param {{ onSubmit: (data: object) => void, onCancel: () => void, loading?: boolean }} props
 */
export default function AjouterMedicamentForm({ onSubmit, onCancel, loading }) {
  const [mode, setMode] = useState('recherche');

  return (
    <div>
      <div className="flex gap-1 bg-blanc-casse border border-gris-bordure rounded-[8px] p-1 mb-4">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-[6px] cursor-pointer transition-colors duration-200 ${
              mode === m.value ? 'bg-vert-medical text-white' : 'text-bleu-nuit hover:bg-vert-menthe'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'recherche' ? (
        <RechercheReferentiel onSubmit={onSubmit} onCancel={onCancel} loading={loading} />
      ) : (
        <NouveauMedicament onSubmit={onSubmit} onCancel={onCancel} loading={loading} />
      )}
    </div>
  );
}

function RechercheReferentiel({ onSubmit, onCancel, loading }) {
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
        <div className="p-3 bg-blanc-casse rounded-[8px] flex items-center justify-between">
          <div>
            <p className="font-medium text-bleu-nuit text-sm">{selected.designation}</p>
            <p className="text-xs text-gris-doux font-mono">CIP {selected.CIP}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(null)}>Changer</Button>
        </div>
        <FormInput
          label="Quantité"
          type="number"
          min="1"
          value={form.quantite}
          onChange={(e) => setForm((f) => ({ ...f, quantite: e.target.value }))}
          required
        />
        <FormInput
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
              className="w-full text-left p-3 rounded-[8px] hover:bg-vert-menthe transition-colors duration-200 cursor-pointer"
            >
              <p className="font-medium text-bleu-nuit text-sm">{med.designation}</p>
              <p className="text-xs text-gris-doux font-mono">CIP {med.CIP} • {med.liste}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gris-doux text-center py-6">Aucun médicament trouvé. Essayez « Nouveau médicament » si vous ne le trouvez pas dans le référentiel.</p>
      )}
    </div>
  );
}

function NouveauMedicament({ onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    designation: '', CIP: '', prix_de_vente: '', liste: LISTES[0], TVA: TAUX_TVA[0],
    quantite: '', prix_unitaire: '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-gris-doux -mt-1">Ce médicament sera ajouté au référentiel général, puis à votre catalogue.</p>
      <FormInput label="Désignation" name="designation" value={form.designation} onChange={handleChange} required />
      <FormInput label="Code CIP" name="CIP" value={form.CIP} onChange={handleChange} required />
      <FormInput label="Prix de vente référentiel (FCFA)" name="prix_de_vente" type="number" min="0" step="0.01" value={form.prix_de_vente} onChange={handleChange} required />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Liste</label>
          <select
            name="liste"
            value={form.liste}
            onChange={handleChange}
            className="w-full rounded-[8px] border border-gris-bordure px-4 py-3 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
          >
            {LISTES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-bleu-nuit mb-1.5">TVA</label>
          <select
            name="TVA"
            value={form.TVA}
            onChange={handleChange}
            className="w-full rounded-[8px] border border-gris-bordure px-4 py-3 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
          >
            {TAUX_TVA.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Quantité en stock" name="quantite" type="number" min="1" value={form.quantite} onChange={handleChange} required />
        <FormInput label="Prix unitaire de vente (FCFA)" name="prix_unitaire" type="number" min="0" step="0.01" value={form.prix_unitaire} onChange={handleChange} required />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
        <Button type="submit" loading={loading}>Créer et ajouter au catalogue</Button>
      </div>
    </form>
  );
}
