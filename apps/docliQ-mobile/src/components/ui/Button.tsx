import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader } from 'tabler-icons-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Design system variant: primary (teal filled), secondary (teal outline),
  // tertiary (ghost), accent (coral), destructive (red outline),
  // destructive-filled (red filled), icon (circular), link (text-only)
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'destructive' | 'destructive-filled' | 'icon' | 'link'
  // Button size for touch targets and visual hierarchy
  size?: 'sm' | 'md' | 'lg'
  // Full-width button (replaces btn-block utility)
  fullWidth?: boolean
  // Loading state: shows spinner, disables interaction
  loading?: boolean
  // Icon element before button text
  leftIcon?: ReactNode
  // Icon element after button text
  rightIcon?: ReactNode
  // Test ID for testing-library queries
  testId?: string
}

// Tailwind class sets for each variant
const variantStyles = {
  // Primary: Teal filled for main CTAs (brand primary action)
  primary:
    'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700 active:scale-[0.98] disabled:bg-teal-200 disabled:text-teal-800',
  // Secondary: Teal outline for alternative actions
  secondary:
    'bg-transparent text-teal-700 border border-teal-500 hover:bg-teal-50 active:bg-teal-100 active:scale-[0.98]',
  // Tertiary: Ghost style for low-emphasis actions
  tertiary:
    'bg-transparent text-charcoal-500 hover:bg-cream-200 active:bg-cream-300 active:scale-[0.98]',
  // Accent: Coral for highlight/urgent actions (secondary brand color)
  accent:
    'bg-coral-500 text-charcoal-500 hover:bg-coral-600 active:bg-coral-700 active:scale-[0.98] focus-visible:ring-coral-500',
  // Destructive: Red outline for dangerous actions (cancel, delete, remove)
  destructive:
    'border border-red-300 text-red-600 hover:bg-red-50 active:scale-[0.98] disabled:opacity-50',
  // Destructive filled: Red filled for confirming destructive actions
  'destructive-filled':
    'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] disabled:opacity-50',
  // Icon: Circular transparent button for icon-only use (back, close, favorite)
  icon: 'flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors',
  // Link: Text-only button for secondary actions
  link: 'bg-transparent text-teal-700 hover:underline',
}

// Size classes for consistent button heights and padding
const sizeStyles = {
  // Small: 40px, compact for icon buttons and tight UI
  sm: 'h-10 px-3 py-2 text-sm w-10',
  // Medium: 44px minimum (WCAG touch target), standard button size
  md: 'h-11 px-4 py-3 text-base',
  // Large: 48-56px for primary CTAs (calls-to-action)
  lg: 'h-14 px-4 py-3.5 text-base',
}

// Base styles applied to all button variants
const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-normal ease-out-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      children,
      testId,
      ...props
    },
    ref
  ) => {
    // Combine all classes: base + variant + size + fullWidth + custom
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 disabled:cursor-not-allowed' : ''} ${className}`

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        data-testid={testId}
        {...props}
      >
        {/* Icon + text layout: left icon, then text, then right icon */}
        {loading ? (
          <Loader size="20" stroke="2" className="animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="mr-2 flex items-center justify-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 flex items-center justify-center">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
