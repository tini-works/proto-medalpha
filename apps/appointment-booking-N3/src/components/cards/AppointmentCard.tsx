import { IconStethoscope, IconClock } from '@tabler/icons-react'
import type { Appointment } from '../../types'
import { Pill } from '../display/Pill'
import { Avatar } from '../display/Avatar'
import { formatDateWithWeekday, formatTime } from '../../utils/format'

interface AppointmentCardProps {
  appointment: Appointment
  onClick?: () => void
  onReschedule?: () => void
  onCancel?: () => void
  onBookAgain?: () => void
  variant?: 'default' | 'upcoming'
}

// Map appointment status to pill tones
const statusConfig: Record<
  Appointment['status'],
  { tone: 'info' | 'positive' | 'warning' | 'negative' | 'neutral'; label: string }
> = {
  matching: { tone: 'info', label: 'Matching' },
  await_confirm: { tone: 'warning', label: 'Await confirm' },
  confirmed: { tone: 'positive', label: 'Confirmed' },
  completed: { tone: 'neutral', label: 'Completed' },
  cancelled_patient: { tone: 'negative', label: 'Patient canceled' },
  cancelled_doctor: { tone: 'negative', label: 'Doctor canceled' },
}

// Specialty icons mapping using inline SVGs
const specialtyIcons: Record<string, JSX.Element> = {
  'General Medicine': (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M7 10c0 1.657-1.343 3-3 3S1 11.657 1 10s1.343-3 3-3 3 1.343 3 3z" />
      <path d="M9 15l4 4 4-4" />
      <path d="M13 17v-2" />
      <path d="M10 18h6" />
    </svg>
  ),
  Cardiology: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Dermatology: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  ),
}

export function AppointmentCard({
  appointment,
  onClick,
  variant = 'default',
}: AppointmentCardProps) {
  const config = statusConfig[appointment.status]
  const specialtyIcon = specialtyIcons[appointment.specialty] || <IconStethoscope className="w-3.5 h-3.5" stroke={1.5} />

  if (variant === 'upcoming') {
    return (
      <button
        onClick={onClick}
        className="w-full text-left p-4 bg-white rounded-lg border border-cream-400 hover:border-cream-500 transition-colors duration-normal ease-out-brand"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-lg bg-cream-200 text-slate-600 flex-shrink-0">
            {specialtyIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-charcoal-500 truncate">{appointment.doctorName}</h3>
              <Pill tone={config.tone} size="sm">
                {config.label}
              </Pill>
            </div>
            <p className="text-sm text-slate-600">{appointment.specialty}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>{formatDateWithWeekday(appointment.dateISO)}</span>
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-cream-400 hover:border-cream-500 transition-colors duration-normal ease-out-brand"
    >
      <div className="flex items-start gap-3">
        <Avatar name={appointment.doctorName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-charcoal-500 truncate">{appointment.doctorName}</h3>
            <Pill tone={config.tone} size="sm">
              {config.label}
            </Pill>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">{appointment.specialty}</p>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <IconClock className="w-4 h-4 flex-shrink-0" stroke={1.5} />
              <span>{formatTime(appointment.time)} Uhr</span>
            </div>
          </div>
        </div>
      </div>

      {appointment.forUserName && (
        <div className="mt-2 text-sm text-slate-500">
          Patient: {appointment.forUserName}
        </div>
      )}
    </button>
  )
}
