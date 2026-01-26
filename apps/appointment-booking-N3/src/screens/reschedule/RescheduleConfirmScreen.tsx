import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page, Header } from '../../components'
import { useReschedule, useBooking } from '../../state'
import { apiRescheduleAppointment } from '../../data/api'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { rescheduleSuccessPath, reschedulePath, PATHS } from '../../routes/paths'

export default function RescheduleConfirmScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { rescheduleContext, setRescheduleContext } = useReschedule()
  const { cancelAppointment, addAppointment } = useBooking()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validate context
  if (!rescheduleContext || !rescheduleContext.selectedNewSlot) {
    return (
      <Page>
        <Header title="Confirm Reschedule" showBack />
        <div className="px-4 py-8 text-center">
          <p className="text-neutral-500">No slot selected</p>
          <button
            onClick={() => navigate(id ? reschedulePath(id) : PATHS.HISTORY)}
            className="mt-4 text-teal-600 font-medium"
          >
            Back to slot selection
          </button>
        </div>
      </Page>
    )
  }

  const { originalAppointment, selectedNewSlot } = rescheduleContext

  const handleConfirm = async () => {
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

        // Cancel old appointment
        cancelAppointment(originalAppointment.id)

        // Add new appointment
        addAppointment(newAppointment)

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(reschedulePath(originalAppointment.id))
  }

  return (
    <Page>
      <Header title="Confirm Reschedule" showBack />

      <div className="px-4 py-4 space-y-6">
        {/* Comparison View */}
        <div className="space-y-4">
          {/* Old Appointment */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium mb-1">Previous Appointment</p>
                <p className="font-semibold text-neutral-900">
                  {formatDateWithWeekday(originalAppointment.dateISO)} at {formatTime(originalAppointment.time)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">Will be cancelled</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <p className="font-semibold text-neutral-900">
                  {formatDateWithWeekday(selectedNewSlot.dateISO)} at {formatTime(selectedNewSlot.time)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">Will be booked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
          <div className="p-4">
            <p className="text-sm text-neutral-500 mb-1">Doctor</p>
            <p className="font-medium text-neutral-900">{originalAppointment.doctorName}</p>
            <p className="text-sm text-neutral-600">{originalAppointment.specialty}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-neutral-500 mb-1">Location</p>
            <p className="font-medium text-neutral-900">Marktplatz 5, 10178 Berlin</p>
          </div>
          {originalAppointment.forUserName && (
            <div className="p-4">
              <p className="text-sm text-neutral-500 mb-1">Patient</p>
              <p className="font-medium text-neutral-900">{originalAppointment.forUserName}</p>
            </div>
          )}
        </div>

        {/* Safety Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              Your previous appointment will only be cancelled after the new appointment is confirmed.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full h-12 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Reschedule Appointment'
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full h-12 text-neutral-600 font-medium hover:text-neutral-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Page>
  )
}
