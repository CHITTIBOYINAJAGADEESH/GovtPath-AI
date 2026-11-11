import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This operation cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title={title}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            isDestructive ? 'bg-red-50 text-admin-error' : 'bg-amber-50 text-amber-600'
          }`}
        >
          <AlertTriangle size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-admin-text">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button type="button" onClick={onClose} className="admin-btn-outline">
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={isDestructive ? 'admin-btn-danger' : 'admin-btn-primary'}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
