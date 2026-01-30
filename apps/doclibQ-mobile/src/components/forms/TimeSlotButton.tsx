interface TimeSlotButtonProps {
  time: string
  subtitle?: string
  variant?: 'primary' | 'secondary'
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function TimeSlotButton({
  time,
  subtitle,
  variant = 'secondary',
  selected = false,
  onClick,
  disabled = false,
}: TimeSlotButtonProps) {
  const isPrimary = variant === 'primary' || selected

  const baseClasses = `
    shrink-0 flex flex-col items-center justify-center
    px-4 py-2 rounded-lg min-w-[100px]
    transition-all duration-200
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  `

  const variantClasses = isPrimary
    ? 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700'
    : 'bg-cream-200 text-charcoal-500 hover:bg-cream-300'

  const subtitleOpacity = isPrimary ? 'opacity-90' : 'opacity-70'

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-sm font-bold">{time}</span>
      {subtitle && (
        <span className={`text-[10px] ${subtitleOpacity}`}>{subtitle}</span>
      )}
    </button>
  )
}
