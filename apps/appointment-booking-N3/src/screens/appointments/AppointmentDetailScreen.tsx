import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page } from '../../components'
import { useBooking } from '../../state'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { PATHS } from '../../routes/paths'

export default function AppointmentDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { appointments, cancelAppointment } = useBooking()

  const appointment = appointments.find((apt) => apt.id === id)

  if (!appointment) {
    return (
      <Page>
        <BackHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <p className="text-slate-500">Appointment not found</p>
            <button
              onClick={() => navigate(PATHS.HISTORY)}
              className="mt-4 text-teal-700 font-medium hover:underline"
            >
              Back to appointments
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

  return (
    <header className="sticky top-0 z-10 bg-white px-4 py-3">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100 transition-colors"
        aria-label="Go back"
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
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-cream-200">
      <div className="mx-auto max-w-md px-6 py-4 safe-area-bottom">
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  )
}

// ============================================
// MATCHING STATUS
// ============================================
function MatchingStatus({ appointment }: StatusProps) {
  const navigate = useNavigate()
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
    { label: 'Verifying your preferences', done: currentStep >= 1 },
    { label: 'Checking doctor availability', done: currentStep >= 2 },
    { label: 'Matching you with the best time slot...', done: false, active: currentStep === 2 },
    { label: 'Confirming your appointment', done: false },
  ]

  const handleCancel = () => {
    cancelAppointment(appointment.id)
    navigate(PATHS.HISTORY)
  }

  return (
    <Page className="flex flex-col">
      <BackHeader />

      {/* Center-aligned Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Animated Search Icon */}
        <div className="w-28 h-28 rounded-full bg-sky-100 flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-charcoal-500 mb-3 text-center">Finding Your Match...</h1>
        <p className="text-slate-600 text-center mb-10 max-w-sm">
          We're searching for the best available appointment that fits your preferences
        </p>

        {/* Progress Steps */}
        <div className="w-full max-w-sm space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {step.done ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : step.active ? (
                <div className="w-6 h-6 rounded-full border-2 border-teal-500 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-cream-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${step.done ? 'text-green-600' : step.active ? 'text-charcoal-500' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Connection retry banner */}
        <div className="w-full max-w-sm mt-5">
          <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 20v-6h-6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.5 18.5a8 8 0 0112.7-9.2L20 10"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.5 5.5a8 8 0 01-12.7 9.2L4 14"
              />
            </svg>
            <div className="min-w-0">
              <p className="text-xs font-medium leading-snug">Auto-fixing connection issue...</p>
              <p className="mt-0.5 text-xs text-sky-700/90 leading-snug">
                Retrying (2/3) <span aria-hidden="true">•</span> This may take a moment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={handleCancel}
          className="w-full py-3.5 px-4 border border-cream-400 text-charcoal-500 font-medium rounded-xl hover:bg-cream-50 transition-colors"
        >
          Cancel Request
        </button>
      </StickyBottomBar>
    </Page>
  )
}

// ============================================
// AWAIT CONFIRM STATUS
// ============================================
function AwaitConfirmStatus({ appointment, onCancel }: StatusProps) {
  const navigate = useNavigate()

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
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">Awaiting Confirmation</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          We've found a match! Waiting for {appointment.doctorName} to confirm your appointment.
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
          Cancel Request
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
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const handleAddToCalendar = () => {
    const startDate = new Date(`${appointment.dateISO}T${appointment.time}`)
    const endDate = new Date(startDate.getTime() + 30 * 60000)
    const title = `Appointment with ${appointment.doctorName}`
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
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">Appointment Confirmed!</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          Your appointment has been confirmed. We've sent the details to your email and phone.
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
              Add to Calendar
            </button>
            <button
              onClick={() => setShowCancelDialog(true)}
              className="btn btn-block bg-transparent text-red-600 hover:bg-red-50 active:bg-red-100"
            >
              Cancel Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={() => navigate(PATHS.HISTORY)}
          className="btn btn-primary btn-block flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          View my appointments
        </button>
        <button
          onClick={() => navigate(PATHS.HOME)}
          className="btn btn-tertiary btn-block"
        >
          Back to Home
        </button>
      </StickyBottomBar>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <CancelDialog
          doctorName={appointment.doctorName}
          dateISO={appointment.dateISO}
          onConfirm={handleCancel}
          onClose={() => setShowCancelDialog(false)}
        />
      )}
    </Page>
  )
}

// ============================================
// PATIENT CANCELED STATUS
// ============================================
function PatientCanceledStatus({ appointment }: StatusProps) {
  const navigate = useNavigate()

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
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">Appointment Canceled</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          You've canceled this appointment request. You can submit a new request anytime.
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
            Canceled by You
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
          Submit New Request
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
        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">Appointment Declined</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          Unfortunately, {appointment.doctorName} is unable to accept this appointment. Please try booking with another doctor.
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
          Book New Appointment
        </button>
        <button
          onClick={() => navigate(PATHS.HOME)}
          className="w-full py-3.5 px-4 border border-cream-400 text-charcoal-500 font-medium rounded-xl hover:bg-cream-50 transition-colors"
        >
          Back to Home
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
          {appointment.specialty} • 15 years exp.
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
          <span className={textColor}>Heart Care Clinic, Building A</span>
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

interface CancelDialogProps {
  doctorName: string
  dateISO: string
  onConfirm: () => void
  onClose: () => void
}

function CancelDialog({ doctorName, dateISO, onConfirm, onClose }: CancelDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false)

  const handleConfirm = async () => {
    setIsCancelling(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden animate-slide-up safe-area-bottom">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-cream-400" />
        </div>

        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-charcoal-500 mb-2 text-center">
            Cancel Appointment?
          </h3>
          <p className="text-slate-600 mb-4 text-center">
            Are you sure you want to cancel your appointment with {doctorName} on {formatDateWithWeekday(dateISO)}?
          </p>

          <div className="bg-cream-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-slate-600 text-center">
              <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the appointment.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirm}
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
              onClick={onClose}
              disabled={isCancelling}
              className="w-full py-3.5 px-4 border border-cream-400 text-charcoal-500 font-medium rounded-xl hover:bg-cream-50 transition-colors disabled:opacity-50"
            >
              Keep Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
