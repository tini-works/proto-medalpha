import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, Avatar, Rating } from '../../components'
import { Button } from '../../components/ui'
import { PATHS, appointmentDetailPath } from '../../routes'
import { useBooking, useHistory, useProfile, usePreferences } from '../../state'
import { getLocale, type Language } from '../../utils'
import { IconCalendar, IconMapPin, IconCheck, IconInfoCircle, IconChevronDown, IconPlus } from '@tabler/icons-react'
import type { Appointment, HistoryItem } from '../../types'

function formatDate(dateISO: string, language: Language) {
  const date = new Date(dateISO)
  return date.toLocaleDateString(getLocale(language), { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function AssistantConfirmScreen() {
  const navigate = useNavigate()
  const { selectedDoctor, selectedSlot, addAppointment, resetBooking } = useBooking()
  const { profile } = useProfile()
  const { addHistoryItem } = useHistory()
  const { language } = usePreferences()

  const slotLabel = useMemo(() => {
    if (!selectedSlot) return ''
    return `${formatDate(selectedSlot.dateISO, language)}, ${selectedSlot.time}`
  }, [selectedSlot, language])

  if (!selectedDoctor || !selectedSlot) {
    return (
      <Page>
        <Header title="Confirm booking" showBack onBack={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)} />
        <div className="px-4 py-6 space-y-4">
          <div className="bg-white rounded-2xl border border-cream-400 p-4">
            <p className="font-semibold text-charcoal-500">Select a doctor and time first.</p>
            <p className="text-sm text-slate-600 mt-2">Return to recommendations to pick a slot.</p>
          </div>
          <Button className="btn btn-primary btn-block" onClick={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)} variant="primary" fullWidth>
            Back to recommendations
          </Button>
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
                <IconCalendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Appointment time</p>
                <p className="text-charcoal-500 font-semibold mt-1">{slotLabel}</p>
                <p className="text-xs text-slate-500 mt-1">30 min consultation</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <IconMapPin className="w-5 h-5" />
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
            <IconInfoCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center">
              <IconCheck className="w-5 h-5" />
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
              <IconChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-start gap-2">
          <IconPlus className="w-4 h-4 text-teal-600 mt-0.5" />
          <p>
            This slot was recommended based on your preference for morning appointments and insurance compatibility.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              if (!selectedDoctor || !selectedSlot) return

              const appointmentId = `apt_${Date.now()}`

              const appointment: Appointment = {
                id: appointmentId,
                doctorId: selectedDoctor.id,
                doctorName: selectedDoctor.name,
                specialty: selectedDoctor.specialty,
                dateISO: selectedSlot.dateISO,
                time: selectedSlot.time,
                forUserId: profile.id || 'self',
                forUserName: profile.fullName || 'You',
                status: 'confirmed',
                reminderSet: true,
                calendarSynced: false,
              }

              addAppointment(appointment)

              const historyItem: HistoryItem = {
                id: `h_${Date.now()}`,
                type: 'appointment',
                title: `Appointment: ${selectedDoctor.specialty}`,
                subtitle: `${selectedDoctor.name} · ${selectedDoctor.city}`,
                dateISO: selectedSlot.dateISO,
                status: 'planned',
                forUserId: appointment.forUserId,
                forUserName: appointment.forUserName,
              }
              addHistoryItem(historyItem)

              resetBooking()
              navigate(appointmentDetailPath(appointmentId), { replace: true })
            }}
          >
            Confirm booking →
          </Button>
        </div>
      </div>
    </Page>
  )
}
