import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconArrowLeft, IconFilter, IconChevronDown, IconX } from '@tabler/icons-react'
import { Page, TabBar, DoctorCard, EmptyState } from '../../components'
import { useBooking } from '../../state'
import { apiSearchDoctors, getTimeSlots } from '../../data'
import { doctorPath, doctorSlotsPath, PATHS } from '../../routes'
import type { Doctor, TimeSlot } from '../../types'

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
  const { search, setSearchFilters, selectDoctor, selectSlot } = useBooking()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorSlots, setDoctorSlots] = useState<Record<string, TimeSlot[]>>({})
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('earliest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [radius, setRadius] = useState<number>(search?.radius ?? 10)
  const [minRating, setMinRating] = useState<number>(search?.minRating ?? 0)
  const [onlyPublic, setOnlyPublic] = useState<boolean>(Boolean(search?.onlyPublic))
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(search?.languages ?? [])

  useEffect(() => {
    // Check if there are active filters
    if (search) {
      setRadius(search.radius ?? 10)
      setMinRating(search.minRating ?? 0)
      setOnlyPublic(Boolean(search.onlyPublic))
      setSelectedLanguages(search.languages ?? [])
      setSortBy((search.sortBy as SortOption) || 'earliest')

      setHasActiveFilters(
        Boolean(
          (search.radius ?? 10) !== 10 ||
            Boolean(search.onlyPublic) ||
            (search.minRating ?? 0) > 0 ||
            (search.languages?.length ?? 0) > 0
        )
      )
    }

    const fetchDoctors = async () => {
      setLoading(true)
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
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [search])

  const availableLanguages = useMemo(() => {
    const set = new Set<string>()
    for (const doctor of doctors) {
      for (const lang of doctor.languages) set.add(lang)
    }
    const list = Array.from(set)
    list.sort((a, b) => a.localeCompare(b))
    return list
  }, [doctors])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (radius !== 10) count += 1
    if (onlyPublic) count += 1
    if (minRating > 0) count += 1
    if (selectedLanguages.length > 0) count += 1
    return count
  }, [radius, onlyPublic, minRating, selectedLanguages.length])

  const applyFiltersToState = () => {
    if (!search) return
    setSearchFilters({
      ...search,
      radius,
      minRating,
      onlyPublic,
      languages: selectedLanguages,
      sortBy,
    })
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      if (onlyPublic && !doctor.accepts.includes('GKV')) return false
      if (minRating > 0 && doctor.rating < minRating) return false
      if (selectedLanguages.length > 0 && !selectedLanguages.some((l) => doctor.languages.includes(l))) return false
      return true
    })
  }, [doctors, onlyPublic, minRating, selectedLanguages])

  // Sort doctors based on selected option
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
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

  const handleSelectDoctor = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(doctorPath(doctor.id))
  }

  const handleSelectSlot = (doctor: Doctor, slot: TimeSlot) => {
    selectDoctor(doctor)
    selectSlot(slot)
    navigate(PATHS.BOOKING_CONFIRM)
  }

  const handleMoreAppointments = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(doctorSlotsPath(doctor.id))
  }

  const handleFilterClick = () => {
    setShowFilters(true)
  }

  return (
    <Page>
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-cream-300">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back button */}
          <button
            onClick={() => navigate(PATHS.BOOKING_LOCATION)}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-neutral-100"
            aria-label={t('goBack')}
          >
            <IconArrowLeft className="w-6 h-6 text-neutral-700" size={24} stroke={2} />
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold text-charcoal-500">{t('searchResults')}</h1>

          {/* Filter button with badge */}
          <button
            onClick={handleFilterClick}
            className="relative flex items-center justify-center w-10 h-10 -mr-2 rounded-full hover:bg-neutral-100 text-neutral-600"
            aria-label={t('filters')}
          >
            <IconFilter className="w-5 h-5" size={20} stroke={2} />
            {hasActiveFilters && <span className="absolute -top-0.5 -right-0.5 text-[11px] font-semibold bg-teal-600 text-white rounded-full px-1.5 py-0.5">{activeFilterCount}</span>}
          </button>
        </div>
      </header>

      {/* Sort Selector Row */}
      <div className="sticky top-[57px] z-10 bg-cream-100 border-b border-cream-300">
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
      <div className="px-4 py-4 pb-24">
        {loading ? (
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
                slots={doctorSlots[doctor.id] || []}
                onSelectDoctor={() => handleSelectDoctor(doctor)}
                onSelectSlot={(slot) => handleSelectSlot(doctor, slot)}
                onMoreAppointments={() => handleMoreAppointments(doctor)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filters Sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
            onClick={() => {
              applyFiltersToState()
              setShowFilters(false)
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[90vh] flex flex-col rounded-t-3xl bg-white overflow-hidden animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-cream-400" />
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
              <h2 className="text-lg font-semibold text-charcoal-500">{t('filters')}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRadius(10)
                  setMinRating(0)
                  setOnlyPublic(false)
                  setSelectedLanguages([])
                }}
                className="text-sm font-medium text-slate-600 hover:underline"
              >
                {t('clearAll')}
              </button>
                <button
                  onClick={() => {
                    applyFiltersToState()
                    setShowFilters(false)
                  }}
                  className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors duration-normal ease-out-brand"
                  aria-label="Close"
                >
                  <IconX className="w-5 h-5 text-slate-600" size={20} stroke={2} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
              {/* Distance */}
              <section className="bg-white rounded-2xl border border-cream-400 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-charcoal-500">{t('distance')}</p>
                  <span className="px-2 py-0.5 rounded-md bg-cream-100 text-sm font-semibold text-charcoal-500">
                    {radius} {t('km')}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-teal-500"
                  aria-label="Distance radius in kilometers"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 {t('km')}</span>
                  <span>50 {t('km')}</span>
                </div>
              </section>

              {/* Rating */}
              <section className="bg-white rounded-2xl border border-cream-400 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-charcoal-500">{t('minimumRating')}</p>
                  <span className="text-sm font-semibold text-charcoal-500">{minRating.toFixed(1)}+</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full accent-teal-500"
                  aria-label="Minimum rating"
                />
              </section>

              {/* Toggles */}
              <section className="bg-white rounded-2xl border border-cream-400 p-4 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyPublic}
                    onChange={(e) => setOnlyPublic(e.target.checked)}
                    className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500 border-cream-400"
                  />
                  <div>
                    <p className="font-medium text-charcoal-500">{t('onlyPublicInsurance')}</p>
                    <p className="text-sm text-slate-600 mt-1">{t('publicInsuranceHint')}</p>
                  </div>
                </label>

              </section>

              {/* Languages */}
              <section className="bg-white rounded-2xl border border-cream-400 p-4">
                <p className="text-sm font-semibold text-charcoal-500 mb-3">{t('languages')}</p>
                {availableLanguages.length === 0 ? (
                  <p className="text-sm text-slate-600">{t('noLanguageData')}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((lang) => {
                      const selected = selectedLanguages.includes(lang)
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setSelectedLanguages((prev) =>
                              prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                            )
                          }}
                          className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors duration-normal ease-out-brand ${
                            selected ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-white border-cream-400 text-slate-700 hover:bg-cream-50'
                          }`}
                        >
                          {lang}
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </Page>
  )
}
