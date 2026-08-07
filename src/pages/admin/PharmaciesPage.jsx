import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAdminPharmacies, useAccepterPharmacie, useRefuserPharmacie,
  useSuspendrePharmacie, useReactiverPharmacie,
} from '../../hooks/usePharmacies';
import PharmaciesList from '../../components/organisms/PharmaciesList';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Alert from '../../components/atoms/Alert';
import Pagination from '../../components/atoms/Pagination';
import { PHARMACIE_ACTIONS } from '../../utils/pharmacieActions';

const ONGLETS = [
  { value: 'active', label: 'Certifiées' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'suspendue', label: 'Suspendues' },
];

export default function PharmaciesPage() {
  const [onglet, setOnglet] = useState('active');
  const [page, setPage] = useState(1);
  const [confirmation, setConfirmation] = useState(null);
  const [motif, setMotif] = useState('');

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
      onSuccess: () => toast.success(PHARMACIE_ACTIONS[action].succes),
      onError: (err) => toast.error(err.response?.data?.message || "Une erreur est survenue."),
      onSettled: () => fermerConfirmation(),
    });
  };

  const config = confirmation ? PHARMACIE_ACTIONS[confirmation.action] : null;
  const enCours = confirmation ? mutations[confirmation.action].isPending : false;

  return (
    <div>
      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger les pharmacies.'}
        </Alert>
      )}

      <div className="flex gap-1 bg-blanc-casse border border-gris-bordure rounded-[8px] p-1 mb-4 w-fit">
        {ONGLETS.map((o) => (
          <button
            key={o.value}
            onClick={() => changerOnglet(o.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-[6px] cursor-pointer transition-colors duration-200 ${
              onglet === o.value ? 'bg-vert-medical text-white' : 'text-bleu-nuit hover:bg-vert-menthe'
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

      <ConfirmDialog
        open={!!confirmation}
        onClose={fermerConfirmation}
        onConfirm={confirmerAction}
        title={config?.titre}
        description={confirmation && config.description(confirmation.pharmacie)}
        confirmLabel={config?.confirmLabel}
        variant={config?.variant}
        loading={enCours}
        motif={config?.motifRequis ? motif : undefined}
        onMotifChange={config?.motifRequis ? setMotif : undefined}
        motifLabel="Motif du refus"
        motifPlaceholder="Ex: documents illisibles, licence invalide..."
        motifRequired={config?.motifRequis}
      />
    </div>
  );
}
