import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Champ de saisie stylé selon la charte DESIGN.md (utilisé partout, pas
 * seulement les pages d'authentification). Les champs de type "password"
 * affichent un bouton pour révéler la saisie.
 * @param {{ label?: string, error?: string, icon?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
export default function FormInput({ label, error, icon, className = '', type, ...props }) {
  const [visible, setVisible] = useState(false);
  const estMotDePasse = type === 'password';
  const typeReel = estMotDePasse && visible ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-bleu-nuit mb-1.5">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-doux">{icon}</span>
        )}
        <input
          type={typeReel}
          className={`w-full rounded-[8px] border px-4 py-3 text-sm text-bleu-nuit placeholder:text-gris-doux transition-colors duration-200 outline-none ${icon ? 'pl-11' : ''} ${estMotDePasse ? 'pr-11' : ''} ${
            error
              ? 'border-danger focus:ring-2 focus:ring-danger/20'
              : 'border-gris-bordure focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20'
          } ${className}`}
          {...props}
        />
        {estMotDePasse && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gris-doux hover:text-vert-medical transition-colors duration-200 cursor-pointer"
            tabIndex={-1}
            aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
