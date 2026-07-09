import SearchBar from './SearchBar';

const FILTRES = [
  { value: '', label: 'Tous' },
  { value: 'actif', label: 'Actifs' },
  { value: 'inactif', label: 'Inactifs' },
];

/**
 * @param {{ search: string, onSearchChange: (v: string) => void, statut: string, onStatutChange: (v: string) => void }} props
 */
export default function FilterBar({ search, onSearchChange, statut, onStatutChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="flex-1">
        <SearchBar onSearch={onSearchChange} initialValue={search} placeholder="Rechercher par nom ou CIP..." />
      </div>
      <div className="flex gap-1 bg-gris-clair rounded-lg p-1 shrink-0">
        {FILTRES.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onStatutChange(f.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${
              statut === f.value ? 'bg-white text-noir shadow-sm' : 'text-gris hover:text-noir'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
