import { IconCalendar, IconCheck, IconShoppingBag } from '@tabler/icons-react'
import type { HistoryItem } from '../../types'
import { Button } from '../ui'
import { Pill } from '../display/Pill'
import { Avatar } from '../display/Avatar'
import { formatDate } from '../../utils/format'

interface HistoryCardProps {
  item: HistoryItem
  onClick?: () => void
  onBookAgain?: () => void
  variant?: 'default' | 'history'
}

const typeIcons: Record<HistoryItem['type'], JSX.Element> = {
  appointment: <IconCalendar className="w-5 h-5" stroke={1.5} />,
  redemption: <IconCheck className="w-5 h-5" stroke={1.5} />,
  purchase: <IconShoppingBag className="w-5 h-5" stroke={1.5} />,
}

// Conservative status mapping - no green for generic "completed"
const statusConfig: Record<HistoryItem['status'], { tone: 'info' | 'neutral' | 'negative'; label: string }> = {
  planned: { tone: 'info', label: 'Planned' },
  completed: { tone: 'neutral', label: 'Completed' },
  cancelled: { tone: 'negative', label: 'Cancelled' },
}

export function HistoryCard({ item, onClick, onBookAgain, variant = 'default' }: HistoryCardProps) {
  const config = statusConfig[item.status]

  // History variant - simpler design with grayscale photo and Book Again button
  if (variant === 'history') {
    return (
      <button
        onClick={onClick}
        className="w-full text-left bg-white rounded-xl border border-cream-400 p-4 hover:border-cream-500 transition-colors duration-normal ease-out-brand"
      >
        <div className="flex items-start gap-3">
          {/* Grayscale Avatar */}
          <div className="relative grayscale opacity-70 flex-shrink-0">
            <Avatar name={item.title} size="lg" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-charcoal-500 truncate">{item.title}</h3>
              <Pill tone={config.tone} size="sm">
                {item.status === 'completed' ? '✓ ' : item.status === 'cancelled' ? '✕ ' : ''}{config.label}
              </Pill>
            </div>
            <p className="text-sm text-slate-500">{item.subtitle}</p>
            <p className="text-xs text-slate-400 mt-1">{formatDate(item.dateISO)}</p>
          </div>
        </div>

        {/* Book Again Button */}
        {onBookAgain && item.type === 'appointment' && (
          <div className="mt-3 pt-3 border-t border-cream-200">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onBookAgain()
              }}
              variant="secondary"
              size="md"
              fullWidth
            >
              Book Again
            </Button>
          </div>
        )}
      </button>
    )
  }

  // Default variant (original design)
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-cream-400 hover:border-cream-500 transition-colors duration-normal ease-out-brand"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cream-200 text-slate-600 flex-shrink-0">
          {typeIcons[item.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-charcoal-500 leading-tight">{item.title}</h3>
            <Pill tone={config.tone} size="sm">
              {config.label}
            </Pill>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">{item.subtitle}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span>{formatDate(item.dateISO)}</span>
            {item.forUserName && <span>Patient: {item.forUserName}</span>}
          </div>
        </div>
      </div>
    </button>
  )
}
