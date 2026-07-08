import { useState, useCallback } from 'react';
import SearchBar from '../../components/molecules/SearchBar';
import { useMedicaments } from '../../hooks/useMedicaments';
import { useNavigate } from 'react-router-dom';
import { Pill } from 'lucide-react';
import Spinner from '../../components/atoms/Spinner';

export default function ComparaisonPrixPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMedicaments({ search: search || undefined, page: 1 });
  const navigate = useNavigate();

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const medicaments = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-noir mb-2">Comparer les prix</h1>
      <p className="text-gris mb-6">Recherchez un médicament pour voir les prix dans différentes pharmacies</p>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Nom du médicament..."
      />

      <div className="mt-6">
        {isLoading && (
          <div className="flex justify-center py-8"><Spinner /></div>
        )}

        {!isLoading && medicaments.length === 0 && search && (
          <p className="text-gris text-center py-8">Aucun médicament trouvé pour « {search} »</p>
        )}

        {!isLoading && medicaments.length > 0 && (
          <div className="space-y-2">
            {medicaments.map((med) => (
              <button
                key={med.id}
                onClick={() => navigate(`/medicaments/${med.id}`)}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-lg shadow-card hover:shadow-md transition-shadow text-left cursor-pointer"
              >
                <div className="w-10 h-10 bg-vert-clair rounded-lg flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5 text-vert" />
                </div>
                <div>
                  <p className="font-medium text-noir text-sm">{med.designation}</p>
                  <p className="text-xs text-gris">{med.forme || med.CIP}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
