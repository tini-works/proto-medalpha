import { IconHome, IconBriefcase } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export interface SavedLocation {
  id: string
  name: string // "Home" or "Work"
  address: string // Full address
  icon: 'home' | 'work'
}

interface SavedLocationsProps {
  locations: SavedLocation[]
  onSelect: (location: SavedLocation) => void
  selectedId?: string
}

export function SavedLocations({ locations, onSelect, selectedId }: SavedLocationsProps) {
  if (locations.length === 0) return null
  const { t } = useTranslation('booking')

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">{t('savedLocations')}</h3>
      <div className="space-y-2">
        {locations.map((location) => {
          const isSelected = selectedId === location.id
          return (
            <button
              key={location.id}
              onClick={() => onSelect(location)}
              className={`w-full p-4 bg-white rounded-xl border shadow-sm transition-colors duration-normal ease-out-brand flex items-center gap-3 text-left ${
                isSelected
                  ? 'border-teal-500 ring-1 ring-teal-500'
                  : 'border-cream-400 hover:border-cream-500'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  location.icon === 'home' ? 'bg-teal-50' : 'bg-coral-50'
                }`}
              >
                {location.icon === 'home' ? (
                  <IconHome className="text-teal-700" size={20} stroke={2} />
                ) : (
                  <IconBriefcase className="text-coral-700" size={20} stroke={2} />
                )}
              </div>

              {/* Name & Address */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-charcoal-500">{location.name}</p>
                <p className="text-sm text-slate-500 truncate">{location.address}</p>
              </div>

              {/* Radio indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-teal-500 bg-teal-500' : 'border-cream-400'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
