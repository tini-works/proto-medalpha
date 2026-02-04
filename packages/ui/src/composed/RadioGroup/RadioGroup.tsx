import { ErrorText } from '../../primitives'

export interface RadioOption {
  value: string
  label: string
  description?: string
}

export interface RadioGroupProps {
  label: string
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

/**
 * RadioGroup - Accessible radio group with card-style options.
 *
 * Features:
 * - fieldset/legend for proper a11y structure
 * - Card-style radio options with selected/hover states
 * - Optional description for each option
 * - Error state with ErrorText primitive
 * - Disabled state support
 */
export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  className = '',
}: RadioGroupProps) {
  return (
    <fieldset className={`space-y-2 ${className}`.trim()} disabled={disabled}>
      <legend className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-coral-600 ml-0.5">*</span>}
      </legend>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <label
              key={option.value}
              className={`
                flex items-start gap-3 p-3 rounded-lg border focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-cream-400 bg-white hover:bg-cream-50'
                }
              `.trim()}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="mt-0.5 w-4 h-4 text-teal-600 border-cream-400 focus:ring-0"
              />
              <div>
                <span className="block text-sm font-medium text-charcoal-500">
                  {option.label}
                </span>
                {option.description && (
                  <span className="block text-sm text-slate-500">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          )
        })}
      </div>

      {error && <ErrorText>{error}</ErrorText>}
    </fieldset>
  )
}
