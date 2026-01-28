import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, Avatar, Rating } from '../../components'
import { PATHS } from '../../routes'
import { useBooking, useProfile } from '../../state'

function formatDate(dateISO: string) {
  const date = new Date(dateISO)
  return date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function AssistantConfirmScreen() {
  const navigate = useNavigate()
  const { selectedDoctor, selectedSlot } = useBooking()
  const { profile } = useProfile()

  const slotLabel = useMemo(() => {
    if (!selectedSlot) return ''
    return `${formatDate(selectedSlot.dateISO)}, ${selectedSlot.time}`
  }, [selectedSlot])

  if (!selectedDoctor || !selectedSlot) {
    return (
      <Page>
        <Header title="Confirm booking" showBack onBack={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)} />
        <div className="px-4 py-6 space-y-4">
          <div className="bg-white rounded-2xl border border-cream-400 p-4">
            <p className="font-semibold text-charcoal-500">Select a doctor and time first.</p>
            <p className="text-sm text-slate-600 mt-2">Return to recommendations to pick a slot.</p>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)}>
            Back to recommendations
          </button>
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header title="Confirm Booking" showBack onBack={() => navigate(PATHS.ASSISTANT_DOCTOR.replace(':id', selectedDoctor.id))} />

      <div className="px-4 py-4 space-y-4 pb-28">
        <div className="bg-white rounded-2xl border border-cream-400 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar name={selectedDoctor.name} imageUrl={selectedDoctor.imageUrl} size="lg" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-charcoal-500">{selectedDoctor.name}</h2>
              <p className="text-sm text-slate-500">{selectedDoctor.specialty} Specialist</p>
              <div className="mt-2">
                <Rating value={selectedDoctor.rating} reviewCount={selectedDoctor.reviewCount} />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-cream-200 pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-teal-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Appointment time</p>
                <p className="text-charcoal-500 font-semibold mt-1">{slotLabel}</p>
                <p className="text-xs text-slate-500 mt-1">30 min consultation</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Location</p>
                <p className="text-charcoal-500 font-semibold mt-1">{selectedDoctor.city}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedDoctor.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-charcoal-500">
            <span>Cost &amp; Insurance</span>
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-700">Public insurance covered</p>
              <p className="text-xs text-teal-700/70 mt-1">Publicly insured • No payment required now</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-charcoal-500">Booking for</p>
          <div className="bg-white rounded-2xl border border-cream-400 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-sm">
                {profile.fullName?.trim()?.[0] || 'M'}
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal-500">{profile.fullName || 'Myself'}</p>
                <p className="text-xs text-slate-500">Primary member</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-teal-700 font-medium">
              Change
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-start gap-2">
          <svg className="w-4 h-4 text-teal-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p>
            This slot was recommended based on your preference for morning appointments and insurance compatibility.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <button className="btn btn-primary btn-block h-14" onClick={() => navigate(PATHS.BOOKING_SUCCESS)}>
            Confirm booking →
          </button>
        </div>
      </div>
    </Page>
  )
}
