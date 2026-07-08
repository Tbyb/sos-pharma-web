/**
 * @param {{ couleur?: string, fond?: string, children: React.ReactNode }} props
 */
export default function Badge({ couleur, fond, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ color: couleur, backgroundColor: fond }}
    >
      {children}
    </span>
  );
}
