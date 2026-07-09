import { useRef, useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import {
  useCatalogue, useAjouterMedicament, useModifierCatalogue,
  useToggleDisponibilite, useRetirerCatalogue, useImporterCatalogue,
} from '../../hooks/useCatalogue';
import CatalogueTable from '../../components/organisms/CatalogueTable';
import AjouterMedicamentForm from '../../components/molecules/AjouterMedicamentForm';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import Alert from '../../components/atoms/Alert';

export default function CataloguePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const { data, isLoading, isError, error } = useCatalogue();
  const ajouter = useAjouterMedicament();
  const modifier = useModifierCatalogue();
  const toggleDispo = useToggleDisponibilite();
  const retirer = useRetirerCatalogue();
  const importer = useImporterCatalogue();

  const catalogue = data?.data || [];

  const handleAjouter = (form) => {
    ajouter.mutate(form, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Médicament ajouté au catalogue.' });
        setModalOpen(false);
      },
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Une erreur est survenue.' }),
    });
  };

  const handleModifier = (id, form) => {
    modifier.mutate({ id, data: form }, {
      onSuccess: () => setMessage({ type: 'success', text: 'Médicament mis à jour.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour.' }),
    });
  };

  const handleToggle = (stock) => {
    toggleDispo.mutate({ id: stock.id, disponible: !stock.disponible }, {
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement de disponibilité.' }),
    });
  };

  const handleRetirer = (stock) => {
    if (!window.confirm(`Retirer "${stock.medicament?.designation}" de votre catalogue ?`)) return;
    retirer.mutate(stock.id, {
      onSuccess: () => setMessage({ type: 'success', text: 'Médicament retiré du catalogue.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du retrait.' }),
    });
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const fichier = e.target.files?.[0];
    e.target.value = '';
    if (!fichier) return;

    importer.mutate(fichier, {
      onSuccess: (res) => setMessage({ type: 'success', text: res?.data?.message || 'Import terminé avec succès.' }),
      onError: (err) => setMessage({ type: 'error', text: err.response?.data?.message || "Erreur lors de l'import." }),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-noir">Mon catalogue</h1>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" className="hidden" onChange={handleFileChange} />
          <Button variant="outline" onClick={handleImportClick} loading={importer.isPending}>
            <Upload className="w-4 h-4" /> Importer CSV
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Ajouter
          </Button>
        </div>
      </div>

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}
      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger le catalogue.'}
        </Alert>
      )}

      {!isError && (
        <CatalogueTable
          catalogue={catalogue}
          isLoading={isLoading}
          onToggleDisponibilite={handleToggle}
          onModifier={handleModifier}
          onRetirer={handleRetirer}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter un médicament au catalogue">
        <AjouterMedicamentForm
          onSubmit={handleAjouter}
          onCancel={() => setModalOpen(false)}
          loading={ajouter.isPending}
        />
      </Modal>
    </div>
  );
}
