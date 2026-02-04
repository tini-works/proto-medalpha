import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Sheet } from '../ui'

interface CancelAppointmentSheetProps {
  open: boolean
  doctorName: string
  formattedDate: string
  onConfirm: () => void
  onClose: () => void
}

export function CancelAppointmentSheet({
  open,
  doctorName,
  formattedDate,
  onConfirm,
  onClose,
}: CancelAppointmentSheetProps) {
  const { t } = useTranslation(['detail', 'appointments'])
  const [isCancelling, setIsCancelling] = useState(false)

  const handleConfirm = async () => {
    setIsCancelling(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onConfirm()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      variant="bottom"
      size="auto"
      showCloseButton={false}
      testId="cancel-appointment-sheet"
      footer={
        <>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            fullWidth
            loading={isCancelling}
            disabled={isCancelling}
          >
            {t('cancelAppointment')}
          </Button>
          <Button onClick={onClose} variant="tertiary" fullWidth disabled={isCancelling}>
            {t('keepAppointment')}
          </Button>
        </>
      }
    >
      <div className="px-6 pb-2">
        <h3 className="text-lg font-semibold text-charcoal-500 mb-2 text-center">
          {t('cancelDialog.title')}
        </h3>
        <p className="text-slate-600 mb-4 text-center">
          {t('cancelDialog.message', { doctorName, date: formattedDate })}
        </p>

        <div className="bg-cream-200 rounded-lg p-3">
          <p className="text-sm text-slate-600 text-center">
            <strong>{t('cancelDialog.policyTitle')}</strong> {t('cancelDialog.policyText')}
          </p>
        </div>
      </div>
    </Sheet>
  )
}
