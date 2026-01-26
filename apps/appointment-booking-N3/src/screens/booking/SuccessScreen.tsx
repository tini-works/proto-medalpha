import { Link, useLocation } from 'react-router-dom'
import { Page } from '../../components'
import { PATHS } from '../../routes'
import type { Appointment } from '../../types'

export default function SuccessScreen() {
  const location = useLocation()
  const state = location.state as { confirmationNumber?: string; appointment?: Appointment } | undefined
  const confirmationNumber = state?.confirmationNumber || `BK-${Date.now().toString(36).toUpperCase()}`
  const appointment = state?.appointment

  const handleAddToCalendar = () => {
    if (!appointment) return
    const startDate = new Date(`${appointment.dateISO}T${appointment.time}:00`)
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000)
    const formatICSDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:Appointment: ${appointment.doctorName} (${appointment.specialty})
LOCATION:${appointment.doctorId}
DESCRIPTION:Confirmation: ${confirmationNumber}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `appointment-${confirmationNumber}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Success icon - neutral, not celebratory */}
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-charcoal-500 mb-2">Appointment Booked</h1>
        <p className="text-slate-600 mb-8 max-w-xs leading-relaxed">
          Your appointment has been successfully submitted. A confirmation will be sent via email.
        </p>

        <div className="bg-white border border-cream-400 rounded-xl px-4 py-3 mb-6 w-full max-w-sm">
          <p className="text-xs text-slate-500">Confirmation number</p>
          <p className="font-mono font-semibold text-charcoal-500">{confirmationNumber}</p>
        </div>

        {/* Calendar sync option */}
        <button
          onClick={handleAddToCalendar}
          disabled={!appointment}
          className="flex items-center justify-center gap-2 w-full max-w-sm px-4 py-3 border border-cream-400 rounded-lg text-charcoal-500 hover:bg-cream-50 transition-colors duration-normal ease-out-brand mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Add to Calendar
        </button>

        {/* Actions - conservative styling */}
        <div className="w-full space-y-3">
          <Link
            to={PATHS.HISTORY}
            className="btn btn-primary btn-block text-center"
          >
            View Appointments
          </Link>

          <Link
            to={PATHS.HOME}
            className="btn btn-secondary btn-block text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Page>
  )
}
