import { useTranslation } from 'react-i18next'
import { Button, Sheet } from '../ui'

/** Shown when user tries to book while offline; explains that internet is required. */
interface OfflineBookingSheetProps {
  open: boolean
  onClose: () => void
}

export function OfflineBookingSheet({ open, onClose }: OfflineBookingSheetProps) {
  const { t } = useTranslation('settings')

  return (
    <Sheet
      open={open}
      onClose={onClose}
      variant="bottom"
      size="auto"
      title={t('offlineBookingTitle')}
      description={t('offlineBookingMessage')}
      testId="offline-booking-sheet"
      footer={
        <Button onClick={onClose} variant="primary" fullWidth>
          {t('offlineBookingAction')}
        </Button>
      }
    />
  )
}
