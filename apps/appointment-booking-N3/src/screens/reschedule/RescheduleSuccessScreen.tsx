import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Page, Avatar, Rating } from '../../components'
import { getDoctorById } from '../../data'
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
  const doctor = appointment ? getDoctorById(appointment.doctorId) : undefined

  const appointmentLabel = (() => {
    if (!appointment) return 'Tomorrow, 10:00 AM'
    const today = new Date()
    const date = new Date(appointment.dateISO)
    const diffDays = Math.ceil((date.getTime() - new Date(today.toDateString()).getTime()) / (1000 * 60 * 60 * 24))
    const dayLabel = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' })
    return `${dayLabel}, ${appointment.time}`
  })()

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

  const handleGetDirection = () => {
    const address = 'Marktplatz 5, 10178 Berlin'
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-8 pb-48">
          {/* Success Header */}
          <div className="flex flex-col items-center justify-center text-center">
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
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 text-left">
            <p className="text-sm text-slate-700">
              An updated confirmation has been sent via email and push notification.
            </p>
          </div>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white border border-cream-400 rounded-2xl p-4 mt-6 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar name={appointment?.doctorName || 'Dr. Sarah Weber'} imageUrl={doctor?.imageUrl} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-charcoal-500">{appointment?.doctorName || 'Dr. Sarah Weber'}</p>
              <p className="text-xs text-slate-500">
                {appointment?.specialty || 'Cardiology'} • {doctor?.city || 'Charité Berlin'}
              </p>
              {doctor && (
                <div className="mt-1">
                  <Rating value={doctor.rating} reviewCount={doctor.reviewCount} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-cream-200 pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-teal-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Date &amp; Time</p>
                <p className="text-sm font-semibold text-charcoal-500">{appointmentLabel}</p>
                <p className="text-xs text-slate-500 mt-1">30 min consultation</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold text-charcoal-500">{doctor?.city || 'Charité Campus Mitte'}</p>
                <p className="text-xs text-slate-500 mt-1">{doctor?.address || 'Charitéplatz 1, 10117 Berlin'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-cream-200">
            <p className="text-sm text-slate-500">Confirmation Number</p>
            <p className="font-mono font-semibold text-charcoal-500">{confirmationNumber}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleAddToCalendar}
            className="btn btn-secondary btn-block h-12 w-full rounded-2xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Update Calendar
          </button>

          <button
            onClick={handleGetDirection}
            className="btn btn-secondary btn-block h-12 w-full rounded-2xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Direction
          </button>
        </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-6 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <button onClick={() => navigate(PATHS.HISTORY)} className="btn btn-primary btn-block text-center">
            View appointments
          </button>
          <button onClick={() => navigate(PATHS.HOME)} className="btn btn-tertiary btn-block text-center">
            Back to Home
          </button>
        </div>
      </div>
    </Page>
  )
}
