import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Page, Header, Avatar } from '../../components'
import { Pill } from '../../components/display/Pill'
import { useBooking, useHistory, useReschedule } from '../../state'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { PATHS, reschedulePath } from '../../routes/paths'

// Status configuration
const statusConfig: Record<
  'confirmed' | 'completed' | 'cancelled',
  { tone: 'positive' | 'neutral' | 'negative'; label: string }
> = {
  confirmed: { tone: 'positive', label: 'Confirmed' },
  completed: { tone: 'neutral', label: 'Completed' },
  cancelled: { tone: 'negative', label: 'Cancelled' },
}

export default function AppointmentDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { appointments, cancelAppointment } = useBooking()
  const { items: historyItems, updateHistoryItem } = useHistory()
  const { setRescheduleContext } = useReschedule()

  const [showCancelDialog, setShowCancelDialog] = useState(
    searchParams.get('action') === 'cancel'
  )
  const [isCancelling, setIsCancelling] = useState(false)

  // Find the appointment in either appointments or history
  const appointment = appointments.find((apt) => apt.id === id)
  const historyItem = historyItems.find((item) => item.id === id)

  // Determine if this is an upcoming or past appointment
  const today = new Date().toISOString().split('T')[0]
  const isUpcoming = appointment?.status === 'confirmed' && appointment.dateISO >= today
  const isPast = !isUpcoming

  // Get display data
  const displayData = appointment
    ? {
        doctorName: appointment.doctorName,
        specialty: appointment.specialty,
        dateISO: appointment.dateISO,
        time: appointment.time,
        status: appointment.status,
        forUserName: appointment.forUserName,
        address: 'Marktplatz 5, 10178 Berlin', // Mock address
      }
    : historyItem
    ? {
        doctorName: historyItem.title,
        specialty: historyItem.subtitle || '',
        dateISO: historyItem.dateISO,
        time: '10:00', // Default time for history items
        status: historyItem.status === 'completed' ? 'completed' : historyItem.status === 'cancelled' ? 'cancelled' : 'confirmed',
        forUserName: historyItem.forUserName,
        address: 'Marktplatz 5, 10178 Berlin', // Mock address
      }
    : null

  if (!displayData) {
    return (
      <Page>
        <Header title="Appointment Details" showBack />
        <div className="px-4 py-8 text-center">
          <p className="text-neutral-500">Appointment not found</p>
          <button
            onClick={() => navigate(PATHS.HISTORY)}
            className="mt-4 text-teal-600 font-medium"
          >
            Back to appointments
          </button>
        </div>
      </Page>
    )
  }

  const config = statusConfig[displayData.status as keyof typeof statusConfig]

  const handleReschedule = () => {
    if (appointment) {
      setRescheduleContext({
        originalAppointment: appointment,
        suggestedSlots: [],
        selectedNewSlot: null,
      })
      navigate(reschedulePath(appointment.id))
    }
  }

  const handleCancel = async () => {
    if (!appointment) return

    setIsCancelling(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Cancel the appointment
    cancelAppointment(appointment.id)

    // Update history item if exists
    if (historyItem) {
      updateHistoryItem(historyItem.id, { status: 'cancelled' })
    }

    setIsCancelling(false)
    setShowCancelDialog(false)

    // Navigate back to history
    navigate(PATHS.HISTORY)
  }

  const handleBookAgain = () => {
    navigate(`/book-again/${id}`)
  }

  const handleOpenRoute = () => {
    // Open maps with the address
    const encodedAddress = encodeURIComponent(displayData.address)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  return (
    <Page>
      <Header title="Appointment Details" showBack />

      <div className="px-4 py-4 space-y-6">
        {/* Status Badge */}
        <div className="flex justify-end">
          <Pill tone={config.tone}>{config.label}</Pill>
        </div>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-4">
            <Avatar name={displayData.doctorName} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-neutral-900 truncate">
                {displayData.doctorName}
              </h2>
              <p className="text-neutral-600">{displayData.specialty}</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
          {/* Date & Time */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {formatDateWithWeekday(displayData.dateISO)}
              </p>
              <p className="text-sm text-neutral-600">{formatTime(displayData.time)}</p>
            </div>
          </div>

          {/* Location */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Location</p>
              <p className="text-sm text-neutral-600">{displayData.address}</p>
            </div>
            <button
              onClick={handleOpenRoute}
              className="px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Open Route
            </button>
          </div>

          {/* Patient */}
          {displayData.forUserName && (
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Patient</p>
                <p className="text-sm text-neutral-600">{displayData.forUserName}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isUpcoming && (
            <>
              <button
                onClick={handleReschedule}
                className="w-full h-12 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 active:scale-[0.98] transition-all"
              >
                Reschedule Appointment
              </button>
              <button
                onClick={() => setShowCancelDialog(true)}
                className="w-full h-12 border border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                Cancel Appointment
              </button>
            </>
          )}

          {isPast && displayData.status !== 'cancelled' && (
            <button
              onClick={handleBookAgain}
              className="w-full h-12 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 active:scale-[0.98] transition-all"
            >
              Book Again
            </button>
          )}

          <button
            onClick={handleOpenRoute}
            className="w-full h-12 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCancelDialog(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md mx-4 mb-0 sm:mb-4 p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Cancel Appointment?
            </h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to cancel your appointment with {displayData.doctorName} on {formatDateWithWeekday(displayData.dateISO)}?
            </p>

            <div className="bg-neutral-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-neutral-600">
                <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the appointment.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
                className="flex-1 h-12 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Keep
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-1 h-12 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isCancelling ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Cancel Appointment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}
