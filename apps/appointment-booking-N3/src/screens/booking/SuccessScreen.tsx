import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Calendar, MapPin } from 'tabler-icons-react'
import { Page, Avatar, Rating } from '../../components'
import { getDoctorById } from '../../data'
import { PATHS } from '../../routes'
import type { Appointment } from '../../types'

export default function SuccessScreen() {
  const { t } = useTranslation('booking')
  const location = useLocation()
  const state = location.state as { confirmationNumber?: string; appointment?: Appointment } | undefined
  const confirmationNumber = state?.confirmationNumber || `BK-${Date.now().toString(36).toUpperCase()}`
  const appointment = state?.appointment
  const doctor = appointment ? getDoctorById(appointment.doctorId) : undefined

  const appointmentLabel = (() => {
    if (!appointment) return `${t('tomorrow')}, 10:00 AM`
    const today = new Date()
    const dateISO = appointment.dateISO
    const date = new Date(dateISO)
    const diffDays = Math.ceil((date.getTime() - new Date(today.toDateString()).getTime()) / (1000 * 60 * 60 * 24))
    const dayLabel = diffDays === 0 ? t('today') : diffDays === 1 ? t('tomorrow') : date.toLocaleDateString('en-US', { weekday: 'long' })
    return `${dayLabel}, ${appointment.time}`
  })()

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

  const handleGetDirections = () => {
    if (!doctor) return
    const query = encodeURIComponent(`${doctor.address}, ${doctor.city}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col px-6 py-10 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <Check size="32" stroke="3" className="text-white" />
        </div>

        <h1 className="text-xl font-semibold text-charcoal-500">{t('appointmentConfirmed')}</h1>
        <p className="text-xs text-slate-500 mt-2">
          {t('bookingIdSent', { id: confirmationNumber })}
        </p>

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
                <Calendar size="20" stroke="2" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t('dateTime')}</p>
                <p className="text-sm font-semibold text-charcoal-500">{appointmentLabel}</p>
                <p className="text-xs text-slate-500 mt-1">{t('consultation30Min')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <MapPin size="20" stroke="2" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t('appointmentLocation')}</p>
                <p className="text-sm font-semibold text-charcoal-500">{doctor?.city || 'Charité Campus Mitte'}</p>
                <p className="text-xs text-slate-500 mt-1">{doctor?.address || 'Charitéplatz 1, 10117 Berlin'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleAddToCalendar}
            disabled={!appointment}
            className="btn h-12 w-full rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 border border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <Calendar size="20" stroke="2" />
            {t('addToCalendar')}
          </button>
          <button
            onClick={handleGetDirections}
            disabled={!doctor}
            className="btn h-12 w-full rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 border border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <MapPin size="20" stroke="2" />
            {t('getDirections')}
          </button>
        </div>

        <div className="h-24" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-6 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <Link to={PATHS.HISTORY} className="btn btn-primary btn-block text-center block">
            {t('viewAppointments')}
          </Link>
          <Link to={PATHS.HOME} className="btn btn-tertiary btn-block text-center block">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </Page>
  )
}
