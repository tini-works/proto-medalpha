import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronDown, IconX, IconSearch, IconArrowRight } from '@tabler/icons-react'
import { Page, TabBar, DoctorCard, EmptyState, ProgressIndicator, DoctorDetailSheet, StickyActionBar, Header } from '../../components'
import { Button, Chip } from '../../components/ui'
import { useBooking, useProfile } from '../../state'
import { apiSearchDoctors, getTimeSlots } from '../../data'
import { PATHS } from '../../routes'
import type { Doctor, TimeSlot } from '../../types'
import { translateSpecialty } from '../../utils'
import { resolveBookingProgress } from './bookingProgress'

type SortOption = 'earliest' | 'rating' | 'distance'

// Sort labels - will be translated with i18n
const sortLabelKeys: Record<SortOption, string> = {
  earliest: 'earliestAppointment',
  rating: 'highestRated',
  distance: 'nearest',
}

export default function ResultsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { search, setSearchFilters, selectDoctor, selectSlot, bookingFlow, setBookingFlow } = useBooking()
  const { profile, toggleMyDoctor } = useProfile()
  const savedDoctorIds = useMemo(() => new Set(profile.myDoctors.map((e) => e.doctor.id)), [profile.myDoctors])

  // Doctor-first flow is the primary use case for this screen now
  const isDoctorFirstFlow = bookingFlow === 'by_doctor'

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorSlots, setDoctorSlots] = useState<Record<string, TimeSlot[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('earliest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [radius, setRadius] = useState<number>(search?.radius ?? 10)
  const [minRating, setMinRating] = useState<number>(search?.minRating ?? 0)
  const [onlyPublic, setOnlyPublic] = useState<boolean>(Boolean(search?.onlyPublic))
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(search?.languages ?? [])

  // Doctor-first flow: doctor selection and detail sheet
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [detailSheetDoctor, setDetailSheetDoctor] = useState<Doctor | null>(null)

  // Search query and specialty filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null)

  // Set booking flow when entering this screen via doctor-first path
  useEffect(() => {
    if (!bookingFlow) {
      setBookingFlow('by_doctor')
    }
  }, [bookingFlow, setBookingFlow])

  useEffect(() => {
    // Check if there are active filters
    if (search) {
      setRadius(search.radius ?? 10)
      setMinRating(search.minRating ?? 0)
      setOnlyPublic(Boolean(search.onlyPublic))
      setSelectedLanguages(search.languages ?? [])
      setSortBy((search.sortBy as SortOption) || 'earliest')
    }

    const fetchDoctors = async () => {
      setLoading(true)
      setError(null)
      try {
        const searchParams = search
          ? {
              specialty: search.specialty,
              city: search.city,
              insuranceType: search.insuranceType,
            }
          : {}

        const results = await apiSearchDoctors(searchParams)
        setDoctors(results)

        // Fetch slots for each doctor
        const slotsMap: Record<string, TimeSlot[]> = {}
        for (const doctor of results) {
          slotsMap[doctor.id] = getTimeSlots(doctor.id)
        }
        setDoctorSlots(slotsMap)
      } catch {
        setError(t('errors.loadDoctorsFailed'))
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [search, t])

  const availableLanguages = useMemo(() => {
    const set = new Set<string>()
    for (const doctor of doctors) {
      for (const lang of doctor.languages) set.add(lang)
    }
    const list = Array.from(set)
    list.sort((a, b) => a.localeCompare(b))
    return list
  }, [doctors])

  // Get unique specialties for filter chips
  const availableSpecialties = useMemo(() => {
    const set = new Set<string>()
    for (const doctor of doctors) {
      set.add(doctor.specialty)
    }
    return Array.from(set).sort()
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      // Search by name or specialty
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const nameMatch = doctor.name.toLowerCase().includes(query)
        const specialtyMatch = doctor.specialty.toLowerCase().includes(query)
        if (!nameMatch && !specialtyMatch) return false
      }
      // Specialty filter (for doctor-first flow)
      if (specialtyFilter && doctor.specialty !== specialtyFilter) return false
      if (onlyPublic && !doctor.accepts.includes('GKV')) return false
      if (minRating > 0 && doctor.rating < minRating) return false
      if (selectedLanguages.length > 0 && !selectedLanguages.some((l) => doctor.languages.includes(l))) return false
      return true
    })
  }, [doctors, searchQuery, specialtyFilter, onlyPublic, minRating, selectedLanguages])

  // Sort doctors based on selected option
  const sortedDoctors = useMemo(() => {
    return [...filteredDoctors].sort((a, b) => {
      switch (sortBy) {
        case 'earliest':
          return new Date(a.nextAvailableISO).getTime() - new Date(b.nextAvailableISO).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          // Mock distance based on ID
          const distA = parseFloat(a.id.replace('d', '')) * 0.3 + 0.5
          const distB = parseFloat(b.id.replace('d', '')) * 0.3 + 0.5
          return distA - distB
        default:
          return 0
      }
    })
  }, [filteredDoctors, sortBy])

  const handleSelectDoctor = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: PATHS.BOOKING_RESULTS, submitMode: 'confirm' } })
  }

  const handleSelectSlot = (doctor: Doctor, slot: TimeSlot) => {
    selectDoctor(doctor)
    selectSlot(slot)
    navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: PATHS.BOOKING_RESULTS, submitMode: 'confirm' } })
  }

  const handleMoreAppointments = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: PATHS.BOOKING_RESULTS, submitMode: 'confirm' } })
  }

  // Specialty-first flow: handle doctor selection via radio
  const handleDoctorRadioSelect = (doctorId: string) => {
    setSelectedDoctorId(selectedDoctorId === doctorId ? null : doctorId)
  }

  // Specialty-first flow: open detail bottom sheet
  const handleViewDetails = (doctor: Doctor) => {
    setDetailSheetDoctor(doctor)
  }

  // Specialty-first flow: select doctor from detail sheet
  const handleSelectFromSheet = () => {
    if (detailSheetDoctor) {
      setSelectedDoctorId(detailSheetDoctor.id)
      setDetailSheetDoctor(null)
    }
  }

  // Doctor-first flow: continue with selected doctor to symptoms screen
  const handleContinue = () => {
    const selectedDoctor = sortedDoctors.find((d) => d.id === selectedDoctorId)
    if (!selectedDoctor) return

    selectDoctor(selectedDoctor)
    navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: PATHS.BOOKING_RESULTS, submitMode: 'confirm' } })
  }

  return (
    <Page>
      <Header title={isDoctorFirstFlow ? t('selectDoctor') : t('searchResults')} showBack />

      {/* Progress indicator for doctor-first flow */}
      {isDoctorFirstFlow && (
        <div className="px-4 py-4 space-y-3 bg-white border-b border-cream-300">
          {(() => {
            const progress = resolveBookingProgress({ bookingFlow, fallbackFlow: 'by_doctor', currentStep: 2 })
            return (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide text-slate-600">{t(progress.stepLabelKey)}</span>
                  <span className="text-xs text-slate-500">{t('yourRequest')}</span>
                </div>
                <ProgressIndicator
                  currentStep={progress.currentStep}
                  totalSteps={progress.totalSteps}
                  variant="bar"
                  showLabel={false}
                  showPercentage={false}
                />
              </>
            )
          })()}
        </div>
      )}

      {/* Specialty filter chips for doctor-first flow */}
      {isDoctorFirstFlow && availableSpecialties.length > 1 && (
        <div className="px-4 py-2 bg-white border-b border-cream-300">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <Chip
              shape="pill"
              selected={!specialtyFilter}
              onClick={() => setSpecialtyFilter(null)}
              className="whitespace-nowrap"
            >
              {t('allSpecialties')}
            </Chip>
            {availableSpecialties.map((specialty) => (
              <Chip
                key={specialty}
                shape="pill"
                selected={specialtyFilter === specialty}
                onClick={() => setSpecialtyFilter(specialty)}
                className="whitespace-nowrap"
              >
                {translateSpecialty(t, specialty)}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* My Doctors */}
      {profile.myDoctors.length > 0 && (
        <div className="px-4 py-4 bg-white border-b border-cream-300">
          <h2 className="text-sm font-semibold text-charcoal-500 mb-3">{t('myDoctors')}</h2>
          <div className="space-y-3">
            {profile.myDoctors.map((entry) => (
              <DoctorCard
                key={entry.doctor.id}
                doctor={entry.doctor}
                showSlots={false}
                onSelectDoctor={() => handleSelectDoctor(entry.doctor)}
                onViewDetails={() => handleViewDetails(entry.doctor)}
                saved
                onToggleSaved={() => toggleMyDoctor(entry.doctor)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-cream-300">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" size={20} stroke={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchDoctorPlaceholder')}
            className="w-full pl-10 pr-10 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sm text-charcoal-500 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600"
              aria-label={t('clearSearch')}
            >
              <IconX size={16} stroke={2} />
            </button>
          )}
        </div>
      </div>

      {/* Sort Selector Row */}
      <div className="bg-cream-100 border-b border-cream-300">
        <div className="px-4 py-2.5">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 text-sm text-slate-600"
            >
              <span>{t('sortedBy')}</span>
              <span className="font-semibold text-charcoal-500">{t(sortLabelKeys[sortBy])}</span>
              <IconChevronDown className="w-4 h-4" size={16} stroke={2} />
            </button>

            {/* Sort dropdown menu */}
            {showSortMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                {/* Menu */}
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-cream-400 py-1 z-20">
                  {(Object.keys(sortLabelKeys) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option)
                        setShowSortMenu(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        sortBy === option
                          ? 'bg-cream-200 text-charcoal-500 font-medium'
                          : 'text-slate-700 hover:bg-cream-50'
                      }`}
                    >
                      {t(sortLabelKeys[option])}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-slate-500 mt-1">
            {loading ? t('searching') : `${sortedDoctors.length} ${sortedDoctors.length !== 1 ? t('doctorsFound') : t('doctorFound')}`}
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className={`px-4 py-4 ${isDoctorFirstFlow ? 'pb-28' : 'pb-24'}`}>
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-red-600 underline hover:no-underline"
            >
              {t('tryAgain')}
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-neutral-100 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-neutral-100 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-neutral-100 rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-neutral-100 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="h-6 bg-neutral-100 rounded w-24 animate-pulse" />
                  <div className="h-6 bg-neutral-100 rounded w-16 animate-pulse" />
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="flex gap-2">
                    <div className="h-12 bg-neutral-100 rounded-lg w-24 animate-pulse" />
                    <div className="h-12 bg-neutral-100 rounded-lg w-24 animate-pulse" />
                    <div className="h-12 bg-neutral-100 rounded-lg w-24 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedDoctors.length === 0 ? (
          <EmptyState
            icon="search"
            title={t('noDoctorsFound')}
            description={t('noResultsHint')}
            action={
              <button
                onClick={() => setShowFilters(true)}
                className="btn btn-primary btn-block"
              >
                {t('updateRequest')}
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {sortedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                slots={isDoctorFirstFlow ? [] : (doctorSlots[doctor.id] || [])}
                showSlots={!isDoctorFirstFlow}
                saved={savedDoctorIds.has(doctor.id)}
                onToggleSaved={() => toggleMyDoctor(doctor)}
                selectable={isDoctorFirstFlow}
                selected={selectedDoctorId === doctor.id}
                onSelect={() => handleDoctorRadioSelect(doctor.id)}
                onViewDetails={() => handleViewDetails(doctor)}
                onSelectDoctor={() => handleSelectDoctor(doctor)}
                onSelectSlot={(slot) => handleSelectSlot(doctor, slot)}
                onMoreAppointments={() => handleMoreAppointments(doctor)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom action bar for doctor-first flow */}
      {isDoctorFirstFlow && !loading && sortedDoctors.length > 0 && (
        <StickyActionBar zIndexClassName="z-30">
          <Button
            onClick={handleContinue}
            disabled={!selectedDoctorId}
            variant="primary"
            fullWidth
            size="lg"
            rightIcon={<IconArrowRight size={20} stroke={2} />}
          >
            {t('continueBtn')}
          </Button>
        </StickyActionBar>
      )}

      {/* Doctor Detail Sheet */}
      {detailSheetDoctor && (
        <DoctorDetailSheet
          doctor={detailSheetDoctor}
          onClose={() => setDetailSheetDoctor(null)}
          onSelect={handleSelectFromSheet}
          saved={savedDoctorIds.has(detailSheetDoctor.id)}
          onToggleSaved={() => toggleMyDoctor(detailSheetDoctor)}
        />
      )}

      {/* Only show TabBar when not in doctor-first flow */}
      {!isDoctorFirstFlow && <TabBar />}
    </Page>
  )
}
