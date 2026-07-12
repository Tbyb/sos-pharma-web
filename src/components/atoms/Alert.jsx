import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, bg: 'bg-vert-menthe', border: 'border-vert-medical/30', text: 'text-vert-profond' },
  error: { icon: AlertCircle, bg: 'bg-[#FEE2E2]', border: 'border-[#DC2626]/20', text: 'text-[#991B1B]' },
  warning: { icon: AlertTriangle, bg: 'bg-[#FFF1EC]', border: 'border-orange-corail/30', text: 'text-[#9A3412]' },
  info: { icon: Info, bg: 'bg-[#E3F2FD]', border: 'border-bleu-nuit/20', text: 'text-bleu-nuit' },
};

/**
 * @param {{ variant?: 'success'|'error'|'warning'|'info', children: React.ReactNode }} props
 */
export default function Alert({ variant = 'info', children, className = '' }) {
  const { icon: Icon, bg, border, text } = config[variant];
  return (
    <div className={`flex items-start gap-3 p-4 rounded-[8px] border ${bg} ${border} ${text} ${className}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="text-sm">{children}</div>
    </div>
  );
}
