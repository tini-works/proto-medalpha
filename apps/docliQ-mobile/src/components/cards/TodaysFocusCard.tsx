import { IconMapPin } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../display/Avatar'
import { Pill } from '../display/Pill'
import { formatTime, translateSpecialty } from '../../utils'
import type { Appointment } from '../../types'
import { getDoctorById } from '../../data/doctors'

interface TodaysFocusCardProps {
  appointment: Appointment
  onClick?: () => void
}

/**
 * Hero card highlighting the user's next upcoming appointment
 * Displayed on HomeScreen for verified users with a confirmed upcoming appointment
 */
export function TodaysFocusCard({ appointment, onClick }: TodaysFocusCardProps) {
  const { t, i18n } = useTranslation(['home', 'booking'])
  const relativeDate = getRelativeDateLabel(appointment.dateISO, {
    today: t('today'),
    tomorrow: t('tomorrow'),
    locale: i18n.language === 'de' ? 'de-DE' : 'en-US',
  })
  const time = formatTime(appointment.time)
  const doctor = getDoctorById(appointment.doctorId)
  const specialtyLabel = translateSpecialty(t, appointment.specialty)
  const locationLabel = getPracticeLocationLabel(t, doctor?.name, doctor?.city)

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
        <div className="mb-1 text-sm font-medium opacity-90">{t('dateAt', { date: relativeDate })}</div>
        <div className="mb-6 text-5xl font-bold">{time}</div>

        {/* Doctor info section */}
        <div className="mb-5 flex items-center gap-3">
          <Avatar name={appointment.doctorName} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-white">{appointment.doctorName}</h3>
            <p className="truncate text-sm opacity-90">{specialtyLabel}</p>
          </div>
        </div>

        {/* Location and button row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <IconMapPin className="h-4 w-4 flex-shrink-0" stroke={1.5} />
            <span className="truncate">{locationLabel}</span>
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

function getRelativeDateLabel(
  dateISO: string,
  opts: { today: string; tomorrow: string; locale: string }
): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const appointmentDate = new Date(dateISO)
  appointmentDate.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return opts.today
  if (daysDiff === 1) return opts.tomorrow

  return appointmentDate.toLocaleDateString(opts.locale, {
    day: 'numeric',
    month: 'short',
  })
}

function getPracticeLocationLabel(
  t: (key: string, options?: any) => string,
  doctorName?: string,
  city?: string
): string {
  if (!doctorName || !city) return t('locationUnavailable')

  const parts = doctorName.trim().split(/\s+/)
  const lastName = parts.length > 0 ? parts[parts.length - 1] : doctorName
  return `${t('practiceName', { name: lastName })}, ${city}`
}
