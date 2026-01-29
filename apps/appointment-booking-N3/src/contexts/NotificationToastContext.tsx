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

let toastIdCounter = 0
const AUTO_DISMISS_MS = 5000

export function NotificationToastProvider({ children }: { children: React.ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null)
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismissToast = useCallback((id: string) => {
    setCurrentToast((prev) => (prev?.id === id ? null : prev))
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current)
      dismissTimeoutRef.current = null
    }
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current)
        dismissTimeoutRef.current = null
      }
      const id = `toast-${++toastIdCounter}`
      const data: ToastData = { ...toast, id }
      setCurrentToast(data)
      dismissTimeoutRef.current = setTimeout(() => {
        dismissToast(id)
        dismissTimeoutRef.current = null
      }, AUTO_DISMISS_MS)
    },
    [dismissToast]
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
