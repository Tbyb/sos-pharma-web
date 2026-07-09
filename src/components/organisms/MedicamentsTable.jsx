import { Pencil, Ban, RotateCcw } from 'lucide-react';
import Badge from '../atoms/Badge';
import Skeleton from '../atoms/Skeleton';
import Button from '../atoms/Button';
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
    return <p className="text-center text-gris py-12">Aucun médicament trouvé.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gris border-b">
            <th className="py-3 px-4 font-medium">Désignation</th>
            <th className="py-3 px-4 font-medium">CIP</th>
            <th className="py-3 px-4 font-medium">Prix</th>
            <th className="py-3 px-4 font-medium">Liste</th>
            <th className="py-3 px-4 font-medium">TVA</th>
            <th className="py-3 px-4 font-medium">Statut</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((med) => (
            <tr key={med.id} className="border-b last:border-0 hover:bg-gris-clair/50">
              <td className="py-2.5 px-4 font-medium text-noir">{med.designation}</td>
              <td className="py-2.5 px-4 text-gris">{med.CIP}</td>
              <td className="py-2.5 px-4">{formatMontant(med.prix_de_vente)}</td>
              <td className="py-2.5 px-4 text-gris">{med.liste}</td>
              <td className="py-2.5 px-4 text-gris">{med.TVA}</td>
              <td className="py-2.5 px-4">
                {med.actif
                  ? <Badge couleur="#16A34A" fond="#DCFCE7">Actif</Badge>
                  : <Badge couleur="#6B7280" fond="#F3F4F6">Inactif</Badge>}
              </td>
              <td className="py-2.5 px-4">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(med)} title="Modifier">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {med.actif ? (
                    <Button variant="ghost" size="sm" onClick={() => onDesactiver(med)} title="Désactiver">
                      <Ban className="w-4 h-4 text-danger" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => onReactiver(med)} title="Réactiver">
                      <RotateCcw className="w-4 h-4 text-succes" />
                    </Button>
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
