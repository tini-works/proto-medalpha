import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconSearch,
  IconUser,
  IconUsers,
  IconArrowRight,
  IconClock,
  IconMapPin,
  IconShieldCheck,
} from '@tabler/icons-react'
import { Header, Page, StickyActionBar } from '../../components'
import { Button, Chip } from '../../components/ui'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import { doctors, specialties, symptoms } from '../../data'

// Patient segment type
type PatientSegment = 'myself' | 'family'

// Intent classification result
type IntentType = 'doctor' | 'specialty' | 'urgent' | 'rebook' | 'unclear'

interface IntentClassification {
  type: IntentType
  confidence: number
  data: {
    doctorId?: string
    specialty?: string
    symptom?: string
    isUrgent?: boolean
  }
}

export default function IntentCaptureScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { profile } = useProfile()
  const {
    setBookingFlow,
    resetBooking,
    selectFamilyMember,
    setSearchFilters,
    selectDoctor,
  } = useBooking()

  const [searchQuery, setSearchQuery] = useState('')
  const [patientSegment, setPatientSegment] = useState<PatientSegment>('myself')
  const [showManualOptions, setShowManualOptions] = useState(false)

  // Check if user has recent doctors for "See my doctor again" feature
  const hasRecentDoctors = useMemo(() => {
    return profile.myDoctors && profile.myDoctors.length > 0
  }, [profile.myDoctors])

  // Intent classification based on search query
  const classifiedIntent = useMemo((): IntentClassification | null => {
    if (!searchQuery.trim()) return null

    const query = searchQuery.toLowerCase().trim()

    // Check for doctor names (partial match)
    const doctorMatch = doctors.find(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        query.includes(d.name.toLowerCase().split(' ')[1]) // Try matching last name
    )

    if (doctorMatch) {
      return {
        type: 'doctor',
        confidence: 0.9,
        data: { doctorId: doctorMatch.id },
      }
    }

    // Check for specialties
    const specialtyMatch = specialties.find(
      (s) =>
        s.value.toLowerCase().includes(query) ||
        t(s.labelKey).toLowerCase().includes(query)
    )

    if (specialtyMatch) {
      return {
        type: 'specialty',
        confidence: 0.85,
        data: { specialty: specialtyMatch.value },
      }
    }

    // Check for urgency keywords
    const urgencyKeywords = [
      'urgent',
      'emergency',
      'pain',
      'bleeding',
      'acute',
      'dringend',
      'schmerzen',
      'notfall',
    ]
    if (urgencyKeywords.some((keyword) => query.includes(keyword))) {
      return {
        type: 'urgent',
        confidence: 0.8,
        data: { isUrgent: true },
      }
    }

    // Check for symptoms that map to specialties
    const symptomMatch = symptoms.find((s) =>
      t(s.labelKey).toLowerCase().includes(query)
    )

    if (symptomMatch) {
      return {
        type: 'specialty',
        confidence: 0.7,
        data: { specialty: symptomMatch.specialty, symptom: symptomMatch.id },
      }
    }

    // If query is too vague or short
    if (query.length < 3) {
      return {
        type: 'unclear',
        confidence: 0.3,
        data: {},
      }
    }

    // Default to unclear but with medium confidence for longer queries
    return {
      type: 'unclear',
      confidence: 0.5,
      data: {},
    }
  }, [searchQuery, t])

  // Handle routing based on intent
  const handleContinue = () => {
    // Reset booking state first
    resetBooking()
    selectFamilyMember(patientSegment === 'family' ? profile.familyMembers[0]?.id || null : null)

    if (!classifiedIntent || classifiedIntent.type === 'unclear') {
      // Show manual options if intent is unclear
      setShowManualOptions(true)
      return
    }

    // Route based on intent type
    switch (classifiedIntent.type) {
      case 'doctor':
        if (classifiedIntent.data.doctorId) {
          const doctor = doctors.find((d) => d.id === classifiedIntent.data.doctorId)
          if (doctor) {
            setBookingFlow('by_doctor')
            selectDoctor(doctor)
            navigate(PATHS.BOOKING_SLOTS.replace(':id', doctor.id))
            return
          }
        }
        break

      case 'specialty':
        if (classifiedIntent.data.specialty) {
          setBookingFlow('by_specialty')
          setSearchFilters({
            specialty: classifiedIntent.data.specialty,
            city: profile.address?.city || '',
            insuranceType: profile.insuranceType || 'GKV',
            includeStores: false,
            radius: 10,
            visitType: 'in_clinic',
            urgency: classifiedIntent.data.symptom ? 'urgent' : 'routine',
            onlyPublic: profile.insuranceType === 'GKV',
            minRating: 0,
            languages: [],
            sortBy: 'earliest',
          })
          navigate(PATHS.BOOKING_AVAILABILITY)
          return
        }
        break

      case 'urgent':
        setBookingFlow('fast_lane')
        navigate(PATHS.FAST_LANE)
        return

      case 'rebook':
        // Handled by the "See my doctor again" quick option
        return
    }

    // Fallback: show manual options
    setShowManualOptions(true)
  }

  // Quick option: Book for myself
  const handleBookForMyself = () => {
    setPatientSegment('myself')
    selectFamilyMember(null)
  }

  // Quick option: Book for family
  const handleBookForFamily = () => {
    setPatientSegment('family')
    if (profile.familyMembers.length > 0) {
      selectFamilyMember(profile.familyMembers[0].id)
    }
  }

  // Quick option: See my doctor again
  const handleRebookMyDoctor = () => {
    if (profile.myDoctors?.[0]?.doctor) {
      const recentDoctor = profile.myDoctors[0].doctor
      resetBooking()
      selectFamilyMember(patientSegment === 'family' ? profile.familyMembers[0]?.id || null : null)
      setBookingFlow('by_doctor')
      selectDoctor(recentDoctor)
      navigate(PATHS.BOOKING_SLOTS.replace(':id', recentDoctor.id))
    }
  }

  // Manual flow selection when intent is unclear
  const handleManualFlowSelect = (flow: 'fast_lane' | 'by_specialty' | 'by_doctor') => {
    resetBooking()
    selectFamilyMember(patientSegment === 'family' ? profile.familyMembers[0]?.id || null : null)
    setBookingFlow(flow)

    switch (flow) {
      case 'fast_lane':
        navigate(PATHS.FAST_LANE)
        break
      case 'by_specialty':
        navigate(PATHS.BOOKING_SPECIALTY)
        break
      case 'by_doctor':
        navigate(PATHS.BOOKING_DOCTOR_SEARCH)
        break
    }
  }

  // Get suggestion text based on classified intent
  const getSuggestionText = () => {
    if (!classifiedIntent) return null

    switch (classifiedIntent.type) {
      case 'doctor':
        return t('intentSuggestionDoctor')
      case 'specialty':
        return t('intentSuggestionSpecialty')
      case 'urgent':
        return t('intentSuggestionUrgent')
      case 'unclear':
        return classifiedIntent.confidence < 0.5 ? t('intentSuggestionUnclear') : null
      default:
        return null
    }
  }

  return (
    <Page>
      <Header title={t('bookAppointment')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Patient Selection */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-charcoal-500">{t('whoIsAppointmentFor')}</h2>
          <div className="flex gap-2">
            <Chip
              selected={patientSegment === 'myself'}
              onClick={handleBookForMyself}
              leadingIcon={<IconUser size={18} />}
              fullWidth
            >
              {t('myself')}
            </Chip>
            <Chip
              selected={patientSegment === 'family'}
              onClick={handleBookForFamily}
              leadingIcon={<IconUsers size={18} />}
              fullWidth
            >
              {t('familyMember')}
            </Chip>
          </div>

          {/* Family member selector (when family is selected) */}
          {patientSegment === 'family' && profile.familyMembers.length > 0 && (
            <div className="mt-3 space-y-2">
              {profile.familyMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => selectFamilyMember(member.id)}
                  className={`w-full bg-white border rounded-xl p-3 text-left transition-all ${
                    profile.familyMembers.find((m) => m.id === member.id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-cream-400 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center">
                      <IconUser size={20} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-charcoal-500">{member.name}</div>
                      <div className="text-xs text-slate-500">
                        {t(`family.relationship.${member.relationship}`)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {patientSegment === 'family' && profile.familyMembers.length === 0 && (
            <div className="mt-3 bg-cream-100 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-600 mb-2">{t('noFamilyMembers')}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(PATHS.PROFILE_FAMILY_ADD)}
              >
                {t('addFamilyMember')}
              </Button>
            </div>
          )}
        </section>

        {/* Intent Capture - Main Search */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">{t('whatBringsYouIn')}</h2>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <IconSearch size={20} stroke={2} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowManualOptions(false)
              }}
              placeholder={t('intentSearchPlaceholder')}
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-cream-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-all duration-normal ease-out-brand"
            />
          </div>

          {/* Intent suggestion hint */}
          {classifiedIntent && classifiedIntent.type !== 'unclear' && (
            <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 rounded-lg px-3 py-2">
              <IconArrowRight size={16} />
              <span>{getSuggestionText()}</span>
            </div>
          )}

          {/* Helper text with examples */}
          <p className="text-xs text-slate-500">
            {t('intentHelperText')}
          </p>
        </section>

        {/* Quick Options */}
        {!showManualOptions && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-charcoal-500">{t('quickOptions')}</h2>
            <div className="grid grid-cols-1 gap-2">
              {hasRecentDoctors && (
                <button
                  type="button"
                  onClick={handleRebookMyDoctor}
                  className="w-full bg-white border border-cream-400 rounded-xl p-4 text-left hover:border-teal-400 hover:bg-cream-50 transition-all duration-normal ease-out-brand"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <IconClock size={20} stroke={2} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-charcoal-500">{t('seeMyDoctorAgain')}</div>
                      <div className="text-xs text-slate-500">
                        {t('recentDoctor', { name: profile.myDoctors![0].doctor.name })}
                      </div>
                    </div>
                    <IconArrowRight size={20} className="text-slate-400" />
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleManualFlowSelect('fast_lane')}
                className="w-full bg-white border border-cream-400 rounded-xl p-4 text-left hover:border-teal-400 hover:bg-cream-50 transition-all duration-normal ease-out-brand"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <IconClock size={20} stroke={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-charcoal-500">{t('fastLane')}</div>
                    <div className="text-xs text-slate-500">{t('fastLaneDesc')}</div>
                  </div>
                  <IconArrowRight size={20} className="text-slate-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleManualFlowSelect('by_specialty')}
                className="w-full bg-white border border-cream-400 rounded-xl p-4 text-left hover:border-teal-400 hover:bg-cream-50 transition-all duration-normal ease-out-brand"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <IconShieldCheck size={20} stroke={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-charcoal-500">{t('bookBySpecialty')}</div>
                    <div className="text-xs text-slate-500">{t('bookBySpecialtyDesc')}</div>
                  </div>
                  <IconArrowRight size={20} className="text-slate-400" />
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Manual Flow Selection (when intent is unclear) */}
        {showManualOptions && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-charcoal-500">{t('howWouldYouLikeToBook')}</h2>
            <p className="text-sm text-slate-600">{t('unclearIntentHelp')}</p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleManualFlowSelect('fast_lane')}
                className="w-full bg-white border border-cream-400 rounded-xl p-4 text-left hover:border-teal-400 hover:bg-cream-50 transition-all duration-normal ease-out-brand"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <IconClock size={20} stroke={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-charcoal-500">{t('fastLane')}</div>
                    <div className="text-xs text-slate-500">{t('fastLaneDesc')}</div>
                  </div>
                  <IconArrowRight size={20} className="text-slate-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleManualFlowSelect('by_specialty')}
                className="w-full bg-white border border-cream-400 rounded-xl p-4 text-left hover:border-teal-400 hover:bg-cream-50 transition-all duration-normal ease-out-brand"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <IconShieldCheck size={20} stroke={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-charcoal-500">{t('bookBySpecialty')}</div>
                    <div className="text-xs text-slate-500">{t('bookBySpecialtyDesc')}</div>
                  </div>
                  <IconArrowRight size={20} className="text-slate-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleManualFlowSelect('by_doctor')}
                className="w-full bg-white border border-cream-400 rounded-xl p-4 text-left hover:border-teal-400 hover:bg-cream-50 transition-all duration-normal ease-out-brand"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                    <IconMapPin size={20} stroke={2} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-charcoal-500">{t('bookByDoctor')}</div>
                    <div className="text-xs text-slate-500">{t('bookByDoctorDesc')}</div>
                  </div>
                  <IconArrowRight size={20} className="text-slate-400" />
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowManualOptions(false)}
              className="w-full text-sm text-slate-500 hover:text-charcoal-500 py-2"
            >
              {t('backToSearch')}
            </button>
          </section>
        )}
      </div>

      {/* Sticky Action Bar */}
      <StickyActionBar>
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleContinue}
          disabled={!searchQuery.trim() && !showManualOptions}
          rightIcon={<IconArrowRight size={20} stroke={2} />}
        >
          {showManualOptions ? t('continueBtn') : t('analyzeMyRequest')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}
