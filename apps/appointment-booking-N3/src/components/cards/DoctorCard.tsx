import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Doctor, TimeSlot } from '../../types'
import { Avatar } from '../display/Avatar'
import { Pill } from '../display/Pill'
import { TimeSlotButton } from '../forms/TimeSlotButton'

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

// Heart icon component
function HeartIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  )
}

// Star icon for compact rating display
function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

// Location icon
function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  )
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
              <HeartIcon filled={isFavorite} />
            </button>
          </div>

          {/* Rating and distance row */}
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="font-medium text-slate-500">{doctor.rating.toFixed(1)}</span>
              <span className="text-slate-400">({doctor.reviewCount})</span>
            </div>
            <span className="text-cream-400">|</span>
            <div className="flex items-center gap-1">
              <LocationIcon />
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
              <button
                onClick={handleMoreClick}
                className="text-xs font-medium text-slate-500 hover:text-charcoal-500 flex items-center gap-0.5"
              >
                {t('moreAppointments')}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
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
          <button
            onClick={onSelectDoctor}
            className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-charcoal-500 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors"
          >
            {t('viewAvailableAppointments')}
          </button>
        </div>
      )}
    </div>
  )
}
