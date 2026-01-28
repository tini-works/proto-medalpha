import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page, Avatar, Pill } from '../../components'
import { useBooking } from '../../state'
import { formatDateLong, formatTime } from '../../utils/format'
import { PATHS } from '../../routes'
import type { Appointment } from '../../types'

/**
 * Detailed view of a single appointment with actions
 * Accessible from HomeScreen's Today's Focus card or History screen
 */
export default function AppointmentDetailScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { appointments } = useBooking()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Find the appointment by ID
  const appointment = appointments.find((apt) => apt.id === id)

  if (!appointment) {
    return (
      <Page>
        <div className="flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-lg font-semibold text-charcoal-500">Appointment not found</h1>
          <button
            onClick={() => navigate(PATHS.HOME)}
            className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Back to Home
          </button>
        </div>
      </Page>
    )
  }

  const statusConfig: Record<
    Appointment['status'],
    { tone: 'positive' | 'neutral' | 'negative'; label: string }
  > = {
    matching: { tone: 'neutral', label: 'Matching' },
    await_confirm: { tone: 'neutral', label: 'Await confirm' },
    confirmed: { tone: 'positive', label: 'Confirmed' },
    completed: { tone: 'neutral', label: 'Completed' },
    cancelled_patient: { tone: 'negative', label: 'Patient canceled' },
    cancelled_doctor: { tone: 'negative', label: 'Doctor canceled' },
  }

  const status = statusConfig[appointment.status]

  const handleReschedule = () => {
    // Navigate to booking flow (could pre-fill with this doctor)
    navigate(PATHS.BOOKING_SEARCH)
  }

  const handleCancel = () => {
    // In a real app, this would call an API to cancel the appointment
    console.log('Cancel appointment:', appointment.id)
    setShowCancelConfirm(false)
  }

  const handleAddToCalendar = () => {
    // In a real app, this would trigger calendar integration
    console.log('Add to calendar:', appointment.id)
  }

  const handleGetDirections = () => {
    // In a real app, this would open maps with the practice location
    console.log('Get directions:', appointment.id)
  }

  return (
    <Page>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cream-400 bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-cream-200 transition-colors"
            aria-label="Go back"
          >
            <svg className="h-6 w-6 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-charcoal-500">Appointment Details</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="space-y-4 px-4 py-6">
        {/* Appointment Summary Card */}
        <div className="rounded-xl border border-cream-400 bg-white p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-charcoal-500">{formatTime(appointment.time)}</h2>
              </div>
              <p className="text-sm text-slate-500">{formatDateLong(appointment.dateISO)}</p>
            </div>
            <Pill tone={status.tone}>{status.label}</Pill>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="rounded-xl border border-cream-400 bg-white p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Doctor</h3>
          <div className="flex items-center gap-3">
            <Avatar name={appointment.doctorName} size="lg" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-charcoal-500">{appointment.doctorName}</h4>
              <p className="text-sm text-slate-500">{appointment.specialty}</p>
            </div>
          </div>
        </div>

        {/* Patient Information (if for family member) */}
        {appointment.forUserName && (
          <div className="rounded-xl border border-cream-400 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Patient</h3>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 flex-shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-charcoal-500">{appointment.forUserName}</span>
            </div>
          </div>
        )}

        {/* Location Information */}
        <div className="rounded-xl border border-cream-400 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h3>
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="font-medium text-charcoal-500">Praxis Weber</p>
              <p className="text-sm text-slate-500">Charlottenstraße 10</p>
              <p className="text-sm text-slate-500">10969 Berlin, Deutschland</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {appointment.status === 'confirmed' && (
          <div className="space-y-3 pt-2">
            {/* Get Directions Button */}
            <button
              onClick={handleGetDirections}
              className="w-full rounded-lg border border-cream-400 bg-cream-50 py-3 font-medium text-teal-600 transition-colors hover:bg-cream-100 active:scale-95"
            >
              <svg className="mb-2 inline-block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6.447 3.268A1 1 0 0021 20.382V9.618a1 1 0 00-1.553-.894L15 11m0 13V11m0 0l-6 3.618" />
              </svg>
              <div>Get Directions</div>
            </button>

            {/* Add to Calendar Button */}
            <button
              onClick={handleAddToCalendar}
              className="w-full rounded-lg border border-cream-400 bg-cream-50 py-3 font-medium text-teal-600 transition-colors hover:bg-cream-100 active:scale-95"
            >
              <svg className="mb-2 inline-block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>Add to Calendar</div>
            </button>

            {/* Reschedule Button */}
            <button
              onClick={handleReschedule}
              className="w-full rounded-lg border border-cream-400 bg-white py-3 font-medium text-slate-500 transition-colors hover:bg-cream-50 active:scale-95"
            >
              Reschedule
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full rounded-lg border border-red-200 bg-red-50 py-3 font-medium text-red-600 transition-colors hover:bg-red-100 active:scale-95"
            >
              Cancel Appointment
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div className="w-full rounded-t-2xl border-t border-cream-400 bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-charcoal-500">Cancel Appointment?</h3>
            <p className="mb-6 text-sm text-slate-500">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-lg border border-cream-400 bg-white py-3 font-medium text-slate-500 transition-colors hover:bg-cream-50 active:scale-95"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700 active:scale-95"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}
