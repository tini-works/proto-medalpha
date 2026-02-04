import React, { createContext, useCallback, useContext, useState } from 'react'

/** Target surface for biometric simulation (panel-driven, not inline DEV buttons). */
export type BiometricSimulationTarget =
  | 'biometrics-settings'
  | 'allow-modal'
  | 'sign-in-prompt'

export type BiometricSimulationRequest = {
  type: 'success' | 'fail'
  target: BiometricSimulationTarget
} | null

interface DevModeContextValue {
  isDevMode: boolean
  isDrawerOpen: boolean
  toggleDevMode: () => void
  openDrawer: () => void
  closeDrawer: () => void
  /** Panel-driven biometric simulation; consumed by active biometric surface, then cleared. */
  biometricSimulationRequest: BiometricSimulationRequest
  requestBiometricSimulation: (type: 'success' | 'fail', target: BiometricSimulationTarget) => void
  clearBiometricSimulationRequest: () => void
}

const DevModeContext = createContext<DevModeContextValue | null>(null)

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [biometricSimulationRequest, setBiometricSimulationRequest] =
    useState<BiometricSimulationRequest>(null)

  const toggleDevMode = useCallback(() => {
    setIsDevMode((prev) => {
      const next = !prev
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

  const requestBiometricSimulation = useCallback(
    (type: 'success' | 'fail', target: BiometricSimulationTarget) => {
      setBiometricSimulationRequest({ type, target })
    },
    []
  )
  const clearBiometricSimulationRequest = useCallback(() => {
    setBiometricSimulationRequest(null)
  }, [])

  const value: DevModeContextValue = {
    isDevMode,
    isDrawerOpen,
    toggleDevMode,
    openDrawer,
    closeDrawer,
    biometricSimulationRequest,
    requestBiometricSimulation,
    clearBiometricSimulationRequest,
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
