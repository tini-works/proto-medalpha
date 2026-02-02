import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconMapPin, IconSearch } from '@tabler/icons-react'
import { RadiusSlider } from './RadiusSlider'
import { SavedLocations } from '../display/SavedLocations'
import { Button } from '../ui'
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
  showRadius?: boolean
  showMapPreview?: boolean
  showSavedLocations?: boolean
}

const RECENT_KEY = 'docliq_recent_location_searches'
const MAX_RECENTS = 5

// Simulated location suggestions for the bottom-sheet search UI.
// Keep to common German cities (i18n-safe strings) and a few postal codes.
const LOCATION_SUGGESTIONS = [
  'Berlin',
  'Hamburg',
  'München',
  'Köln',
  'Frankfurt am Main',
  'Stuttgart',
  'Düsseldorf',
  'Leipzig',
  'Dortmund',
  'Essen',
  'Bremen',
  'Dresden',
  'Hannover',
  'Nürnberg',
  'Duisburg',
  'Bochum',
  'Wuppertal',
  'Bielefeld',
  'Bonn',
  'Mannheim',
  '10115',
  '20095',
  '80331',
  '50667',
  '60311',
] as const

export function LocationSelector({
  onLocationSelect,
  savedLocations = [],
  initialRadius = 10,
  showRadius = true,
  showMapPreview = true,
  showSavedLocations = true,
}: LocationSelectorProps) {
  const { t } = useTranslation('booking')
  const [addressQuery, setAddressQuery] = useState('')
  const [radius, setRadius] = useState(initialRadius)
  const [selectedSavedId, setSelectedSavedId] = useState<string | undefined>()
  const [locationType, setLocationType] = useState<'gps' | 'address' | 'saved' | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) setRecentSearches(parsed.filter((v) => typeof v === 'string'))
    } catch {
      // ignore
    }
  }, [])

  const persistRecents = (items: string[]) => {
    setRecentSearches(items)
    localStorage.setItem(RECENT_KEY, JSON.stringify(items))
  }

  const saveRecentSearch = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    const next = [trimmed, ...recentSearches.filter((v) => v.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      MAX_RECENTS
    )
    persistRecents(next)
  }

  const filteredSuggestions = useMemo(() => {
    const q = addressQuery.trim().toLowerCase()
    if (!q) return []
    return LOCATION_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 6)
  }, [addressQuery])

  const showRecents = useMemo(() => addressQuery.trim().length === 0 && recentSearches.length > 0, [addressQuery, recentSearches.length])

  const selectAddress = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setAddressQuery(trimmed)
    setLocationType('address')
    setSelectedSavedId(undefined)
    saveRecentSearch(trimmed)
    onLocationSelect({
      type: 'address',
      value: trimmed,
      radius,
    })
  }

  const handleUseCurrentLocation = () => {
    setLocationType('gps')
    setSelectedSavedId(undefined)
    setAddressQuery('')
    onLocationSelect({
      type: 'gps',
      value: t('currentLocation'),
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
      if (filteredSuggestions.length > 0) {
        selectAddress(filteredSuggestions[0])
      } else {
        selectAddress(addressQuery.trim())
      }
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
      onLocationSelect({ type: 'gps', value: t('currentLocation'), radius: newRadius })
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
      <Button
        onClick={handleUseCurrentLocation}
        variant="primary"
        fullWidth
        leftIcon={
          <IconMapPin className="w-5 h-5" stroke={2} />
        }
        className={locationType === 'gps' ? 'shadow-md ring-2 ring-teal-500 ring-offset-2' : 'shadow-md'}
      >
        {t('useCurrentLocation')}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-cream-100 text-slate-500">{t('orEnterAddress')}</span>
        </div>
      </div>

      {/* Address Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconSearch className="w-5 h-5 text-slate-400" stroke={2} />
        </div>
        <input
          type="text"
          value={addressQuery}
          onChange={handleAddressChange}
          onKeyDown={handleAddressKeyDown}
          placeholder={t('addressPlaceholder')}
          className={`w-full h-14 pl-12 pr-4 rounded-xl bg-white shadow-sm ring-1 focus:ring-2 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-colors duration-normal ease-out-brand ${
            locationType === 'address' && addressQuery.trim()
              ? 'ring-teal-500 focus:ring-teal-500'
              : 'ring-cream-400 focus:ring-teal-500'
          }`}
        />
      </div>

      {/* Recent Searches / Suggestions */}
      {(showRecents || filteredSuggestions.length > 0) && (
        <div className="bg-white rounded-xl border border-cream-300 shadow-sm overflow-hidden">
          {showRecents && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-cream-200">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t('recentSearches')}</p>
              <button
                type="button"
                className="text-xs font-medium text-teal-700 hover:underline"
                onClick={() => persistRecents([])}
              >
                {t('clearRecent')}
              </button>
            </div>
          )}

          {filteredSuggestions.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-cream-200">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t('suggestions')}</p>
            </div>
          )}

          <div className="divide-y divide-cream-200">
            {showRecents &&
              recentSearches.map((value) => (
                <button
                  key={`recent-${value}`}
                  type="button"
                  className="w-full px-4 py-3 text-left text-sm text-charcoal-500 hover:bg-cream-50 transition-colors"
                  onClick={() => selectAddress(value)}
                >
                  {value}
                </button>
              ))}
            {filteredSuggestions.map((value) => (
              <button
                key={`suggest-${value}`}
                type="button"
                className="w-full px-4 py-3 text-left text-sm text-charcoal-500 hover:bg-cream-50 transition-colors"
                onClick={() => selectAddress(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Preview */}
      {showMapPreview && (
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
            <span className="text-xs text-slate-600 bg-white/80 px-2 py-1 rounded">{t('mapPreview')}</span>
          </div>
        </div>
      )}

      {/* Radius Slider */}
      {showRadius && <RadiusSlider value={radius} onChange={handleRadiusChange} min={1} max={50} unit="km" />}

      {/* Saved Locations */}
      {showSavedLocations && savedLocations.length > 0 && (
        <SavedLocations
          locations={savedLocations}
          onSelect={handleSavedLocationSelect}
          selectedId={selectedSavedId}
        />
      )}
    </div>
  )
}
