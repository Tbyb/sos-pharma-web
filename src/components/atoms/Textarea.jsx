/**
 * @param {{ label?: string, error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>} props
 */
export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-bleu-nuit mb-1.5">{label}</label>
      )}
      <textarea
        className={`w-full rounded-[8px] border px-4 py-3 text-sm text-bleu-nuit placeholder:text-gris-doux transition-colors duration-200 outline-none ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-gris-bordure focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
