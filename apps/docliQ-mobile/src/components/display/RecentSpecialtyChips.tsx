import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getRecentSpecialties } from '../../data/recentSpecialties'

interface RecentSpecialtyChipsProps {
  query: string
  selectedValue: string | null
  onSelect: (value: string) => void
  labelForValue?: (value: string) => string
}

export function RecentSpecialtyChips({
  query,
  selectedValue,
  onSelect,
  labelForValue,
}: RecentSpecialtyChipsProps) {
  const { t } = useTranslation('booking')

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const recents = getRecentSpecialties()
    if (!q) return recents

    return recents.filter((value) => {
      const label = labelForValue ? labelForValue(value) : value
      return label.toLowerCase().includes(q) || value.toLowerCase().includes(q)
    })
  }, [query, labelForValue])

  if (items.length === 0) return null

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        {t('recentSpecialties')}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((value) => {
          const isSelected = selectedValue?.toLowerCase() === value.toLowerCase()
          const label = labelForValue ? labelForValue(value) : value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-teal-500 text-white'
                  : 'bg-white border border-cream-300 text-charcoal-500 hover:bg-cream-50'
              }`}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

