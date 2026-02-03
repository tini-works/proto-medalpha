import { useState, useEffect, useCallback } from 'react'

interface OnlineStatus {
  isOnline: boolean
  justCameOnlineAt: number | null
  refreshOnlineStatus: () => void
}

export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [justCameOnlineAt, setJustCameOnlineAt] = useState<number | null>(null)

  const refreshOnlineStatus = useCallback(() => {
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true
    setIsOnline(online)
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

  return { isOnline, justCameOnlineAt, refreshOnlineStatus }
}
