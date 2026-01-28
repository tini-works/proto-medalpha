import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Star, MapPin, ChevronRight, Circle, CircleCheck } from 'tabler-icons-react'
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
  // New props for specialty-first flow
  selectable?: boolean
  selected?: boolean
  onSelect?: () => void
  onViewDetails?: () => void
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
  selectable = false,
  selected = false,
  onSelect,
  onViewDetails,
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
    <div
      className={`bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border transition-colors ${
        selected ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-cream-300'
      }`}
    >
      {/* Header section with radio, photo, info, and favorite */}
      <div className="flex gap-3">
        {/* Radio button for selectable mode */}
        {selectable && (
          <button
            onClick={onSelect}
            className="shrink-0 flex items-start pt-1 focus:outline-none"
            aria-label={selected ? 'Deselect doctor' : 'Select doctor'}
          >
            {selected ? (
              <CircleCheck size="24" className="text-teal-500" fill="currentColor" stroke="white" />
            ) : (
              // #region agent log
              (() => {
                fetch('http://127.0.0.1:7244/ingest/470418f0-0d1b-444c-9138-7dc93d3f0e03', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    location: 'DoctorCard.tsx:radio-unchecked',
                    message: 'Rendering unchecked Circle radio',
                    data: { selectable, selected, doctorId: doctor.id, icon: 'Circle', className: 'text-cream-400' },
                    timestamp: Date.now(),
                    sessionId: 'debug-session',
                    hypothesisId: 'B',
                  }),
                }).catch(() => {})
                return null
              })(),
              // #endregion
              <Circle size="24" className="text-cream-400 hover:text-teal-400 transition-colors" stroke="1.5" />
            )}
          </button>
        )}

        {/* Photo */}
        <button
          onClick={selectable ? onSelect : onSelectDoctor}
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
              onClick={selectable ? onSelect : onSelectDoctor}
              className="text-left focus:outline-none min-w-0 flex-1"
            >
              <h3 className="font-semibold text-charcoal-500 leading-tight truncate">{doctor.name}</h3>
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
                <Heart size="20" stroke="1.5" fill="currentColor" />
              ) : (
                <Heart size="20" stroke="1.5" />
              )}
            </button>
          </div>

          {/* Rating and distance row */}
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Star size="14" className="text-yellow-400" fill="currentColor" />
              <span className="font-medium text-slate-500">{doctor.rating.toFixed(1)}</span>
              <span className="text-slate-400">({doctor.reviewCount})</span>
            </div>
            <span className="text-cream-400">|</span>
            <div className="flex items-center gap-1">
              <MapPin size="14" stroke="1.5" />
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
                <ChevronRight size="14" stroke="2" />
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

      {/* View Details link for selectable mode (no slots shown) */}
      {!showSlots && onViewDetails && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="link"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails()
            }}
          >
            {t('viewDetails')}
            <ChevronRight size="16" stroke="2" />
          </Button>
        </div>
      )}
    </div>
  )
}
