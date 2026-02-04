interface DateInputProps {
  label: string
  value: string // ISO format YYYY-MM-DD
  onChange: (value: string) => void
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  max?: string // Max date (ISO)
  min?: string // Min date (ISO)
}

export function DateInput({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  disabled,
  placeholder = 'DD / MM / YYYY',
  max,
  min,
}: DateInputProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-label-md text-slate-700">
        {label}
        {required && <span className="text-coral-600 ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        max={max}
        min={min}
        className={`
          w-full px-3 py-2.5 text-body-md rounded-lg border bg-white
          ${error ? 'border-coral-600 focus:ring-coral-500' : 'border-cream-400 focus:ring-teal-500'}
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-cream-200 disabled:text-slate-500
          ${!value ? 'text-slate-400' : 'text-charcoal-500'}
        `}
      />
      {error && <p className="text-body-sm text-coral-800">{error}</p>}
      {hint && !error && <p className="text-body-sm text-slate-500">{hint}</p>}
    </div>
  )
}
