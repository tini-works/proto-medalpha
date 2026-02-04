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

const CONFIRM_ORIGIN_KEY = 'booking.confirm.originFrom'

function readConfirmOrigin(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem(CONFIRM_ORIGIN_KEY)
  } catch {
    return null
  }
}

function writeConfirmOrigin(path: string) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CONFIRM_ORIGIN_KEY, path)
  } catch {
    // ignore
  }
}

export default function ConfirmScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('booking')
  const { selectedDoctor, selectedFamilyMemberId, selectFamilyMember, addAppointment, resetBooking, search, fastLaneRequest, specialtyMatchRequest } = useBooking()
  const { profile } = useProfile()
  const { addHistoryItem } = useHistory()
  const { language } = usePreferences()

  const [reason, setReason] = useState('')
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patientSegment, setPatientSegment] = useState<'myself' | 'family'>(
    selectedFamilyMemberId ? 'family' : 'myself'
  )

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

  const requestedSpecialtyFromContext =
    selectedDoctor?.specialty ??
    specialtyMatchRequest?.specialty ??
    fastLaneRequest?.specialty ??
    search?.specialty

  const requestedSpecialty = requestedSpecialtyFromContext ?? t('specialtyToBeDetermined')

  const effectiveDoctor = selectedDoctor ?? {
    id: 'unassigned',
    name: t('doctorToBeAssigned'),
    specialty: requestedSpecialty,
    city: '',
    address: '',
    imageUrl: '',
  }

  const forUser = selectedFamilyMemberId
    ? profile.familyMembers.find((m) => m.id === selectedFamilyMemberId)
    : null

  const forUserName = forUser ? forUser.name : profile.fullName
  const forUserId = forUser ? forUser.id : profile.id || 'self'

  // Keep locale computed even though date/time is placeholder on this screen.
  getLocale(language)

  // UI: time is a placeholder until the request is sent and the nearest available slot is found.
  const summaryDateLabel = t('appointmentTimePlaceholderTitle')
  const summaryTimeLabel = t('appointmentTimePlaceholderSubtitle')

  useEffect(() => {
    const from = (location.state as any)?.from as string | undefined
    // Persist the sheet origin so that closing the sheet doesn't jump to unrelated screens
    // (e.g. profile flows used while inside the sheet).
    if (from && !from.startsWith('/profile')) {
      writeConfirmOrigin(from)
    }
  }, [location.state])

  useEffect(() => {
    setPatientSegment(selectedFamilyMemberId ? 'family' : 'myself')
  }, [selectedFamilyMemberId])

  const handleConfirm = () => {
    if (!reason.trim()) return
    if (!isOnline || isSubmitting) return
    setIsSubmitting(true)
    const appointmentId = `apt_${Date.now()}`
    const now = new Date()
    const dateISO = now.toISOString().slice(0, 10)
    const time = now.toTimeString().slice(0, 5)

    // Create appointment request (matching) - actual slot is determined after request is sent
    const appointment: Appointment = {
      id: appointmentId,
      doctorId: effectiveDoctor.id,
      doctorName: effectiveDoctor.name,
      specialty: effectiveDoctor.specialty,
      dateISO,
      time,
      forUserId,
      forUserName,
      status: 'matching',
      reminderSet: true,
      calendarSynced: false,
      notes: reason.trim(),
    }

    addAppointment(appointment)

    // Add to history
    const historyItem: HistoryItem = {
      id: `h_${Date.now()}`,
      type: 'appointment',
      title: `Appointment: ${effectiveDoctor.specialty}`,
      subtitle: effectiveDoctor.city ? `${effectiveDoctor.name} · ${effectiveDoctor.city}` : effectiveDoctor.name,
      dateISO,
      status: 'planned',
      forUserId,
      forUserName,
    }

    addHistoryItem(historyItem)

    // Reset booking state
    resetBooking()

    // Confirm CTA: go to Request Sent screen
    navigate(PATHS.BOOKING_REQUEST_SENT, { replace: true, state: { appointmentId } })
  }

  const handleClose = () => {
    const from = (location.state as any)?.from as string | undefined
    const origin = readConfirmOrigin()
    const target = origin ?? from
    if (target) {
      navigate(target)
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
                name: effectiveDoctor.name,
                specialty: effectiveDoctor.specialty,
                imageUrl: effectiveDoctor.imageUrl,
              }}
              date={summaryDateLabel}
              time={summaryTimeLabel}
              type="in-person"
              showVisitType={false}
              address={effectiveDoctor.address}
            />

            {/* Patient selection */}
            <section className="space-y-2">
              <h2 className="text-sm font-medium text-charcoal-500">{t('whoIsAppointmentFor')}</h2>
              <div className="flex gap-2">
                <Chip
                  selected={patientSegment === 'myself'}
                  onClick={() => {
                    setPatientSegment('myself')
                    selectFamilyMember(null)
                  }}
                  fullWidth
                >
                  {t('myself')}
                </Chip>
                <Chip
                  selected={patientSegment === 'family'}
                  onClick={() => {
                    setPatientSegment('family')
                    if (profile.familyMembers.length > 0 && !selectedFamilyMemberId) {
                      selectFamilyMember(profile.familyMembers[0].id)
                    }
                  }}
                  fullWidth
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

              {patientSegment === 'family' && profile.familyMembers.length === 0 && (
                <div className="mt-3 bg-cream-100 rounded-xl p-4 text-center space-y-2">
                  <p className="text-sm text-slate-600">{t('noFamilyMembers')}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-auto px-4"
                    onClick={() =>
                      navigate(PATHS.PROFILE_FAMILY_ADD, {
                        state: { from: location.pathname, skipInBackStack: true, bookingFrom: readConfirmOrigin() },
                      })
                    }
                  >
                    {t('addFamilyMember')}
                  </Button>
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
