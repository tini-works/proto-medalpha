import { IconMapPin } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../display/Avatar'
import { Pill } from '../display/Pill'
import { formatTime, getRelativeDateLabel } from '../../utils/format'
import type { Appointment } from '../../types'

interface TodaysFocusCardProps {
  appointment: Appointment
  onClick?: () => void
}

/**
 * Hero card highlighting the user's next upcoming appointment
 * Displayed on HomeScreen for verified users with a confirmed upcoming appointment
 */
export function TodaysFocusCard({ appointment, onClick }: TodaysFocusCardProps) {
  const { t } = useTranslation('home')
  const relativeDate = getRelativeDateLabel(appointment.dateISO)
  const time = formatTime(appointment.time)

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-teal-600 p-5 text-white cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Decorative shape in top-right corner */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-500 opacity-20" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Label pill */}
        <div className="mb-4 inline-block">
          <Pill tone="neutral" size="sm">
            {t('nextAppointment')}
          </Pill>
        </div>

        {/* Date label and time display */}
        <div className="mb-1 text-sm font-medium opacity-90">{relativeDate} {t('dateAt').replace('{{date}}', '').trim()}</div>
        <div className="mb-6 text-5xl font-bold">{time}</div>

        {/* Doctor info section */}
        <div className="mb-5 flex items-center gap-3">
          <Avatar name={appointment.doctorName} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-white">{appointment.doctorName}</h3>
            <p className="truncate text-sm opacity-90">{appointment.specialty}</p>
          </div>
        </div>

        {/* Location and button row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <IconMapPin className="h-4 w-4 flex-shrink-0" stroke={1.5} />
            <span className="truncate">Praxis Weber, Berlin</span>
          </div>

          {/* View details button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
            className="flex-shrink-0 rounded-full bg-white px-6 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-cream-50 active:scale-95"
          >
            {t('viewDetails')}
          </button>
        </div>
      </div>
    </div>
  )
}
