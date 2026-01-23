interface Specialty {
  value: string
  label: string
  subtitle: string
}

const COMMON_SPECIALTIES: Specialty[] = [
  { value: 'Primary care', label: 'Primary Care', subtitle: 'General medicine' },
  { value: 'Cardiology', label: 'Cardiology', subtitle: 'Heart & blood vessels' },
  { value: 'Dermatology', label: 'Dermatology', subtitle: 'Skin care' },
  { value: 'Gynecology', label: 'Gynecology', subtitle: "Women's health" },
  { value: 'Orthopedics', label: 'Orthopedics', subtitle: 'Bones & joints' },
  { value: 'Pediatrics', label: 'Pediatrics', subtitle: "Children's health" },
  { value: 'Ophthalmology', label: 'Ophthalmology', subtitle: 'Eye care' },
]

interface SpecialtyChipsProps {
  onSelect: (specialty: Specialty) => void
}

export function SpecialtyChips({ onSelect }: SpecialtyChipsProps) {
  return (
    <div className="space-y-3">
      {/* Heading with help icon */}
      <div className="flex items-center gap-2 px-1">
        <svg
          className="w-4 h-4 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-medium text-neutral-500">
          Not sure? Common choices:
        </span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {COMMON_SPECIALTIES.map((specialty) => (
          <button
            key={specialty.value}
            onClick={() => onSelect(specialty)}
            className="px-4 py-2.5 rounded-full bg-white border border-neutral-200 shadow-sm hover:border-neutral-400 hover:shadow transition-all text-sm font-medium text-neutral-700"
          >
            {specialty.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export type { Specialty }
