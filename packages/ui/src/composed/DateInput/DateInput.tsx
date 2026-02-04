import { useId } from 'react'
import { Label } from '../../primitives/Label'
import { ErrorText } from '../../primitives/ErrorText'
import { HelperText } from '../../primitives/HelperText'

export interface DateInputProps {
  /** Label text for the input */
  label: string
  /** Date value in ISO format (YYYY-MM-DD) */
  value: string
  /** Callback when date value changes */
  onChange: (value: string) => void
  /** Error message to display */
  error?: string
  /** Hint text shown when no error */
  hint?: string
  /** Show required indicator */
  required?: boolean
  /** Disable the input */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Maximum allowed date (ISO format) */
  max?: string
  /** Minimum allowed date (ISO format) */
  min?: string
  /** Custom input ID (auto-generated if not provided) */
  id?: string
  /** Additional CSS classes for container */
  className?: string
}

/**
 * DateInput - Composed date input with label, error, and hint support.
 *
 * Uses native date input (type="date") with Label, ErrorText, and HelperText primitives.
 *
 * @example
 * ```tsx
 * <DateInput
 *   label="Date of Birth"
 *   value={dob}
 *   onChange={setDob}
 *   max="2024-12-31"
 *   required
 * />
 * ```
 */
export function DateInput({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  disabled,
  placeholder,
  max,
  min,
  id,
  className = '',
}: DateInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  // Build aria-describedby: error takes precedence, then hint
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className={`space-y-1 ${className}`.trim()}>
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>

      <input
        id={inputId}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        max={max}
        min={min}
        aria-invalid={error ? true : undefined}
        aria-required={required}
        aria-describedby={describedBy}
        className={`
          w-full px-3 py-2.5 text-base rounded-lg border bg-white
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-cream-200 disabled:text-slate-500 disabled:cursor-not-allowed
          ${error ? 'border-coral-600 focus:ring-coral-500' : 'border-cream-400 focus:ring-teal-500'}
          ${!value ? 'text-slate-400' : 'text-charcoal-500'}
        `}
      />

      {error && <ErrorText id={errorId}>{error}</ErrorText>}
      {hint && !error && <HelperText id={hintId}>{hint}</HelperText>}
    </div>
  )
}
