import type { InputHTMLAttributes } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function Field({ label, error, hint, className = '', id, ...props }: FieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-3 py-2.5 text-base rounded-lg border
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:ring-primary-500'}
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-neutral-100 disabled:text-neutral-500
          placeholder:text-neutral-400
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
    </div>
  )
}
