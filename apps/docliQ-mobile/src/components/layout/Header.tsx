import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IconChevronLeft } from '@tabler/icons-react'
import { PATHS, doctorSlotsPath } from '../../routes/paths'
import { useBooking } from '../../state'
import { Button } from '../ui'
import { popBackPath } from '../../utils/navigation'

interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: ReactNode
}

/**
 * Determines the logical previous screen based on current route
 * Returns an object with the path pattern and extracted params, or null
 */
function getPreviousPathInfo(currentPath: string): { path: string; params?: Record<string, string> } | null {
  const pathParts = currentPath.split('/').filter(Boolean)

  // Booking flow navigation hierarchy
  if (currentPath === PATHS.BOOKING_CONFIRM) {
    // Confirm always comes from slots selection - need doctor ID from booking state
    return { path: 'SLOTS_FROM_CONFIRM' } // Special marker
  }

  // Fast-Lane flow: back should return to booking type selection
  if (currentPath === PATHS.FAST_LANE) {
    return { path: PATHS.BOOKING }
  }
  if (currentPath === PATHS.FAST_LANE_MATCHING) {
    return { path: PATHS.FAST_LANE }
  }
  if (currentPath === PATHS.FAST_LANE_SUCCESS || currentPath === PATHS.FAST_LANE_NO_MATCH) {
    return { path: PATHS.FAST_LANE }
  }

  // Slots: /booking/doctor/:id/slots -> Doctor profile: /booking/doctor/:id
  if (pathParts[0] === 'booking' && pathParts[1] === 'doctor' && pathParts[3] === 'slots') {
    const doctorId = pathParts[2]
    return { path: PATHS.BOOKING_DOCTOR, params: { id: doctorId } }
  }

  // Doctor profile: /booking/doctor/:id -> Results
  if (pathParts[0] === 'booking' && pathParts[1] === 'doctor' && pathParts.length === 3) {
    return { path: PATHS.BOOKING_RESULTS }
  }

  // Reviews: /booking/doctor/:id/reviews -> Doctor profile: /booking/doctor/:id
  if (pathParts[0] === 'booking' && pathParts[1] === 'doctor' && pathParts[3] === 'reviews') {
    const doctorId = pathParts[2]
    return { path: PATHS.BOOKING_DOCTOR, params: { id: doctorId } }
  }

  if (currentPath === PATHS.BOOKING_RESULTS) {
    return { path: PATHS.BOOKING_SEARCH }
  }
  if (currentPath === PATHS.BOOKING_SPECIALTY || currentPath === PATHS.BOOKING_SEARCH) {
    return { path: PATHS.BOOKING }
  }
  if (currentPath === PATHS.BOOKING_INSURANCE) {
    return { path: PATHS.BOOKING_LOCATION }
  }
  if (currentPath === PATHS.BOOKING_LOCATION) {
    return { path: PATHS.BOOKING_SEARCH }
  }

  // Profile screens
  if (currentPath === PATHS.PROFILE_EDIT) {
    return { path: PATHS.HOME }
  }
  if (pathParts[0] === 'profile' && pathParts[1] === 'family' && pathParts.length === 3) {
    return { path: PATHS.PROFILE_FAMILY }
  }
  // Family Members screen: always navigate back to Settings
  if (currentPath === PATHS.PROFILE_FAMILY) {
    return { path: PATHS.SETTINGS }
  }

  // Settings screens
  if (
    currentPath === PATHS.SETTINGS_NOTIFICATIONS ||
    currentPath === PATHS.SETTINGS_LANGUAGE ||
    currentPath === PATHS.SETTINGS_PRIVACY ||
    currentPath === PATHS.SETTINGS_FAQ ||
    currentPath === PATHS.SETTINGS_CONTACT ||
    currentPath === PATHS.SETTINGS_HELP
  ) {
    return { path: PATHS.SETTINGS }
  }

  // History screens
  if (pathParts[0] === 'history' && pathParts.length === 2) {
    return { path: PATHS.HISTORY }
  }
  if (pathParts[0] === 'appointments' && pathParts.length === 2) {
    return { path: PATHS.HOME }
  }

  // Reschedule flow
  if (pathParts[0] === 'reschedule' && pathParts.length === 2) {
    // Base reschedule path -> appointment detail
    const id = pathParts[1]
    return { path: `/appointments/${id}` }
  }
  if (pathParts[0] === 'reschedule' && pathParts[2] === 'confirm') {
    const id = pathParts[1]
    return { path: `/reschedule/${id}` }
  }
  if (pathParts[0] === 'reschedule' && pathParts[2] === 'reason') {
    const id = pathParts[1]
    return { path: `/appointments/${id}` }
  }

  // Book again flow
  if (pathParts[0] === 'book-again' && pathParts.length === 2) {
    // Base book-again path -> appointment detail or history
    const id = pathParts[1]
    return { path: `/appointments/${id}` }
  }
  if (pathParts[0] === 'book-again' && pathParts[2] === 'alternatives') {
    const id = pathParts[1]
    return { path: `/book-again/${id}` }
  }

  return null
}

export function Header({ title, subtitle, showBack = false, onBack, rightAction }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedDoctor } = useBooking()

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    // Check if navigation state provides a 'from' path
    const fromPath = (location.state as any)?.from as string | undefined
    if (fromPath) {
      navigate(fromPath)
      return
    }

    const currentPath = `${location.pathname}${location.search}`
    const backPath = popBackPath(currentPath)
    if (backPath && backPath !== currentPath) {
      navigate(backPath)
      return
    }

    // Try to determine logical previous screen based on current route
    const previousPathInfo = getPreviousPathInfo(location.pathname)

    if (previousPathInfo) {
      let resolvedPath = previousPathInfo.path

      // Handle special case: Confirm screen needs doctor ID from booking state
      if (resolvedPath === 'SLOTS_FROM_CONFIRM') {
        if (selectedDoctor) {
          resolvedPath = doctorSlotsPath(selectedDoctor.id)
          navigate(resolvedPath)
          return
        } else {
          // Fallback if doctor not available
          navigate(-1)
          return
        }
      }

      // Replace dynamic params in path pattern
      if (previousPathInfo.params) {
        Object.entries(previousPathInfo.params).forEach(([key, value]) => {
          resolvedPath = resolvedPath.replace(`:${key}`, value)
        })
      }

      navigate(resolvedPath)
      return
    }

    // Last resort: use browser history
    navigate(-1)
  }

  return (
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-cream-300">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
          {/* Back button uses shared Button component with icon variant */}
          {showBack && (
            <Button
              variant="icon"
              size="sm"
              onClick={handleBack}
              className="-ml-2"
              aria-label="Go back"
            >
              <IconChevronLeft className="text-slate-700" size={24} stroke={2} />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-charcoal-500">{title}</h1>
            {subtitle && <p className="truncate text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  )
}
