import { useState } from 'react'
import { RadiusSlider } from './RadiusSlider'
import { SavedLocations } from '../display/SavedLocations'
import type { SavedLocation } from '../display/SavedLocations'

export interface LocationValue {
  type: 'gps' | 'address' | 'saved'
  value: string
  radius: number
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationValue) => void
  savedLocations?: SavedLocation[]
  initialRadius?: number
}

export function LocationSelector({
  onLocationSelect,
  savedLocations = [],
  initialRadius = 10,
}: LocationSelectorProps) {
  const [addressQuery, setAddressQuery] = useState('')
  const [radius, setRadius] = useState(initialRadius)
  const [selectedSavedId, setSelectedSavedId] = useState<string | undefined>()
  const [locationType, setLocationType] = useState<'gps' | 'address' | 'saved' | null>(null)

  const handleUseCurrentLocation = () => {
    setLocationType('gps')
    setSelectedSavedId(undefined)
    setAddressQuery('')
    onLocationSelect({
      type: 'gps',
      value: 'Current Location',
      radius,
    })
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAddressQuery(value)
    if (value.trim()) {
      setLocationType('address')
      setSelectedSavedId(undefined)
    }
  }

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && addressQuery.trim()) {
      e.preventDefault()
      onLocationSelect({
        type: 'address',
        value: addressQuery.trim(),
        radius,
      })
    }
  }

  const handleSavedLocationSelect = (location: SavedLocation) => {
    setLocationType('saved')
    setSelectedSavedId(location.id)
    setAddressQuery('')
    onLocationSelect({
      type: 'saved',
      value: location.address,
      radius,
    })
  }

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius)
    // If a location is already selected, update with new radius
    if (locationType === 'gps') {
      onLocationSelect({ type: 'gps', value: 'Current Location', radius: newRadius })
    } else if (locationType === 'address' && addressQuery.trim()) {
      onLocationSelect({ type: 'address', value: addressQuery.trim(), radius: newRadius })
    } else if (locationType === 'saved' && selectedSavedId) {
      const savedLoc = savedLocations.find((l) => l.id === selectedSavedId)
      if (savedLoc) {
        onLocationSelect({ type: 'saved', value: savedLoc.address, radius: newRadius })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* GPS CTA Button */}
      <button
        onClick={handleUseCurrentLocation}
        className={`btn btn-primary btn-block flex items-center justify-center gap-2 shadow-md ${
          locationType === 'gps' ? 'ring-2 ring-teal-500 ring-offset-2' : ''
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Use Current Location
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-cream-100 text-slate-500">Or enter a specific address</span>
        </div>
      </div>

      {/* Address Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={addressQuery}
          onChange={handleAddressChange}
          onKeyDown={handleAddressKeyDown}
          placeholder="Enter street, city, or postal code..."
          className={`w-full h-14 pl-12 pr-4 rounded-xl bg-white shadow-sm ring-1 focus:ring-2 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-colors duration-normal ease-out-brand ${
            locationType === 'address' && addressQuery.trim()
              ? 'ring-teal-500 focus:ring-teal-500'
              : 'ring-cream-400 focus:ring-teal-500'
          }`}
        />
      </div>

      {/* Map Preview */}
      <div className="h-32 rounded-xl bg-cream-200 relative overflow-hidden">
        {/* Grid pattern for map effect */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'linear-gradient(to right, #E8E3DB 1px, transparent 1px), linear-gradient(to bottom, #E8E3DB 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        {/* Pulsing location dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pulse ring - uses custom animation */}
            <div className="absolute -inset-2 rounded-full bg-teal-500/20 animate-location-pulse" />
            {/* Center dot */}
            <div className="relative w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center shadow-md">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Map label */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs text-slate-600 bg-white/80 px-2 py-1 rounded">Map Preview</span>
        </div>
      </div>

      {/* Radius Slider */}
      <RadiusSlider value={radius} onChange={handleRadiusChange} min={1} max={50} unit="km" />

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <SavedLocations
          locations={savedLocations}
          onSelect={handleSavedLocationSelect}
          selectedId={selectedSavedId}
        />
      )}
    </div>
  )
}
