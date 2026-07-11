import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Upload } from 'lucide-react';
import {
  useCatalogue, useAjouterMedicament, useModifierCatalogue,
  useToggleDisponibilite, useRetirerCatalogue, useImporterCatalogue,
} from '../../hooks/useCatalogue';
import CatalogueTable from '../../components/organisms/CatalogueTable';
import AjouterMedicamentForm from '../../components/molecules/AjouterMedicamentForm';
import Button from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import Alert from '../../components/atoms/Alert';

export default function CataloguePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stockARetirer, setStockARetirer] = useState(null);
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
        toast.success('Médicament ajouté au catalogue.');
        setModalOpen(false);
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Une erreur est survenue.'),
    });
  };

  const handleModifier = (id, form) => {
    modifier.mutate({ id, data: form }, {
      onSuccess: () => toast.success('Médicament mis à jour.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.'),
    });
  };

  const handleToggle = (stock) => {
    toggleDispo.mutate({ id: stock.id, disponible: !stock.disponible }, {
      onError: (err) => toast.error(err.response?.data?.message || 'Erreur lors du changement de disponibilité.'),
    });
  };

  const confirmerRetrait = () => {
    if (!stockARetirer) return;
    retirer.mutate(stockARetirer.id, {
      onSuccess: () => toast.success('Médicament retiré du catalogue.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Erreur lors du retrait.'),
      onSettled: () => setStockARetirer(null),
    });
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const fichier = e.target.files?.[0];
    e.target.value = '';
    if (!fichier) return;

    importer.mutate(fichier, {
      onSuccess: (res) => {
        const { importes = 0, erreurs = [] } = res?.data || {};
        setMessage({
          type: erreurs.length ? 'warning' : 'success',
          text: `${importes} médicament(s) importé(s) dans le catalogue.`,
          details: erreurs,
        });
      },
      onError: (err) => toast.error(err.response?.data?.message || "Erreur lors de l'import."),
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

      {message && (
        <Alert variant={message.type} className="mb-4">
          <p>{message.text}</p>
          {message.details?.length > 0 && (
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              {message.details.map((detail, i) => <li key={i}>{detail}</li>)}
            </ul>
          )}
        </Alert>
      )}
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
          onRetirer={setStockARetirer}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter un médicament au catalogue">
        <AjouterMedicamentForm
          onSubmit={handleAjouter}
          onCancel={() => setModalOpen(false)}
          loading={ajouter.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!stockARetirer}
        onClose={() => setStockARetirer(null)}
        onConfirm={confirmerRetrait}
        title="Retirer le médicament"
        description={stockARetirer && `Retirer "${stockARetirer.medicament?.designation}" de votre catalogue ?`}
        confirmLabel="Retirer"
        loading={retirer.isPending}
      />
    </div>
  );
}
