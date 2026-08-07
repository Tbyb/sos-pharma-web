import { X } from 'lucide-react';

const tailles = {
  md: 'max-w-lg',
  xl: 'max-w-3xl',
};

/**
 * @param {{ open: boolean, onClose: () => void, title?: string, children: React.ReactNode, footer?: React.ReactNode, size?: 'md'|'xl' }} props
 */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 animate-[fade-in_0.15s_ease-out]"
        onClick={onClose}
      />
      <div className={`relative bg-white rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] w-full ${tailles[size]} mx-4 max-h-[90vh] flex flex-col animate-[scale-in_0.15s_ease-out]`}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gris-bordure">
            <h3 className="text-lg font-medium text-bleu-nuit">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-[6px] hover:bg-vert-menthe text-gris-doux transition-colors duration-200 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-4 border-t border-gris-bordure flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
