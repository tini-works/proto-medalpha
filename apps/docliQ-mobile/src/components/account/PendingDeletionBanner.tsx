import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconAlertTriangle } from '@tabler/icons-react'

export interface PendingDeletionBannerProps {
  expiresAt: string
  onCancel: () => void
  onSkipToDeletion?: () => void
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0h 0m'
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

export function PendingDeletionBanner({
  expiresAt,
  onCancel,
  onSkipToDeletion,
}: PendingDeletionBannerProps) {
  const { t } = useTranslation('legal')
  const [timeRemaining, setTimeRemaining] = useState(() => {
    return new Date(expiresAt).getTime() - Date.now()
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(expiresAt).getTime() - Date.now()
      setTimeRemaining(remaining)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [expiresAt])

  const countdownText = formatCountdown(timeRemaining)

  return (
    <div
      className="bg-amber-50 border-b border-amber-200 px-4 py-3"
      role="alert"
      data-testid="pending-deletion-banner"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <IconAlertTriangle size={16} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-charcoal-500 text-sm">
            {t('deletePending.title')}
          </p>
          <p className="text-sm text-amber-700 mt-0.5">
            {t('deletePending.countdown', { time: countdownText })}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
            >
              {t('deletePending.cancelButton')}
            </button>
            {onSkipToDeletion && (
              <button
                type="button"
                onClick={onSkipToDeletion}
                className="text-xs font-mono text-slate-400 hover:text-slate-600"
                data-testid="dev-skip-deletion"
              >
                {t('deletePending.mockSkip')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
