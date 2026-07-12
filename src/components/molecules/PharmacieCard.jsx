import { MapPin, Phone } from 'lucide-react';

/**
 * @param {{ pharmacie: object, onClick?: () => void, selected?: boolean }} props
 */
export default function PharmacieCard({ pharmacie, onClick, selected }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[8px] border p-4 cursor-pointer transition-all duration-200 ${
        selected
          ? 'border-vert-medical shadow-[0_4px_14px_rgba(0,0,0,0.08)]'
          : 'border-gris-bordure hover:border-vert-medical hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]'
      }`}
    >
      <h3 className="font-medium text-bleu-nuit text-sm">{pharmacie.nomPharmacie}</h3>
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
    </div>
  );
}
