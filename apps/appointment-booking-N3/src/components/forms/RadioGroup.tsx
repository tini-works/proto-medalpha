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
      <legend className="block text-label-md text-slate-700">
        {label}
        {required && <span className="text-coral-600 ml-0.5">*</span>}
      </legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-3 p-3 rounded-lg border cursor-pointer
              ${
                value === option.value
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-cream-400 bg-white hover:bg-cream-50'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-0.5 w-4 h-4 text-teal-600 border-cream-400 focus:ring-teal-500"
            />
            <div>
              <span className="block text-body-sm font-medium text-charcoal-500">{option.label}</span>
              {option.description && <span className="block text-body-sm text-slate-500">{option.description}</span>}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-body-sm text-coral-800">{error}</p>}
    </fieldset>
  )
}
