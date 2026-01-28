import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Doctor, TimeSlot } from '../../types'
import { Avatar } from '../display/Avatar'
import { Pill } from '../display/Pill'
import { TimeSlotButton } from '../forms/TimeSlotButton'
import { Button } from '../ui'

interface DoctorCardProps {
  doctor: Doctor
  slots?: TimeSlot[]
  onSelectDoctor?: () => void
  onSelectSlot?: (slot: TimeSlot) => void
  onMoreAppointments?: () => void
  showSlots?: boolean
}

// Helper to format time slot subtitle (duration or day label)
function getSlotSubtitle(slot: TimeSlot, t: ReturnType<typeof useTranslation>['t']): string {
  const today = new Date()
  const slotDate = new Date(slot.dateISO)
  const daysDiff = Math.ceil((slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return t('today')
  if (daysDiff === 1) return t('tomorrow')
  return '15 min'
}

export function DoctorCard({
  doctor,
  slots = [],
  onSelectDoctor,
  onSelectSlot,
  onMoreAppointments,
  showSlots = true,
}: DoctorCardProps) {
  const { t } = useTranslation('booking')
  const [isFavorite, setIsFavorite] = useState(false)

  // Get first 3 available slots for quick booking
  const availableSlots = slots.filter((s) => s.available).slice(0, 3)

  // Mock distance (in real app, would come from location service)
  const distanceKm = (parseFloat(doctor.id.replace('d', '')) * 0.7 + 0.8).toFixed(1)

  const insuranceTag = (() => {
    const hasGkv = doctor.accepts.includes('GKV')
    const hasPkv = doctor.accepts.includes('PKV')
    if (hasGkv && hasPkv) return t('both')
    if (hasGkv) return t('public')
    if (hasPkv) return t('private')
    return '—'
  })()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleSlotClick = (slot: TimeSlot) => {
    onSelectSlot?.(slot)
  }

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMoreAppointments?.()
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-cream-300">
      {/* Header section with photo, info, and favorite */}
      <div className="flex gap-3">
        {/* Photo */}
        <button
          onClick={onSelectDoctor}
          className="shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500/40 rounded-xl"
        >
          {doctor.imageUrl ? (
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <Avatar name={doctor.name} size="lg" />
            </div>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={onSelectDoctor}
              className="text-left focus:outline-none"
            >
              <h3 className="font-semibold text-charcoal-500 leading-tight">{doctor.name}</h3>
              <p className="text-sm text-teal-600 font-medium">{doctor.specialty}</p>
            </button>

            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-full transition-colors ${
                isFavorite
                  ? 'text-red-500'
                  : 'text-cream-400 hover:text-red-400'
              }`}
              aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              {isFavorite ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
            </button>
          </div>

          {/* Rating and distance row */}
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-yellow-400" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-medium text-slate-500">{doctor.rating.toFixed(1)}</span>
              <span className="text-slate-400">({doctor.reviewCount})</span>
            </div>
            <span className="text-cream-400">|</span>
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 1C6.48 1 2 5.48 2 11c0 6 4.48 11 10 11s10-5 10-11S17.52 1 12 1zm0 19c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <circle cx="12" cy="11" r="1.5" />
              </svg>
              <span>{distanceKm} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags row - Insurance and languages */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        <Pill tone="info" size="sm">
          {insuranceTag}
        </Pill>
        {doctor.languages.slice(0, 2).map((lang) => (
          <Pill key={lang} tone="neutral" size="sm">
            {lang}
          </Pill>
        ))}
      </div>

      {/* Time slots section */}
      {showSlots && availableSlots.length > 0 && (
        <div className="mt-4 pt-3 border-t border-cream-300">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {t('nextAvailable')}
            </span>
            {onMoreAppointments && (
              <Button
                variant="link"
                className="text-xs text-slate-500 hover:text-charcoal-500 flex items-center gap-0.5"
                onClick={handleMoreClick}
              >
                {t('moreAppointments')}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Button>
            )}
          </div>

          {/* Scrollable slots */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {availableSlots.map((slot, index) => (
              <TimeSlotButton
                key={`${slot.dateISO}-${slot.time}`}
                time={slot.time}
                subtitle={getSlotSubtitle(slot, t)}
                variant={index === 0 ? 'primary' : 'secondary'}
                onClick={() => handleSlotClick(slot)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fallback if no slots but showSlots is true */}
      {showSlots && availableSlots.length === 0 && (
        <div className="mt-4 pt-3 border-t border-cream-300">
          <Button
            className="w-full py-2.5 text-sm text-slate-500 hover:text-charcoal-500 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors"
            onClick={onSelectDoctor}
          >
            {t('viewAvailableAppointments')}
          </Button>
        </div>
      )}
    </div>
  )
}
