import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Page, Header, Avatar } from '../../components'
import { Pill } from '../../components/display/Pill'
import { useBooking, useHistory, useReschedule } from '../../state'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { PATHS } from '../../routes/paths'

// Status configuration
const statusConfig = {
  matching: { tone: 'neutral' as const, label: 'Matching' },
  await_confirm: { tone: 'neutral' as const, label: 'Await confirm' },
  confirmed: { tone: 'positive' as const, label: 'Confirmed' },
  completed: { tone: 'neutral' as const, label: 'Completed' },
  cancelled_patient: { tone: 'negative' as const, label: 'Patient canceled' },
  cancelled_doctor: { tone: 'negative' as const, label: 'Doctor canceled' },
} as const

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
  const isUpcoming = Boolean(
    appointment &&
      (appointment.status === 'matching' ||
        appointment.status === 'await_confirm' ||
        appointment.status === 'confirmed') &&
      appointment.dateISO >= today
  )
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
        status:
          historyItem.status === 'completed'
            ? 'completed'
            : historyItem.status === 'cancelled'
              ? 'cancelled_patient'
              : 'confirmed',
        forUserName: historyItem.forUserName,
        address: 'Marktplatz 5, 10178 Berlin', // Mock address
      }
    : null

  if (!displayData) {
    return (
      <Page>
        <Header title="Appointment Details" showBack />
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

  const config = statusConfig[displayData.status as keyof typeof statusConfig]

  const handleReschedule = () => {
    if (appointment) {
      setRescheduleContext({
        originalAppointment: appointment,
        suggestedSlots: [],
        selectedNewSlot: null,
      })
      navigate(`/reschedule/${appointment.id}/reason`)
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
        <div className="bg-white rounded-xl border border-cream-400 p-4">
          <div className="flex items-center gap-4">
            <Avatar name={displayData.doctorName} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-charcoal-500 truncate">
                {displayData.doctorName}
              </h2>
              <p className="text-slate-600">{displayData.specialty}</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-200">
          {/* Date & Time */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-charcoal-500">
                {formatDateWithWeekday(displayData.dateISO)}
              </p>
              <p className="text-sm text-slate-600">{formatTime(displayData.time)}</p>
            </div>
          </div>

          {/* Location */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-500">Location</p>
              <p className="text-sm text-slate-600">{displayData.address}</p>
            </div>
            <button
              onClick={handleOpenRoute}
              className="px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-normal ease-out-brand"
            >
              Open Route
            </button>
          </div>

          {/* Patient */}
          {displayData.forUserName && (
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-charcoal-500">Patient</p>
                <p className="text-sm text-slate-600">{displayData.forUserName}</p>
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
                className="btn btn-primary btn-block h-12 py-0"
              >
                Reschedule Appointment
              </button>
              <button
                onClick={() => setShowCancelDialog(true)}
                className="w-full py-3.5 px-4 border border-red-300 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
              >
                Cancel Appointment
              </button>
            </>
          )}

          {isPast && (
            <button
              onClick={handleBookAgain}
              className="btn btn-primary btn-block h-12 py-0"
            >
              Book Again
            </button>
          )}

          <button
            onClick={handleOpenRoute}
            className="btn btn-secondary btn-block h-12 py-0 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Bottom Sheet */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
            onClick={() => setShowCancelDialog(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden animate-slide-up safe-area-bottom">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-cream-400" />
            </div>

            <div className="px-4 pb-6">
              <h3 className="text-lg font-semibold text-charcoal-500 mb-2">
                Cancel Appointment?
              </h3>
              <p className="text-slate-600 mb-4">
                Are you sure you want to cancel your appointment with {displayData.doctorName} on {formatDateWithWeekday(displayData.dateISO)}?
              </p>

              <div className="bg-cream-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-slate-600">
                  <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the appointment.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="w-full py-3.5 px-4 border border-red-300 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center"
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
                <button
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isCancelling}
                  className="btn btn-secondary w-full h-12 py-0 disabled:opacity-50"
                >
                  Keep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}
