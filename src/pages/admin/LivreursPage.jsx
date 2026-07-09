import { useState } from 'react';
import { Truck, Ban, RotateCcw } from 'lucide-react';
import {
  useLivreurs, useLivreurMissions, useSuspendreLivreur, useReactiverLivreur,
} from '../../hooks/useLivreurs';
import Card from '../../components/atoms/Card';
import Badge from '../../components/atoms/Badge';
import Button from '../../components/atoms/Button';
import Skeleton from '../../components/atoms/Skeleton';
import Modal from '../../components/atoms/Modal';
import Alert from '../../components/atoms/Alert';
import { formatDate } from '../../utils/formatters';

export default function LivreursPage() {
  const [missionsLivreurId, setMissionsLivreurId] = useState(null);
  const [message, setMessage] = useState(null);

  const { data, isLoading, isError, error } = useLivreurs();
  const { data: missionsRes, isLoading: loadingMissions } = useLivreurMissions(missionsLivreurId);
  const suspendre = useSuspendreLivreur();
  const reactiver = useReactiverLivreur();

  const livreurs = data?.data || [];
  const missions = missionsRes?.data || [];

  const toggleStatut = (livreur) => {
    const mutation = livreur.statut === 'suspendu' ? reactiver : suspendre;
    mutation.mutate(livreur.id, {
      onSuccess: () => setMessage({
        type: 'success',
        text: livreur.statut === 'suspendu' ? 'Livreur réactivé.' : 'Livreur suspendu.',
      }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Une erreur est survenue.' }),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-noir mb-6">Gestion des livreurs</h1>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}
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
        <p className="text-center text-gris py-12">Aucun livreur enregistré.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gris border-b">
                <th className="py-3 px-4 font-medium">Nom</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Téléphone</th>
                <th className="py-3 px-4 font-medium">Missions actives</th>
                <th className="py-3 px-4 font-medium">Statut</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {livreurs.map((livreur) => (
                <tr key={livreur.id} className="border-b last:border-0 hover:bg-gris-clair/50">
                  <td className="py-2.5 px-4 font-medium text-noir">{livreur.nom || '—'}</td>
                  <td className="py-2.5 px-4 text-gris">{livreur.email || '—'}</td>
                  <td className="py-2.5 px-4 text-gris">{livreur.telephone || '—'}</td>
                  <td className="py-2.5 px-4 text-noir">{livreur.missions_actives}</td>
                  <td className="py-2.5 px-4">
                    {livreur.statut === 'suspendu'
                      ? <Badge couleur="#6B7280" fond="#F3F4F6">Suspendu</Badge>
                      : <Badge couleur="#16A34A" fond="#DCFCE7">Actif</Badge>}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setMissionsLivreurId(livreur.id)} title="Voir missions">
                        <Truck className="w-4 h-4" />
                      </Button>
                      {livreur.statut === 'suspendu' ? (
                        <Button variant="ghost" size="sm" onClick={() => toggleStatut(livreur)} title="Réactiver">
                          <RotateCcw className="w-4 h-4 text-succes" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => toggleStatut(livreur)} title="Suspendre">
                          <Ban className="w-4 h-4 text-danger" />
                        </Button>
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
                    <p className="text-sm font-medium text-noir">Livraison #{mission.id}</p>
                    <p className="text-xs text-gris mt-0.5">{mission.adresse}</p>
                    {mission.commande?.patient?.user && (
                      <p className="text-xs text-gris">
                        Patient : {mission.commande.patient.user.prenom} {mission.commande.patient.user.nom}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gris">{formatDate(mission.created_at)}</p>
                    <span className="text-xs font-medium text-noir">{mission.statut}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gris py-6 text-center">Aucune livraison pour ce livreur.</p>
        )}
      </Modal>
    </div>
  );
}
