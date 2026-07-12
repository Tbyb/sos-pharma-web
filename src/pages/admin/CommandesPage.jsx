import { useState } from 'react';
import { useAdminCommandes, useAdminCommandeDetail } from '../../hooks/useCommandes';
import { usePharmacies } from '../../hooks/usePharmacies';
import CommandesTable from '../../components/organisms/CommandesTable';
import CommandeDetails from '../../components/molecules/CommandeDetails';
import Modal from '../../components/atoms/Modal';
import Skeleton from '../../components/atoms/Skeleton';
import Pagination from '../../components/atoms/Pagination';
import Alert from '../../components/atoms/Alert';
import { STATUTS_COMMANDE } from '../../utils/constants';

const FILTRES_INITIAUX = { statut: '', idPharmacie: '', date_debut: '', date_fin: '' };

export default function CommandesPage() {
  const [filtres, setFiltres] = useState(FILTRES_INITIAUX);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading, isError, error } = useAdminCommandes({
    statut: filtres.statut || undefined,
    idPharmacie: filtres.idPharmacie || undefined,
    date_debut: filtres.date_debut || undefined,
    date_fin: filtres.date_fin || undefined,
    page,
  });
  const { data: pharmaciesRes } = usePharmacies();
  const { data: detailRes, isLoading: loadingDetail } = useAdminCommandeDetail(selectedId);

  const commandes = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.last_page || 1;
  const pharmacies = pharmaciesRes?.data || [];

  const handleFiltreChange = (e) => {
    setFiltres((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  return (
    <div>
      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger les commandes.'}
        </Alert>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          name="statut"
          value={filtres.statut}
          onChange={handleFiltreChange}
          className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUTS_COMMANDE).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          name="idPharmacie"
          value={filtres.idPharmacie}
          onChange={handleFiltreChange}
          className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
        >
          <option value="">Toutes les pharmacies</option>
          {pharmacies.map((p) => (
            <option key={p.id} value={p.id}>{p.nomPharmacie}</option>
          ))}
        </select>

        <input
          type="date"
          name="date_debut"
          value={filtres.date_debut}
          onChange={handleFiltreChange}
          className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
        />
        <input
          type="date"
          name="date_fin"
          value={filtres.date_fin}
          onChange={handleFiltreChange}
          className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
        />
      </div>

      {!isError && (
        <CommandesTable commandes={commandes} isLoading={isLoading} onRowClick={(c) => setSelectedId(c.id)} />
      )}

      {!isError && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={meta.current_page || page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Modal open={!!selectedId} onClose={() => setSelectedId(null)} title="Détail de la commande">
        {loadingDetail || !detailRes ? (
          <Skeleton height="200px" />
        ) : (
          <CommandeDetails commande={detailRes.data} />
        )}
      </Modal>
    </div>
  );
}
