import { useState } from 'react';
import FormInput from '../atoms/FormInput';

const LISTES = ['Liste I', 'Liste II', 'Liste III', 'Hors liste'];
const TAUX_TVA = ['18%', '0%'];

/**
 * @param {{ medicament?: object, onSubmit: (data: object) => void, onCancel: () => void, loading?: boolean }} props
 */
export default function MedicamentForm({ medicament, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    designation: medicament?.designation || '',
    CIP: medicament?.CIP || '',
    prix_de_vente: medicament?.prix_de_vente || '',
    liste: medicament?.liste || LISTES[0],
    TVA: medicament?.TVA || TAUX_TVA[0],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.designation.trim()) errs.designation = 'La désignation est obligatoire.';
    if (!form.CIP.trim()) errs.CIP = 'Le code CIP est obligatoire.';
    if (form.prix_de_vente === '' || Number(form.prix_de_vente) < 0) errs.prix_de_vente = 'Le prix doit être un nombre positif.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Désignation" name="designation" value={form.designation} onChange={handleChange} error={errors.designation} />
      <FormInput label="Code CIP" name="CIP" value={form.CIP} onChange={handleChange} error={errors.CIP} />
      <FormInput label="Prix de vente (FCFA)" name="prix_de_vente" type="number" min="0" step="0.01" value={form.prix_de_vente} onChange={handleChange} error={errors.prix_de_vente} />

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

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-[6px] text-gris-doux hover:bg-blanc-casse transition-colors duration-200 text-sm font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-[6px] bg-vert-medical hover:bg-vert-profond disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors duration-200"
        >
          {loading ? 'Enregistrement...' : (medicament ? 'Enregistrer' : 'Ajouter')}
        </button>
      </div>
    </form>
  );
}
