interface PatientOption {
  value: string
  label: string
}

interface PatientSelectorProps {
  value: string
  onChange: (value: string) => void
  options?: PatientOption[]
  label?: string
}

const defaultOptions: PatientOption[] = [
  { value: 'myself', label: 'Myself' },
  { value: 'child', label: 'Child' },
]

export function PatientSelector({
  value,
  onChange,
  options = defaultOptions,
  label,
}: PatientSelectorProps) {
  return (
    <div className="space-y-1">
      {label && (
        <span className="block text-label-md text-slate-700">{label}</span>
      )}
      <div className="flex h-12 w-full items-center justify-center rounded-xl bg-cream-200 p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex h-full grow cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-medium
              transition-colors duration-normal ease-out-brand
              ${
                value === option.value
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-charcoal-500'
              }
            `}
          >
            <span>{option.label}</span>
            <input
              type="radio"
              name="patient-selector"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="invisible absolute w-0"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
