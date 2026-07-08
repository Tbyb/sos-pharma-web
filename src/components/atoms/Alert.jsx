import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  error: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
};

/**
 * @param {{ variant?: 'success'|'error'|'warning'|'info', children: React.ReactNode }} props
 */
export default function Alert({ variant = 'info', children, className = '' }) {
  const { icon: Icon, bg, border, text } = config[variant];
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${bg} ${border} ${text} ${className}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="text-sm">{children}</div>
    </div>
  );
}
