import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCheck, IconCalendar, IconMapPin, IconBell } from '@tabler/icons-react'
import { Page, Avatar, Rating } from '../../../components'
import { getDoctorById } from '../../../data'
import { PATHS, appointmentDetailPath } from '../../../routes'
import type { Appointment } from '../../../types'

export default function FastLaneSuccessScreen() {
  const { t } = useTranslation('booking')
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { appointment?: Appointment } | undefined
  const appointment = state?.appointment
  const doctor = appointment ? getDoctorById(appointment.doctorId) : undefined

  const appointmentLabel = (() => {
    if (!appointment) return ''
    const today = new Date()
    const date = new Date(appointment.dateISO)
    const diffDays = Math.ceil(
      (date.getTime() - new Date(today.toDateString()).getTime()) / (1000 * 60 * 60 * 24)
    )
    const dayLabel =
      diffDays === 0
        ? t('today')
        : diffDays === 1
          ? t('tomorrow')
          : date.toLocaleDateString('en-US', { weekday: 'long' })
    return `${dayLabel}, ${appointment.time}`
  })()

  const handleAddToCalendar = () => {
    if (!appointment) return
    const startDate = new Date(`${appointment.dateISO}T${appointment.time}:00`)
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000)
    const formatICSDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:Appointment: ${appointment.doctorName} (${appointment.specialty})
LOCATION:${doctor?.address || ''}
DESCRIPTION:Fast-Lane Booking
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `appointment-${appointment.id}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSetReminder = () => {
    // Mock reminder set - in a real app this would integrate with device notifications
    alert(t('reminderSet'))
  }

  const handleViewDetails = () => {
    if (appointment) {
      navigate(appointmentDetailPath(appointment.id))
    }
  }

  if (!appointment) {
    return (
      <Page>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">{t('noAppointmentData')}</p>
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col px-6 py-10 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md animate-bounce-in">
          <IconCheck size={32} stroke={3} className="text-white" />
        </div>

        <h1 className="text-xl font-semibold text-charcoal-500">{t('appointmentConfirmed')}</h1>
        <p className="text-sm text-slate-500 mt-2">{t('fastLaneSuccessMessage')}</p>

        {/* Appointment card with doctor info */}
        <div className="bg-white border border-cream-400 rounded-2xl p-4 mt-6 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar name={appointment.doctorName} imageUrl={doctor?.imageUrl} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-charcoal-500">{appointment.doctorName}</p>
              <p className="text-xs text-slate-500">
                {appointment.specialty} • {doctor?.city}
              </p>
              {doctor && (
                <div className="mt-1">
                  <Rating value={doctor.rating} reviewCount={doctor.reviewCount} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-cream-200 pt-4 space-y-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-teal-700">
                <IconCalendar size={20} stroke={2} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{t('dateTime')}</p>
                <p className="text-sm font-semibold text-charcoal-500">{appointmentLabel}</p>
                <p className="text-xs text-slate-500 mt-1">{t('consultation30Min')}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <IconMapPin size={20} stroke={2} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                  {t('appointmentLocation')}
                </p>
                <p className="text-sm font-semibold text-charcoal-500">{doctor?.city}</p>
                <p className="text-xs text-slate-500 mt-1">{doctor?.address}</p>
              </div>
            </div>

            {/* Patient */}
            <div className="flex items-center gap-2 pt-2 border-t border-cream-200">
              <span className="text-xs text-slate-500">{t('for')}:</span>
              <span className="text-sm font-medium text-charcoal-500">{appointment.forUserName}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAddToCalendar}
            className="flex-1 btn h-12 rounded-xl flex items-center justify-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <IconCalendar size={18} stroke={2} />
            {t('addToCalendar')}
          </button>
          <button
            onClick={handleSetReminder}
            className="flex-1 btn h-12 rounded-xl flex items-center justify-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <IconBell size={18} stroke={2} />
            {t('setReminder')}
          </button>
        </div>

        <div className="h-24" />
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-6 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <button onClick={handleViewDetails} className="btn btn-primary btn-block">
            {t('viewAppointmentDetails')}
          </button>
          <Link to={PATHS.HOME} className="btn btn-tertiary btn-block text-center block">
            {t('backToHome')}
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </Page>
  )
}
