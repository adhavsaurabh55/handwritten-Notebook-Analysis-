import Button from './Button';
import Modal from './Modal';

/**
 * ConfirmationDialog — Reusable confirmation prompt built on Modal.
 *
 * Props:
 *   - isOpen: boolean              — Controls visibility
 *   - onClose: () => void          — Called when dialog is dismissed
 *   - onConfirm: () => void        — Called when user clicks confirm
 *   - title: string                — Dialog title (default: "Are you sure?")
 *   - message: string | ReactNode  — Body text (default: "This action cannot be undone.")
 *   - confirmText: string          — Confirm button label (default: "Confirm")
 *   - cancelText: string           — Cancel button label (default: "Cancel")
 *   - variant: "danger" | "warning" | "info"   — Style variant (default: "danger")
 *   - loading: boolean             — Shows loading on confirm button
 *   - size: "sm" | "md"           — Modal size (default: "sm")
 */

const variantConfig = {
  danger: {
    icon: (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    confirmVariant: 'danger',
  },
  warning: {
    icon: (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    confirmVariant: 'secondary',
  },
  info: {
    icon: (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    confirmVariant: 'primary',
  },
};

function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  size = 'sm',
}) {
  const config = variantConfig[variant] || variantConfig.danger;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      showCloseButton={false}
    >
      <div className="text-center">
        {config.icon}

        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>

        {typeof message === 'string' ? (
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        ) : (
          <div className="mt-2">{message}</div>
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          fullWidth
        >
          {cancelText}
        </Button>
        <Button
          variant={config.confirmVariant}
          onClick={handleConfirm}
          loading={loading}
          fullWidth
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;

