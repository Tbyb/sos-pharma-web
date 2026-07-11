import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import Textarea from '../atoms/Textarea';

/**
 * Modal de confirmation generique avant une action (destructive ou non),
 * avec un champ motif optionnel (ex: refus d'une commande/pharmacie).
 *
 * @param {{
 *   open: boolean, onClose: Function, onConfirm: Function,
 *   title?: string, description?: React.ReactNode, confirmLabel?: string,
 *   variant?: string, loading?: boolean,
 *   motif?: string, onMotifChange?: (value: string) => void,
 *   motifLabel?: string, motifPlaceholder?: string, motifRequired?: boolean,
 * }} props
 */
export default function ConfirmDialog({
  open, onClose, onConfirm, title, description, confirmLabel = 'Confirmer',
  variant = 'danger', loading = false,
  motif, onMotifChange, motifLabel = 'Motif', motifPlaceholder, motifRequired = false,
}) {
  const motifInvalide = motifRequired && !motif?.trim();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button variant={variant} loading={loading} disabled={motifInvalide} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description && <p className="text-sm text-gris">{description}</p>}
      {onMotifChange && (
        <Textarea
          className="mt-3"
          label={motifLabel}
          placeholder={motifPlaceholder}
          value={motif}
          onChange={(e) => onMotifChange(e.target.value)}
          rows={3}
        />
      )}
    </Modal>
  );
}
