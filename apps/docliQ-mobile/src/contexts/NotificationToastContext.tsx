import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

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
  const currentToastRef = useRef<ToastData | null>(null)
  const toastQueueRef = useRef<ToastData[]>([])
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastIdRef = useRef(0)

  // Keep ref in sync with state to avoid stale closures
  currentToastRef.current = currentToast

  // Cleanup timeout on unmount to prevent state updates on unmounted component
  useEffect(() => {
    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current)
      }
    }
  }, [])

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
      // Use ref to get latest value, avoid stale closure
      if (currentToastRef.current?.id === id) {
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
    [processQueue]
  )

  const showToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${++toastIdRef.current}`
      const data: ToastData = { ...toast, id }

      // Clear any existing auto-dismiss timer
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current)
        dismissTimeoutRef.current = null
      }

      // If there's already a toast showing, push it to front of queue
      // Use ref to get latest value, avoid stale closure
      if (currentToastRef.current) {
        toastQueueRef.current.unshift(currentToastRef.current)
      }

      // Show the new toast immediately (newest on top)
      setCurrentToast(data)
      dismissTimeoutRef.current = setTimeout(() => {
        dismissTimeoutRef.current = null
        processQueue()
      }, AUTO_DISMISS_MS)
    },
    [processQueue]
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
