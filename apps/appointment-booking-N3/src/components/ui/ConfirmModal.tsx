import { useEffect, useRef } from 'react'
import { IconX } from '@tabler/icons-react'
import { Button } from './Button'

export interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Focus the confirm button when modal opens
  useEffect(() => {
    if (open && confirmButtonRef.current) {
      confirmButtonRef.current.focus()
    }
  }, [open])

  // Handle escape key
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
        data-testid="modal-backdrop"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm animate-scale-in">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors"
            aria-label="Close"
          >
            <IconX size={16} className="text-slate-600" />
          </button>

          {/* Content */}
          <div className="p-6 pt-8">
            <h2 id="modal-title" className="text-lg font-semibold text-charcoal-500 text-center">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 text-center">{message}</p>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                ref={confirmButtonRef}
                onClick={onConfirm}
                variant={variant === 'destructive' ? 'destructive-filled' : 'primary'}
                fullWidth
              >
                {confirmLabel}
              </Button>
              <Button onClick={onCancel} variant="tertiary" fullWidth>
                {cancelLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
