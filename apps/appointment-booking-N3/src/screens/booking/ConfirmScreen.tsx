import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PatientSelector,
  ReasonTextarea,
  InsuranceBanner,
  AppointmentSummaryCard,
} from '../../components'
import { useBooking, useProfile, useHistory } from '../../state'
import { PATHS } from '../../routes'
import type { Appointment, HistoryItem } from '../../types'

export default function ConfirmScreen() {
  const navigate = useNavigate()
  const { selectedDoctor, selectedSlot, selectedFamilyMemberId, selectFamilyMember, addAppointment, resetBooking } = useBooking()
  const { profile } = useProfile()
  const { addHistoryItem } = useHistory()

  const [patientType, setPatientType] = useState<string>(selectedFamilyMemberId ? 'child' : 'myself')
  const [reason, setReason] = useState('')

  if (!selectedDoctor || !selectedSlot) {
    navigate(PATHS.BOOKING_SEARCH)
    return null
  }

  const handlePatientChange = (value: string) => {
    setPatientType(value)
    if (value === 'myself') {
      selectFamilyMember(null)
    }
    // For 'child', the family member selection would happen in a separate flow
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
      title: `Appointment: ${selectedDoctor.specialty}`,
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

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark overlay - fade in */}
      <div
        className="absolute inset-0 bg-neutral-900/50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Bottom sheet container - slide up */}
      <div className="absolute bottom-0 left-0 right-0 h-[90vh] flex flex-col rounded-t-3xl bg-white overflow-hidden animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-4 pb-4">
          <h1 className="text-xl font-bold text-neutral-900">Confirm Appointment</h1>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-6">
            {/* Patient Selector */}
            <PatientSelector
              value={patientType}
              onChange={handlePatientChange}
              label="Who is this appointment for?"
            />

            {/* Appointment Summary Card */}
            <AppointmentSummaryCard
              doctor={{
                name: selectedDoctor.name,
                specialty: selectedDoctor.specialty,
                imageUrl: selectedDoctor.imageUrl,
              }}
              date={formattedDate}
              time={selectedSlot.time}
              duration="30 min"
              type="in-person"
              address={selectedDoctor.address}
            />

            {/* Insurance Banner */}
            <InsuranceBanner
              insuranceType={profile.insuranceType === 'PKV' ? 'PKV' : 'GKV'}
              label="Cost & Coverage"
            />

            {/* Reason Textarea */}
            <ReasonTextarea
              value={reason}
              onChange={setReason}
              label="Reason for visit (optional)"
              placeholder="Describe your symptoms or reason for visit..."
              maxLength={200}
            />
          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex-shrink-0 p-4 bg-white border-t border-neutral-100">
          <button
            onClick={handleConfirm}
            className="
              w-full h-14 bg-neutral-800 text-white font-bold rounded-xl
              shadow-lg shadow-neutral-800/25
              hover:bg-neutral-900 transition-colors
              active:scale-[0.99] transform
            "
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  )
}
