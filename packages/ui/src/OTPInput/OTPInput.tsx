import { forwardRef, useId, type HTMLAttributes } from 'react'
import { useOTPInput } from './useOTPInput'

export interface OTPInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Number of digits (default: 6) */
  length?: 4 | 6
  /** Fires when all digits entered */
  onComplete?: (code: string) => void
  /** Fires on any change (controlled mode) */
  onChange?: (code: string) => void
  /** Current value for controlled mode */
  value?: string
  /** Error message (triggers error styling) */
  error?: string
  /** Focus first input on mount (default: true) */
  autoFocus?: boolean
  /** Disable all inputs */
  disabled?: boolean
  /** Show dots instead of digits (PIN mode) */
  mask?: boolean
  /** Delay before auto-submit in ms (default: 300, 0 to disable) */
  autoSubmitDelay?: number
}

export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      length = 6,
      onComplete,
      onChange,
      value,
      error,
      autoFocus = true,
      disabled = false,
      mask = false,
      autoSubmitDelay = 300,
      className = '',
      ...props
    },
    ref
  ) => {
    const errorId = useId()
    const groupId = useId()

    const { digits, inputRefs, setDigit, handlePaste, focusInput, hasInteracted } =
      useOTPInput({
        length,
        value,
        onChange,
        onComplete,
        autoSubmitDelay,
        disabled,
        autoFocus,
      })

    // Auto-clear error when user starts typing
    const showError = error && !hasInteracted

    // Handle single digit input
    const handleChange = (index: number, inputValue: string) => {
      const cleanValue = inputValue.replace(/\D/g, '')

      if (cleanValue.length > 1) {
        // Multi-char input (paste via onChange)
        handlePaste(index, cleanValue)
        return
      }

      setDigit(index, cleanValue)

      // Auto-advance to next input
      if (cleanValue && index < length - 1) {
        focusInput(index + 1)
      }
    }

    // Handle keyboard navigation
    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const { key } = e

      switch (key) {
        case 'Backspace':
          if (!digits[index] && index > 0) {
            // Empty cell: move back and clear previous
            e.preventDefault()
            setDigit(index - 1, '')
            focusInput(index - 1)
          } else {
            // Has content: clear current (default behavior)
            setDigit(index, '')
          }
          break

        case 'Delete':
          setDigit(index, '')
          break

        case 'ArrowLeft':
          e.preventDefault()
          focusInput(index - 1)
          break

        case 'ArrowRight':
          e.preventDefault()
          focusInput(index + 1)
          break

        default:
          // Block non-digit keys (except Tab, Enter for form navigation)
          if (!/^\d$/.test(key) && !['Tab', 'Enter'].includes(key)) {
            e.preventDefault()
          }
      }
    }

    // Handle paste event
    const handlePasteEvent = (
      index: number,
      e: React.ClipboardEvent<HTMLInputElement>
    ) => {
      e.preventDefault()
      const pastedText = e.clipboardData.getData('text')
      handlePaste(index, pastedText)
    }

    // Styling
    const inputBaseStyles = `
      w-12 h-14 text-center text-xl font-semibold rounded-lg border
      transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50
    `

    const getInputStyles = (digit: string) => {
      if (showError) {
        return 'border-error-500 focus:ring-error-500'
      }
      if (digit) {
        return 'border-neutral-400 bg-neutral-50 focus:ring-primary-500 focus:border-primary-500'
      }
      return 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
    }

    return (
      <div ref={ref} className={className} {...props}>
        {/* Input group */}
        <div
          role="group"
          aria-labelledby={groupId}
          aria-describedby={showError ? errorId : undefined}
          className="flex justify-center gap-2"
        >
          <span id={groupId} className="sr-only">
            Verification code input
          </span>

          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={mask && digit ? '•' : digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePasteEvent(index, e)}
              disabled={disabled}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={showError ? true : undefined}
              className={`${inputBaseStyles} ${getInputStyles(digit)}`}
            />
          ))}
        </div>

        {/* Error message */}
        {showError && (
          <p
            id={errorId}
            role="alert"
            className="text-center text-sm text-error-500 mt-2"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

OTPInput.displayName = 'OTPInput'
