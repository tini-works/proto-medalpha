import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconSparkles, IconSun, IconMoon, IconCheck, IconCalendar, IconArrowRight } from '@tabler/icons-react'
import { Header, Page, ProgressIndicator, StickyActionBar } from '../../components'
import { Button } from '../../components/ui'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import { useBookingSubmission } from '../../hooks/useBookingSubmission'
import type { DayOfWeek, TimeRange, AvailabilitySlot, InsuranceType } from '../../types'
import { resolveBookingProgress } from './bookingProgress'

const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri']
const TIME_RANGES: TimeRange[] = ['morning', 'afternoon', 'evening']

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  morning: '7-12h',
  afternoon: '12-15h',
  evening: '15-19h',
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
}

export default function AvailabilityScreen() {
  const { t } = useTranslation('booking')
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { search, setAvailabilityPrefs, bookingFlow, selectedDoctor } = useBooking()
  const { submitSpecialty } = useBookingSubmission()

  const isDoctorFirstFlow = bookingFlow === 'by_doctor'

  const [fullyFlexible, setFullyFlexible] = useState(false)
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())

  // Redirect if required data is missing
  useEffect(() => {
    if (isDoctorFirstFlow) {
      // Doctor-first flow: redirect if no doctor selected
      if (!selectedDoctor) {
        navigate(PATHS.BOOKING_RESULTS)
      }
    } else {
      // Specialty-first flow: redirect if no specialty or city
      if (!search?.specialty || !search?.city) {
        navigate(PATHS.BOOKING_SPECIALTY)
      }
    }
  }, [isDoctorFirstFlow, selectedDoctor, search?.specialty, search?.city, navigate])

  // Create a key for each slot (e.g., "mon-morning")
  const slotKey = (day: DayOfWeek, timeRange: TimeRange) => `${day}-${timeRange}`

  // Parse slot key back to day and timeRange
  const parseSlotKey = (key: string): AvailabilitySlot => {
    const [day, timeRange] = key.split('-') as [DayOfWeek, TimeRange]
    return { day, timeRange }
  }

  const toggleSlot = (day: DayOfWeek, timeRange: TimeRange) => {
    const key = slotKey(day, timeRange)
    setSelectedSlots((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
    // If user manually selects slots, turn off fully flexible
    if (fullyFlexible) {
      setFullyFlexible(false)
    }
  }

  const handleFullyFlexibleToggle = () => {
    setFullyFlexible((prev) => !prev)
    if (!fullyFlexible) {
      // Select all slots when choosing fully flexible
      const allSlots = new Set<string>()
      DAYS.forEach((day) => {
        TIME_RANGES.forEach((timeRange) => {
          allSlots.add(slotKey(day, timeRange))
        })
      })
      setSelectedSlots(allSlots)
    } else {
      // Clear selections when unchecking fully flexible
      setSelectedSlots(new Set())
    }
  }

  // Generate summary text for selected slots
  const selectionSummary = useMemo(() => {
    if (fullyFlexible) {
      return { primary: t('anyTimeWorks'), secondary: '', count: 15 }
    }

    if (selectedSlots.size === 0) {
      return { primary: '', secondary: '', count: 0 }
    }

    // Group by time range
    const byTimeRange: Record<TimeRange, DayOfWeek[]> = {
      morning: [],
      afternoon: [],
      evening: [],
    }

    selectedSlots.forEach((key) => {
      const { day, timeRange } = parseSlotKey(key)
      byTimeRange[timeRange].push(day)
    })

    // Build summary strings
    const parts: string[] = []
    const secondaryParts: string[] = []

    TIME_RANGES.forEach((timeRange) => {
      const days = byTimeRange[timeRange]
      if (days.length === 0) return

      const dayNames = days.map((d) => DAY_LABELS[d]).join(', ')
      const timeLabel =
        timeRange === 'morning' ? t('mornings') : timeRange === 'afternoon' ? t('afternoons') : t('evenings')

      if (parts.length === 0) {
        parts.push(`${dayNames} ${timeLabel}`)
      } else {
        secondaryParts.push(`${dayNames} ${timeLabel}`)
      }
    })

    return {
      primary: parts.join(', ') + (secondaryParts.length > 0 ? ' + more' : ''),
      secondary: secondaryParts.join(', '),
      count: selectedSlots.size,
    }
  }, [selectedSlots, fullyFlexible, t])

  const handleBack = () => {
    if (isDoctorFirstFlow) {
      // Doctor-first flow: go back to symptoms screen
      navigate(PATHS.BOOKING_SYMPTOMS)
    } else {
      // Specialty-first flow: go back to combined specialty screen
      navigate(PATHS.BOOKING_SPECIALTY)
    }
  }

  const handleContinue = () => {
    // Convert selected slots to AvailabilitySlot array
    const slots: AvailabilitySlot[] = Array.from(selectedSlots).map(parseSlotKey)

    // Store availability prefs
    const prefs = { fullyFlexible, slots }
    setAvailabilityPrefs(prefs)

    // Determine insurance type based on flow
    const insuranceType: InsuranceType = isDoctorFirstFlow && selectedDoctor
      ? (selectedDoctor.accepts.includes('GKV') ? 'GKV' : 'PKV')
      : ((search?.insuranceType || 'GKV') as InsuranceType)

    // Submit using the shared hook
    submitSpecialty({
      specialty: isDoctorFirstFlow && selectedDoctor ? selectedDoctor.specialty : (search?.specialty || ''),
      city: isDoctorFirstFlow && selectedDoctor ? selectedDoctor.city : (search?.city || ''),
      insuranceType,
      doctorId: isDoctorFirstFlow && selectedDoctor ? selectedDoctor.id : '',
      doctorName: isDoctorFirstFlow && selectedDoctor ? selectedDoctor.name : '',
      availabilityPrefs: prefs,
      patientId: profile.id,
      patientName: profile.fullName,
    })
  }

  const canContinue = fullyFlexible || selectedSlots.size > 0

  return (
    <Page safeBottom={false}>
      <Header title={t('selectAvailability')} showBack onBack={handleBack} />

      {/* Progress indicator */}
      <div className="px-4 py-4 space-y-3 bg-white border-b border-cream-300">
        {(() => {
          const progress = resolveBookingProgress({
            bookingFlow,
            fallbackFlow: isDoctorFirstFlow ? 'by_doctor' : 'by_specialty',
            currentStep: isDoctorFirstFlow ? 4 : 3,
          })
          return (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-slate-600">
                  {t(progress.stepLabelKey)}
                </span>
                <span className="text-xs text-slate-500">{t('yourRequest')}</span>
              </div>
              <ProgressIndicator
                currentStep={progress.currentStep}
                totalSteps={progress.totalSteps}
                variant="bar"
                showLabel={false}
                showPercentage={false}
              />
            </>
          )
        })()}
      </div>

      <div className="px-4 pb-28 space-y-6">
        {/* Subtitle */}
        <p className="text-sm text-slate-500">{t('choosePreferredTimeSlots')}</p>

        {/* Fully flexible option */}
        <button
          type="button"
          onClick={handleFullyFlexibleToggle}
          className={`w-full rounded-2xl border p-4 flex items-center gap-4 transition-colors duration-normal ease-out-brand ${
            fullyFlexible ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
          }`}
          aria-pressed={fullyFlexible}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              fullyFlexible ? 'bg-teal-100' : 'bg-cream-100'
            }`}
          >
            <IconSparkles size={24} stroke={1.5} className={fullyFlexible ? 'text-teal-600' : 'text-slate-500'} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-charcoal-500">{t('imFullyFlexible')}</p>
            <p className="text-sm text-slate-500">{t('anyTimeWorksForMe')}</p>
          </div>
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
              fullyFlexible ? 'bg-teal-500 border-teal-500' : 'border-cream-400'
            }`}
          >
            {fullyFlexible && <IconCheck size={16} stroke={3} className="text-white" />}
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-cream-300" />
          <span className="text-xs text-slate-400 uppercase tracking-wide">{t('orSelectTimes')}</span>
          <div className="flex-1 h-px bg-cream-300" />
        </div>

        {/* Time slot grid */}
        <div className="bg-white rounded-2xl border border-cream-400 p-4">
          {/* Day headers */}
          <div className="grid grid-cols-6 gap-2 mb-3">
            <div /> {/* Empty cell for time labels */}
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-600">
                {DAY_LABELS[day]}
              </div>
            ))}
          </div>

          {/* Time rows */}
          {TIME_RANGES.map((timeRange) => (
            <div key={timeRange} className="grid grid-cols-6 gap-2 mb-2">
              {/* Time label */}
              <div className="flex items-center gap-1">
                {timeRange === 'morning' && <IconSun size={14} stroke={2} className="text-amber-500" />}
                {timeRange === 'afternoon' && <IconSun size={14} stroke={2} className="text-orange-500" />}
                {timeRange === 'evening' && <IconMoon size={14} stroke={2} className="text-indigo-500" />}
                <span className="text-xs text-slate-500">{TIME_RANGE_LABELS[timeRange]}</span>
              </div>

              {/* Day cells */}
              {DAYS.map((day) => {
                const key = slotKey(day, timeRange)
                const isSelected = selectedSlots.has(key)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSlot(day, timeRange)}
                    disabled={fullyFlexible}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#3AAAB6] text-white'
                        : fullyFlexible
                          ? 'bg-cream-100 cursor-not-allowed'
                          : 'bg-cream-100 hover:bg-cream-200'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`${DAY_LABELS[day]} ${TIME_RANGE_LABELS[timeRange]}`}
                  >
                    {isSelected && <IconCheck size={18} stroke={2.5} />}
                  </button>
                )
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-cream-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-teal-500" />
              <span className="text-xs text-slate-500">{t('selected')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cream-100 border border-cream-300" />
              <span className="text-xs text-slate-500">{t('available')}</span>
            </div>
          </div>
        </div>

        {/* Selection summary */}
        {canContinue && (
          <div className="bg-[#E8F4F6] rounded-2xl p-4 border border-[#B8E0E6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#3AAAB6] border border-[#D4EBEF]">
                <IconCalendar size={20} stroke={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{selectionSummary.primary}</p>
                {selectionSummary.secondary && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{selectionSummary.secondary}</p>
                )}
              </div>
              <span className="px-3 py-1.5 rounded-full bg-white border border-[#3AAAB6] text-xs font-semibold text-[#3AAAB6] whitespace-nowrap">
                {selectionSummary.count} {t('slots')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <StickyActionBar>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          variant="primary"
          fullWidth
          size="lg"
          rightIcon={<IconArrowRight size={20} stroke={2} />}
        >
          {t('continueBtn')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}
