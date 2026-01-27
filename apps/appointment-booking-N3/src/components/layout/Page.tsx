import { useEffect, useState, type ReactNode } from 'react'

interface PageProps {
  children: ReactNode
  className?: string
  safeBottom?: boolean
  showOfflineBanner?: boolean
}

export function Page({ children, className = '', safeBottom = true, showOfflineBanner = true }: PageProps) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className={`min-h-screen bg-cream-100 ${safeBottom ? 'pb-32' : ''} ${className}`}>
      <div className="mx-auto max-w-md">
        {showOfflineBanner && !isOnline && (
          <div className="px-4 pt-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636l12.728 12.728" />
              </svg>
              <span>You are offline. Some actions may be unavailable.</span>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
