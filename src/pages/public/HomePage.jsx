import { useState, useCallback, useMemo } from 'react';
import { LocateFixed } from 'lucide-react';
import SearchBar from '../../components/molecules/SearchBar';
import MedicamentsList from '../../components/organisms/MedicamentsList';
import Button from '../../components/atoms/Button';
import { useMedicaments } from '../../hooks/useMedicaments';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculerDistanceKm } from '../../utils/geo';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [tri, setTri] = useState('pertinence');
  const { position, statut: statutGeoloc, demanderPosition } = useGeolocation();

  const { data, isLoading } = useMedicaments({ search: search || undefined, page });

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const medicaments = data?.data;
  const meta = data?.meta || {};

  const medicamentsTries = useMemo(() => {
    const enrichis = (medicaments || []).map((m) => {
      const prix = (m.stocks || []).map((s) => parseFloat(s.prix_unitaire)).filter((p) => !Number.isNaN(p));
      const prixMin = prix.length ? Math.min(...prix) : null;

      let distanceMin = null;
      if (position) {
        const distances = (m.stocks || [])
          .map((s) => (s.pharmacie?.latitude && s.pharmacie?.longitude)
            ? calculerDistanceKm(position.latitude, position.longitude, parseFloat(s.pharmacie.latitude), parseFloat(s.pharmacie.longitude))
            : null)
          .filter((d) => d != null);
        distanceMin = distances.length ? Math.min(...distances) : null;
      }

      return { ...m, _prixMin: prixMin, _distanceMin: distanceMin };
    });

    const trier = {
      prix_asc: (a, b) => (a._prixMin ?? Infinity) - (b._prixMin ?? Infinity),
      prix_desc: (a, b) => (b._prixMin ?? -Infinity) - (a._prixMin ?? -Infinity),
      distance: (a, b) => (a._distanceMin ?? Infinity) - (b._distanceMin ?? Infinity),
    }[tri];

    return trier ? [...enrichis].sort(trier) : enrichis;
  }, [medicaments, tri, position]);

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

        {medicamentsTries.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20"
            >
              <option value="pertinence">Trier par</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="distance">Distance (plus proche)</option>
            </select>

            {tri === 'distance' && !position && (
              <Button size="sm" variant="outline" onClick={demanderPosition} loading={statutGeoloc === 'chargement'}>
                <LocateFixed className="w-3.5 h-3.5" /> Activer la localisation
              </Button>
            )}
            {tri === 'distance' && statutGeoloc === 'refuse' && (
              <span className="text-xs text-danger">Localisation refusée ou indisponible.</span>
            )}
          </div>
        )}

        <MedicamentsList
          medicaments={medicamentsTries}
          isLoading={isLoading}
          currentPage={meta.current_page || page}
          totalPages={meta.last_page || 1}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
