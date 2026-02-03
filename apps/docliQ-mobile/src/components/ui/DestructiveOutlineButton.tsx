import type { ReactNode } from 'react'

interface DestructiveOutlineButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function DestructiveOutlineButton({
  children,
  onClick,
  className = '',
  disabled = false,
}: DestructiveOutlineButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 px-4 border-2 border-red-500 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}

