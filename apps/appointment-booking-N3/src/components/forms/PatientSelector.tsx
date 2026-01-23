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
        <span className="block text-sm font-medium text-neutral-700">{label}</span>
      )}
      <div className="flex h-12 w-full items-center justify-center rounded-xl bg-neutral-100 p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex h-full grow cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold
              transition-all duration-200
              ${
                value === option.value
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
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
