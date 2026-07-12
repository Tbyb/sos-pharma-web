import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAdminPaiements } from '../../hooks/usePaiement';
import TransactionsList from '../../components/organisms/TransactionsList';
import StatCard from '../../components/molecules/StatCard';
import Alert from '../../components/atoms/Alert';
import Pagination from '../../components/atoms/Pagination';
import { STATUTS_PAIEMENT, MODES_PAIEMENT } from '../../utils/constants';

const FILTRES_INITIAUX = { statut: '', mode: '', date_debut: '', date_fin: '' };

export default function TransactionsPage() {
  const [filtres, setFiltres] = useState(FILTRES_INITIAUX);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useAdminPaiements({
    statut: filtres.statut || undefined,
    mode: filtres.mode || undefined,
    date_debut: filtres.date_debut || undefined,
    date_fin: filtres.date_fin || undefined,
    page,
  });

  const transactions = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.last_page || 1;

  const handleFiltreChange = (e) => {
    setFiltres((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  return (
    <div>
      {isError && (
        <Alert variant="error" className="mb-4">
          {error?.response?.data?.message || 'Impossible de charger les transactions.'}
        </Alert>
      )}

      <div className="mb-4 max-w-xs">
        <StatCard
          icon={Wallet}
          label="Revenus (paiements complétés)"
          valeur={meta.total_revenus ?? '0 FCFA'}
          variant="vert"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          name="statut"
          value={filtres.statut}
          onChange={handleFiltreChange}
          className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
        >
          <option value="">Historique (hors en attente)</option>
          {Object.entries(STATUTS_PAIEMENT).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          name="mode"
          value={filtres.mode}
          onChange={handleFiltreChange}
          className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
        >
          <option value="">Tous les modes</option>
          {Object.entries(MODES_PAIEMENT).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
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

      {!isError && <TransactionsList transactions={transactions} isLoading={isLoading} />}

      {!isError && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={meta.current_page || page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
