/**
 * @param {{ label?: string, error?: string, icon?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
export default function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-noir mb-1">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gris">{icon}</span>
        )}
        <input
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none ${icon ? 'pl-10' : ''} ${error ? 'border-danger focus:ring-danger/20' : 'border-gray-300 focus:border-bleu focus:ring-2 focus:ring-bleu/20'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
