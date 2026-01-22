interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  label: string
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export function RadioGroup({ label, name, options, value, onChange, error, required }: RadioGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-3 p-3 rounded-lg border cursor-pointer
              ${value === option.value ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-0.5 w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
            />
            <div>
              <span className="block text-sm font-medium text-neutral-900">{option.label}</span>
              {option.description && <span className="block text-sm text-neutral-500">{option.description}</span>}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </fieldset>
  )
}
