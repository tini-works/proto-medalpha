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
    const hadDevOverride = typeof window !== 'undefined' && (window as any).__devOnlineOverride !== undefined
    if (hadDevOverride) {
      // Clear dev override so "Try again" checks the real connection.
      delete (window as any).__devOnlineOverride
    }

    const currentStatus = typeof navigator === 'undefined' ? true : navigator.onLine
    if (hadDevOverride && typeof window !== 'undefined') {
      // Notify other hook instances to sync their state.
      window.dispatchEvent(new Event(currentStatus ? 'online' : 'offline'))
    }
    setIsOnline((prev) => {
      if (!prev && currentStatus) setJustCameOnlineAt(Date.now())
      if (prev && !currentStatus) setJustCameOnlineAt(null)
      return currentStatus
    })
  }, [])

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
