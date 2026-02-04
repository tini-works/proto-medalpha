import { forwardRef, useState, type ButtonHTMLAttributes } from 'react'
import { useCountdown } from './useCountdown'

export interface ResendTimerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Countdown start in seconds (default: 60) */
  initialSeconds?: number
  /** Callback when resend clicked */
  onResend: () => void | Promise<void>
  /** Button text when enabled (default: "Resend code") */
  label?: string
  /** Button text during send (default: "Sending...") */
  resendingLabel?: string
  /** Text showing countdown - use {{seconds}} placeholder (default: "Resend in {{seconds}}s") */
  countdownLabel?: string
  /** Start with button enabled (first resend available immediately) */
  startEnabled?: boolean
}

export const ResendTimer = forwardRef<HTMLButtonElement, ResendTimerProps>(
  (
    {
      initialSeconds = 60,
      onResend,
      label = 'Resend code',
      resendingLabel = 'Sending...',
      countdownLabel = 'Resend in {{seconds}}s',
      startEnabled = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [isResending, setIsResending] = useState(false)
    const { secondsLeft, isComplete, reset } = useCountdown({
      initialSeconds,
      startComplete: startEnabled,
    })

    const handleClick = async () => {
      if (!isComplete || isResending) return

      setIsResending(true)
      try {
        await onResend()
        reset()
      } finally {
        setIsResending(false)
      }
    }

    // Determine button text
    const getButtonText = () => {
      if (isResending) return resendingLabel
      if (isComplete) return label
      return countdownLabel.replace('{{seconds}}', String(secondsLeft))
    }

    const isDisabled = disabled || !isComplete || isResending

    // Styling - tertiary/ghost button style
    const buttonStyles = `
      w-full py-2 text-sm font-medium rounded-md transition-colors
      ${
        isDisabled
          ? 'text-neutral-400 cursor-not-allowed'
          : 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200'
      }
    `

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-live="polite"
        className={`${buttonStyles} ${className}`}
        {...props}
      >
        {getButtonText()}
      </button>
    )
  }
)

ResendTimer.displayName = 'ResendTimer'
