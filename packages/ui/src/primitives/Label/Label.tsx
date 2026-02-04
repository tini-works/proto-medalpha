import { type LabelHTMLAttributes } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Show required indicator (*) */
  required?: boolean
  /** Label text content */
  children: React.ReactNode
}

/**
 * Label - Form label primitive with required indicator support.
 *
 * Features:
 * - Associates with input via htmlFor
 * - Optional required indicator (*)
 * - Consistent typography styling
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required>
 *   Email Address
 * </Label>
 * ```
 */
export function Label({
  children,
  required,
  className = '',
  ...props
}: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-slate-700 ${className}`.trim()}
      {...props}
    >
      {children}
      {required && (
        <span className="text-coral-600 ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}
