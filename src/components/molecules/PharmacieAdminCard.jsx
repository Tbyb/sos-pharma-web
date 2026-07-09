import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, ChevronRight } from 'lucide-react';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { STATUTS_PHARMACIE } from '../../utils/constants';

/**
 * @param {{ pharmacie: object, onCertifier: (p: object) => void, onRefuser: (p: object) => void, onSuspendre: (p: object) => void, onReactiver: (p: object) => void }} props
 */
export default function PharmacieAdminCard({ pharmacie, onCertifier, onRefuser, onSuspendre, onReactiver }) {
  const statut = STATUTS_PHARMACIE[pharmacie.statut] || { label: pharmacie.statut, couleur: '#6B7280', fond: '#F3F4F6' };

  return (
    <div className="bg-white rounded-lg shadow-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={`/admin/pharmacies/${pharmacie.id}`} className="font-medium text-noir text-sm hover:text-bleu truncate block">
            {pharmacie.nomPharmacie}
          </Link>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gris">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{pharmacie.addresse}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gris">
            <BadgeCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Licence {pharmacie.numLicence}</span>
          </div>
        </div>
        <Badge couleur={statut.couleur} fond={statut.fond} className="shrink-0">{statut.label}</Badge>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t">
        <div className="flex gap-2">
          {pharmacie.statut === 'en_attente' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => onCertifier(pharmacie)}>Certifier</Button>
              <Button size="sm" variant="danger" onClick={() => onRefuser(pharmacie)}>Refuser</Button>
            </>
          )}
          {pharmacie.statut === 'active' && (
            <Button size="sm" variant="outline" onClick={() => onSuspendre(pharmacie)}>Suspendre</Button>
          )}
          {pharmacie.statut === 'suspendue' && (
            <Button size="sm" variant="secondary" onClick={() => onReactiver(pharmacie)}>Réactiver</Button>
          )}
        </div>
        <Link to={`/admin/pharmacies/${pharmacie.id}`} className="flex items-center text-xs text-bleu hover:underline shrink-0">
          Détail <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
