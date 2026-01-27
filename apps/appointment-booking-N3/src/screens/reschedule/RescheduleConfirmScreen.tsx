import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Page, Header } from '../../components'
import { useReschedule, useBooking } from '../../state'
import { apiRescheduleAppointment } from '../../data/api'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { rescheduleSuccessPath, reschedulePath, PATHS } from '../../routes/paths'

export default function RescheduleConfirmScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const origin = (location.state as any)?.origin as 'suggestions' | 'calendar' | undefined

  const { rescheduleContext, setRescheduleContext } = useReschedule()
  const { cancelAppointment, addAppointment } = useBooking()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Validate context
  if (!rescheduleContext || !rescheduleContext.selectedNewSlot) {
    return (
      <Page>
        <Header title="Confirm Reschedule" showBack />
        <div className="px-4 py-8 text-center">
          <p className="text-slate-500">No slot selected</p>
          <button
            onClick={() => navigate(id ? reschedulePath(id) : PATHS.HISTORY)}
            className="mt-4 text-teal-700 font-medium hover:underline"
          >
            Back to slot selection
          </button>
        </div>
      </Page>
    )
  }

  const { originalAppointment, selectedNewSlot } = rescheduleContext

  const handleConfirm = async () => {
    if (!isOnline) return
    setIsSubmitting(true)
    setError(null)

    try {
      // Call API to reschedule
      const result = await apiRescheduleAppointment(originalAppointment.id, {
        dateISO: selectedNewSlot.dateISO,
        time: selectedNewSlot.time,
      })

      if (result.success) {
        // Create new appointment with new details
        const newAppointment = {
          ...originalAppointment,
          id: `apt_${Date.now()}`,
          dateISO: selectedNewSlot.dateISO,
          time: selectedNewSlot.time,
        }

        // Safety rule: book new before canceling old (simulated locally)
        addAppointment(newAppointment)
        cancelAppointment(originalAppointment.id)

        // Update context with confirmation number
        setRescheduleContext({
          ...rescheduleContext,
          confirmationNumber: result.confirmationNumber,
        } as any)

        // Navigate to success
        navigate(rescheduleSuccessPath(originalAppointment.id), {
          state: {
            confirmationNumber: result.confirmationNumber,
            newAppointment,
          },
        })
      }
    } catch (err) {
      setError('This time slot is no longer available. Please select another time.')
      // Return to origin selection screen (best-effort)
      if (origin === 'calendar' && id) {
        navigate(reschedulePath(id))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(reschedulePath(originalAppointment.id))
  }

  return (
    <Page safeBottom={false}>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-charcoal-900/50 animate-fade-in" onClick={handleCancel} />
        <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] flex flex-col rounded-t-3xl bg-white overflow-hidden animate-slide-up">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-cream-400" />
          </div>

          <div className="flex items-center justify-between px-4 pb-4">
            <Header title="Confirm Reschedule" showBack onBack={handleCancel} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
            {/* Comparison View */}
            <div className="space-y-4">
              {/* Old Appointment */}
              <div className="bg-coral-50 border border-coral-600 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-coral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-coral-700 font-medium mb-1">Previous Appointment</p>
                    <p className="font-semibold text-charcoal-500">
                      {formatDateWithWeekday(originalAppointment.dateISO)} at {formatTime(originalAppointment.time)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Will be cancelled</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* New Appointment */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-teal-600 font-medium mb-1">New Appointment</p>
                    <p className="font-semibold text-charcoal-500">
                      {formatDateWithWeekday(selectedNewSlot.dateISO)} at {formatTime(selectedNewSlot.time)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Will be booked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-200">
              <div className="p-4">
                <p className="text-sm text-slate-500 mb-1">Doctor</p>
                <p className="font-medium text-charcoal-500">{originalAppointment.doctorName}</p>
                <p className="text-sm text-slate-600">{originalAppointment.specialty}</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-500 mb-1">Location</p>
                <p className="font-medium text-charcoal-500">Marktplatz 5, 10178 Berlin</p>
              </div>
              {originalAppointment.forUserName && (
                <div className="p-4">
                  <p className="text-sm text-slate-500 mb-1">Patient</p>
                  <p className="font-medium text-charcoal-500">{originalAppointment.forUserName}</p>
                </div>
              )}
            </div>

            {/* Safety Note */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-slate-700">
                  Your previous appointment will only be cancelled after the new appointment is confirmed.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-coral-50 border border-coral-600 rounded-xl p-4">
                <p className="text-sm text-coral-800">{error}</p>
              </div>
            )}
          </div>

          {/* Sticky bottom actions */}
          <div className="border-t border-cream-300 bg-white px-4 py-4 safe-area-bottom">
            <div className="mx-auto max-w-md flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting || !isOnline}
                className="btn btn-primary btn-block h-12 py-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  isOnline ? 'Reschedule Appointment' : 'Offline'
                )}
              </button>

              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="btn btn-tertiary btn-block h-12 py-0 disabled:opacity-50"
              >
                Keep Current Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
