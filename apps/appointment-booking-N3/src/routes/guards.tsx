import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppState } from '../state/AppContext'
import { PATHS } from './paths'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state } = useAppState()
  const location = useLocation()

  if (!state.auth.isAuthenticated) {
    return <Navigate to={PATHS.AUTH_WELCOME} replace />
  }

  // Allow unverified users to access Verify Identity screen, Profile Complete, and Home
  // (booking features require profile completion, enforced separately)
  const allowedUnverifiedPaths = [
    PATHS.AUTH_VERIFY_IDENTITY,
    PATHS.PROFILE_COMPLETE,
    PATHS.HOME,
    PATHS.APPOINTMENT_DETAIL,
  ]
  if (!state.auth.verified && !allowedUnverifiedPaths.some((path) => location.pathname.startsWith(path.split(':')[0]))) {
    return <Navigate to={PATHS.AUTH_VERIFY} replace />
  }

  return <>{children}</>
}

export function RequireProfileComplete({ children }: { children: ReactNode }) {
  // Intentionally no-op: booking and other flows should be accessible even if the
  // profile is incomplete (per product decision).
  return <>{children}</>
}

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { state } = useAppState()

  if (state.auth.isAuthenticated && state.auth.verified) {
    return <Navigate to={PATHS.HOME} replace />
  }

  return <>{children}</>
}
