import { IconBrandGoogle, IconBrandApple, IconMail } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Sheet } from '../ui'

interface AddToCalendarSheetProps {
  open: boolean
  onClose: () => void
  onSelect: (provider: 'google' | 'apple' | 'outlook') => void
}

export function AddToCalendarSheet({ open, onClose, onSelect }: AddToCalendarSheetProps) {
  const { t } = useTranslation('detail')

  const Option = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode
    label: string
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 bg-white rounded-xl border border-cream-300 hover:bg-cream-50 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-teal-600">
        {icon}
      </div>
      <span className="text-base font-medium text-charcoal-500">{label}</span>
    </button>
  )

  return (
    <Sheet
      open={open}
      onClose={onClose}
      variant="bottom"
      size="md"
      title={t('addToCalendar')}
      description={t('addToCalendarDescription')}
      testId="add-to-calendar-sheet"
    >
      <Sheet.Body className="px-4 pb-8 space-y-3">
        <Option
          icon={<IconBrandGoogle size={22} stroke={2} />}
          label={t('calendar.google')}
          onClick={() => onSelect('google')}
        />
        <Option
          icon={<IconBrandApple size={22} stroke={2} />}
          label={t('calendar.apple')}
          onClick={() => onSelect('apple')}
        />
        <Option
          icon={<IconMail size={22} stroke={2} />}
          label={t('calendar.outlook')}
          onClick={() => onSelect('outlook')}
        />
      </Sheet.Body>
    </Sheet>
  )
}
