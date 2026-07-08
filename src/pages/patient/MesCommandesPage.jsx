import { useState } from 'react';
import { useMesCommandes } from '../../hooks/useCommandes';
import CommandesList from '../../components/organisms/CommandesList';

export default function MesCommandesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMesCommandes({ page });

  const commandes = data?.data || [];
  const meta = data?.meta || {};
  const perPage = meta.per_page || 10;
  const totalPages = meta.last_page || Math.ceil((meta.total || 0) / perPage) || 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-noir mb-6">Mes commandes</h1>

      <CommandesList
        commandes={commandes}
        isLoading={isLoading}
        currentPage={meta.current_page || page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
