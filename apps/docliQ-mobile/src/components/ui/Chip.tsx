import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  leadingIcon?: ReactNode
  shape?: 'pill' | 'rounded'
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

export function Chip({
  children,
  selected = false,
  onClick,
  leadingIcon,
  shape = 'rounded',
  fullWidth = false,
  disabled = false,
  className = '',
}: ChipProps) {
  const shapeClass = shape === 'pill' ? 'rounded-full px-4 py-2' : 'rounded-xl px-4 py-3'
  const widthClass = fullWidth ? 'w-full' : ''

  const stateClass = selected
    ? 'bg-teal-50 border border-teal-500 text-charcoal-500 shadow-sm'
    : 'bg-white border border-cream-400 text-charcoal-500 hover:bg-cream-50 hover:border-cream-500'

  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${widthClass} ${shapeClass} text-sm font-medium transition-all text-left inline-flex items-center gap-2 ${stateClass} ${disabledClass} ${className}`}
      aria-pressed={selected}
      disabled={disabled}
    >
      {leadingIcon}
      {children}
    </button>
  )
}
