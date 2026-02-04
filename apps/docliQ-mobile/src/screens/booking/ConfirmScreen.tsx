import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ReasonTextarea,
  AppointmentSummaryCard,
} from '../../components'
import { Button, Chip } from '../../components/ui'
import { useBooking, useProfile, useHistory, usePreferences } from '../../state'
import { PATHS, appointmentDetailPath } from '../../routes'
import { getLocale } from '../../utils'
import type { Appointment, HistoryItem } from '../../types'

export default function ConfirmScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('booking')
  const { selectedDoctor, selectedSlot, selectedFamilyMemberId, selectFamilyMember, addAppointment, resetBooking } = useBooking()
  const { profile, upsertMyDoctor } = useProfile()
  const { addHistoryItem } = useHistory()
  const { language } = usePreferences()

  const [reason, setReason] = useState('')
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

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
  const formattedDate = date.toLocaleDateString(getLocale(language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const patientSegment: 'myself' | 'family' = selectedFamilyMemberId ? 'family' : 'myself'

  const handleConfirm = () => {
    if (!reason.trim()) return
    if (!isOnline || isSubmitting) return
    setIsSubmitting(true)
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

    // Update "My Doctors" (last 5 booked)
    upsertMyDoctor(selectedDoctor)

    // Reset booking state
    resetBooking()

    // Standardize confirmed view: go to canonical Appointment Details screen
    navigate(appointmentDetailPath(appointmentId), { replace: true })
  }

  const handleClose = () => {
    const from = (location.state as any)?.from as string | undefined
    if (from) {
      navigate(from)
      return
    }
    navigate(-1)
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark overlay - fade in */}
      <div
        className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Bottom sheet container - slide up */}
      <div className="absolute bottom-0 left-0 right-0 h-[90vh] flex flex-col rounded-t-3xl bg-white overflow-hidden animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-cream-400" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-4 pb-4">
          <h1 className="text-xl font-bold text-charcoal-500">{t('confirmAppointment')}</h1>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors duration-normal ease-out-brand"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-slate-600"
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
              showVisitType={false}
              address={selectedDoctor.address}
            />

            {/* Patient selection */}
            <section className="space-y-2">
              <h2 className="text-sm font-medium text-charcoal-500">{t('whoIsAppointmentFor')}</h2>
              <div className="flex gap-2">
                <Chip
                  selected={patientSegment === 'myself'}
                  onClick={() => selectFamilyMember(null)}
                  fullWidth
                >
                  {t('myself')}
                </Chip>
                <Chip
                  selected={patientSegment === 'family'}
                  onClick={() => {
                    if (profile.familyMembers.length === 0) return
                    selectFamilyMember(profile.familyMembers[0].id)
                  }}
                  fullWidth
                  disabled={profile.familyMembers.length === 0}
                >
                  {t('familyMember')}
                </Chip>
              </div>

              {patientSegment === 'family' && profile.familyMembers.length > 0 && (
                <div className="mt-3 space-y-2">
                  {profile.familyMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => selectFamilyMember(member.id)}
                      className={`w-full bg-white border rounded-xl p-3 text-left transition-all ${
                        selectedFamilyMemberId === member.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-cream-400 hover:border-teal-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-charcoal-500 truncate">{member.name}</div>
                          <div className="text-xs text-slate-500">
                            {t(`family.relationship.${member.relationship}`)}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            selectedFamilyMemberId === member.id
                              ? 'border-teal-500 bg-teal-500'
                              : 'border-cream-400 bg-white'
                          }`}
                          aria-hidden="true"
                        >
                          {selectedFamilyMemberId === member.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Reason Textarea */}
            <ReasonTextarea
              value={reason}
              onChange={setReason}
              label={`${t('reasonForVisit')} *`}
              placeholder={t('reasonPlaceholder')}
              maxLength={200}
            />
          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex-shrink-0 p-4 bg-white border-t border-cream-300">
          <Button
            onClick={handleConfirm}
            disabled={!isOnline || isSubmitting || !reason.trim()}
            loading={isSubmitting}
            variant="primary"
            fullWidth
            size="lg"
          >
            {isOnline ? t('confirmAppointmentBtn') : t('offline')}
          </Button>
        </div>
      </div>
    </div>
  )
}
