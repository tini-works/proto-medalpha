import React, { createContext, useCallback, useContext, useRef, useState } from 'react'

/**
 * Data for a single in-app toast (status-change notification).
 */
export interface ToastData {
  id: string
  title: string
  appointmentId?: string
  type: 'success' | 'info' | 'warning'
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastData, 'id'>) => void
  dismissToast: (id: string) => void
  currentToast: ToastData | null
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 5000

export function NotificationToastProvider({ children }: { children: React.ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null)
  const toastQueueRef = useRef<ToastData[]>([])
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastIdRef = useRef(0)

  // Process next toast in queue
  const processQueue = useCallback(() => {
    if (toastQueueRef.current.length === 0) {
      setCurrentToast(null)
      return
    }

    const nextToast = toastQueueRef.current.shift()!
    setCurrentToast(nextToast)

    dismissTimeoutRef.current = setTimeout(() => {
      dismissTimeoutRef.current = null
      processQueue()
    }, AUTO_DISMISS_MS)
  }, [])

  const dismissToast = useCallback(
    (id: string) => {
      if (currentToast?.id === id) {
        // Dismissing the current toast - process queue for next
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current)
          dismissTimeoutRef.current = null
        }
        processQueue()
      } else {
        // Remove from queue if not yet shown
        toastQueueRef.current = toastQueueRef.current.filter((t) => t.id !== id)
      }
    },
    [currentToast, processQueue]
  )

  const showToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${++toastIdRef.current}`
      const data: ToastData = { ...toast, id }

      if (currentToast === null && toastQueueRef.current.length === 0) {
        // No active toast, show immediately
        setCurrentToast(data)
        dismissTimeoutRef.current = setTimeout(() => {
          dismissTimeoutRef.current = null
          processQueue()
        }, AUTO_DISMISS_MS)
      } else {
        // Queue the toast for later
        toastQueueRef.current.push(data)
      }
    },
    [currentToast, processQueue]
  )

  const value: ToastContextValue = {
    showToast,
    dismissToast,
    currentToast,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useNotificationToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useNotificationToast must be used within NotificationToastProvider')
  }
  return ctx
}
