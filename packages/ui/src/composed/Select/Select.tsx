import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { Label } from '../../primitives/Label'
import { ErrorText } from '../../primitives/ErrorText'
import { HelperText } from '../../primitives/HelperText'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text for the select */
  label: string
  /** Array of options to display */
  options: SelectOption[]
  /** Error message - displays ErrorText and applies error styling */
  error?: string
  /** Hint text - displays HelperText when no error present */
  hint?: string
  /** Placeholder option text (disabled, shows first) */
  placeholder?: string
}

// Dropdown arrow SVG as background image
const dropdownArrowSvg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`

/**
 * Select - Composed select component with label, error, and hint support.
 *
 * Features:
 * - Uses Label, ErrorText, HelperText primitives
 * - Auto-generated IDs via useId()
 * - Custom dropdown arrow styling
 * - Error and disabled state styling
 * - Proper aria-describedby and aria-invalid attributes
 * - forwardRef for external control
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *   ]}
 *   placeholder="Select a country"
 *   hint="Choose your country of residence"
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      hint,
      placeholder,
      className = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility linking
    const generatedId = useId()
    const selectId = id || generatedId
    const errorId = `${selectId}-error`
    const hintId = `${selectId}-hint`

    // Determine which description ID to use
    const hasError = !!error
    const hasHint = !!hint && !hasError
    const describedBy = hasError ? errorId : hasHint ? hintId : undefined

    // Style classes
    const baseStyles = `
      w-full px-3 py-2.5 text-base rounded-lg border appearance-none bg-white
      focus:outline-none focus-visible:ring-2 focus-visible:border-transparent
      transition-colors duration-150
    `

    const stateStyles = hasError
      ? 'border-coral-600 focus-visible:ring-coral-500'
      : 'border-cream-400 focus-visible:ring-teal-500'

    const disabledStyles = disabled
      ? 'bg-cream-200 text-slate-500 cursor-not-allowed'
      : ''

    return (
      <div className="space-y-1">
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-disabled={disabled || undefined}
          aria-describedby={describedBy}
          className={`${baseStyles} ${stateStyles} ${disabledStyles} ${className}`.trim()}
          style={{
            backgroundImage: dropdownArrowSvg,
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

        {hasError && <ErrorText id={errorId}>{error}</ErrorText>}
        {hasHint && <HelperText id={hintId}>{hint}</HelperText>}
      </div>
    )
  }
)

Select.displayName = 'Select'
