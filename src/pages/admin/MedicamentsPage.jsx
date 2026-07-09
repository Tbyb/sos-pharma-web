import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useAdminMedicaments, useCreerMedicament, useModifierMedicament,
  useDesactiverMedicament, useReactiverMedicament,
} from '../../hooks/useMedicaments';
import FilterBar from '../../components/molecules/FilterBar';
import MedicamentsTable from '../../components/organisms/MedicamentsTable';
import MedicamentForm from '../../components/molecules/MedicamentForm';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import Alert from '../../components/atoms/Alert';
import Pagination from '../../components/atoms/Pagination';

export default function MedicamentsPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [medicamentEnEdition, setMedicamentEnEdition] = useState(null);
  const [message, setMessage] = useState(null);

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
        setMessage({ type: 'success', text: medicamentEnEdition ? 'Médicament mis à jour.' : 'Médicament ajouté au référentiel.' });
        setModalOpen(false);
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Une erreur est survenue.' });
      });
  };

  const handleDesactiver = (med) => {
    if (!window.confirm(`Désactiver "${med.designation}" ? Il ne sera plus visible des patients.`)) return;
    desactiver.mutate(med.id, {
      onSuccess: () => setMessage({ type: 'success', text: 'Médicament désactivé.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la désactivation.' }),
    });
  };

  const handleReactiver = (med) => {
    reactiver.mutate(med.id, {
      onSuccess: () => setMessage({ type: 'success', text: 'Médicament réactivé.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la réactivation.' }),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-noir">Référentiel médicaments</h1>
        <Button onClick={ouvrirAjout}>
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}
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
          onDesactiver={handleDesactiver}
          onReactiver={handleReactiver}
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
    </div>
  );
}
