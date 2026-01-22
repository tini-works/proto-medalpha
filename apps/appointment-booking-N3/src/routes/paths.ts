export const PATHS = {
  // Auth
  AUTH_WELCOME: '/auth/welcome',
  AUTH_REGISTER: '/auth/register',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_VERIFY: '/auth/verify',

  // Profile
  PROFILE_COMPLETE: '/profile/complete',
  PROFILE_FAMILY: '/profile/family',
  PROFILE_EDIT: '/profile/edit',

  // Home
  HOME: '/home',

  // Booking
  BOOKING_SEARCH: '/booking/search',
  BOOKING_RESULTS: '/booking/results',
  BOOKING_DOCTOR: '/booking/doctor/:id',
  BOOKING_SLOTS: '/booking/doctor/:id/slots',
  BOOKING_CONFIRM: '/booking/confirm',
  BOOKING_SUCCESS: '/booking/success',

  // History
  HISTORY: '/history',
  HISTORY_DETAIL: '/history/:id',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
} as const

export function doctorPath(id: string) {
  return `/booking/doctor/${id}`
}

export function doctorSlotsPath(id: string) {
  return `/booking/doctor/${id}/slots`
}

export function historyDetailPath(id: string) {
  return `/history/${id}`
}
