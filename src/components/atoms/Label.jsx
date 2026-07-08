/**
 * @param {{ children: React.ReactNode } & React.LabelHTMLAttributes<HTMLLabelElement>} props
 */
export default function Label({ children, className = '', ...props }) {
  return (
    <label className={`block text-sm font-medium text-noir ${className}`} {...props}>
      {children}
    </label>
  );
}
