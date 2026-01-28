import { useTranslation } from 'react-i18next'
import type { Appointment } from '../../types'
import { formatDateShort, formatTime } from '../../utils/format'
import { getDoctorById } from '../../data/doctors'
import { Pill } from '../display/Pill'
import { Avatar } from '../display/Avatar'

export function AppointmentListCard({
  appointment,
  onClick,
}: {
  appointment: Appointment
  onClick?: () => void
}) {
  const { t } = useTranslation('appointments')

  const statusConfig: Record<
    Appointment['status'],
    { tone: 'info' | 'positive' | 'warning' | 'negative' | 'neutral'; label: string }
  > = {
    matching: { tone: 'info', label: t('status.matching') },
    await_confirm: { tone: 'warning', label: t('status.awaitConfirm') },
    confirmed: { tone: 'positive', label: t('status.confirmed') },
    cancelled_doctor: { tone: 'negative', label: t('status.doctorCancelled') },
    completed: { tone: 'neutral', label: t('status.completed') },
    cancelled_patient: { tone: 'negative', label: t('status.patientCanceled') },
  }

  const status = statusConfig[appointment.status]
  const showAccepts = appointment.status === 'matching' || appointment.status === 'await_confirm'

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

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-cream-300 bg-white p-4 shadow-sm hover:border-cream-400 transition-colors duration-normal ease-out-brand focus:outline-none focus:ring-2 focus:ring-teal-500/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 mt-0.5">
            <Avatar name={appointment.doctorName} size="lg" shape="circle" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-charcoal-500 truncate">{appointment.doctorName}</h3>
            <div className="mt-0.5 flex items-center gap-2 min-w-0">
              <p className="min-w-0 truncate text-sm text-slate-600">{appointment.specialty}</p>
              {estimatedWaitRange && (
                <span className="shrink-0 text-xs font-semibold text-sky-700">
                  {t('estimatedWaitShort', { min: estimatedWaitRange.min, max: estimatedWaitRange.max })}
                </span>
              )}
            </div>

            {showAccepts ? (
              <p className="mt-1 text-xs text-slate-500 truncate">{formatInsuranceAccepts()}</p>
            ) : (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {formatDateShort(appointment.dateISO)}, {formatTime(appointment.time)} Uhr
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <Pill tone={status.tone}>{status.label}</Pill>
        </div>
      </div>
    </button>
  )
}
