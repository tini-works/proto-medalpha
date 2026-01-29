import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IconCheck, IconCalendar, IconMapPin } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Page, Avatar, Rating } from '../../components'
import { Button } from '../../components/ui'
import { getDoctorById } from '../../data'
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
  const { t, i18n } = useTranslation(['appointments', 'booking'])

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
    if (!appointment) return t('reschedule.success.fallbackAppointmentLabel', { ns: 'appointments' })
    const today = new Date()
    const date = new Date(appointment.dateISO)
    const diffDays = Math.ceil((date.getTime() - new Date(today.toDateString()).getTime()) / (1000 * 60 * 60 * 24))
    const dayLabel =
      diffDays === 0
        ? t('today', { ns: 'booking' })
        : diffDays === 1
          ? t('tomorrow', { ns: 'booking' })
          : date.toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'en-US', { weekday: 'long' })
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
SUMMARY:${t('reschedule.calendar.summary', { ns: 'appointments', doctorName: appointment.doctorName, specialty: appointment.specialty })}
LOCATION:Marktplatz 5, 10178 Berlin
DESCRIPTION:${t('reschedule.calendar.confirmation', { ns: 'appointments', confirmationNumber })}
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
            <IconCheck
              className={`w-10 h-10 text-teal-600 transition-all duration-300 delay-150 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              stroke={3}
            />
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {t('reschedule.success.title', { ns: 'appointments' })}
          </h1>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 text-left">
            <p className="text-sm text-slate-700">
              {t('reschedule.success.subtitle', { ns: 'appointments' })}
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
                <IconCalendar className="w-5 h-5" stroke={2} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t('dateTime', { ns: 'booking' })}</p>
                <p className="text-sm font-semibold text-charcoal-500">{appointmentLabel}</p>
                <p className="text-xs text-slate-500 mt-1">{t('consultation30Min', { ns: 'booking' })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <IconMapPin className="w-5 h-5" stroke={2} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t('appointmentLocation', { ns: 'booking' })}</p>
                <p className="text-sm font-semibold text-charcoal-500">{doctor?.city || 'Charité Campus Mitte'}</p>
                <p className="text-xs text-slate-500 mt-1">{doctor?.address || 'Charitéplatz 1, 10117 Berlin'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-cream-200">
            <p className="text-sm text-slate-500">{t('reschedule.success.confirmationNumber', { ns: 'appointments' })}</p>
            <p className="font-mono font-semibold text-charcoal-500">{confirmationNumber}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleAddToCalendar}
            variant="secondary"
            size="md"
            fullWidth
          >
            <IconCalendar className="w-5 h-5 mr-2" stroke={2} />
            {t('addToCalendar', { ns: 'booking' })}
          </Button>

          <Button
            onClick={handleGetDirection}
            variant="secondary"
            size="md"
            fullWidth
          >
            <IconMapPin className="w-5 h-5 mr-2" stroke={2} />
            {t('getDirections', { ns: 'booking' })}
          </Button>
        </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-6 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <Button onClick={() => navigate(PATHS.HISTORY)} variant="primary" size="lg" fullWidth>
            {t('viewAppointments', { ns: 'booking' })}
          </Button>
          <Button onClick={() => navigate(PATHS.HOME)} variant="tertiary" size="md" fullWidth>
            {t('backToHome', { ns: 'booking' })}
          </Button>
        </div>
      </div>
    </Page>
  )
}
