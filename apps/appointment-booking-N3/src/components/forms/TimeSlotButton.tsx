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
    ? 'bg-neutral-800 text-white hover:bg-neutral-700'
    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'

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
