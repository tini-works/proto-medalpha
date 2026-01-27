import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, TabBar, ProgressIndicator, RecentSearches, SpecialtyChips, addRecentSearch } from '../../components'
import type { RecentSearch, Specialty } from '../../components'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'

// Specialty subtitle mapping for recent searches
const specialtySubtitles: Record<string, string> = {
  'General Practitioner': 'Primary care',
  'Dentist': 'Dental care',
  'Gynecologist': "Women's health",
  'Orthopedist': 'Bones & joints',
  'Pediatrician': "Children's health",
  'Dermatologist': 'Skin care',
  'ENT (HNO)': 'Ear, nose & throat',
  'Cardiology': 'Heart & blood vessels',
  'Primary care': 'General medicine',
  'Dermatology': 'Skin care',
  'Pediatrics': "Children's health",
  'Orthopedics': 'Bones & joints',
  'Gynecology': "Women's health",
  'Ophthalmology': 'Eye care',
}

export default function SearchScreen() {
  const navigate = useNavigate()
  const { setSearchFilters } = useBooking()
  const { profile } = useProfile()
  const inputRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState('')

  // Check if user has already set location and insurance
  const hasLocation = Boolean(profile.address?.city?.trim())
  const hasInsurance = Boolean(profile.insuranceType)

  // Total steps: Search (1) -> Location (2) -> Insurance (3) -> Results
  // If both location and insurance are set, we skip directly to results (2 steps)
  const totalSteps = hasLocation && hasInsurance ? 2 : 4

  const handleSearch = (specialty: string, subtitle?: string) => {
    if (!specialty.trim()) return

    // Add to recent searches
    addRecentSearch({
      title: specialty,
      subtitle: subtitle || specialtySubtitles[specialty] || 'Medical specialty',
      specialty: specialty,
    })

    // Set search filters with pre-filled data from profile if available
    setSearchFilters({
      specialty: specialty,
      city: hasLocation ? profile.address.city : '',
      insuranceType: hasInsurance ? profile.insuranceType : '',
      includeStores: false,
      radius: 10,
      visitType: 'in_clinic',
      urgency: 'routine',
      onlyPublic: false,
      minRating: 0,
      languages: [],
      sortBy: 'earliest',
    })

    // Skip screens based on what user has already set
    // Location always comes before Insurance
    if (hasLocation && hasInsurance) {
      // Both set - go directly to results
      navigate(PATHS.BOOKING_RESULTS)
    } else {
      // Always go to Location first, Location will handle skipping to Results if insurance is set
      navigate(PATHS.BOOKING_LOCATION)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(searchQuery)
    }
  }

  const handleRecentSearchSelect = (search: RecentSearch) => {
    handleSearch(search.specialty, search.subtitle)
  }

  const handleSpecialtySelect = (specialty: Specialty) => {
    handleSearch(specialty.value, specialty.subtitle)
  }

  return (
    <Page>
      <Header title="Select a Specialty" />

      <div className="px-4 py-4 animate-fade-in">
        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={1}
          totalSteps={totalSteps}
          variant="bar"
          showLabel={true}
          showPercentage={true}
        />
      </div>

      <div className="px-4 py-2 space-y-6">
        {/* Search Input */}
        <div className="relative">
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try 'Dermatologist' or 'HNO'..."
            className="w-full h-14 pl-12 pr-4 rounded-xl bg-white shadow-sm ring-1 ring-cream-400 focus:ring-2 focus:ring-teal-500 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-colors duration-normal ease-out-brand"
          />
        </div>

        {/* Recent Searches */}
        <RecentSearches onSelect={handleRecentSearchSelect} />

        {/* Common Specialty Chips */}
        <SpecialtyChips onSelect={handleSpecialtySelect} />
      </div>

      <TabBar />
    </Page>
  )
}
