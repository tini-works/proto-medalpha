import {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
} from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { InputBase } from '../../primitives/InputBase'
import { Label } from '../../primitives/Label'
import { ErrorText } from '../../primitives/ErrorText'
import { HelperText } from '../../primitives/HelperText'

export interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Field label text */
  label: string
  /** Error message to display */
  error?: string
  /** Hint text shown when no error */
  hint?: string
  /** Show password strength indicator when value is present */
  showStrengthIndicator?: boolean
  /** Show password requirements list (used with strength indicator) */
  showRequirements?: boolean
}

/**
 * PasswordField - Composed password input with visibility toggle.
 *
 * Features:
 * - Visibility toggle button with eye icons
 * - Label, error, and hint text support
 * - Optional strength indicator placeholder
 * - Accessible with aria-describedby linking
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label,
      error,
      hint,
      showStrengthIndicator = false,
      showRequirements = false,
      value = '',
      id: providedId,
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false)
    const generatedId = useId()
    const inputId = providedId || generatedId

    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`
    const strengthId = `${inputId}-strength`

    // Build aria-describedby based on what's rendered
    const describedByIds: string[] = []
    if (error) {
      describedByIds.push(errorId)
    }
    if (hint && !error && !showStrengthIndicator) {
      describedByIds.push(hintId)
    }
    if (showStrengthIndicator && String(value).length > 0) {
      describedByIds.push(strengthId)
    }
    const ariaDescribedBy =
      describedByIds.length > 0 ? describedByIds.join(' ') : undefined

    const toggleVisibility = () => setVisible((v) => !v)

    return (
      <div className="space-y-1">
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>

        <div className="relative">
          <InputBase
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            value={value}
            hasError={!!error}
            required={required}
            aria-describedby={ariaDescribedBy}
            className={`pr-12 ${className}`.trim()}
            {...props}
          />
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 transition-colors"
          >
            {visible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        </div>

        {error && <ErrorText id={errorId}>{error}</ErrorText>}

        {hint && !error && !showStrengthIndicator && (
          <HelperText id={hintId}>{hint}</HelperText>
        )}

        {showStrengthIndicator && String(value).length > 0 && (
          <div data-testid="strength-indicator" id={strengthId}>
            {/* Strength indicator implementation will be added later */}
          </div>
        )}
      </div>
    )
  }
)

PasswordField.displayName = 'PasswordField'
