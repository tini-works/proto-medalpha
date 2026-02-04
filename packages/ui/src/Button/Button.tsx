import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'destructive-filled'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

const variantStyles = {
  // Business intent: align "primary" actions with MedAlpha brand tokens (brand-blue-*).
  // This avoids invisible buttons when an app doesn't define generic `primary-*` colors.
  primary: 'bg-brand-blue-600 text-white hover:bg-brand-blue-700 focus:ring-brand-blue-500',
  secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500',
  destructive: 'border border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-500',
  'destructive-filled': 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', fullWidth = false, loading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const widthStyle = fullWidth ? 'w-full' : ''

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
