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
  confirmed: { tone: 'positive', label: 'Confirmed' },
  completed: { tone: 'neutral', label: 'Completed' },
  cancelled: { tone: 'negative', label: 'Cancelled' },
}

// Specialty icons mapping
const specialtyIcons: Record<string, JSX.Element> = {
  'General Medicine': (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Cardiology: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Dermatology: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  default: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

function getSpecialtyIcon(specialty: string): JSX.Element {
  return specialtyIcons[specialty] || specialtyIcons.default
}

export function AppointmentCard({
  appointment,
  onClick,
  onReschedule,
  onCancel,
  onBookAgain,
  variant = 'default',
}: AppointmentCardProps) {
  const config = statusConfig[appointment.status]

  if (variant === 'upcoming') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-cream-400 overflow-hidden">
        {/* Status Badge */}
        <div className="px-4 pt-4 flex justify-end">
          <Pill tone={config.tone}>{config.label}</Pill>
        </div>

        {/* Date/Time Row */}
        <div className="px-4 py-2 flex items-center gap-2 text-sm text-slate-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDateWithWeekday(appointment.dateISO)}</span>
          <span className="text-cream-400">|</span>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTime(appointment.time)} Uhr</span>
        </div>

        {/* Doctor Info */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Avatar with specialty icon overlay */}
            <div className="relative">
              <Avatar name={appointment.doctorName} size="lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white">
                {getSpecialtyIcon(appointment.specialty)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-charcoal-500 truncate">{appointment.doctorName}</h3>
              <p className="text-sm text-slate-600">{appointment.specialty}</p>
            </div>
          </div>
        </div>

        {/* Patient Name */}
        {appointment.forUserName && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Patient: {appointment.forUserName}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {appointment.status === 'confirmed' && (onReschedule || onCancel) && (
          <div className="px-4 pb-4 flex gap-3">
            {onReschedule && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onReschedule()
                }}
                className="flex-1 h-11 rounded-lg border border-cream-400 text-sm font-medium text-charcoal-500 hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
              >
                Reschedule
              </button>
            )}
            {onCancel && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel()
                }}
                className="flex-1 h-11 rounded-lg border border-cream-400 text-sm font-medium text-charcoal-500 hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {appointment.status !== 'confirmed' && onBookAgain && (
          <div className="px-4 pb-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBookAgain()
              }}
              className="btn btn-secondary btn-block h-11 py-0"
            >
              Book Again
            </button>
          </div>
        )}
      </div>
    )
  }

  // Default variant (original design)
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-cream-400 hover:border-cream-500 transition-colors duration-normal ease-out-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-charcoal-500 truncate">{appointment.doctorName}</h3>
          <p className="text-sm text-slate-600">{appointment.specialty}</p>
        </div>
        <Pill tone={config.tone}>{config.label}</Pill>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDateWithWeekday(appointment.dateISO)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTime(appointment.time)} Uhr</span>
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
