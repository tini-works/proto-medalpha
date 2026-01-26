import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, ProgressIndicator } from '../../components'
import { LocationSelector } from '../../components/forms/LocationSelector'
import type { LocationValue } from '../../components/forms/LocationSelector'
import type { SavedLocation } from '../../components/display/SavedLocations'
import { useBooking } from '../../state'
import { PATHS } from '../../routes'

// Mock saved locations - in a real app, these would come from user profile/state
const mockSavedLocations: SavedLocation[] = [
  {
    id: 'home',
    name: 'Home',
    address: 'Musterstrasse 123, 10115 Berlin',
    icon: 'home',
  },
  {
    id: 'work',
    name: 'Work',
    address: 'Alexanderplatz 1, 10178 Berlin',
    icon: 'work',
  },
]

export default function LocationScreen() {
  const navigate = useNavigate()
  const { setSearchFilters, search } = useBooking()
  const [selectedLocation, setSelectedLocation] = useState<LocationValue | null>(null)

  const handleLocationSelect = (location: LocationValue) => {
    setSelectedLocation(location)
  }

  const handleContinue = () => {
    if (selectedLocation) {
      // Update search filters with location data
      setSearchFilters({
        specialty: search?.specialty || '',
        city: selectedLocation.value,
        insuranceType: search?.insuranceType || '',
        includeStores: search?.includeStores || false,
        radius: selectedLocation.radius,
      })
      navigate(PATHS.BOOKING_RESULTS)
    }
  }

  const handleBack = () => {
    navigate(PATHS.BOOKING_SEARCH)
  }

  return (
    <Page safeBottom={false}>
      <Header title="Location" showBack onBack={handleBack} />

      <div className="px-4 py-4">
        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={2}
          totalSteps={4}
          variant="dots"
          showLabel={true}
          showPercentage={false}
        />
      </div>

      <div className="px-4 py-2">
        {/* Title */}
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Where do you need the appointment?
        </h2>

        {/* Location Selector */}
        <LocationSelector
          onLocationSelect={handleLocationSelect}
          savedLocations={mockSavedLocations}
          initialRadius={10}
        />
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md flex gap-3">
          <button
            onClick={handleBack}
            className="btn btn-tertiary flex-1 h-12 py-0"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedLocation}
            className="btn btn-primary flex-1 h-12 py-0 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </Page>
  )
}
