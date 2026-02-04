import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconAlertCircle, IconCheck, IconShield, IconCalendar } from '@tabler/icons-react'
import { Header, Page, StickyActionBar, ProgressIndicator } from '../../components'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import { Button } from '../../components/ui'
import { getStepLabelKey } from './bookingProgress'
import { getTimeSlots } from '../../data'
import { pickNextAvailableSlot } from './quickRebook'

type AppointmentTypeId = 'acute_urgent' | 'prevention_wellness' | 'follow_up'
type PatientSegment = 'myself' | 'family'

function formatAge(dateOfBirthISO?: string) {
  if (!dateOfBirthISO) return null
  const dob = new Date(dateOfBirthISO)
  if (Number.isNaN(dob.getTime())) return null
  const now = new Date()
  let years = now.getFullYear() - dob.getFullYear()
  const m = now.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years -= 1
  return years >= 0 ? years : null
}

export default function BookingTypeScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('booking')
  const { profile } = useProfile()
  const { selectedFamilyMemberId, selectFamilyMember, setBookingFlow, resetBooking, selectDoctor, selectSlot } = useBooking()
  const [appointmentTypeId, setAppointmentTypeId] = useState<AppointmentTypeId>('acute_urgent')
  const [patientSegment, setPatientSegment] = useState<PatientSegment>(
    selectedFamilyMemberId ? 'family' : 'myself'
  )

  const canContinue =
    patientSegment === 'myself' || (patientSegment === 'family' && profile.familyMembers.length > 0 && !!selectedFamilyMemberId)

  const progressConfig = (() => {
    if (appointmentTypeId === 'follow_up') return { totalSteps: 2 }
    if (appointmentTypeId === 'prevention_wellness') return { totalSteps: 5 }
    return { totalSteps: 3 }
  })()

  const handleContinue = () => {
    const mapping: Record<AppointmentTypeId, { flow: 'fast_lane' | 'by_specialty' | 'by_doctor'; path: string }> = {
      follow_up: { flow: 'fast_lane', path: PATHS.FAST_LANE },
      prevention_wellness: { flow: 'by_doctor', path: PATHS.BOOKING_RESULTS },
      acute_urgent: { flow: 'by_specialty', path: PATHS.BOOKING_SPECIALTY },
    }

    const currentFamilyMemberId = patientSegment === 'family' ? selectedFamilyMemberId : null
    resetBooking()
    selectFamilyMember(currentFamilyMemberId)

    const { flow, path } = mapping[appointmentTypeId]
    setBookingFlow(flow)

    // Approach2: Follow-up becomes quick rebook when we have a recent doctor.
    if (appointmentTypeId === 'follow_up') {
      const recentDoctor = profile.myDoctors?.[0]?.doctor
      if (recentDoctor) {
        const nextSlot = pickNextAvailableSlot(getTimeSlots(recentDoctor.id))
        if (nextSlot) {
          selectDoctor(recentDoctor as any)
          selectSlot(nextSlot)
          navigate(PATHS.BOOKING_CONFIRM)
          return
        }
      }
    }

    navigate(path)
  }

  return (
    <Page>
      <Header title={t('bookAppointment')} showBack />

      <div className="px-4 py-4 space-y-3 bg-white border-b border-cream-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">
            {t(getStepLabelKey(1, progressConfig.totalSteps))}
          </span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator
          currentStep={1}
          totalSteps={progressConfig.totalSteps}
          variant="bar"
          showLabel={false}
          showPercentage={false}
        />
      </div>

      <div className="px-4 py-6 space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">{t('whoIsAppointmentFor')}</h2>

          {/* Segmented control */}
          <div className="bg-white border border-cream-400 rounded-xl p-1 flex">
            <button
              type="button"
              onClick={() => {
                setPatientSegment('myself')
                selectFamilyMember(null)
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                patientSegment === 'myself'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-700 hover:bg-cream-100'
              }`}
              aria-pressed={patientSegment === 'myself'}
            >
              {t('myself')}
            </button>
            <button
              type="button"
              onClick={() => {
                setPatientSegment('family')
                if (profile.familyMembers.length > 0 && !selectedFamilyMemberId) {
                  selectFamilyMember(profile.familyMembers[0].id)
                }
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                patientSegment === 'family'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-700 hover:bg-cream-100'
              }`}
              aria-pressed={patientSegment === 'family'}
            >
              {t('familyMember')}
            </button>
          </div>

          {patientSegment === 'family' && profile.familyMembers.length > 0 ? (
            <div className="space-y-3">
              {profile.familyMembers.map((member) => {
                const isSelected = selectedFamilyMemberId === member.id
                const age = formatAge(member.dateOfBirth)
                const ageLabel = age === null ? t('family.ageUnknown') : t('family.age', { age })

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => selectFamilyMember(member.id)}
                    className={`w-full bg-white border rounded-2xl p-4 text-left transition-all duration-200 ${
                      isSelected ? 'border-teal-600 shadow-sm' : 'border-cream-400 hover:border-teal-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-charcoal-500">{member.name}</div>
                        <div className="text-sm text-slate-500 mt-0.5">
                          {t(`family.relationship.${member.relationship}`)} · {ageLabel}
                        </div>
                      </div>
                      <div
                        aria-hidden="true"
                        className={`w-7 h-7 mt-1 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-teal-600' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected ? <IconCheck size={16} stroke={3} className="text-white" /> : null}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : patientSegment === 'family' ? (
            <div className="bg-white border border-cream-400 rounded-2xl p-4">
              <p className="text-sm text-slate-600">{t('noFamilyMembers')}</p>
              <button
                type="button"
                onClick={() =>
                  navigate(PATHS.PROFILE_FAMILY_ADD, {
                    state: { from: location.pathname, skipInBackStack: true },
                  })
                }
                className="mt-3 text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                {t('addFamilyMember')}
              </button>
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">{t('appointmentTypeTitle')}</h2>

          <button
            type="button"
            onClick={() => setAppointmentTypeId('acute_urgent')}
            className={`w-full bg-white border rounded-2xl p-4 text-left transition-all duration-200 ${
              appointmentTypeId === 'acute_urgent' ? 'border-teal-600 shadow-sm' : 'border-cream-400 hover:border-teal-400'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-100 text-rose-600">
                <IconAlertCircle className="w-6 h-6" stroke={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-charcoal-500">{t('appointmentType.acute.title')}</div>
                <div className="text-sm text-slate-500 mt-0.5">{t('appointmentType.acute.description')}</div>
              </div>
              <div
                aria-hidden="true"
                className={`w-7 h-7 mt-1 rounded-full flex items-center justify-center flex-shrink-0 ${
                  appointmentTypeId === 'acute_urgent' ? 'bg-teal-600' : 'border border-slate-300 bg-white'
                }`}
              >
                {appointmentTypeId === 'acute_urgent' ? <IconCheck size={16} stroke={3} className="text-white" /> : null}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAppointmentTypeId('prevention_wellness')}
            className={`w-full bg-white border rounded-2xl p-4 text-left transition-all duration-200 ${
              appointmentTypeId === 'prevention_wellness'
                ? 'border-teal-600 shadow-sm'
                : 'border-cream-400 hover:border-teal-400'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                <IconShield className="w-6 h-6" stroke={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-charcoal-500">{t('appointmentType.prevention.title')}</div>
                <div className="text-sm text-slate-500 mt-0.5">{t('appointmentType.prevention.description')}</div>
              </div>
              <div
                aria-hidden="true"
                className={`w-7 h-7 mt-1 rounded-full flex items-center justify-center flex-shrink-0 ${
                  appointmentTypeId === 'prevention_wellness' ? 'bg-teal-600' : 'border border-slate-300 bg-white'
                }`}
              >
                {appointmentTypeId === 'prevention_wellness' ? (
                  <IconCheck size={16} stroke={3} className="text-white" />
                ) : null}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAppointmentTypeId('follow_up')}
            className={`w-full bg-white border rounded-2xl p-4 text-left transition-all duration-200 ${
              appointmentTypeId === 'follow_up' ? 'border-teal-600 shadow-sm' : 'border-cream-400 hover:border-teal-400'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-100 text-sky-600">
                <IconCalendar className="w-6 h-6" stroke={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-charcoal-500">{t('appointmentType.followUp.title')}</div>
                <div className="text-sm text-slate-500 mt-0.5">{t('appointmentType.followUp.description')}</div>
              </div>
              <div
                aria-hidden="true"
                className={`w-7 h-7 mt-1 rounded-full flex items-center justify-center flex-shrink-0 ${
                  appointmentTypeId === 'follow_up' ? 'bg-teal-600' : 'border border-slate-300 bg-white'
                }`}
              >
                {appointmentTypeId === 'follow_up' ? <IconCheck size={16} stroke={3} className="text-white" /> : null}
              </div>
            </div>
          </button>
        </section>
      </div>

      <StickyActionBar>
        <Button variant="primary" fullWidth size="lg" onClick={handleContinue} disabled={!canContinue}>
          {t('continueBtn')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}
