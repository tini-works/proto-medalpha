import type { ReactNode } from 'react'
import { IconSearch, IconCalendar, IconClock, IconUser, IconInbox } from '@tabler/icons-react'

interface EmptyStateProps {
  icon?: 'search' | 'calendar' | 'history' | 'user'
  title: string
  description?: string
  action?: ReactNode
}

function EmptyIcon({ icon }: { icon: EmptyStateProps['icon'] }) {
  const className = 'text-cream-400'

  // Use Tabler icons for empty states with appropriate sizing
  switch (icon) {
    case 'search':
      return <IconSearch className={className} size={48} stroke={1.5} />
    case 'calendar':
      return <IconCalendar className={className} size={48} stroke={1.5} />
    case 'history':
      return <IconClock className={className} size={48} stroke={1.5} />
    case 'user':
      return <IconUser className={className} size={48} stroke={1.5} />
    default:
      return <IconInbox className={className} size={48} stroke={1.5} />
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <EmptyIcon icon={icon} />
      <h3 className="mt-4 text-lg font-medium text-charcoal-500">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
