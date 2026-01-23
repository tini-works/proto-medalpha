import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, TabBar, ProgressIndicator, RecentSearches, SpecialtyChips, addRecentSearch } from '../../components'
import type { RecentSearch, Specialty } from '../../components'
import { useBooking } from '../../state'
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
  const inputRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (specialty: string, subtitle?: string) => {
    if (!specialty.trim()) return

    // Add to recent searches
    addRecentSearch({
      title: specialty,
      subtitle: subtitle || specialtySubtitles[specialty] || 'Medical specialty',
      specialty: specialty,
    })

    // Set search filters
    setSearchFilters({
      specialty: specialty,
      city: '',
      insuranceType: '',
      includeStores: false,
    })

    navigate(PATHS.BOOKING_RESULTS)
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
          totalSteps={4}
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
            className="w-full h-14 pl-12 pr-4 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-neutral-200 focus:ring-2 focus:ring-neutral-400 focus:outline-none text-neutral-900 placeholder:text-neutral-400 transition-all"
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
