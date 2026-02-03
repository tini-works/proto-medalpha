import { useState, useEffect, useCallback } from 'react'

interface OnlineStatus {
  isOnline: boolean
  justCameOnlineAt: number | null
  refreshOnlineStatus: () => void
}

/**
 * Hook to track browser online/offline status.
 * Supports dev override via window.__devOnlineOverride for testing.
 */
export function useOnlineStatus(): OnlineStatus {
  const getOnlineStatus = useCallback(() => {
    // Support dev override for testing offline scenarios
    if (typeof window !== 'undefined' && (window as any).__devOnlineOverride !== undefined) {
      return (window as any).__devOnlineOverride as boolean
    }
    return typeof navigator === 'undefined' ? true : navigator.onLine
  }, [])

  const [isOnline, setIsOnline] = useState(getOnlineStatus)
  const [justCameOnlineAt, setJustCameOnlineAt] = useState<number | null>(null)

  const refreshOnlineStatus = useCallback(() => {
    const currentStatus = getOnlineStatus()
    setIsOnline(currentStatus)
  }, [getOnlineStatus])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setJustCameOnlineAt(Date.now())
    }

    const handleOffline = () => {
      setIsOnline(false)
      setJustCameOnlineAt(null)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Clear "just came online" indicator after 3 seconds
  useEffect(() => {
    if (justCameOnlineAt) {
      const timer = setTimeout(() => {
        setJustCameOnlineAt(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [justCameOnlineAt])

  return { isOnline, justCameOnlineAt, refreshOnlineStatus }
}
