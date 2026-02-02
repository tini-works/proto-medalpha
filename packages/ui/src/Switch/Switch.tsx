import { forwardRef, type HTMLAttributes, type KeyboardEvent } from 'react'
import { useSwitch } from './useSwitch'

export interface SwitchProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled checked state */
  checked?: boolean
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean
  /** Called when switch state changes */
  onChange?: (checked: boolean) => void
  /** Disable interaction */
  disabled?: boolean
  /** Show loading spinner (optimistic UI feedback) */
  loading?: boolean
  /** Size variant */
  size?: 'sm' | 'md'
}

// Track dimensions and colors per size
const trackStyles = {
  sm: 'w-9 h-5', // 36x20px
  md: 'w-11 h-6', // 44x24px
}

const thumbStyles = {
  sm: 'w-4 h-4', // 16px
  md: 'w-5 h-5', // 20px
}

const thumbTranslate = {
  sm: { unchecked: 'translate-x-0', checked: 'translate-x-4' },
  md: { unchecked: 'translate-x-0', checked: 'translate-x-5' },
}

// Spinner component (matches Button loading spinner)
function LoadingSpinner({ size }: { size: 'sm' | 'md' }) {
  const spinnerSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'

  return (
    <svg
      className={`${spinnerSize} animate-spin text-brand-teal-600`}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      disabled = false,
      loading = false,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const { isChecked, toggle } = useSwitch({
      checked,
      defaultChecked,
      onChange,
      disabled,
      loading,
    })

    // Handle keyboard interaction
    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        toggle()
      }
    }

    // Build track classes
    const trackBase = `
      relative inline-flex items-center shrink-0 self-start rounded-full p-0.5
      cursor-pointer transition-colors duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500
    `

    // Track state classes
    let trackState = ''
    if (disabled) {
      trackState = isChecked
        ? 'bg-neutral-400 opacity-70 cursor-not-allowed'
        : 'bg-neutral-200 opacity-60 cursor-not-allowed'
    } else if (loading) {
      trackState = isChecked
        ? 'bg-brand-teal-500/60 cursor-wait'
        : 'bg-neutral-300/60 cursor-wait'
    } else {
      trackState = isChecked
        ? 'bg-brand-teal-500 hover:bg-brand-teal-600'
        : 'bg-neutral-300 hover:bg-neutral-400'
    }

    // Touch target expansion for sm size (ensures 44px minimum)
    const touchTarget =
      size === 'sm'
        ? "before:absolute before:-inset-3 before:content-['']"
        : ''

    // Build thumb classes
    const thumbBase = `
      inline-flex items-center justify-center rounded-full
      bg-white shadow-sm transition-transform duration-200 ease-out
    `

    const thumbPosition = isChecked
      ? thumbTranslate[size].checked
      : thumbTranslate[size].unchecked

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled || loading || undefined}
        aria-busy={loading || undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={`
          ${trackBase}
          ${trackStyles[size]}
          ${trackState}
          ${touchTarget}
          ${className}
        `}
        {...props}
      >
        <span
          className={`
            ${thumbBase}
            ${thumbStyles[size]}
            ${thumbPosition}
          `}
          aria-hidden="true"
        >
          {loading && <LoadingSpinner size={size} />}
        </span>
        {loading && <span className="sr-only">Saving...</span>}
      </button>
    )
  }
)

Switch.displayName = 'Switch'
