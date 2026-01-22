import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppState } from '../state/AppContext'
import { PATHS } from './paths'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state } = useAppState()

  if (!state.auth.isAuthenticated) {
    return <Navigate to={PATHS.AUTH_WELCOME} replace />
  }

  if (!state.auth.verified) {
    return <Navigate to={PATHS.AUTH_VERIFY} replace />
  }

  return <>{children}</>
}

export function RequireProfileComplete({ children }: { children: ReactNode }) {
  const { isProfileComplete } = useAppState()

  if (!isProfileComplete) {
    return <Navigate to={PATHS.PROFILE_COMPLETE} replace />
  }

  return <>{children}</>
}

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { state } = useAppState()

  if (state.auth.isAuthenticated && state.auth.verified) {
    return <Navigate to={PATHS.HOME} replace />
  }

  return <>{children}</>
}
