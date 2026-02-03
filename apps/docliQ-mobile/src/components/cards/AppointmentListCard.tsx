import { useTranslation } from 'react-i18next'
import { IconSearch, IconCalendar, IconMapPin } from '@tabler/icons-react'
import type { Appointment } from '../../types'
import { formatDateShort, formatTime, translateSpecialty } from '../../utils'
import { getDoctorById } from '../../data/doctors'
import { Pill } from '../display/Pill'
import { Avatar } from '../display/Avatar'

export function AppointmentListCard({
  appointment,
  onClick,
  onRate,
}: {
  appointment: Appointment
  onClick?: () => void
  onRate?: () => void
}) {
  const { t } = useTranslation(['appointments', 'booking'])
  const isMatching = appointment.status === 'matching'

  const statusConfig: Record<
    Appointment['status'],
    { tone: 'info' | 'positive' | 'pending' | 'warning' | 'negative' | 'neutral'; label: string }
  > = {
    matching: { tone: 'info', label: t('status.matching') },
    await_confirm: { tone: 'pending', label: t('status.awaitConfirm') },
    confirmed: { tone: 'positive', label: t('status.confirmed') },
    cancelled_doctor: { tone: 'negative', label: t('status.doctorCancelled') },
    completed: { tone: 'neutral', label: t('status.completed') },
    cancelled_patient: { tone: 'negative', label: t('status.patientCanceled') },
    modified_by_practice: { tone: 'warning', label: t('status.modifiedByPractice') },
  }

  const status = statusConfig[appointment.status]
  const showAccepts = appointment.status === 'matching'

  const hashString = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      hash = (hash * 31 + value.charCodeAt(i)) | 0
    }
    return Math.abs(hash)
  }

  const getEstimatedWaitRangeMinutes = () => {
    const now = Date.now()
    const ts =
      (appointment.updatedAt ? new Date(appointment.updatedAt).getTime() : NaN) ||
      (appointment.createdAt ? new Date(appointment.createdAt).getTime() : NaN)
    const ageMinutes = Number.isFinite(ts) ? Math.max(0, Math.floor((now - ts) / (1000 * 60))) : 0

    const h1 = hashString(appointment.id)
    const h2 = hashString(`${appointment.id}:${appointment.doctorId}`)

    // Demo-only: keep the perceived wait time small (1–3 min) while still being stable per appointment.
    // Age nudges the range slightly upward within the same 1–3 min band.
    const ageBump = Math.min(1, Math.floor(ageMinutes / 60))
    const min = 1 + (h1 % 2) + ageBump // 1–3
    const max = Math.min(3, min + 1 + (h2 % 2 ? 0 : 1)) // ensure <= 3
    return { min, max }
  }

  const formatInsuranceAccepts = () => {
    const accepts = getDoctorById(appointment.doctorId)?.accepts ?? (['PKV', 'GKV'] as const)

    const sorted = [...accepts].sort((a, b) => {
      const score = (x: (typeof accepts)[number]) => (x === 'PKV' ? 0 : 1)
      return score(a) - score(b)
    })

    const labels = sorted.map((it) => t(`insurance.${it}`))
    const list =
      labels.length >= 2 ? t('list.and', { a: labels[0], b: labels[1] }) : (labels[0] ?? '')

    return t('accepts', { insurances: list })
  }

  const estimatedWaitRange =
    appointment.status === 'matching' ? getEstimatedWaitRangeMinutes() : null

  // Get doctor info for location
  const doctor = getDoctorById(appointment.doctorId)
  const locationPreference = doctor?.city ?? 'Berlin'

  const isClickable = typeof onClick === 'function'
  const feedbackComplete = Boolean(appointment.feedbackSubmittedAt || appointment.feedbackRating)
  const feedbackDismissed = Boolean(appointment.feedbackDismissed)
  const showRateAction =
    appointment.status === 'completed' &&
    typeof onRate === 'function' &&
    !feedbackComplete &&
    !feedbackDismissed
  const containerClassName = `w-full text-left rounded-2xl border border-cream-300 bg-white p-4 shadow-sm transition-colors duration-normal ease-out-brand ${
    isClickable
      ? 'hover:border-cream-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer'
      : 'cursor-default'
  }`

  const content = (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 mt-0.5">
            {isMatching ? (
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                <IconSearch className="w-6 h-6 text-sky-600" stroke={2} />
              </div>
            ) : (
              <Avatar name={appointment.doctorName} size="lg" shape="circle" />
            )}
          </div>
          <div className="min-w-0">
            {isMatching ? (
              <>
                {/* Matching status: Show specialty as main title */}
                <h3 className="font-semibold text-charcoal-500 truncate">{translateSpecialty(t, appointment.specialty)}</h3>
                <div className="mt-0.5 flex items-center gap-2 min-w-0">
                  <p className="min-w-0 truncate text-sm text-slate-600">{t('matching.requestedSpecialty')}</p>
                  {estimatedWaitRange && (
                    <span className="shrink-0 text-xs font-semibold text-sky-700">
                      {t('estimatedWaitShort', { min: estimatedWaitRange.min, max: estimatedWaitRange.max })}
                    </span>
                  )}
                </div>
                {/* Request submitted and location */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <IconMapPin className="w-3.5 h-3.5 flex-shrink-0" stroke={2} />
                    <span>{t('matching.locationPreference')}: {locationPreference}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Non-matching status: Show doctor name as main title */}
                <h3 className="font-semibold text-charcoal-500 truncate">{appointment.doctorName}</h3>
                <div className="mt-0.5 flex items-center gap-2 min-w-0">
                  <p className="min-w-0 truncate text-sm text-slate-600">{translateSpecialty(t, appointment.specialty)}</p>
                </div>

                {showAccepts ? (
                  <p className="mt-1 text-xs text-slate-500 truncate">{formatInsuranceAccepts()}</p>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <Pill tone={status.tone}>{status.label}</Pill>
        </div>

        {!isMatching && !showAccepts && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <IconCalendar className="w-4 h-4 flex-shrink-0" stroke={2} />
            <span>
              {formatDateShort(appointment.dateISO)}, {formatTime(appointment.time)} {t('timeSuffix')}
            </span>
          </div>
        )}

        <div className="shrink-0 text-right">
          {appointment.status === 'completed' && feedbackComplete && (
            <span className="text-sm text-slate-400">{t('rated')}</span>
          )}
        </div>
      </div>

      {showRateAction && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onRate?.()
            }}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            {t('rateVisit')}
          </button>
        </div>
      )}
    </div>
  )

  if (!isClickable) {
    return <div className={containerClassName}>{content}</div>
  }

  return (
    <button type="button" onClick={onClick} className={containerClassName}>
      {content}
    </button>
  )
}
