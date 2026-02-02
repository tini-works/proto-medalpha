import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconCalendar, IconClock } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Avatar, Header, Page, StickyActionBar } from '../../components'
import { Button } from '../../components/ui'
import { useBooking, useReschedule } from '../../state'
import { PATHS, reschedulePath } from '../../routes'

type Reason = 'conflict' | 'earlier' | 'later' | 'other'

export default function RescheduleReasonScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('appointments')
  const { appointments } = useBooking()
  const { setRescheduleContext } = useReschedule()

  const appointment = appointments.find((a) => a.id === id)
  const [reason, setReason] = useState<Reason | null>(null)

  const reasons: Array<{ id: Reason; label: string; description: string }> = [
    { id: 'conflict', label: t('reschedule.reasons.conflict.label'), description: t('reschedule.reasons.conflict.description') },
    { id: 'earlier', label: t('reschedule.reasons.earlier.label'), description: t('reschedule.reasons.earlier.description') },
    { id: 'later', label: t('reschedule.reasons.later.label'), description: t('reschedule.reasons.later.description') },
    { id: 'other', label: t('reschedule.reasons.other.label'), description: t('reschedule.reasons.other.description') },
  ]

  if (!id || !appointment) {
    return (
      <Page>
        <Header title={t('reschedule.title')} showBack />
        <div className="px-4 py-8 text-center">
          <p className="text-slate-500">{t('notFound')}</p>
          <button onClick={() => navigate(PATHS.HISTORY)} className="mt-4 text-teal-700 font-medium hover:underline">
            {t('backToAppointments')}
          </button>
        </div>
      </Page>
    )
  }

  const handleNext = () => {
    if (!reason) return
    setRescheduleContext({
      originalAppointment: appointment,
      suggestedSlots: [],
      selectedNewSlot: null,
      reason,
    })
    navigate(reschedulePath(appointment.id))
  }

  const handleSkip = () => {
    setRescheduleContext({
      originalAppointment: appointment,
      suggestedSlots: [],
      selectedNewSlot: null,
    })
    navigate(reschedulePath(appointment.id))
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('reschedule.appointmentTitle')} showBack />

      <div className="px-4 py-6 space-y-6 pb-28">
        <div className="bg-white rounded-2xl border border-cream-400 p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">{t('reschedule.currentAppointment')}</p>
          <div className="flex items-start gap-3">
            <Avatar name={appointment.doctorName} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-charcoal-500">{appointment.doctorName}</p>
              <p className="text-sm text-slate-600">{appointment.specialty}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <IconCalendar className="w-4 h-4 text-slate-400" stroke={2} />
                  {appointment.dateISO}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconClock className="w-4 h-4 text-slate-400" stroke={2} />
                  {appointment.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">{t('reschedule.whyTitle')}</h2>
          <p className="text-sm text-slate-600">{t('reschedule.whySubtitle')}</p>
        </div>

        <div className="space-y-3">
          {reasons.map((r) => {
            const selected = reason === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(r.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-colors duration-normal ease-out-brand ${
                  selected ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
                }`}
                aria-pressed={selected}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-charcoal-500">{r.label}</p>
                    <p className="text-sm text-slate-600 mt-1">{r.description}</p>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selected ? 'border-teal-600' : 'border-cream-400'
                    }`}
                  >
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <StickyActionBar>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleNext}
            disabled={!reason}
            variant="primary"
            size="lg"
            fullWidth
          >
            {t('reschedule.next')}
          </Button>
          <Button onClick={handleSkip} variant="tertiary" size="md" fullWidth>
            {t('reschedule.skip')}
          </Button>
        </div>
      </StickyActionBar>
    </Page>
  )
}
