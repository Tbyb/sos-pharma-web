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
import Textarea from '../../components/atoms/Textarea';
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
  const [motif, setMotif] = useState('');
  const [message, setMessage] = useState(null);

  const { data, isLoading, isError, error } = useAdminPharmacies({ statut: onglet, page });
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

  const demanderConfirmation = (action) => (pharmacie) => {
    setMotif('');
    setConfirmation({ action, pharmacie });
  };

  const fermerConfirmation = () => {
    setConfirmation(null);
    setMotif('');
  };

  const confirmerAction = () => {
    if (!confirmation) return;
    const { action, pharmacie } = confirmation;
    const variables = action === 'refuser' ? { id: pharmacie.id, motif } : pharmacie.id;
    mutations[action].mutate(variables, {
      onSuccess: () => setMessage({ type: 'success', text: PHARMACIE_ACTIONS[action].succes }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || "Une erreur est survenue." }),
      onSettled: () => fermerConfirmation(),
    });
  };

  const config = confirmation ? PHARMACIE_ACTIONS[confirmation.action] : null;
  const enCours = confirmation ? mutations[confirmation.action].isPending : false;
  const motifInvalide = confirmation?.action === 'refuser' && !motif.trim();

  return (
    <div>
      <h1 className="text-2xl font-bold text-noir mb-6">Gestion des pharmacies</h1>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}
      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger les pharmacies.'}
        </Alert>
      )}

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

      {!isError && (
        <PharmaciesList
          pharmacies={pharmacies}
          isLoading={isLoading}
          onCertifier={demanderConfirmation('certifier')}
          onRefuser={demanderConfirmation('refuser')}
          onSuspendre={demanderConfirmation('suspendre')}
          onReactiver={demanderConfirmation('reactiver')}
        />
      )}

      {!isError && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={meta.current_page || page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Modal
        open={!!confirmation}
        onClose={fermerConfirmation}
        title={config?.titre}
        footer={
          <>
            <Button variant="ghost" onClick={fermerConfirmation}>Annuler</Button>
            <Button variant={config?.variant} loading={enCours} disabled={motifInvalide} onClick={confirmerAction}>{config?.confirmLabel}</Button>
          </>
        }
      >
        <p className="text-sm text-gris">{confirmation && config.description(confirmation.pharmacie)}</p>
        {config?.motifRequis && (
          <Textarea
            className="mt-3"
            label="Motif du refus"
            placeholder="Ex: documents illisibles, licence invalide..."
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={3}
          />
        )}
      </Modal>
    </div>
  );
}
