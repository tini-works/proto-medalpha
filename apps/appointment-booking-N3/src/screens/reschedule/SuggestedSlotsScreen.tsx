import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page, Header, EmptyState, Avatar } from '../../components'
import { Button } from '../../components/ui'
import { useReschedule, useBooking } from '../../state'
import { apiGetSuggestedSlots } from '../../data/api'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { rescheduleConfirmPath, doctorSlotsPath, PATHS } from '../../routes/paths'
import type { SuggestedSlot } from '../../types'

export default function SuggestedSlotsScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { appointments } = useBooking()
  const { rescheduleContext, setRescheduleContext, setRescheduleNewSlot } = useReschedule()

  const [isLoading, setIsLoading] = useState(true)
  const [suggestedSlots, setSuggestedSlots] = useState<SuggestedSlot[]>([])

  // Find the appointment
  const appointment = appointments.find((apt) => apt.id === id)

  useEffect(() => {
    if (!appointment) return

    // Initialize reschedule context if not set
    if (!rescheduleContext || rescheduleContext.originalAppointment.id !== appointment.id) {
      setRescheduleContext({
        originalAppointment: appointment,
        suggestedSlots: [],
        selectedNewSlot: null,
      })
    }

    // Fetch suggested slots
    const fetchSlots = async () => {
      setIsLoading(true)
      try {
        const slots = await apiGetSuggestedSlots(appointment.doctorId, appointment)
        setSuggestedSlots(slots)
        // Update context with fetched slots
        setRescheduleContext({
          originalAppointment: appointment,
          suggestedSlots: slots,
          selectedNewSlot: null,
          reason: rescheduleContext?.reason,
        })
      } catch (error) {
        console.error('Failed to fetch suggested slots:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()
  }, [appointment, id, rescheduleContext?.reason])

  if (!appointment) {
    return (
      <Page>
        <Header title="Reschedule" showBack />
        <div className="px-4 py-8 text-center">
          <p className="text-slate-500">Appointment not found</p>
          <button
            onClick={() => navigate(PATHS.HISTORY)}
            className="mt-4 text-teal-700 font-medium hover:underline"
          >
            Back to appointments
          </button>
        </div>
      </Page>
    )
  }

  const handleSelectSlot = (slot: SuggestedSlot) => {
    setRescheduleNewSlot(slot)
    navigate(rescheduleConfirmPath(appointment.id), { state: { origin: 'suggestions' } })
  }

  const handleViewAllSlots = () => {
    // Navigate to the full calendar (reuse existing slot selection screen)
    navigate(doctorSlotsPath(appointment.doctorId) + `?reschedule=${appointment.id}`)
  }

  const formatSlotLabel = (slot: SuggestedSlot) => `${formatDateWithWeekday(slot.dateISO)} · ${formatTime(slot.time)}`

  const reasonMeta = (slot: SuggestedSlot) => {
    switch (slot.reason) {
      case 'same_time':
        return { tag: 'Recommended', note: 'Best match for your schedule', icon: 'star' }
      case 'similar_time':
        return { tag: '1 day earlier', note: 'Similar time of day', icon: 'calendar' }
      case 'soonest':
        return { tag: 'Next available', note: 'Morning slot', icon: 'clock' }
      case 'same_weekday':
        return { tag: 'Next week', note: 'Afternoon availability', icon: 'refresh' }
      default:
        return { tag: 'Option', note: 'Available time', icon: 'calendar' }
    }
  }

  return (
    <Page safeBottom={false}>
      <Header title="Suggested Alternatives" subtitle="We found these times based on your previous preference." showBack />

      <div className="px-4 py-4 space-y-6 pb-28">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-cream-400 p-4 animate-pulse">
                <div className="h-4 w-24 bg-cream-200 rounded mb-3" />
                <div className="h-6 w-48 bg-cream-300 rounded mb-2" />
                <div className="h-10 w-full bg-cream-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : suggestedSlots.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No slots available"
            description="There are no alternative slots available at this time."
          />
        ) : (
          <>
            {/* Recommended */}
            {suggestedSlots[0] && (
              <div className="bg-white rounded-2xl border border-cream-400 p-4 space-y-3 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.012 6.2h6.519c.969 0 1.371 1.24.588 1.81l-5.277 3.833 2.012 6.2c.3.921-.755 1.688-1.54 1.118L12 17.77l-5.277 3.833c-.784.57-1.838-.197-1.539-1.118l2.012-6.2-5.277-3.833c-.783-.57-.38-1.81.588-1.81h6.519l2.012-6.2z" />
                  </svg>
                  Recommended
                </div>
                <div>
                  <p className="text-lg font-semibold text-charcoal-500">{formatSlotLabel(suggestedSlots[0])}</p>
                  <p className="text-sm text-teal-700 font-medium">Best match for your schedule</p>
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wide flex items-center gap-2">
                  <span>Why this slot:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar name={appointment.doctorName} size="sm" />
                  <span className="text-sm text-slate-600">{appointment.doctorName}</span>
                </div>
                <Button
                  onClick={() => handleSelectSlot(suggestedSlots[0])}
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  Select Recommended Slot
                </Button>
              </div>
            )}

            {/* Other options */}
            {suggestedSlots.length > 1 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Other options</p>
                {suggestedSlots.slice(1).map((slot) => {
                  const meta = reasonMeta(slot)
                  return (
                    <div key={`${slot.dateISO}-${slot.time}`} className="bg-white rounded-2xl border border-cream-400 p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-teal-700">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-cream-100 text-[10px] font-semibold text-teal-700 border border-cream-300 mb-1">
                            {meta.tag}
                          </div>
                          <p className="text-sm font-semibold text-charcoal-500">{formatSlotLabel(slot)}</p>
                          <p className="text-xs text-slate-500">{meta.note}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectSlot(slot)}
                        className="px-3 h-9 rounded-lg border border-cream-300 text-sm text-charcoal-500 hover:bg-cream-50"
                      >
                        Select
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="text-center text-sm text-slate-500 pt-4">
              None of these work for you?
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <Button onClick={handleViewAllSlots} variant="secondary" size="lg" fullWidth>
            View all Availables
          </Button>
        </div>
      </div>
    </Page>
  )
}
