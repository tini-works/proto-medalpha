import type { SelectHTMLAttributes } from 'react'

/**
 * @deprecated Use `Select` from `@meda/ui` instead.
 * This component will be removed in a future release.
 */
interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
  hint?: string
  placeholder?: string
}

/**
 * @deprecated Use `Select` from `@meda/ui` instead.
 * This component will be removed in a future release.
 */
export function Select({ label, options, error, hint, placeholder, className = '', id, ...props }: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      <label htmlFor={selectId} className="block text-label-md text-slate-700">
        {label}
        {props.required && <span className="text-coral-600 ml-0.5">*</span>}
      </label>
      <select
        id={selectId}
        className={`
          w-full px-3 py-2.5 text-body-md rounded-lg border appearance-none bg-white
          ${error ? 'border-coral-600 focus:ring-coral-500' : 'border-cream-400 focus:ring-teal-500'}
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-cream-200 disabled:text-slate-500
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-body-sm text-coral-800">{error}</p>}
      {hint && !error && <p className="text-body-sm text-slate-500">{hint}</p>}
    </div>
  )
}
