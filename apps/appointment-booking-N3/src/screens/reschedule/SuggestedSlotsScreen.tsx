import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page, Header, EmptyState } from '../../components'
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
        })
      } catch (error) {
        console.error('Failed to fetch suggested slots:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()
  }, [appointment, id])

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
    navigate(rescheduleConfirmPath(appointment.id))
  }

  const handleViewAllSlots = () => {
    // Navigate to the full calendar (reuse existing slot selection screen)
    navigate(doctorSlotsPath(appointment.doctorId) + `?reschedule=${appointment.id}`)
  }

  return (
    <Page>
      <Header title="Reschedule Appointment" showBack />

      <div className="px-4 py-4 space-y-6">
        {/* Current Appointment Summary */}
        <div className="bg-cream-200 rounded-xl p-4">
          <p className="text-sm text-slate-500 mb-1">Current Appointment</p>
          <p className="font-semibold text-charcoal-500">
            {formatDateWithWeekday(appointment.dateISO)} at {formatTime(appointment.time)}
          </p>
          <p className="text-slate-600">{appointment.doctorName}</p>
          <p className="text-sm text-slate-500">{appointment.specialty}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-cream-300" />

        {/* Suggested Slots */}
        <div>
          <h2 className="text-lg font-semibold text-charcoal-500 mb-4">
            Available Alternatives
          </h2>

          {isLoading ? (
            // Loading skeleton
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-cream-400 p-4 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-cream-300 rounded" />
                      <div className="h-4 w-20 bg-cream-200 rounded" />
                    </div>
                    <div className="h-10 w-24 bg-cream-300 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestedSlots.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No slots available"
              description="There are no alternative slots available at this time. Try viewing all available times."
            />
          ) : (
            <div className="space-y-3">
              {suggestedSlots.map((slot) => (
                <div
                  key={`${slot.dateISO}-${slot.time}`}
                  className="bg-white rounded-xl border border-cream-400 p-4 hover:border-cream-500 transition-colors duration-normal ease-out-brand"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal-500">
                        {formatDateWithWeekday(slot.dateISO)} at {formatTime(slot.time)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500">30 min</span>
                        {slot.reasonLabel && (
                          <>
                            <span className="text-cream-400">|</span>
                            <span className="text-sm text-teal-700 font-medium">
                              {slot.reasonLabel}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectSlot(slot)}
                      className="px-4 h-10 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 active:bg-teal-700 active:scale-[0.98] transition-colors duration-normal ease-out-brand flex-shrink-0"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Times Button */}
        <div className="pt-2">
          <div className="border-t border-cream-300 pt-6">
            <button
              onClick={handleViewAllSlots}
              className="btn btn-secondary btn-block h-12 py-0 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View All Available Times
            </button>
          </div>
        </div>
      </div>
    </Page>
  )
}
