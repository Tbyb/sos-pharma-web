import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import {
  useAdminMedicaments, useCreerMedicament, useModifierMedicament,
  useDesactiverMedicament, useReactiverMedicament,
} from '../../hooks/useMedicaments';
import FilterBar from '../../components/molecules/FilterBar';
import MedicamentsTable from '../../components/organisms/MedicamentsTable';
import MedicamentForm from '../../components/molecules/MedicamentForm';
import Modal from '../../components/atoms/Modal';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Alert from '../../components/atoms/Alert';
import Pagination from '../../components/atoms/Pagination';

export default function MedicamentsPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [medicamentEnEdition, setMedicamentEnEdition] = useState(null);
  const [medicamentADesactiver, setMedicamentADesactiver] = useState(null);
  const [medicamentAReactiver, setMedicamentAReactiver] = useState(null);

  const { data, isLoading, isError, error } = useAdminMedicaments({ search: search || undefined, statut: statut || undefined, page });
  const creer = useCreerMedicament();
  const modifier = useModifierMedicament();
  const desactiver = useDesactiverMedicament();
  const reactiver = useReactiverMedicament();

  const medicaments = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.last_page || 1;

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatutChange = (value) => {
    setStatut(value);
    setPage(1);
  };

  const ouvrirAjout = () => {
    setMedicamentEnEdition(null);
    setModalOpen(true);
  };

  const ouvrirEdition = (med) => {
    setMedicamentEnEdition(med);
    setModalOpen(true);
  };

  const handleSubmit = (form) => {
    const mutation = medicamentEnEdition
      ? modifier.mutateAsync({ id: medicamentEnEdition.id, data: form })
      : creer.mutateAsync(form);

    mutation
      .then(() => {
        toast.success(medicamentEnEdition ? 'Médicament mis à jour.' : 'Médicament ajouté au référentiel.');
        setModalOpen(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Une erreur est survenue.');
      });
  };

  const confirmerDesactivation = () => {
    if (!medicamentADesactiver) return;
    desactiver.mutate(medicamentADesactiver.id, {
      onSuccess: () => toast.success('Médicament désactivé.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Erreur lors de la désactivation.'),
      onSettled: () => setMedicamentADesactiver(null),
    });
  };

  const confirmerReactivation = () => {
    if (!medicamentAReactiver) return;
    reactiver.mutate(medicamentAReactiver.id, {
      onSuccess: () => toast.success('Médicament réactivé.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Erreur lors de la réactivation.'),
      onSettled: () => setMedicamentAReactiver(null),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={ouvrirAjout}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-vert-medical hover:bg-vert-profond text-white text-sm font-medium transition-colors duration-200"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger les médicaments.'}
        </Alert>
      )}

      <div className="mb-4">
        <FilterBar search={search} onSearchChange={handleSearchChange} statut={statut} onStatutChange={handleStatutChange} />
      </div>

      {!isError && (
        <MedicamentsTable
          medicaments={medicaments}
          isLoading={isLoading}
          onEdit={ouvrirEdition}
          onDesactiver={setMedicamentADesactiver}
          onReactiver={setMedicamentAReactiver}
        />
      )}

      {!isError && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={meta.current_page || page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={medicamentEnEdition ? 'Modifier le médicament' : 'Ajouter un médicament'}
      >
        <MedicamentForm
          medicament={medicamentEnEdition}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={creer.isPending || modifier.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!medicamentADesactiver}
        onClose={() => setMedicamentADesactiver(null)}
        onConfirm={confirmerDesactivation}
        title="Désactiver le médicament"
        description={medicamentADesactiver && `Désactiver "${medicamentADesactiver.designation}" ? Il ne sera plus visible des patients.`}
        confirmLabel="Désactiver"
        loading={desactiver.isPending}
      />

      <ConfirmDialog
        open={!!medicamentAReactiver}
        onClose={() => setMedicamentAReactiver(null)}
        onConfirm={confirmerReactivation}
        title="Réactiver le médicament"
        description={medicamentAReactiver && `Réactiver "${medicamentAReactiver.designation}" ? Il redeviendra visible des patients.`}
        confirmLabel="Réactiver"
        loading={reactiver.isPending}
      />
    </div>
  );
}
