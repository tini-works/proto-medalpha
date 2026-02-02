import React, { createContext, useCallback, useContext, useState } from 'react'

interface DevModeContextValue {
  isDevMode: boolean
  isDrawerOpen: boolean
  toggleDevMode: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const DevModeContext = createContext<DevModeContextValue | null>(null)

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDevMode = useCallback(() => {
    setIsDevMode((prev) => {
      const next = !prev
      // Auto-open drawer when enabling dev mode
      if (next) {
        setIsDrawerOpen(true)
      } else {
        setIsDrawerOpen(false)
      }
      return next
    })
  }, [])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const value: DevModeContextValue = {
    isDevMode,
    isDrawerOpen,
    toggleDevMode,
    openDrawer,
    closeDrawer,
  }

  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>
}

export function useDevMode(): DevModeContextValue {
  const ctx = useContext(DevModeContext)
  if (!ctx) {
    throw new Error('useDevMode must be used within DevModeProvider')
  }
  return ctx
}
