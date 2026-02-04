import { IconCalendar, IconVideo, IconMapPin } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../display/Avatar'
import { translateSpecialty } from '../../utils'

function parseDurationMinutes(duration?: string) {
  if (!duration) return null
  const m = duration.match(/(\d+)\s*(min|mins|minute|minutes)/i)
  if (!m) return null
  const minutes = Number(m[1])
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null
}

function formatEndTime(startTime: string, durationMinutes: number) {
  // Expects "HH:MM" (24h). Falls back to null if parsing fails.
  const m = startTime.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const hours = Number(m[1])
  const minutes = Number(m[2])
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

  const total = hours * 60 + minutes + durationMinutes
  const endHours = Math.floor((total % (24 * 60)) / 60)
  const endMinutes = total % 60
  const pad2 = (n: number) => String(n).padStart(2, '0')
  return `${pad2(endHours)}:${pad2(endMinutes)}`
}

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
  showVisitType?: boolean
}

export function AppointmentSummaryCard({
  doctor,
  date,
  time,
  duration,
  type,
  address,
  showVisitType = true,
}: AppointmentSummaryCardProps) {
  const { t } = useTranslation('booking')
  const typeLabel = type === 'in-person' ? t('inPersonVisit') : t('videoConsultation')
  const durationMinutes = parseDurationMinutes(duration) ?? null
  const endTime = durationMinutes ? formatEndTime(time, durationMinutes) : null

  return (
    <div className="bg-white rounded-xl border border-cream-400 overflow-hidden">
      {/* Doctor info header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-charcoal-500 truncate">{doctor.name}</h3>
            <p className="text-sm text-slate-600">{translateSpecialty(t, doctor.specialty)}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-cream-200" />

      {/* Details section */}
      <div className="p-4 space-y-3">
        {/* Date + time */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
            <IconCalendar className="w-4.5 h-4.5 text-slate-600" stroke={1.5} />
          </div>
          <div className="min-w-0">
            <div className="text-sm text-slate-700">{date}</div>
            <div className="text-sm text-slate-600">
              {endTime ? `${time}–${endTime}` : time}
              {duration ? <span className="text-slate-400"> ({duration})</span> : null}
            </div>
          </div>
        </div>

        {/* Visit type */}
        {showVisitType && (
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
        )}

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
