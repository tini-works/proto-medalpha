import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { InputBase } from '../../primitives/InputBase'
import { Label } from '../../primitives/Label'
import { HelperText } from '../../primitives/HelperText'
import { ErrorText } from '../../primitives/ErrorText'

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label: string
  /** Error message - when present, shows error state */
  error?: string
  /** Hint text displayed below input (hidden when error is shown) */
  hint?: string
}

/**
 * Field - Composed text field component combining primitives.
 *
 * Features:
 * - Auto-generated IDs for accessibility linking
 * - aria-describedby linking to error/hint
 * - aria-required when required prop is set
 * - Error state styling propagation
 *
 * @example
 * ```tsx
 * <Field
 *   label="Email"
 *   hint="We'll never share your email"
 *   error={errors.email}
 *   required
 * />
 * ```
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, required, disabled, id: providedId, ...props }, ref) => {
    // Generate unique IDs for accessibility linking
    const generatedId = useId()
    const inputId = providedId || generatedId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    // Build aria-describedby based on what's rendered
    const describedBy = error ? errorId : hint ? hintId : undefined

    return (
      <div className="space-y-1">
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>

        <InputBase
          ref={ref}
          id={inputId}
          hasError={!!error}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          {...props}
        />

        {error ? (
          <ErrorText id={errorId}>{error}</ErrorText>
        ) : hint ? (
          <HelperText id={hintId}>{hint}</HelperText>
        ) : null}
      </div>
    )
  }
)

Field.displayName = 'Field'
