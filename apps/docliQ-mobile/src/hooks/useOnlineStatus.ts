import { useCallback, useEffect, useState } from 'react'

/** Returns current online status and helpers for banners / manual refresh. */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    () => (typeof navigator !== 'undefined' ? navigator.onLine : true)
  )
  const [justCameOnlineAt, setJustCameOnlineAt] = useState<number | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setJustCameOnlineAt(Date.now())
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const refreshOnlineStatus = useCallback(() => {
    if (typeof navigator === 'undefined') return
    const nowOnline = navigator.onLine
    setIsOnline(nowOnline)
    if (nowOnline) setJustCameOnlineAt(Date.now())
  }, [])

  return { isOnline, justCameOnlineAt, refreshOnlineStatus }
}
