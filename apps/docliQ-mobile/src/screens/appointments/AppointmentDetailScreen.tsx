import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconStar, IconStarFilled } from '@tabler/icons-react'
import { Page, CancelAppointmentSheet, StickyActionBar } from '../../components'
import { DestructiveOutlineButton } from '../../components/ui'
import { AddToCalendarSheet } from '../../components/sheets'
import { useBooking, useHistory } from '../../state'
import { formatDateWithWeekday, formatTime, translateSpecialty } from '../../utils'
import { PATHS } from '../../routes/paths'
import { MatchingStatusView } from '../../components/appointments/MatchingStatusView'

export default function AppointmentDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('detail')
  const { appointments, cancelAppointment } = useBooking()
  const { getHistoryItemById } = useHistory()

  const appointment = appointments.find((apt) => apt.id === id)
  const autoOpenFeedback = Boolean((location.state as { rateVisit?: boolean } | undefined)?.rateVisit)
  const historyItem = id ? getHistoryItemById(id) : undefined

  const historyAppointment = historyItem
    ? (() => {
        const title = historyItem.title.replace('Appointment:', '').trim()
        const parts = historyItem.subtitle.split('·').map((part) => part.trim())
        const fallbackParts = historyItem.subtitle.split('Â·').map((part) => part.trim())
        const doctorName = (parts[0] || fallbackParts[0] || 'Dr. Taylor').trim()
        const specialty = title || 'General Medicine'
        const details = historyItem.details ?? {}
        return {
          id: historyItem.id,
          doctorId: 'd1',
          doctorName,
          specialty,
          dateISO: historyItem.dateISO,
          time: '10:00',
          forUserId: historyItem.forUserId,
          forUserName: historyItem.forUserName,
          status: historyItem.status === 'cancelled' ? 'cancelled_patient' : 'completed',
          reminderSet: false,
          calendarSynced: false,
          storeId: undefined,
          feedbackRating: typeof details.feedbackRating === 'number' ? details.feedbackRating : undefined,
          feedbackComment: typeof details.feedbackComment === 'string' ? details.feedbackComment : undefined,
          feedbackDismissed: Boolean(details.feedbackDismissed),
          feedbackSubmittedAt: typeof details.feedbackSubmittedAt === 'string' ? details.feedbackSubmittedAt : undefined,
          cancelReason: typeof details.cancelReason === 'string' ? details.cancelReason : undefined,
        }
      })()
    : undefined

  const resolvedAppointment = appointment ?? historyAppointment
  const isHistoryFallback = !appointment && Boolean(historyAppointment)

  if (!resolvedAppointment) {
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
  switch (resolvedAppointment.status) {
    case 'matching':
      return <MatchingStatus appointment={resolvedAppointment} />
    case 'await_confirm':
      return <AwaitConfirmStatus appointment={resolvedAppointment} onCancel={() => cancelAppointment(resolvedAppointment.id)} />
    case 'confirmed':
      return <ConfirmedStatus appointment={resolvedAppointment} onCancel={() => cancelAppointment(resolvedAppointment.id)} />
    case 'completed':
      return (
        <CompletedStatus
          appointment={resolvedAppointment}
          autoOpenFeedback={autoOpenFeedback}
          useHistoryFallback={isHistoryFallback}
        />
      )
    case 'cancelled_patient':
      return <PatientCanceledStatus appointment={resolvedAppointment} />
    case 'cancelled_doctor':
      return <DoctorCanceledStatus appointment={resolvedAppointment} />
    default:
      return <ConfirmedStatus appointment={resolvedAppointment} onCancel={() => cancelAppointment(resolvedAppointment.id)} />
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
    createdAt?: string
    updatedAt?: string
    feedbackRating?: number
    feedbackComment?: string
    feedbackDismissed?: boolean
    feedbackSubmittedAt?: string
    cancelReason?: string
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
        <div className="w-full max-w-sm rounded-2xl bg-white border border-cream-300 p-5">
          <DoctorInfoCard appointment={appointment} align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} align="left" showLocation />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <DestructiveOutlineButton onClick={handleCancel}>
          {t('cancelRequest')}
        </DestructiveOutlineButton>
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
  const [showCalendarSheet, setShowCalendarSheet] = useState(false)

  const openGoogleCalendar = () => {
    const startDate = new Date(`${appointment.dateISO}T${appointment.time}`)
    const endDate = new Date(startDate.getTime() + 30 * 60000)
    const title = t('calendarEventTitle', { doctorName: appointment.doctorName })
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
    window.open(gcalUrl, '_blank')
  }

  const handleExportIcs = () => {
    const start = new Date(`${appointment.dateISO}T${appointment.time}`)
    const end = new Date(start.getTime() + 30 * 60000)
    const title = t('calendarEventTitle', { doctorName: appointment.doctorName })
    const location = t('defaultClinicLocation')

    const pad = (n: number) => String(n).padStart(2, '0')
    const toIcsUtc = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DocliQ//Appointment//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@docliq`,
      `DTSTAMP:${toIcsUtc(new Date())}`,
      `DTSTART:${toIcsUtc(start)}`,
      `DTEND:${toIcsUtc(end)}`,
      `SUMMARY:${title}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appointment-${appointment.id}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleGetDirections = () => {
    const destination = t('defaultClinicLocation')
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`
    window.open(url, '_blank')
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
        <div className="w-full max-w-sm rounded-2xl bg-white border border-cream-300 p-5">
          <DoctorInfoCard appointment={appointment} variant="confirmed" align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} align="left" showLocation />
        </div>


        <div className="w-full max-w-sm mt-6 flex justify-center">
          <div className="w-full space-y-3">
            <button
              onClick={() => setShowCalendarSheet(true)}
              className="btn btn-secondary btn-block flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('addToCalendar')}
            </button>
            <button
              onClick={handleExportIcs}
              className="btn btn-secondary btn-block flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14" />
              </svg>
              {t('exportIcs')}
            </button>
            <button
              onClick={handleGetDirections}
              className="w-full py-3.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 bg-teal-50 text-teal-700 hover:bg-teal-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-7-9-7-9 7 9 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l9-7" />
              </svg>
              {t('getDirections')}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <DestructiveOutlineButton onClick={() => setShowCancelDialog(true)}>
          {t('cancelAppointment')}
        </DestructiveOutlineButton>
      </StickyBottomBar>

      {/* Cancel Dialog */}
      <CancelAppointmentSheet
        open={showCancelDialog}
        doctorName={appointment.doctorName}
        formattedDate={formatDateWithWeekday(appointment.dateISO)}
        onConfirm={handleCancel}
        onClose={() => setShowCancelDialog(false)}
      />

      <AddToCalendarSheet
        open={showCalendarSheet}
        onClose={() => setShowCalendarSheet(false)}
        onSelect={(provider) => {
          setShowCalendarSheet(false)
          if (provider === 'google') openGoogleCalendar()
          if (provider === 'apple' || provider === 'outlook') {
            // TODO: implement native calendar/ICS; fallback to Google Calendar web for now.
            openGoogleCalendar()
          }
        }}
      />
    </Page>
  )
}

// ============================================
// COMPLETED STATUS
// ============================================
function CompletedStatus({
  appointment,
  autoOpenFeedback = false,
  useHistoryFallback = false,
}: StatusProps & { autoOpenFeedback?: boolean; useHistoryFallback?: boolean }) {
  const navigate = useNavigate()
  const { t } = useTranslation('detail')

  return (
    <Page className="flex flex-col">
      <BackHeader />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-charcoal-500 text-center mb-2">{t('completedTitle')}</h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          {t('completedDescription')}
        </p>

        <div className="w-full max-w-sm rounded-2xl bg-white border border-cream-300 p-5">
          <DoctorInfoCard appointment={appointment} variant="confirmed" align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} align="left" showLocation />
        </div>

        <FeedbackPanel
          appointment={appointment}
          autoOpenFeedback={autoOpenFeedback}
          useHistoryFallback={useHistoryFallback}
        />
      </div>

      <StickyBottomBar>
        <button
          onClick={() => navigate(PATHS.BOOKING)}
          className="w-full py-3.5 px-4 bg-teal-500 text-white font-medium rounded-xl hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('bookFollowUp')}
        </button>
      </StickyBottomBar>
    </Page>
  )
}

// ============================================
// FEEDBACK PANEL
// ============================================
function FeedbackPanel({
  appointment,
  autoOpenFeedback = false,
  useHistoryFallback = false,
}: {
  appointment: StatusProps['appointment']
  autoOpenFeedback?: boolean
  useHistoryFallback?: boolean
}) {
  const { t } = useTranslation('detail')
  const { updateAppointment } = useBooking()
  const { getHistoryItemById, updateHistoryItem } = useHistory()
  const [feedbackExpanded, setFeedbackExpanded] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(appointment.feedbackRating ?? 0)
  const [feedbackComment, setFeedbackComment] = useState(appointment.feedbackComment ?? '')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(
    Boolean(appointment.feedbackSubmittedAt || appointment.feedbackRating)
  )
  const feedbackDismissed = Boolean(appointment.feedbackDismissed)

  useEffect(() => {
    setFeedbackRating(appointment.feedbackRating ?? 0)
    setFeedbackComment(appointment.feedbackComment ?? '')
    setFeedbackSubmitted(Boolean(appointment.feedbackSubmittedAt || appointment.feedbackRating))
  }, [appointment.feedbackComment, appointment.feedbackRating, appointment.feedbackSubmittedAt])

  useEffect(() => {
    if (feedbackDismissed || feedbackSubmitted) {
      setFeedbackExpanded(false)
      return
    }
    if (autoOpenFeedback) setFeedbackExpanded(true)
  }, [autoOpenFeedback, feedbackDismissed, feedbackSubmitted])

  const handleSelectRating = (rating: number) => {
    setFeedbackRating(rating)
    setFeedbackExpanded(true)
  }

  const handleDismissFeedback = () => {
    if (useHistoryFallback) {
      const historyItem = getHistoryItemById(appointment.id)
      const details = historyItem?.details ?? {}
      updateHistoryItem(appointment.id, {
        details: { ...details, feedbackDismissed: true },
      })
    } else {
      updateAppointment(appointment.id, { feedbackDismissed: true })
    }
    setFeedbackExpanded(false)
  }

  const handleSubmitFeedback = () => {
    if (!feedbackRating) return
    if (useHistoryFallback) {
      const historyItem = getHistoryItemById(appointment.id)
      const details = historyItem?.details ?? {}
      updateHistoryItem(appointment.id, {
        details: {
          ...details,
          feedbackRating,
          feedbackComment: feedbackComment.trim() ? feedbackComment.trim() : undefined,
          feedbackDismissed: false,
          feedbackSubmittedAt: new Date().toISOString(),
        },
      })
    } else {
      updateAppointment(appointment.id, {
        feedbackRating,
        feedbackComment: feedbackComment.trim() ? feedbackComment.trim() : undefined,
        feedbackDismissed: false,
        feedbackSubmittedAt: new Date().toISOString(),
      })
    }
    setFeedbackSubmitted(true)
    setFeedbackExpanded(false)
  }

  return (
    <div className="w-full max-w-sm mt-6">
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        {feedbackSubmitted ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-charcoal-500">{t('feedback.thanksTitle')}</p>
            <p className="text-sm text-slate-600">{t('feedback.thanksSubtitle')}</p>
            <div className="flex items-center gap-1 pt-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                const filled = value <= (appointment.feedbackRating ?? feedbackRating)
                return filled ? (
                  <IconStarFilled key={`submitted_${value}`} size={18} className="text-amber-500" />
                ) : (
                  <IconStar key={`submitted_${value}`} size={18} className="text-slate-300" />
                )
              })}
            </div>
            {appointment.feedbackComment ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {t('feedback.commentLabel')}
                </p>
                <p className="text-sm text-slate-600 italic">"{appointment.feedbackComment}"</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-charcoal-500">{t('feedback.title')}</p>
              <p className="text-sm text-slate-600">{t('feedback.subtitle')}</p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                const filled = value <= feedbackRating
                return (
                  <button
                    key={`rating_${value}`}
                    type="button"
                    onClick={() => handleSelectRating(value)}
                    className="p-1"
                    aria-label={`${t('feedback.rateVisit')} ${value}`}
                  >
                    {filled ? (
                      <IconStarFilled size={20} className="text-amber-500" />
                    ) : (
                      <IconStar size={20} className="text-slate-300" />
                    )}
                  </button>
                )
              })}
            </div>

            {feedbackExpanded ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {t('feedback.commentLabel')}
                  </label>
                  <textarea
                    value={feedbackComment}
                    onChange={(event) => setFeedbackComment(event.target.value)}
                    placeholder={t('feedback.commentPlaceholder')}
                    className="mt-2 w-full rounded-xl border border-cream-300 bg-white p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleDismissFeedback}
                    className="text-sm font-medium text-slate-500 hover:text-slate-600"
                  >
                    {t('feedback.notNow')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackRating}
                    className="px-4 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:opacity-50"
                  >
                    {t('feedback.submit')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFeedbackExpanded(true)}
                  className="text-sm font-semibold text-teal-700 hover:text-teal-800"
                >
                  {t('feedback.rateVisit')}
                </button>
                {!feedbackDismissed && (
                  <button
                    type="button"
                    onClick={handleDismissFeedback}
                    className="text-sm font-medium text-slate-500 hover:text-slate-600"
                  >
                    {t('feedback.notNow')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
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

        {/* Summary Card */}
        <div className="w-full max-w-sm rounded-2xl bg-white border border-cream-300 p-5">
          <DoctorInfoCard appointment={appointment} variant="canceled" align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} variant="canceled" align="left" showLocation />
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={() => navigate(PATHS.BOOKING)}
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
        <div className="w-full max-w-sm rounded-2xl bg-white border border-cream-300 p-5">
          <DoctorInfoCard appointment={appointment} variant="canceled" align="left" />
          <div className="h-px bg-cream-200 my-4" />
          <AppointmentDetails appointment={appointment} variant="canceled" align="left" showLocation />
        </div>

        {appointment.cancelReason ? (
          <div className="mt-4 w-full max-w-sm rounded-xl border border-cream-300 bg-cream-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('declinedReasonLabel')}
            </p>
            <p className="mt-1 text-sm text-slate-600">{appointment.cancelReason}</p>
          </div>
        ) : null}
      </div>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar>
        <button
          onClick={() => navigate(PATHS.BOOKING)}
          className="w-full py-3.5 px-4 bg-teal-500 text-white font-medium rounded-xl hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('bookNewAppointment')}
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
  const lastUpdatedIso = appointment.updatedAt ?? appointment.createdAt ?? `${appointment.dateISO}T${appointment.time}`
  const lastUpdatedDate = new Date(lastUpdatedIso)
  const lastUpdatedDateISO = Number.isNaN(lastUpdatedDate.getTime())
    ? appointment.dateISO
    : lastUpdatedDate.toISOString().slice(0, 10)
  const lastUpdatedTime = Number.isNaN(lastUpdatedDate.getTime())
    ? appointment.time
    : `${String(lastUpdatedDate.getHours()).padStart(2, '0')}:${String(lastUpdatedDate.getMinutes()).padStart(2, '0')}`

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

      <div className="mt-2 rounded-lg bg-cream-100 px-3 py-2 text-center text-xs text-slate-500">
        {t('lastUpdated')} {formatDateWithWeekday(lastUpdatedDateISO)} {formatTime(lastUpdatedTime)}
      </div>
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
