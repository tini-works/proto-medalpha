import { useTranslation } from 'react-i18next'
import { Button, Sheet } from '../ui'

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
      title={t('offlineBookingTitle')}
      description={t('offlineBookingMessage')}
      variant="center"
      size="sm"
      showDragHandle={false}
    >
      <Sheet.Body className="px-4 pb-6">
        <p className="text-sm text-slate-600">{t('offlineBookingMessage')}</p>
      </Sheet.Body>
      <Sheet.Footer>
        <Button onClick={onClose} fullWidth>
          {t('offlineBookingAction')}
        </Button>
      </Sheet.Footer>
    </Sheet>
  )
}
