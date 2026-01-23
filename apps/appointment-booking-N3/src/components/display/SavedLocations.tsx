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

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-neutral-700">Saved Locations</h3>
      <div className="space-y-2">
        {locations.map((location) => {
          const isSelected = selectedId === location.id
          return (
            <button
              key={location.id}
              onClick={() => onSelect(location)}
              className={`w-full p-4 bg-white rounded-xl border shadow-sm transition-all flex items-center gap-3 text-left ${
                isSelected
                  ? 'border-neutral-800 ring-1 ring-neutral-800'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  location.icon === 'home' ? 'bg-blue-100' : 'bg-orange-100'
                }`}
              >
                {location.icon === 'home' ? (
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              {/* Name & Address */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900">{location.name}</p>
                <p className="text-sm text-neutral-500 truncate">{location.address}</p>
              </div>

              {/* Radio indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-neutral-800 bg-neutral-800' : 'border-neutral-300'
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
