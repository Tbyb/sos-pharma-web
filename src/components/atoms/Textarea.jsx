/**
 * @param {{ label?: string, error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>} props
 */
export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-noir mb-1">{label}</label>
      )}
      <textarea
        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none ${error ? 'border-danger focus:ring-danger/20' : 'border-gray-300 focus:border-bleu focus:ring-2 focus:ring-bleu/20'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
