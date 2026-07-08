import { useState, useCallback } from 'react';
import SearchBar from '../../components/molecules/SearchBar';
import MedicamentsList from '../../components/organisms/MedicamentsList';
import { useMedicaments } from '../../hooks/useMedicaments';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMedicaments({ search: search || undefined, page });

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const medicaments = data?.data || [];
  const meta = data?.meta || {};

  return (
    <div>
      <section className="bg-vert-clair py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-noir mb-2">Trouvez vos médicaments au meilleur prix</h1>
          <p className="text-gris mb-6">Comparez les prix dans les pharmacies certifiées de Dakar</p>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher un médicament (ex: Paracétamol, Amoxicilline...)"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {search && (
          <p className="text-sm text-gris mb-4">
            Résultats pour « <span className="font-medium text-noir">{search}</span> »
          </p>
        )}

        <MedicamentsList
          medicaments={medicaments}
          isLoading={isLoading}
          currentPage={meta.current_page || page}
          totalPages={meta.last_page || 1}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
