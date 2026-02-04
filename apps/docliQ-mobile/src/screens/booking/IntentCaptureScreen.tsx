import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconSearch,
  IconUser,
  IconUsers,
  IconArrowRight,
  IconClock,
  IconMapPin,
  IconShieldCheck,
  IconPlus,
} from '@tabler/icons-react'
import { Header, Page, StickyActionBar, Avatar } from '../../components'
import { Button, Chip } from '../../components/ui'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import { doctors, specialties, symptoms } from '../../data'

function normalizeForMatch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .toLowerCase()
    .trim()
}

function levenshteinDistance(aRaw: string, bRaw: string) {
  const a = normalizeForMatch(aRaw)
  const b = normalizeForMatch(bRaw)
  if (a === b) return 0
  if (!a) return b.length
  if (!b) return a.length

  const v0 = new Array<number>(b.length + 1)
  const v1 = new Array<number>(b.length + 1)
  for (let i = 0; i <= b.length; i++) v0[i] = i

  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost)
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j]
  }

  return v1[b.length]
}

function isLooseNameMatch(queryRaw: string, candidateRaw: string) {
  const query = normalizeForMatch(queryRaw)
  const candidate = normalizeForMatch(candidateRaw)
  if (!query || !candidate) return false

  if (candidate.includes(query)) return true

  const queryTokens = query.split(/\s+/).filter(Boolean)
  const candidateTokens = candidate.split(/\s+/).filter(Boolean)

  // Short query: allow fuzzy prefix matching (e.g. "sm" -> "schmidt")
  if (query.length >= 2 && query.length <= 3) {
    for (const token of candidateTokens) {
      if (token.length < query.length) continue
      const tokenPrefix = token.slice(0, query.length)
      if (levenshteinDistance(query, tokenPrefix) <= 1) return true
    }
  }

  // Quick token containment (handles "schmid", "dr schmidt", etc.)
  for (const qt of queryTokens) {
    if (candidateTokens.some((ct) => ct.includes(qt))) return true
  }

  // Fuzzy match on last-name-ish tokens to tolerate small typos (e.g. "smithch" -> "schmidt")
  const queryCore = queryTokens[queryTokens.length - 1] ?? query
  const candidateCore = candidateTokens[candidateTokens.length - 1] ?? candidate

  if (queryCore.length < 4 || candidateCore.length < 4) return false
  return levenshteinDistance(queryCore, candidateCore) <= 2
}

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

// Suggestion types for autocomplete
type SuggestionType = 'doctor' | 'specialty' | 'symptom'

interface SearchSuggestion {
  id: string
  type: SuggestionType
  title: string
  subtitle?: string
  icon: 'doctor' | 'specialty' | 'symptom'
  data: {
    doctorId?: string
    specialty?: string
    symptom?: string
  }
}

export default function IntentCaptureScreen() {
  const navigate = useNavigate()
  const location = useLocation()
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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Check if user has recent doctors for "See my doctor again" feature
  const hasRecentDoctors = useMemo(() => {
    return profile.myDoctors && profile.myDoctors.length > 0
  }, [profile.myDoctors])

  // Intent classification based on search query
  const classifiedIntent = useMemo((): IntentClassification | null => {
    if (!searchQuery.trim()) return null

    const query = normalizeForMatch(searchQuery)

    // Check for doctor names (partial match)
    const doctorMatch = doctors.find(
      (d) =>
        isLooseNameMatch(query, d.name) ||
        isLooseNameMatch(query, d.specialty) // allow specialty-in-name matching to still route
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
        normalizeForMatch(s.value).includes(query) ||
        normalizeForMatch(t(s.labelKey)).includes(query)
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

    // Generate search suggestions when user types 2+ characters
  const searchSuggestions = useMemo((): SearchSuggestion[] => {
    const query = normalizeForMatch(searchQuery)
    if (query.length < 2) return []

    const suggestions: SearchSuggestion[] = []

    // Find matching doctors (limit to 3)
    const matchingDoctors = doctors
      .filter(
        (d) =>
          isLooseNameMatch(query, d.name) ||
          normalizeForMatch(d.specialty).includes(query)
      )
      .slice(0, 3)

    matchingDoctors.forEach((doctor) => {
      suggestions.push({
        id: `doc-${doctor.id}`,
        type: 'doctor',
        title: doctor.name,
        subtitle: doctor.specialty,
        icon: 'doctor',
        data: { doctorId: doctor.id },
      })
    })

    // Find matching specialties (limit to 3)
    const matchingSpecialties = specialties
      .filter(
        (s) =>
          normalizeForMatch(s.value).includes(query) ||
          normalizeForMatch(t(s.labelKey)).includes(query)
      )
      .slice(0, 3)

    matchingSpecialties.forEach((specialty) => {
      // Only add if not already added via doctor match
      const alreadyAdded = suggestions.some(
        (s) => s.type === 'specialty' && s.data.specialty === specialty.value
      )
      if (!alreadyAdded) {
        suggestions.push({
          id: `spec-${specialty.id}`,
          type: 'specialty',
          title: t(specialty.labelKey),
          subtitle: t('bookBySpecialtyDesc'),
          icon: 'specialty',
          data: { specialty: specialty.value },
        })
      }
    })

    // Find matching symptoms (limit to 3)
    const matchingSymptoms = symptoms
      .filter((s) => normalizeForMatch(t(s.labelKey)).includes(query))
      .slice(0, 3)

    matchingSymptoms.forEach((symptom) => {
      suggestions.push({
        id: `sym-${symptom.id}`,
        type: 'symptom',
        title: t(symptom.labelKey),
        subtitle: `${t('specialty')}: ${t(
          `specialty${symptom.specialty.replace(/\s/g, '')}`
        )}`,
        icon: 'symptom',
        data: { specialty: symptom.specialty, symptom: symptom.id },
      })
    })

    // Limit total suggestions to 7
    return suggestions.slice(0, 7)
  }, [searchQuery, t])

  // Click outside handler to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle suggestion selection and navigate
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setShowSuggestions(false)
    resetBooking()
    selectFamilyMember(
      patientSegment === 'family' ? profile.familyMembers[0]?.id || null : null
    )

    switch (suggestion.type) {
      case 'doctor':
        if (suggestion.data.doctorId) {
          const doctor = doctors.find((d) => d.id === suggestion.data.doctorId)
          if (doctor) {
            setBookingFlow('by_doctor')
            selectDoctor(doctor)
            navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: location.pathname, submitMode: 'confirm' } })
          }
        }
        break

      case 'specialty':
      case 'symptom':
        if (suggestion.data.specialty) {
          setBookingFlow('by_specialty')
          setSearchFilters({
            specialty: suggestion.data.specialty,
            city: profile.address?.city || '',
            insuranceType: profile.insuranceType || 'GKV',
            includeStores: false,
            radius: 10,
            visitType: 'in_clinic',
            urgency: suggestion.data.symptom ? 'urgent' : 'routine',
            onlyPublic: profile.insuranceType === 'GKV',
            minRating: 0,
            languages: [],
            sortBy: 'earliest',
          })
          navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: location.pathname, submitMode: 'confirm' } })
        }
        break
    }
  }

  const handleViewAllDoctors = () => {
    setShowSuggestions(false)
    resetBooking()
    selectFamilyMember(patientSegment === 'family' ? profile.familyMembers[0]?.id || null : null)
    setBookingFlow('by_doctor')
    navigate(PATHS.BOOKING_RESULTS, { state: { from: location.pathname } })
  }

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
            navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: location.pathname, submitMode: 'confirm' } })
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
          navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: location.pathname, submitMode: 'confirm' } })
          return
        }
        break

      case 'urgent':
        setBookingFlow('fast_lane')
        navigate(PATHS.BOOKING_CONFIRM, { state: { from: location.pathname } })
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
      navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: location.pathname, submitMode: 'confirm' } })
    }
  }

  // Manual flow selection when intent is unclear
  const handleManualFlowSelect = (flow: 'fast_lane' | 'by_specialty' | 'by_doctor') => {
    resetBooking()
    selectFamilyMember(patientSegment === 'family' ? profile.familyMembers[0]?.id || null : null)
    setBookingFlow(flow)

    switch (flow) {
      case 'fast_lane':
        navigate(PATHS.BOOKING_CONFIRM, { state: { from: location.pathname } })
        break
      case 'by_specialty':
        navigate(PATHS.BOOKING_SPECIALTY, { state: { from: location.pathname } })
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
            <div className="mt-3 bg-cream-100 rounded-xl p-4 text-center space-y-2">
              <p className="text-sm text-slate-600">{t('noFamilyMembers')}</p>
              <Button
                variant="secondary"
                size="sm"
                className="w-auto px-4"
                leftIcon={<IconPlus size={16} stroke={2} />}
                onClick={() =>
                  navigate(PATHS.PROFILE_FAMILY_ADD, {
                    state: { from: location.pathname, skipInBackStack: true },
                  })
                }
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
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value
                setSearchQuery(value)
                setShowManualOptions(false)
                setShowSuggestions(value.trim().length >= 2)
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) {
                  setShowSuggestions(true)
                }
              }}
              placeholder={t('intentSearchPlaceholder')}
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-cream-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-all duration-normal ease-out-brand"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (searchSuggestions.length > 0 || normalizeForMatch(searchQuery).length >= 2) && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-cream-400 rounded-xl shadow-lg shadow-slate-200/50 z-50 overflow-hidden"
              >
                <div className="max-h-72 flex flex-col">
                  <div className="overflow-y-auto py-2">
                    {searchSuggestions.map((suggestion, index) => (
                    (() => {
                      if (suggestion.type !== 'doctor' || !suggestion.data.doctorId) return null
                      const doctor = doctors.find((d) => d.id === suggestion.data.doctorId)
                      if (!doctor) return null
                      const distanceKm = (parseFloat(doctor.id.replace('d', '')) * 0.7 + 0.8).toFixed(1)
                      const insurance =
                        doctor.accepts.includes('GKV') && doctor.accepts.includes('PKV')
                          ? 'GKV / PKV'
                          : doctor.accepts.includes('GKV')
                            ? 'GKV'
                            : doctor.accepts.includes('PKV')
                              ? 'PKV'
                              : '—'

                      const showDivider = index !== searchSuggestions.length - 1

                      return (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-cream-50 transition-colors ${
                            showDivider ? 'border-b border-cream-200' : ''
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-cream-100 flex items-center justify-center flex-shrink-0">
                            <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="sm" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-charcoal-500 text-sm truncate">
                              {doctor.name}
                            </div>
                            <div className="text-xs text-slate-500 truncate">{doctor.specialty}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              ★ {doctor.rating.toFixed(1)} ({doctor.reviewCount}) · ~{distanceKm} km · {insurance}
                            </div>
                          </div>

                          <IconArrowRight size={18} className="text-slate-400 flex-shrink-0" />
                        </button>
                      )
                    })() ?? (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-cream-50 transition-colors ${
                        index !== searchSuggestions.length - 1 ? 'border-b border-cream-200' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          suggestion.icon === 'doctor'
                            ? 'bg-sky-100 text-sky-600'
                            : suggestion.icon === 'specialty'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {suggestion.icon === 'doctor' && <IconUsers size={20} stroke={2} />}
                        {suggestion.icon === 'specialty' && <IconShieldCheck size={20} stroke={2} />}
                        {suggestion.icon === 'symptom' && <IconClock size={20} stroke={2} />}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-charcoal-500 text-sm truncate">
                          {suggestion.title}
                        </div>
                        {suggestion.subtitle && (
                          <div className="text-xs text-slate-500 truncate">
                            {suggestion.subtitle}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <IconArrowRight size={18} className="text-slate-400 flex-shrink-0" />
                    </button>
                    )
                  ))}
                  </div>

                  {/* Sticky footer: View all doctors */}
                  {normalizeForMatch(searchQuery).length >= 2 && (
                    <div className="sticky bottom-0 bg-white border-t border-cream-200">
                      <button
                        type="button"
                        onClick={handleViewAllDoctors}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-teal-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 flex-shrink-0">
                          <IconUsers size={20} stroke={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-charcoal-500 text-sm truncate">
                            {t('viewAllDoctors')}
                          </div>
                        </div>
                        <IconArrowRight size={18} className="text-teal-700 flex-shrink-0" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
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
          {t('continueBtn')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}
