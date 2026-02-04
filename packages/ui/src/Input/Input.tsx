import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-md border transition-colors
            ${error ? 'border-error-500 focus:ring-error-500' : 'border-neutral-300 focus:ring-primary-500'}
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-sm text-error-500">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
