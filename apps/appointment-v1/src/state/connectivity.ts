import { useEffect, useState } from 'react'

/**
 * Business intent: support BOOK-020 offline indicator without extra infra.
 */
export function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    function onChange() {
      setOnline(navigator.onLine)
    }
    window.addEventListener('online', onChange)
    window.addEventListener('offline', onChange)
    return () => {
      window.removeEventListener('online', onChange)
      window.removeEventListener('offline', onChange)
    }
  }, [])

  return online
}

