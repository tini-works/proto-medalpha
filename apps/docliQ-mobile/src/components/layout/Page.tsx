import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { IconX } from '@tabler/icons-react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

interface PageProps {
  children: ReactNode
  className?: string
  safeBottom?: boolean
  showOfflineBanner?: boolean
}

export function Page({ children, className = '', safeBottom = true, showOfflineBanner = true }: PageProps) {
  const { t } = useTranslation('settings')
  const { isOnline, justCameOnlineAt, refreshOnlineStatus } = useOnlineStatus()
  const [showOnlineBanner, setShowOnlineBanner] = useState(false)

  useEffect(() => {
    if (!justCameOnlineAt) return
    setShowOnlineBanner(true)
    const timer = setTimeout(() => setShowOnlineBanner(false), 2500)
    return () => clearTimeout(timer)
  }, [justCameOnlineAt])

  return (
    <div className={`min-h-[var(--app-height)] bg-cream-100 ${safeBottom ? 'pb-32' : ''} ${className}`}>
      <div className="mx-auto max-w-md">
        {showOfflineBanner && !isOnline && (
          <div className="px-4 pt-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 flex items-center gap-2">
              <IconX className="text-slate-600 flex-shrink-0" size={16} stroke={2} />
              <span className="flex-1">{t('offlineBanner')}</span>
              <button
                type="button"
                onClick={refreshOnlineStatus}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                {t('offlineTryAgain')}
              </button>
            </div>
          </div>
        )}
        {showOfflineBanner && isOnline && showOnlineBanner && (
          <div className="px-4 pt-3">
            <div className="bg-teal-50 border border-teal-100 rounded-xl px-3 py-2 text-sm text-teal-700">
              {t('onlineUpdating')}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
