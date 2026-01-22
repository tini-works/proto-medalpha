import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { state } = useAppState()
  if (!state.auth.isAuthenticated) return <Navigate to="/auth/welcome" replace />
  if (!state.auth.verified) return <Navigate to="/auth/verify" replace />
  return <>{children}</>
}

export function RequireProfileComplete({ children }: { children: React.ReactNode }) {
  const { isProfileComplete } = useAppState()
  if (!isProfileComplete) return <Navigate to="/profile/complete" replace />
  return <>{children}</>
}

