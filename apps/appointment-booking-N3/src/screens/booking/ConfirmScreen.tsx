import { useNavigate } from 'react-router-dom'
import { Header, Page, Avatar } from '../../components'
import { useBooking, useProfile, useHistory } from '../../state'
import { PATHS } from '../../routes'
import type { Appointment, HistoryItem } from '../../types'

export default function ConfirmScreen() {
  const navigate = useNavigate()
  const { selectedDoctor, selectedSlot, selectedFamilyMemberId, addAppointment, resetBooking } = useBooking()
  const { profile } = useProfile()
  const { addHistoryItem } = useHistory()

  if (!selectedDoctor || !selectedSlot) {
    navigate(PATHS.BOOKING_SEARCH)
    return null
  }

  const forUser = selectedFamilyMemberId
    ? profile.familyMembers.find((m) => m.id === selectedFamilyMemberId)
    : null

  const forUserName = forUser ? forUser.name : profile.fullName
  const forUserId = forUser ? forUser.id : profile.id || 'self'

  const date = new Date(selectedSlot.dateISO)
  const formattedDate = date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleConfirm = () => {
    const appointmentId = `apt_${Date.now()}`

    // Create appointment
    const appointment: Appointment = {
      id: appointmentId,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      dateISO: selectedSlot.dateISO,
      time: selectedSlot.time,
      forUserId,
      forUserName,
      status: 'confirmed',
      reminderSet: true,
      calendarSynced: false,
    }

    addAppointment(appointment)

    // Add to history
    const historyItem: HistoryItem = {
      id: `h_${Date.now()}`,
      type: 'appointment',
      title: `Termin: ${selectedDoctor.specialty}`,
      subtitle: `${selectedDoctor.name} · ${selectedDoctor.city}`,
      dateISO: selectedSlot.dateISO,
      status: 'planned',
      forUserId,
      forUserName,
    }

    addHistoryItem(historyItem)

    // Reset booking state
    resetBooking()

    // Navigate to success
    navigate(PATHS.BOOKING_SUCCESS)
  }

  return (
    <Page safeBottom={false}>
      <Header title="Buchung bestätigen" showBack />

      <div className="px-4 py-6">
        {/* Doctor info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
          <div className="flex items-start gap-3">
            <Avatar name={selectedDoctor.name} size="lg" />
            <div>
              <h2 className="font-semibold text-neutral-900">{selectedDoctor.name}</h2>
              <p className="text-sm text-neutral-600">{selectedDoctor.specialty}</p>
              <p className="text-sm text-neutral-500">{selectedDoctor.address}</p>
            </div>
          </div>
        </div>

        {/* Appointment details */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 space-y-4">
          <h3 className="font-medium text-neutral-900">Termindetails</h3>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">{formattedDate}</p>
              <p className="text-sm text-neutral-500">um {selectedSlot.time} Uhr</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">Für: {forUserName}</p>
              {forUser && <p className="text-sm text-neutral-500">{forUser.relationship}</p>}
            </div>
          </div>
        </div>

        {/* Insurance reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-amber-800">Bitte mitbringen</p>
              <ul className="text-sm text-amber-700 mt-1 list-disc list-inside">
                <li>Ihre eGK (Gesundheitskarte)</li>
                <li>Relevante medizinische Unterlagen</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
        >
          Termin bestätigen
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 py-3.5 px-4 text-neutral-700 font-medium hover:bg-neutral-100 rounded-lg transition-colors"
        >
          Zurück
        </button>
      </div>
    </Page>
  )
}
