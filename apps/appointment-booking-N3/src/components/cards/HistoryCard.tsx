import type { HistoryItem } from '../../types'
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
  appointment: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  redemption: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  purchase: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
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
        className="w-full text-left bg-white rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Grayscale Avatar */}
          <div className="relative grayscale opacity-70 flex-shrink-0">
            <Avatar name={item.title} size="lg" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-neutral-900 truncate">{item.title}</h3>
              <Pill tone={config.tone} size="sm">
                {item.status === 'completed' ? '✓ ' : item.status === 'cancelled' ? '✕ ' : ''}{config.label}
              </Pill>
            </div>
            <p className="text-sm text-neutral-500">{item.subtitle}</p>
            <p className="text-xs text-neutral-400 mt-1">{formatDate(item.dateISO)}</p>
          </div>
        </div>

        {/* Book Again Button */}
        {onBookAgain && item.type === 'appointment' && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBookAgain()
              }}
              className="w-full h-11 text-sm font-medium text-neutral-800 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Book Again
            </button>
          </div>
        )}
      </button>
    )
  }

  // Default variant (original design)
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 text-neutral-600 flex-shrink-0">
          {typeIcons[item.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-neutral-900 leading-tight">{item.title}</h3>
            <Pill tone={config.tone} size="sm">
              {config.label}
            </Pill>
          </div>
          <p className="text-sm text-neutral-600 mt-0.5">{item.subtitle}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
            <span>{formatDate(item.dateISO)}</span>
            {item.forUserName && <span>Patient: {item.forUserName}</span>}
          </div>
        </div>
      </div>
    </button>
  )
}
