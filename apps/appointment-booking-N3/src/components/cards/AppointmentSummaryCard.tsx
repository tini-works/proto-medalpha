import { useTranslation } from 'react-i18next'
import { Avatar } from '../display/Avatar'

interface AppointmentSummaryCardProps {
  doctor: {
    name: string
    specialty: string
    imageUrl?: string
  }
  date: string
  time: string
  duration?: string
  type: 'in-person' | 'video'
  address?: string
}

export function AppointmentSummaryCard({
  doctor,
  date,
  time,
  duration,
  type,
  address,
}: AppointmentSummaryCardProps) {
  const { t } = useTranslation('booking')
  const typeLabel = type === 'in-person' ? t('inPersonVisit') : t('videoConsultation')

  return (
    <div className="bg-white rounded-xl border border-cream-400 overflow-hidden">
      {/* Doctor info header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-charcoal-500 truncate">{doctor.name}</h3>
            <p className="text-sm text-slate-600">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-cream-200" />

      {/* Details section */}
      <div className="p-4 space-y-3">
        {/* Date */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4.5 h-4.5 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-sm text-slate-700">{date}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4.5 h-4.5 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-sm text-slate-700">
            {time}
            {duration && <span className="text-slate-400"> ({duration})</span>}
          </span>
        </div>

        {/* Visit type */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
            {type === 'video' ? (
              <svg
                className="w-4.5 h-4.5 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            ) : (
              <svg
                className="w-4.5 h-4.5 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-slate-700">{typeLabel}</span>
        </div>

        {/* Address (if in-person) */}
        {address && type === 'in-person' && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4.5 h-4.5 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm text-slate-700">{address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
