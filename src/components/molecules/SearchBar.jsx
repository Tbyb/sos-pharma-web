import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

/**
 * @param {{ onSearch: (value: string) => void, placeholder?: string, initialValue?: string }} props
 */
export default function SearchBar({ onSearch, placeholder = 'Rechercher...', initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vert-medical" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-gris-bordure rounded-[8px] text-sm text-bleu-nuit placeholder:text-gris-doux outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
      />
    </div>
  );
}
