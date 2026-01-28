import { Stethoscope, Clock, Heart, Circle, Loader2 } from 'tabler-icons-react'
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
  matching: { tone: 'info', label: 'Finding doctor...' },
  await_confirm: { tone: 'warning', label: 'Pending' },
  confirmed: { tone: 'positive', label: 'Confirmed' },
  completed: { tone: 'neutral', label: 'Completed' },
  cancelled_patient: { tone: 'negative', label: 'Patient canceled' },
  cancelled_doctor: { tone: 'negative', label: 'Doctor canceled' },
}

// Check if doctor info should be visible based on status
function shouldShowDoctorInfo(status: Appointment['status']): boolean {
  return status !== 'matching'
}

// Specialty icons mapping using Tabler icons
const specialtyIcons: Record<string, JSX.Element> = {
  'General Medicine': (
    <Stethoscope size="14" stroke="1.5" />
  ),
  Cardiology: (
    <Heart size="14" stroke="1.5" />
  ),
  Dermatology: (
    <Circle size="14" stroke="1.5" />
  ),
}

export function AppointmentCard({
  appointment,
  onClick,
  variant = 'default',
}: AppointmentCardProps) {
  const config = statusConfig[appointment.status]
  const specialtyIcon = specialtyIcons[appointment.specialty] || <Stethoscope size="14" stroke="1.5" />
  const showDoctorInfo = shouldShowDoctorInfo(appointment.status)

  if (variant === 'upcoming') {
    return (
      <button
        onClick={onClick}
        className="w-full text-left p-4 bg-white rounded-lg border border-cream-400 hover:border-cream-500 transition-colors duration-normal ease-out-brand"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-lg bg-cream-200 text-slate-600 flex-shrink-0">
            {appointment.status === 'matching' ? (
              <Loader2 size="14" stroke="1.5" className="animate-spin" />
            ) : (
              specialtyIcon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-charcoal-500 truncate">
                {showDoctorInfo ? appointment.doctorName : 'Finding your doctor...'}
              </h3>
              <Pill tone={config.tone} size="sm">
                {config.label}
              </Pill>
            </div>
            <p className="text-sm text-slate-600">{appointment.specialty}</p>
            {showDoctorInfo && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <span>{formatDateWithWeekday(appointment.dateISO)}</span>
              </div>
            )}
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
        {showDoctorInfo ? (
          <Avatar name={appointment.doctorName} size="md" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center">
            <Loader2 size="20" stroke="1.5" className="text-slate-400 animate-spin" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-charcoal-500 truncate">
              {showDoctorInfo ? appointment.doctorName : 'Finding your doctor...'}
            </h3>
            <Pill tone={config.tone} size="sm">
              {config.label}
            </Pill>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">{appointment.specialty}</p>
          {showDoctorInfo && (
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Clock size="16" stroke="1.5" className="flex-shrink-0" />
                <span>{formatTime(appointment.time)} Uhr</span>
              </div>
            </div>
          )}
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
