import { type HTMLAttributes } from 'react'

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Helper text content */
  children: React.ReactNode
}

/**
 * HelperText - Hint/description text below form inputs.
 *
 * Features:
 * - Consistent typography and color
 * - Supports id for aria-describedby linking
 *
 * @example
 * ```tsx
 * <HelperText id="email-hint">
 *   We'll never share your email.
 * </HelperText>
 * ```
 */
export function HelperText({
  children,
  className = '',
  ...props
}: HelperTextProps) {
  return (
    <p
      className={`text-sm text-slate-500 ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  )
}
