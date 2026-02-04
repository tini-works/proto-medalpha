import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, StickyActionBar } from '../../components'
import { Button } from '../../components/ui'
import { useBooking, useProfile, useReschedule, usePreferences } from '../../state'
import { apiGetAvailableDates, apiGetDoctor, apiGetSlotsForDate } from '../../data'
import { PATHS, rescheduleConfirmPath, reschedulePath, doctorSlotsPath } from '../../routes'
import { getLocale } from '../../utils'
import type { TimeSlot } from '../../types'

export default function SlotSelectionScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation('booking')
  const { selectedDoctor, selectDoctor, selectSlot } = useBooking()
  const { setRescheduleNewSlot } = useReschedule()
  const { language } = usePreferences()
  const locale = getLocale(language)

  const rescheduleId = searchParams.get('reschedule')
  const bookAgainId = searchParams.get('bookAgain')

  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlotValue, setSelectedSlotValue] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      if (rescheduleId) {
        navigate(reschedulePath(rescheduleId))
        return
      }
      if (bookAgainId) {
        navigate(PATHS.BOOK_AGAIN.replace(':id', bookAgainId))
        return
      }
      navigate(PATHS.BOOKING_SEARCH)
      return
    }

    const ensureDoctor = async () => {
      if (selectedDoctor?.id === id) return selectedDoctor
      const d = await apiGetDoctor(id)
      selectDoctor(d)
      return d
    }

    setLoading(true)
    ensureDoctor()
      .then(() => apiGetAvailableDates(id))
      .then((dates) => {
        setAvailableDates(dates)
        if (dates.length > 0) {
          setSelectedDate(dates[0])
        }
      })
      .catch(() => {
        setError(t('errors.loadSlotsFailed'))
        setTimeout(() => {
          if (rescheduleId) {
            navigate(reschedulePath(rescheduleId))
            return
          }
          navigate(PATHS.BOOKING_RESULTS)
        }, 2000)
      })
      .finally(() => setLoading(false))
  }, [id, selectedDoctor?.id, selectDoctor, navigate, rescheduleId, bookAgainId])

  useEffect(() => {
    if (id && selectedDate) {
      apiGetSlotsForDate(id, selectedDate).then(setSlots)
    }
  }, [id, selectedDate])

  const handleSelectSlot = (slot: TimeSlot) => {
    if (!slot.available) return
    setSelectedSlotValue(slot)
  }

  const handleContinue = () => {
    if (!selectedSlotValue) return

    if (rescheduleId) {
      // If coming from reschedule flow, redirect to reschedule confirm and preserve origin context.
      setRescheduleNewSlot(selectedSlotValue)
      navigate(rescheduleConfirmPath(rescheduleId), { state: { origin: 'calendar' } })
      return
    }

    selectSlot(selectedSlotValue)
    navigate(PATHS.BOOKING_CONFIRM, {
      state: { from: doctorSlotsPath(id || '') },
    })
  }

  if (loading) {
    return (
      <Page safeBottom={false}>
        <Header title={t('selectTime')} showBack />
        <div className="p-4">
          <div className="h-48 bg-cream-200 rounded-lg animate-pulse" />
        </div>
      </Page>
    )
  }

  if (error) {
    return (
      <Page safeBottom={false}>
        <Header title={t('selectTime')} showBack />
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header
        title={t('selectTime')}
        subtitle={selectedDoctor?.name}
        showBack
        onBack={() => {
          if (rescheduleId) {
            navigate(reschedulePath(rescheduleId))
            return
          }
          if (bookAgainId) {
            navigate(PATHS.BOOK_AGAIN.replace(':id', bookAgainId))
            return
          }
          navigate(-1)
        }}
      />

      <div className="px-4 py-6 space-y-6 pb-28">
        {/* Date selection */}
        <section>
          <h2 className="text-sm font-medium text-slate-700 mb-3">{t('selectDate')}</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {availableDates.slice(0, 7).map((date) => {
              const d = new Date(date)
              const isSelected = date === selectedDate
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-16 py-3 rounded-lg text-center transition-colors duration-normal ease-out-brand ${
                    isSelected
                      ? 'bg-teal-500 text-white'
                      : 'bg-white border border-cream-400 text-charcoal-500 hover:border-cream-500'
                  }`}
                >
                  <div className="text-xs opacity-80">
                    {d.toLocaleDateString(locale, { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold">{d.getDate()}</div>
                  <div className="text-xs opacity-80">
                    {d.toLocaleDateString(locale, { month: 'short' })}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Time slots */}
        <section>
          <h2 className="text-sm font-medium text-slate-700 mb-3">{t('availableTimes')}</h2>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlotValue?.time === slot.time && selectedSlotValue?.dateISO === slot.dateISO
              return (
                <button
                  key={`${slot.dateISO}-${slot.time}`}
                  onClick={() => handleSelectSlot(slot)}
                  disabled={!slot.available}
                  className={`py-3 rounded-lg font-medium transition-colors duration-normal ease-out-brand ${
                    !slot.available
                      ? 'bg-cream-200 text-slate-400 cursor-not-allowed'
                      : isSelected
                        ? 'bg-teal-500 text-white'
                        : 'bg-white border border-cream-400 text-charcoal-500 hover:border-cream-500'
                  }`}
                >
                  {slot.time}
                </button>
              )
            })}
          </div>
        </section>

      </div>

      {/* Sticky bottom continue */}
      <StickyActionBar>
        <Button
          onClick={handleContinue}
          disabled={!selectedSlotValue}
          variant="primary"
          fullWidth
          size="lg"
        >
          {t('continueBtn')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}
