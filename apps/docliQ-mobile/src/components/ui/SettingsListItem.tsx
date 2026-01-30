import { ReactNode } from 'react'
import { IconChevronRight } from '@tabler/icons-react'

interface SettingsListItemProps {
  icon: ReactNode
  iconBgClass?: string
  title: string
  description?: string
  onClick?: () => void
  rightElement?: ReactNode
  disabled?: boolean
}

/**
 * Reusable list item for settings screens.
 * Displays icon, title, description, and optional right element or chevron.
 */
export default function SettingsListItem({
  icon,
  iconBgClass = 'bg-teal-50',
  title,
  description,
  onClick,
  rightElement,
  disabled = false,
}: SettingsListItemProps) {
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between p-4 text-left transition-colors
        ${onClick && !disabled ? 'hover:bg-cream-100 cursor-pointer' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconBgClass} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="font-medium text-charcoal-500">{title}</p>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {rightElement || (onClick && (
        <IconChevronRight size={20} className="text-slate-400 flex-shrink-0" />
      ))}
    </Wrapper>
  )
}
