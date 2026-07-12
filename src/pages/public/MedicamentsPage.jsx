import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, LocateFixed } from 'lucide-react';
import MedicamentsList from '../../components/organisms/MedicamentsList';
import { useMedicaments } from '../../hooks/useMedicaments';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculerDistanceKm } from '../../utils/geo';

export default function MedicamentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchUrl = searchParams.get('search') || '';

  const [saisie, setSaisie] = useState(searchUrl);
  const [page, setPage] = useState(1);
  const [tri, setTri] = useState('pertinence');
  const { position, statut: statutGeoloc, demanderPosition } = useGeolocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(saisie.trim() ? { search: saisie.trim() } : {});
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saisie]);

  const { data, isLoading } = useMedicaments({ search: searchUrl || undefined, page });

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
    <div className="min-h-screen bg-blanc-casse">
      {/* Barre de filtres sticky */}
      <div className="sticky top-0 z-20 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vert-medical" />
            <input
              type="text"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder="Rechercher un médicament (ex: Paracétamol, Amoxicilline...)"
              className="w-full pl-11 pr-4 py-2.5 rounded-[8px] border border-gris-bordure text-sm text-bleu-nuit placeholder:text-gris-doux outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value)}
              className="rounded-[6px] border border-gris-bordure px-3 py-2 text-sm text-bleu-nuit outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
            >
              <option value="pertinence">Trier par</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="distance">Distance (plus proche)</option>
            </select>

            {tri === 'distance' && !position && (
              <button
                onClick={demanderPosition}
                disabled={statutGeoloc === 'chargement'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border border-vert-medical text-vert-medical hover:bg-vert-menthe transition-colors duration-200 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                {statutGeoloc === 'chargement' ? 'Localisation...' : 'Activer la localisation'}
              </button>
            )}
            {tri === 'distance' && statutGeoloc === 'refuse' && (
              <span className="text-xs text-danger">Localisation refusée ou indisponible.</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {searchUrl && (
          <p className="text-sm text-gris-doux mb-4">
            Résultats pour « <span className="font-medium text-bleu-nuit">{searchUrl}</span> »
          </p>
        )}

        <MedicamentsList
          medicaments={medicamentsTries}
          isLoading={isLoading}
          currentPage={meta.current_page || page}
          totalPages={meta.last_page || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
