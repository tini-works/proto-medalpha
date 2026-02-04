import { IconHelp } from '@tabler/icons-react'

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
        <IconHelp className="text-slate-400" size={16} stroke={2} />
        <span className="text-sm font-medium text-slate-500">
          Not sure? Common choices:
        </span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {COMMON_SPECIALTIES.map((specialty) => (
          <button
            key={specialty.value}
            onClick={() => onSelect(specialty)}
            className="px-4 py-2.5 rounded-full bg-white border border-cream-400 shadow-sm hover:bg-cream-50 hover:border-cream-500 transition-colors text-sm font-medium text-charcoal-500"
          >
            {specialty.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export type { Specialty }
