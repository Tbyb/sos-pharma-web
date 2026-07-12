import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-vert-medical text-white hover:bg-vert-profond',
  secondary: 'border border-vert-medical text-vert-medical hover:bg-vert-menthe',
  outline: 'border border-vert-medical text-vert-medical hover:bg-vert-menthe',
  danger: 'bg-danger text-white hover:bg-[#B91C1C]',
  ghost: 'bg-transparent text-gris-doux hover:bg-vert-menthe hover:text-bleu-nuit',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * @param {{ variant?: 'primary'|'secondary'|'danger'|'ghost'|'outline', size?: 'sm'|'md'|'lg', loading?: boolean, children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export default function Button({ variant = 'primary', size = 'md', loading = false, children, className = '', disabled, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
