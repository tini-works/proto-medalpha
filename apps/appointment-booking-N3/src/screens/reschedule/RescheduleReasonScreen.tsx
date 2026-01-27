import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Header, Page } from '../../components'
import { useBooking, useReschedule } from '../../state'
import { PATHS, reschedulePath } from '../../routes'

type Reason = 'conflict' | 'earlier' | 'later' | 'other'

const reasons: Array<{ id: Reason; label: string; description: string }> = [
  { id: 'conflict', label: 'Time conflict', description: 'I cannot make the current time.' },
  { id: 'earlier', label: 'Earlier availability', description: 'I want an earlier appointment.' },
  { id: 'later', label: 'Later fits better', description: 'A later time works better for me.' },
  { id: 'other', label: 'Other reason', description: 'Something else.' },
]

export default function RescheduleReasonScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { appointments } = useBooking()
  const { setRescheduleContext } = useReschedule()

  const appointment = appointments.find((a) => a.id === id)
  const [reason, setReason] = useState<Reason | null>(null)

  if (!id || !appointment) {
    return (
      <Page>
        <Header title="Reschedule" showBack />
        <div className="px-4 py-8 text-center">
          <p className="text-slate-500">Appointment not found</p>
          <button onClick={() => navigate(PATHS.HISTORY)} className="mt-4 text-teal-700 font-medium hover:underline">
            Back to appointments
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
      <Header title="Reschedule appointment" showBack />

      <div className="px-4 py-6 space-y-6 pb-28">
        <div className="bg-white rounded-2xl border border-cream-400 p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Current appointment</p>
          <div className="flex items-start gap-3">
            <Avatar name={appointment.doctorName} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-charcoal-500">{appointment.doctorName}</p>
              <p className="text-sm text-slate-600">{appointment.specialty}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {appointment.dateISO}
                </span>
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 4a8 8 0 100 16 8 8 0 000-16z" />
                  </svg>
                  {appointment.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">Why do you want to reschedule?</h2>
          <p className="text-sm text-slate-600">This helps us highlight better alternatives. You can skip this step.</p>
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md flex flex-col gap-3">
          <button
            onClick={handleNext}
            disabled={!reason}
            className="btn btn-primary btn-block h-14 py-0 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button onClick={handleSkip} className="btn btn-tertiary btn-block h-12 py-0">
            Skip for now
          </button>
        </div>
      </div>
    </Page>
  )
}
