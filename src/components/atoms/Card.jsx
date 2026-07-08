/**
 * @param {{ padding?: 'sm'|'md'|'lg', children: React.ReactNode }} props
 */
export default function Card({ padding = 'md', children, className = '' }) {
  const paddings = { sm: 'p-3', md: 'p-5', lg: 'p-6' };
  return (
    <div className={`bg-white rounded-lg shadow-card ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
