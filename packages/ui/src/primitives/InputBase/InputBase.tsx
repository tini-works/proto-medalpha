import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Apply error styling (red border, error focus ring) */
  hasError?: boolean
}

/**
 * InputBase - Low-level input primitive with semantic token styling.
 *
 * Features:
 * - Consistent focus ring styling
 * - Error state support
 * - Disabled state styling
 * - forwardRef for external focus control
 *
 * @example
 * ```tsx
 * <InputBase
 *   type="text"
 *   placeholder="Enter text..."
 *   hasError={!!error}
 * />
 * ```
 */
export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  ({ hasError = false, className = '', disabled, ...props }, ref) => {
    const baseStyles = `
      w-full h-[42px] px-3 py-2.5
      text-base leading-normal
      rounded-lg border bg-white
      placeholder:text-slate-400
      transition-colors duration-150
      focus:outline-none focus:ring-2 focus:border-transparent
    `

    const stateStyles = hasError
      ? 'border-coral-600 focus:ring-coral-500'
      : 'border-cream-400 focus:ring-teal-500'

    const disabledStyles = disabled
      ? 'bg-cream-200 text-slate-500 cursor-not-allowed'
      : ''

    return (
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={`${baseStyles} ${stateStyles} ${disabledStyles} ${className}`.trim()}
        {...props}
      />
    )
  }
)

InputBase.displayName = 'InputBase'
