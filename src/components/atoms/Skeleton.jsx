/**
 * @param {{ variant?: 'line'|'card'|'circle', width?: string, height?: string }} props
 */
export default function Skeleton({ variant = 'line', width, height, className = '' }) {
  const base = 'animate-pulse bg-gray-200 rounded';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} style={{ width: width || '40px', height: height || '40px' }} />;
  }

  if (variant === 'card') {
    return <div className={`${base} rounded-lg ${className}`} style={{ width: width || '100%', height: height || '120px' }} />;
  }

  return <div className={`${base} ${className}`} style={{ width: width || '100%', height: height || '16px' }} />;
}
