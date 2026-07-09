import { useState } from 'react';
import {
  useAdminPharmacies, useAccepterPharmacie, useRefuserPharmacie,
  useSuspendrePharmacie, useReactiverPharmacie,
} from '../../hooks/usePharmacies';
import PharmaciesList from '../../components/organisms/PharmaciesList';
import Modal from '../../components/atoms/Modal';
import Button from '../../components/atoms/Button';
import Alert from '../../components/atoms/Alert';
import Pagination from '../../components/atoms/Pagination';
import { PHARMACIE_ACTIONS } from '../../utils/pharmacieActions';

const ONGLETS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'active', label: 'Certifiées' },
  { value: 'suspendue', label: 'Suspendues' },
];

export default function PharmaciesPage() {
  const [onglet, setOnglet] = useState('en_attente');
  const [page, setPage] = useState(1);
  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState(null);

  const { data, isLoading } = useAdminPharmacies({ statut: onglet, page });
  const certifier = useAccepterPharmacie();
  const refuser = useRefuserPharmacie();
  const suspendre = useSuspendrePharmacie();
  const reactiver = useReactiverPharmacie();

  const mutations = { certifier, refuser, suspendre, reactiver };

  const pharmacies = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.last_page || 1;

  const changerOnglet = (value) => {
    setOnglet(value);
    setPage(1);
  };

  const demanderConfirmation = (action) => (pharmacie) => setConfirmation({ action, pharmacie });

  const confirmerAction = () => {
    if (!confirmation) return;
    const { action, pharmacie } = confirmation;
    mutations[action].mutate(pharmacie.id, {
      onSuccess: () => setMessage({ type: 'success', text: PHARMACIE_ACTIONS[action].succes }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || "Une erreur est survenue." }),
      onSettled: () => setConfirmation(null),
    });
  };

  const config = confirmation ? PHARMACIE_ACTIONS[confirmation.action] : null;
  const enCours = confirmation ? mutations[confirmation.action].isPending : false;

  return (
    <div>
      <h1 className="text-2xl font-bold text-noir mb-6">Gestion des pharmacies</h1>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}

      <div className="flex gap-1 bg-gris-clair rounded-lg p-1 mb-4 w-fit">
        {ONGLETS.map((o) => (
          <button
            key={o.value}
            onClick={() => changerOnglet(o.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${
              onglet === o.value ? 'bg-white text-noir shadow-sm' : 'text-gris hover:text-noir'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <PharmaciesList
        pharmacies={pharmacies}
        isLoading={isLoading}
        onCertifier={demanderConfirmation('certifier')}
        onRefuser={demanderConfirmation('refuser')}
        onSuspendre={demanderConfirmation('suspendre')}
        onReactiver={demanderConfirmation('reactiver')}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={meta.current_page || page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Modal
        open={!!confirmation}
        onClose={() => setConfirmation(null)}
        title={config?.titre}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmation(null)}>Annuler</Button>
            <Button variant={config?.variant} loading={enCours} onClick={confirmerAction}>{config?.confirmLabel}</Button>
          </>
        }
      >
        <p className="text-sm text-gris">{confirmation && config.description(confirmation.pharmacie)}</p>
      </Modal>
    </div>
  );
}
