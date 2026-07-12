import { useState } from 'react';
import toast from 'react-hot-toast';
import { Truck, Ban, RotateCcw } from 'lucide-react';
import {
  useLivreurs, useLivreurMissions, useSuspendreLivreur, useReactiverLivreur,
} from '../../hooks/useLivreurs';
import Card from '../../components/atoms/Card';
import Badge from '../../components/atoms/Badge';
import Skeleton from '../../components/atoms/Skeleton';
import Modal from '../../components/atoms/Modal';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Alert from '../../components/atoms/Alert';
import { formatDate } from '../../utils/formatters';
import { STATUTS_LIVRAISON } from '../../utils/constants';

export default function LivreursPage() {
  const [missionsLivreurId, setMissionsLivreurId] = useState(null);
  const [livreurASuspendre, setLivreurASuspendre] = useState(null);
  const [livreurAReactiver, setLivreurAReactiver] = useState(null);

  const { data, isLoading, isError, error } = useLivreurs();
  const { data: missionsRes, isLoading: loadingMissions } = useLivreurMissions(missionsLivreurId);
  const suspendre = useSuspendreLivreur();
  const reactiver = useReactiverLivreur();

  const livreurs = data?.data || [];
  const missions = missionsRes?.data || [];

  const confirmerReactivation = () => {
    if (!livreurAReactiver) return;
    reactiver.mutate(livreurAReactiver.id, {
      onSuccess: () => toast.success('Livreur réactivé.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Une erreur est survenue.'),
      onSettled: () => setLivreurAReactiver(null),
    });
  };

  const confirmerSuspension = () => {
    if (!livreurASuspendre) return;
    suspendre.mutate(livreurASuspendre.id, {
      onSuccess: () => toast.success('Livreur suspendu.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Une erreur est survenue.'),
      onSettled: () => setLivreurASuspendre(null),
    });
  };

  return (
    <div>
      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger les livreurs.'}
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height="48px" />)}
        </div>
      ) : isError ? null : !livreurs.length ? (
        <p className="text-center text-gris-doux py-16">Aucun livreur enregistré.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-[8px] border border-gris-bordure shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-blanc-casse">
                <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Nom</th>
                <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Email</th>
                <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Téléphone</th>
                <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Missions actives</th>
                <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide">Statut</th>
                <th className="py-3 px-4 font-semibold text-gris-doux text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {livreurs.map((livreur) => (
                <tr key={livreur.id} className="border-t border-gris-bordure hover:bg-blanc-casse transition-colors duration-200">
                  <td className="py-2.5 px-4 font-medium text-bleu-nuit">{livreur.nom || '—'}</td>
                  <td className="py-2.5 px-4 text-gris-doux">{livreur.email || '—'}</td>
                  <td className="py-2.5 px-4 text-gris-doux font-mono">{livreur.telephone || '—'}</td>
                  <td className="py-2.5 px-4 font-mono text-bleu-nuit">{livreur.missions_actives}</td>
                  <td className="py-2.5 px-4">
                    {livreur.statut === 'suspendu'
                      ? <Badge couleur="#6B7280" fond="#F3F4F6">Suspendu</Badge>
                      : <Badge couleur="#0A5C36" fond="#E8F5EE">Actif</Badge>}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setMissionsLivreurId(livreur.id)} title="Voir missions" className="p-1.5 text-gris-doux hover:text-vert-medical transition-colors duration-200 cursor-pointer">
                        <Truck className="w-4 h-4" />
                      </button>
                      {livreur.statut === 'suspendu' ? (
                        <button onClick={() => setLivreurAReactiver(livreur)} title="Réactiver" className="p-1.5 text-gris-doux hover:text-vert-medical transition-colors duration-200 cursor-pointer">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => setLivreurASuspendre(livreur)} title="Suspendre" className="p-1.5 text-gris-doux hover:text-danger transition-colors duration-200 cursor-pointer">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!missionsLivreurId} onClose={() => setMissionsLivreurId(null)} title="Historique des livraisons">
        {loadingMissions ? (
          <Skeleton height="160px" />
        ) : missions.length ? (
          <div className="space-y-2">
            {missions.map((mission) => (
              <Card key={mission.id} padding="sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-bleu-nuit">Livraison #{mission.id}</p>
                    <p className="text-xs text-gris-doux mt-0.5">{mission.adresse}</p>
                    {mission.commande?.patient?.user && (
                      <p className="text-xs text-gris-doux">
                        Patient : {mission.commande.patient.user.prenom} {mission.commande.patient.user.nom}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gris-doux mb-1">{formatDate(mission.created_at)}</p>
                    {(() => {
                      const statut = STATUTS_LIVRAISON[mission.statut] || { label: mission.statut, couleur: '#6B7280', fond: '#F3F4F6' };
                      return <Badge couleur={statut.couleur} fond={statut.fond}>{statut.label}</Badge>;
                    })()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gris-doux py-6 text-center">Aucune livraison pour ce livreur.</p>
        )}
      </Modal>

      <ConfirmDialog
        open={!!livreurASuspendre}
        onClose={() => setLivreurASuspendre(null)}
        onConfirm={confirmerSuspension}
        title="Suspendre le livreur"
        description={livreurASuspendre && `Suspendre "${livreurASuspendre.nom}" ? Il ne pourra plus accepter de nouvelles missions.`}
        confirmLabel="Suspendre"
        loading={suspendre.isPending}
      />

      <ConfirmDialog
        open={!!livreurAReactiver}
        onClose={() => setLivreurAReactiver(null)}
        onConfirm={confirmerReactivation}
        title="Réactiver le livreur"
        description={livreurAReactiver && `Réactiver "${livreurAReactiver.nom}" ? Il pourra de nouveau accepter des missions.`}
        confirmLabel="Réactiver"
        loading={reactiver.isPending}
      />
    </div>
  );
}
