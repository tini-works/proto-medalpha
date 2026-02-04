import { useRef } from 'react'
import { Button } from '@meda/ui'
import { Sheet } from './Sheet'

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

  return (
    <Sheet
      open={open}
      onClose={onCancel}
      variant="center"
      size="auto"
      showDragHandle={false}
      showCloseButton={false}
      initialFocusRef={confirmButtonRef}
      testId="confirm-modal"
    >
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-charcoal-500 text-center">
          {title}
        </h2>
        <p className="text-sm text-slate-600 text-center">{message}</p>

        <div className="flex flex-col gap-3">
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
    </Sheet>
  )
}
