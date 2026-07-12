import { Pencil, Ban, RotateCcw } from 'lucide-react';
import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import { formatMontant } from '../../utils/formatters';

/**
 * @param {{ medicaments: Array, isLoading: boolean, onEdit: (m: object) => void, onDesactiver: (m: object) => void, onReactiver: (m: object) => void }} props
 */
export default function MedicamentsTable({ medicaments = [], isLoading, onEdit, onDesactiver, onReactiver }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="48px" />
        ))}
      </div>
    );
  }

  if (!medicaments.length) {
    return <p className="text-center text-gris-doux py-16">Aucun médicament trouvé.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-blanc-casse">
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Désignation</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">CIP</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Prix</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Liste</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">TVA</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Statut</th>
            <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((med) => (
            <tr key={med.id} className="border-t border-gris-bordure hover:bg-blanc-casse transition-colors duration-200">
              <td className="py-2.5 px-4 font-medium text-bleu-nuit">{med.designation}</td>
              <td className="py-2.5 px-4 text-gris-doux font-mono">{med.CIP}</td>
              <td className="py-2.5 px-4 font-mono text-bleu-nuit">{formatMontant(med.prix_de_vente)}</td>
              <td className="py-2.5 px-4 text-gris-doux">{med.liste}</td>
              <td className="py-2.5 px-4 text-gris-doux">{med.TVA}</td>
              <td className="py-2.5 px-4">
                {med.actif
                  ? <Badge couleur="#0A5C36" fond="#E8F5EE">Actif</Badge>
                  : <Badge couleur="#6B7280" fond="#F3F4F6">Inactif</Badge>}
              </td>
              <td className="py-2.5 px-4">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(med)} title="Modifier" className="p-1.5 text-gris-doux hover:text-vert-medical transition-colors duration-200 cursor-pointer">
                    <Pencil className="w-4 h-4" />
                  </button>
                  {med.actif ? (
                    <button onClick={() => onDesactiver(med)} title="Désactiver" className="p-1.5 text-gris-doux hover:text-danger transition-colors duration-200 cursor-pointer">
                      <Ban className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => onReactiver(med)} title="Réactiver" className="p-1.5 text-gris-doux hover:text-vert-medical transition-colors duration-200 cursor-pointer">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
