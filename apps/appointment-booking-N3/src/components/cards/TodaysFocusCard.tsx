import { Avatar } from '../display/Avatar'
import { Pill } from '../display/Pill'
import { formatTime, getRelativeDateLabel } from '../../utils/format'
import type { Appointment } from '../../types'

interface TodaysFocusCardProps {
  appointment: Appointment
  onCheckIn?: () => void
}

/**
 * Hero card highlighting the user's next upcoming appointment
 * Displayed on HomeScreen for verified users with upcoming appointments
 */
export function TodaysFocusCard({ appointment, onCheckIn }: TodaysFocusCardProps) {
  const relativeDate = getRelativeDateLabel(appointment.dateISO)
  const time = formatTime(appointment.time)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-teal-600 p-5 text-white">
      {/* Decorative shape in top-right corner */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-500 opacity-20" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Label pill */}
        <div className="mb-4 inline-block">
          <Pill tone="neutral" size="sm">
            NEXT APPOINTMENT
          </Pill>
        </div>

        {/* Date label and time display */}
        <div className="mb-1 text-sm font-medium opacity-90">{relativeDate} at</div>
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
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">Praxis Weber, Berlin</span>
          </div>

          {/* Check In button */}
          <button
            onClick={onCheckIn}
            className="flex-shrink-0 rounded-full bg-white px-6 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-cream-50 active:scale-95"
          >
            Check In
          </button>
        </div>
      </div>
    </div>
  )
}
