/**
 * @param {{ nom?: string, size?: 'sm'|'md'|'lg' }} props
 */
export default function Avatar({ nom = '', size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initiales = nom
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-vert text-white font-medium ${sizes[size]} ${className}`}>
      {initiales || '?'}
    </div>
  );
}
