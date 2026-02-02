import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page, CancelAppointmentSheet, StickyActionBar } from '../../components'
import { useBooking } from '../../state'
import { formatDateWithWeekday, formatTime, translateSpecialty } from '../../utils'
import { PATHS } from '../../routes/paths'
import { MatchingStatusView } from '../../components/appointments/MatchingStatusView'

export default function AppointmentDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('detail')
  const { appointments, cancelAppointment } = useBooking()

  const appointment = appointments.find((apt) => apt.id === id)

  if (!appointment) {
    return (
      <Page>
        <BackHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <p className="text-slate-500">{t('notFound')}</p>
            <button
              onClick={() => navigate(PATHS.HISTORY)}
              className="mt-4 text-teal-700 font-medium hover:underline"
            >
              {t('backToAppointments')}
            </button>
          </div>
        </div>
      </Page>
    )
  }

  // Render based on status
  switch (appointment.status) {
    case 'matching':
      return <MatchingStatus appointment={appointment} />
    case 'await_confirm':
      return <AwaitConfirmStatus appointment={appointment} onCancel={() => cancelAppointment(appointment.id)} />
    case 'confirmed':
      return <ConfirmedStatus appointment={appointment} onCancel={() => cancelAppointment(appointment.id)} />
    case 'cancelled_patient':
      return <PatientCanceledStatus appointment={appointment} />
    case 'cancelled_doctor':
      return <DoctorCanceledStatus appointment={appointment} />
    default:
      return <ConfirmedStatus appointment={appointment} onCancel={() => cancelAppointment(appointment.id)} />
  }
}

// Types
interface StatusProps {
  appointment: {
    id: string
    doctorName: string
    specialty: string
    dateISO: string
    time: string
    status: string
  }
  onCancel?: () => void
}

// ============================================
// BACK HEADER COMPONENT
// ============================================
function BackHeader() {
  const navigate = useNavigate()
  const { t } = useTranslation('detail')

  return (
    <header className="sticky top-0 z-10 h-16 bg-white px-4 flex items-center">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100 transition-colors"
        aria-label={t('goBack')}
      >
        <svg className="w-6 h-6 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </header>
  )
}

// ============================================
// STICKY BOTTOM BAR COMPONENT
// ============================================
interface BottomBarProps {
  children: React.ReactNode
}

function StickyBottomBar({ children }: BottomBarProps) {
  return (
    <StickyActionBar containerClassName="px-6">
      <div className="space-y-3">{children}</div>
    </StickyActionBar>
  )
}

// ============================================
// MATCHING STATUS
// ============================================
function MatchingStatus({ appointment }: StatusProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('detail')
  const { cancelAppointment } = useBooking()
  const [currentStep, setCurrentStep] = useState(0)

  // Simulate progress through steps
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(1), 1500),
      setTimeout(() => setCurrentStep(2), 3000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const steps = [
    { label: t('steps.verifyingPreferences'), done: currentStep >= 1 },
    { label: t('steps.checkingAvailability'), done: currentStep >= 2 },
    { label: t('steps.matchingTimeSlot'), done: false, active: currentStep === 2 },
    { label: t('steps.confirmingAppointment'), done: false },
  ]

  const handleCancel = () => {
    cancelAppointment(appointment.id)
    navigate(PATHS.HISTORY)
  }

  return (
    <Page className="flex flex-col">
      <BackHeader />
      <MatchingStatusView
        title={t('matching.title')}
        description={t('matching.description')}
        steps={steps}
        connectionTitle={t('matching.connectionTitle')}
        connectionSubtitle={
          <>
            {t('matching.connectionSubtitle')}
          </>
        }
        primaryActionLabel={t('cancelRequest')}
        onPrimaryAction={handleCancel}
      />
    </Page>
  )
}

// ============================================
// AWAIT CONFIRM STATUS
// ============================================
function AwaitConfirmStatus({ appointment, onCancel }: StatusProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('detail')

  const handleCancel = () => {
    onCancel?.()
    navigate(PATHS.HISTORY)
  }

  return (
    <Page className="flex flex-col">
      <BackHeader />

      {/* Center-aligned Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">{t('awaitingConfirmation')}</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          {t('awaitingDescription', { doctorName: appointment.doctorName })}
        </p>

        {/* Summary Card */}
        <div className="w-full max-w-sm rounded-2xl bg-cream-50 border border-cream-200 p-5">
          <DoctorInfoCard appointment={appointment} align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} align="left" showLocation />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={handleCancel}
          className="w-full py-3.5 px-4 border border-cream-400 text-charcoal-500 font-medium rounded-xl hover:bg-cream-50 transition-colors"
        >
          {t('cancelRequest')}
        </button>
      </StickyBottomBar>
    </Page>
  )
}

// ============================================
// CONFIRMED STATUS
// ============================================
function ConfirmedStatus({ appointment, onCancel }: StatusProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('detail')
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const handleAddToCalendar = () => {
    const startDate = new Date(`${appointment.dateISO}T${appointment.time}`)
    const endDate = new Date(startDate.getTime() + 30 * 60000)
    const title = t('calendarEventTitle', { doctorName: appointment.doctorName })
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
    window.open(gcalUrl, '_blank')
  }

  const handleCancel = () => {
    onCancel?.()
    setShowCancelDialog(false)
    navigate(PATHS.HISTORY)
  }

  return (
    <Page className="flex flex-col">
      <BackHeader />

      {/* Center-aligned Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">{t('confirmed')}</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          {t('confirmedDescription')}
        </p>

        {/* Summary Card */}
        <div className="w-full max-w-sm rounded-2xl bg-cream-50 border border-cream-200 p-5">
          <DoctorInfoCard appointment={appointment} variant="confirmed" align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} align="left" showLocation />
        </div>

        <div className="w-full max-w-sm mt-6 flex justify-center">
          <div className="w-full space-y-3">
            <button
              onClick={handleAddToCalendar}
              className="btn btn-secondary btn-block flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('addToCalendar')}
            </button>
            <button
              onClick={() => setShowCancelDialog(true)}
              className="btn btn-block bg-transparent text-red-600 hover:bg-red-50 active:bg-red-100"
            >
              {t('cancelAppointment')}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={() => navigate(PATHS.HISTORY)}
          className="btn btn-secondary btn-block flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('viewAllAppointments')}
        </button>
        <button
          onClick={() => navigate(PATHS.HOME)}
          className="btn btn-tertiary btn-block"
        >
          {t('backToHome')}
        </button>
      </StickyBottomBar>

      {/* Cancel Dialog */}
      <CancelAppointmentSheet
        open={showCancelDialog}
        doctorName={appointment.doctorName}
        formattedDate={formatDateWithWeekday(appointment.dateISO)}
        onConfirm={handleCancel}
        onClose={() => setShowCancelDialog(false)}
      />
    </Page>
  )
}

// ============================================
// PATIENT CANCELED STATUS
// ============================================
function PatientCanceledStatus({ appointment }: StatusProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('detail')

  return (
    <Page className="flex flex-col">
      <BackHeader />

      {/* Center-aligned Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-400 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">{t('canceled')}</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          {t('canceledDescription')}
        </p>

        {/* Doctor Card - Grayed out */}
        <DoctorInfoCard appointment={appointment} variant="canceled" />

        {/* Appointment Details - Grayed out */}
        <AppointmentDetails appointment={appointment} variant="canceled" />

        {/* Status Badge */}
        <div className="flex justify-center mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-700 text-white text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t('canceledByYou')}
          </span>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={() => navigate(PATHS.BOOKING_SEARCH)}
          className="w-full py-3.5 px-4 bg-teal-500 text-white font-medium rounded-xl hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('submitNewRequest')}
        </button>
      </StickyBottomBar>
    </Page>
  )
}

// ============================================
// DOCTOR CANCELED STATUS
// ============================================
function DoctorCanceledStatus({ appointment }: StatusProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('detail')

  return (
    <Page className="flex flex-col">
      <BackHeader />

      {/* Center-aligned Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">{t('declined')}</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          {t('declinedDescription', { doctorName: appointment.doctorName })}
        </p>

        {/* Summary Card */}
        <div className="w-full max-w-sm rounded-2xl bg-cream-50 border border-cream-200 p-5">
          <DoctorInfoCard appointment={appointment} variant="declined" align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} variant="canceled" align="left" />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={() => navigate(PATHS.BOOKING_SEARCH)}
          className="w-full py-3.5 px-4 bg-teal-500 text-white font-medium rounded-xl hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('bookNewAppointment')}
        </button>
        <button
          onClick={() => navigate(PATHS.HOME)}
          className="w-full py-3.5 px-4 border border-cream-400 text-charcoal-500 font-medium rounded-xl hover:bg-cream-50 transition-colors"
        >
          {t('backToHome')}
        </button>
      </StickyBottomBar>
    </Page>
  )
}

// ============================================
// SHARED COMPONENTS
// ============================================

interface DoctorInfoCardProps {
  appointment: StatusProps['appointment']
  variant?: 'default' | 'confirmed' | 'canceled' | 'declined'
  align?: 'center' | 'left'
}

function DoctorInfoCard({ appointment, variant = 'default', align = 'center' }: DoctorInfoCardProps) {
  const { t } = useTranslation(['detail', 'booking'])
  const isGrayed = variant === 'canceled' || variant === 'declined'
  const isDeclined = variant === 'declined'
  const isLeft = align === 'left'

  return (
    <div className={`flex items-center gap-3 ${isLeft ? '' : 'justify-center'} `}>
      <div
        className={`relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium
          ${isGrayed ? 'bg-slate-200 text-slate-400' : isDeclined ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}
          ${isDeclined ? 'ring-2 ring-red-500 ring-offset-2' : ''}
        `}
      >
        {appointment.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div className={isLeft ? 'text-left' : 'text-center'}>
        <h3 className={`font-semibold ${isGrayed ? 'text-slate-400' : 'text-charcoal-500'}`}>
          {appointment.doctorName}
        </h3>
        <p className={`text-sm ${isGrayed ? 'text-slate-400' : 'text-slate-600'}`}>
          {translateSpecialty(t, appointment.specialty)} • {t('yearsExp', { count: 15 })}
        </p>
      </div>
    </div>
  )
}

interface AppointmentDetailsProps {
  appointment: StatusProps['appointment']
  variant?: 'default' | 'canceled'
  showLocation?: boolean
  align?: 'center' | 'left'
}

function AppointmentDetails({
  appointment,
  variant = 'default',
  showLocation = false,
  align = 'center',
}: AppointmentDetailsProps) {
  const { t } = useTranslation('detail')
  const isGrayed = variant === 'canceled'
  const textColor = isGrayed ? 'text-slate-400' : 'text-slate-600'
  const iconColor = isGrayed ? 'text-slate-300' : 'text-slate-500'
  const rowAlign = align === 'left' ? 'justify-start' : 'justify-center'

  return (
    <div className="space-y-3">
      {/* Date */}
      <div className={`flex items-center ${rowAlign} gap-3`}>
        <svg className={`w-5 h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className={textColor}>{formatDateWithWeekday(appointment.dateISO)}</span>
      </div>

      {/* Time */}
      <div className={`flex items-center ${rowAlign} gap-3`}>
        <svg className={`w-5 h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={textColor}>{formatTime(appointment.time)} - {formatTime(addMinutes(appointment.time, 30))}</span>
      </div>

      {/* Location */}
      {showLocation && (
        <div className={`flex items-center ${rowAlign} gap-3`}>
          <svg className={`w-5 h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={textColor}>{t('defaultClinicLocation')}</span>
        </div>
      )}
    </div>
  )
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const totalMinutes = h * 60 + m + minutes
  const newH = Math.floor(totalMinutes / 60) % 24
  const newM = totalMinutes % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}
