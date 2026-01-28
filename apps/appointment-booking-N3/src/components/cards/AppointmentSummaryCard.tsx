import { IconCalendar, IconClock, IconVideo, IconMapPin } from '@tabler/icons-react'
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
            <IconCalendar className="w-4.5 h-4.5 text-slate-600" stroke={1.5} />
          </div>
          <span className="text-sm text-slate-700">{date}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
            <IconClock className="w-4.5 h-4.5 text-slate-600" stroke={1.5} />
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
              <IconVideo className="w-4.5 h-4.5 text-slate-600" stroke={1.5} />
            ) : (
              <IconMapPin className="w-4.5 h-4.5 text-slate-600" stroke={1.5} />
            )}
          </div>
          <span className="text-sm text-slate-700">{typeLabel}</span>
        </div>

        {/* Address (if in-person) */}
        {address && type === 'in-person' && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <IconMapPin className="w-4.5 h-4.5 text-slate-600" stroke={1.5} />
            </div>
            <span className="text-sm text-slate-700">{address}</span>
          </div>
        )}
      </div>
    </div>
  )
}
