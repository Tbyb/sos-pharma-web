import { MapPin, Phone, Clock } from 'lucide-react';
import Badge from '../atoms/Badge';
import { STATUTS_PHARMACIE } from '../../utils/constants';
import { formatDistanceKm } from '../../utils/geo';

/**
 * @param {{ pharmacie: object, onClick?: () => void, selected?: boolean, distanceKm?: number }} props
 */
export default function PharmacieCard({ pharmacie, onClick, selected, distanceKm }) {
  const certifiee = pharmacie.statut === 'active';
  const statut = STATUTS_PHARMACIE[pharmacie.statut];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[8px] border p-4 cursor-pointer transition-all duration-200 ${
        selected
          ? 'border-vert-medical shadow-[0_4px_14px_rgba(0,0,0,0.08)]'
          : 'border-gris-bordure hover:border-vert-medical hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-bleu-nuit text-sm">{pharmacie.nomPharmacie}</h3>
        {certifiee && <Badge couleur={statut.couleur} fond={statut.fond} className="shrink-0">{statut.label}</Badge>}
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-xs text-gris-doux">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{pharmacie.addresse}</span>
      </div>

      {pharmacie.numTel && (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gris-doux">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span className="font-mono">{pharmacie.numTel}</span>
        </div>
      )}

      {(pharmacie.ouvert_24h || pharmacie.horaires) && (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gris-doux">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className={pharmacie.ouvert_24h ? 'text-vert-medical font-medium' : ''}>
            {pharmacie.ouvert_24h ? 'Ouvert 24h/24' : pharmacie.horaires}
          </span>
        </div>
      )}

      {distanceKm != null && (
        <p className="text-xs text-bleu-nuit font-mono mt-2">{formatDistanceKm(distanceKm)}</p>
      )}
    </div>
  );
}
