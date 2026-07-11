import { X } from 'lucide-react';

/**
 * @param {{ open: boolean, onClose: () => void, title?: string, children: React.ReactNode, footer?: React.ReactNode }} props
 */
export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 animate-[fade-in_0.15s_ease-out]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col animate-[scale-in_0.15s_ease-out]">
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-noir">{title}</h3>
            <button onClick={onClose} className="p-1 rounded hover:bg-gris-clair text-gris cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-4 border-t flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
