import type { Appointment } from '../../types'
import { Pill } from '../display/Pill'
import { formatDateWithWeekday, formatTime } from '../../utils/format'

interface AppointmentCardProps {
  appointment: Appointment
  onClick?: () => void
}

// Map appointment status to pill tones (conservative usage)
const statusConfig: Record<Appointment['status'], { tone: 'info' | 'positive' | 'negative' | 'neutral'; label: string }> = {
  confirmed: { tone: 'info', label: 'Bestätigt' },
  completed: { tone: 'neutral', label: 'Abgeschlossen' },
  cancelled: { tone: 'negative', label: 'Storniert' },
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const config = statusConfig[appointment.status]

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-neutral-900 truncate">{appointment.doctorName}</h3>
          <p className="text-sm text-neutral-600">{appointment.specialty}</p>
        </div>
        <Pill tone={config.tone}>{config.label}</Pill>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-neutral-600">
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
        <div className="mt-2 text-sm text-neutral-500">
          Für: {appointment.forUserName}
        </div>
      )}
    </button>
  )
}
