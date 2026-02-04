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
      <label htmlFor={inputId} className="block text-label-md text-slate-700">
        {label}
        {props.required && <span className="text-coral-600 ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-3 py-2.5 text-body-md rounded-lg border bg-white
          ${error ? 'border-coral-600 focus:ring-coral-500' : 'border-cream-400 focus:ring-teal-500'}
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-cream-200 disabled:text-slate-500
          placeholder:text-slate-400
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-body-sm text-coral-800">{error}</p>}
      {hint && !error && <p className="text-body-sm text-slate-500">{hint}</p>}
    </div>
  )
}
