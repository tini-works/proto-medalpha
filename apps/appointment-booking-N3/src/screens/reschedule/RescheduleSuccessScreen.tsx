import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Page } from '../../components'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { PATHS } from '../../routes/paths'
import type { Appointment } from '../../types'

interface LocationState {
  confirmationNumber?: string
  newAppointment?: Appointment
}

export default function RescheduleSuccessScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | undefined

  const [showCheckmark, setShowCheckmark] = useState(false)

  useEffect(() => {
    // Trigger checkmark animation
    const timer = setTimeout(() => setShowCheckmark(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const confirmationNumber = state?.confirmationNumber || `RSCH-${Date.now().toString(36).toUpperCase()}`
  const appointment = state?.newAppointment

  const handleAddToCalendar = () => {
    if (!appointment) return

    // Create calendar event (simplified ICS approach)
    const startDate = new Date(`${appointment.dateISO}T${appointment.time}:00`)
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000) // 30 min appointment

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:Appointment: ${appointment.doctorName} (${appointment.specialty})
LOCATION:Marktplatz 5, 10178 Berlin
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

  const handleOpenRoute = () => {
    const address = 'Marktplatz 5, 10178 Berlin'
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  const handleDone = () => {
    navigate(PATHS.HISTORY)
  }

  return (
    <Page>
      <div className="min-h-screen flex flex-col">
        {/* Success Header */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {/* Animated Checkmark */}
          <div
            className={`w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-6 transition-all duration-300 ${
              showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <svg
              className={`w-10 h-10 text-teal-600 transition-all duration-300 delay-150 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Appointment Rescheduled
          </h1>
          <p className="text-slate-600 text-center max-w-xs">
            Your appointment has been successfully rescheduled.
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl border border-cream-400 p-4 mb-6">
            {appointment && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-slate-700">
                      {appointment.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-500">{appointment.doctorName}</h3>
                    <p className="text-sm text-slate-600">{appointment.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-charcoal-500">
                      {formatDateWithWeekday(appointment.dateISO)} at {formatTime(appointment.time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-charcoal-500">Marktplatz 5, 10178 Berlin</span>
                  </div>
                </div>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-cream-200">
              <p className="text-sm text-slate-500">Confirmation Number</p>
              <p className="font-mono font-semibold text-charcoal-500">{confirmationNumber}</p>
            </div>
          </div>

          {/* Notification Message */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-700">
              An updated confirmation has been sent via email and push notification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCalendar}
              className="btn btn-secondary btn-block h-12 py-0 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Update Calendar
            </button>

            <button
              onClick={handleOpenRoute}
              className="btn btn-secondary btn-block h-12 py-0 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Open Route
            </button>

            <button
              onClick={handleDone}
              className="btn btn-primary btn-block h-12 py-0"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Page>
  )
}
