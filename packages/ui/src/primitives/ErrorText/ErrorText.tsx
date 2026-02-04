import { type HTMLAttributes } from 'react'

export interface ErrorTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Error message content */
  children: React.ReactNode
}

/**
 * ErrorText - Error message display for form inputs.
 *
 * Features:
 * - role="alert" for screen reader announcement
 * - Consistent error color styling
 * - Supports id for aria-describedby linking
 *
 * @example
 * ```tsx
 * <ErrorText id="email-error">
 *   Please enter a valid email address.
 * </ErrorText>
 * ```
 */
export function ErrorText({
  children,
  className = '',
  ...props
}: ErrorTextProps) {
  return (
    <p
      role="alert"
      className={`text-sm text-coral-800 ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  )
}
