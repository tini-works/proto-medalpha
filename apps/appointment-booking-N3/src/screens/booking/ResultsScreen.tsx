import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, TabBar, DoctorCard, EmptyState } from '../../components'
import { useBooking } from '../../state'
import { apiSearchDoctors, getTimeSlots } from '../../data'
import { doctorPath, doctorSlotsPath, PATHS } from '../../routes'
import type { Doctor, TimeSlot } from '../../types'

type SortOption = 'earliest' | 'rating' | 'distance' | 'name'

const sortLabels: Record<SortOption, string> = {
  earliest: 'Earliest Appointment',
  rating: 'Highest Rated',
  distance: 'Nearest',
  name: 'Name A-Z',
}

// Filter icon
function FilterIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
      />
    </svg>
  )
}

// Back icon
function BackIcon() {
  return (
    <svg className="w-6 h-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

// Chevron down icon
function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

export default function ResultsScreen() {
  const navigate = useNavigate()
  const { search, selectDoctor, selectSlot } = useBooking()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorSlots, setDoctorSlots] = useState<Record<string, TimeSlot[]>>({})
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('earliest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  useEffect(() => {
    // Check if there are active filters
    if (search) {
      setHasActiveFilters(
        Boolean(search.specialty || search.city || search.insuranceType)
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

  // Sort doctors based on selected option
  const sortedDoctors = [...doctors].sort((a, b) => {
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
      case 'name':
        return a.name.localeCompare(b.name)
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
    // Navigate back to search to modify filters
    navigate(PATHS.BOOKING_SEARCH)
  }

  return (
    <Page>
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back button */}
          <button
            onClick={() => navigate(PATHS.BOOKING_SEARCH)}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-neutral-100"
            aria-label="Go back"
          >
            <BackIcon />
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold text-neutral-900">Search Results</h1>

          {/* Filter button with badge */}
          <button
            onClick={handleFilterClick}
            className="relative flex items-center justify-center w-10 h-10 -mr-2 rounded-full hover:bg-neutral-100 text-neutral-600"
            aria-label="Filters"
          >
            <FilterIcon />
            {hasActiveFilters && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Sort Selector Row */}
      <div className="sticky top-[57px] z-10 bg-neutral-50 border-b border-neutral-200">
        <div className="px-4 py-2.5">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 text-sm text-neutral-600"
            >
              <span>Sorted by:</span>
              <span className="font-semibold text-neutral-900">{sortLabels[sortBy]}</span>
              <ChevronDownIcon />
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
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                  {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option)
                        setShowSortMenu(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        sortBy === option
                          ? 'bg-neutral-100 text-neutral-900 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {sortLabels[option]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-neutral-500 mt-1">
            {loading ? 'Searching...' : `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} found`}
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
        ) : doctors.length === 0 ? (
          <EmptyState
            icon="search"
            title="No doctors found"
            description="Try adjusting your search filters to find more results."
            action={
              <button
                onClick={() => navigate(PATHS.BOOKING_SEARCH)}
                className="px-4 py-2.5 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                Modify Search
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

      <TabBar />
    </Page>
  )
}
