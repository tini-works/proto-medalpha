import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconX } from '@tabler/icons-react'
import { Button } from '../ui/Button'
import { Sheet } from '../ui/Sheet'

export interface DeleteWarningModalProps {
  open: boolean
  onCancel: () => void
  onContinue: () => void
}

export function DeleteWarningModal({ open, onCancel, onContinue }: DeleteWarningModalProps) {
  const { t } = useTranslation('legal')
  const continueButtonRef = useRef<HTMLButtonElement>(null)

  const consequences = [
    t('deleteWarning.consequence1'),
    t('deleteWarning.consequence2'),
    t('deleteWarning.consequence3'),
    t('deleteWarning.consequence4'),
  ]

  return (
    <Sheet
      open={open}
      onClose={onCancel}
      variant="center"
      size="auto"
      showDragHandle={false}
      showCloseButton={false}
      initialFocusRef={continueButtonRef}
      testId="delete-warning-modal"
    >
      <div className="p-6 space-y-5">
        <h2 className="text-lg font-semibold text-charcoal-500 text-center">
          {t('deleteWarning.title')}
        </h2>

        <ul className="space-y-3">
          {consequences.map((consequence, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-coral-50 flex items-center justify-center mt-0.5">
                <IconX size={12} className="text-coral-500" strokeWidth={3} />
              </span>
              <span className="text-sm text-slate-600">{consequence}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            ref={continueButtonRef}
            onClick={onContinue}
            variant="destructive-filled"
            fullWidth
          >
            {t('deleteWarning.continue')}
          </Button>
          <Button onClick={onCancel} variant="tertiary" fullWidth>
            {t('deleteWarning.cancel')}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
