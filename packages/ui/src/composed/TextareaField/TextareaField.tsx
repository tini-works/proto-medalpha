import { useId } from 'react'
import { Label } from '../../primitives/Label'
import { ErrorText } from '../../primitives/ErrorText'
import { HelperText } from '../../primitives/HelperText'

export interface TextareaFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  error?: string
  hint?: string
  rows?: number
  required?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

/**
 * TextareaField - Composed textarea component with label, character count, and validation.
 *
 * Features:
 * - Label with required indicator
 * - Character count display (value.length/maxLength)
 * - maxLength enforcement in onChange
 * - Error and hint text support
 * - Accessible via aria-describedby
 */
export function TextareaField({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  error,
  hint,
  rows = 4,
  required,
  disabled,
  id: providedId,
  className = '',
}: TextareaFieldProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId

  // Build describedby IDs for accessibility
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const countId = `${id}-count`

  const describedByIds = [
    error ? errorId : hint ? hintId : null,
    maxLength ? countId : null,
  ]
    .filter(Boolean)
    .join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    // Enforce maxLength if specified
    if (maxLength && newValue.length > maxLength) {
      onChange(newValue.slice(0, maxLength))
    } else {
      onChange(newValue)
    }
  }

  const baseClasses = [
    'w-full bg-cream-200 rounded-xl p-4 resize-none text-charcoal-500',
    'placeholder:text-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white',
    'transition-colors duration-normal ease-out-brand',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border border-coral-600' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedByIds || undefined}
          className={baseClasses}
        />
        {maxLength && (
          <span
            id={countId}
            className="absolute bottom-3 right-3 text-xs text-slate-400"
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error ? (
        <ErrorText id={errorId}>{error}</ErrorText>
      ) : hint ? (
        <HelperText id={hintId}>{hint}</HelperText>
      ) : null}
    </div>
  )
}
