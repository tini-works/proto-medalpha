import { useEffect, useState } from 'react'
import { IconClock, IconChevronRight } from '@tabler/icons-react'

export interface RecentSearch {
  id: string
  title: string
  subtitle: string
  specialty: string
}

const STORAGE_KEY = 'meda-recent-searches'
const MAX_RECENT_SEARCHES = 5

// Helper to get recent searches from localStorage
export function getRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper to add a recent search
export function addRecentSearch(search: Omit<RecentSearch, 'id'>): void {
  try {
    const existing = getRecentSearches()
    // Remove duplicate if exists
    const filtered = existing.filter(
      (s) => s.title.toLowerCase() !== search.title.toLowerCase()
    )
    // Add new search at beginning
    const updated = [
      { ...search, id: `search_${Date.now()}` },
      ...filtered,
    ].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Ignore storage errors
  }
}

interface RecentSearchesProps {
  onSelect: (search: RecentSearch) => void
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const [searches, setSearches] = useState<RecentSearch[]>([])

  useEffect(() => {
    setSearches(getRecentSearches())
  }, [])

  if (searches.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-500 px-1">
        Recent Searches
      </h3>
      <div className="space-y-2">
        {searches.map((search) => (
          <button
            key={search.id}
            onClick={() => onSelect(search)}
            className="w-full flex items-center gap-3 p-3 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-cream-400 hover:ring-cream-400 transition-all"
          >
            {/* History icon in colored circle */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center">
              <IconClock className="text-slate-500" size={20} stroke={1.5} />
            </div>

            {/* Text content */}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-charcoal-500">
                {search.title}
              </p>
              <p className="text-xs text-slate-500">{search.subtitle}</p>
            </div>

            {/* Chevron */}
            <IconChevronRight className="text-slate-400" size={20} stroke={2} />
          </button>
        ))}
      </div>
    </div>
  )
}
