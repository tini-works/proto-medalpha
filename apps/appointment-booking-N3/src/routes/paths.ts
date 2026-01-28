export const PATHS = {
  // Auth
  AUTH_WELCOME: '/auth/welcome',
  AUTH_REGISTER: '/auth/register',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_VERIFY: '/auth/verify',
  AUTH_VERIFY_IDENTITY: '/auth/verify-identity',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',

  // Profile
  PROFILE_COMPLETE: '/profile/complete',
  PROFILE_FAMILY: '/profile/family',
  PROFILE_FAMILY_DETAIL: '/profile/family/:id',
  PROFILE_EDIT: '/profile/edit',

  // Home
  HOME: '/home',
  NOTIFICATIONS: '/notifications',
  ARTICLE_DETAIL: '/news/:articleId',

  // Booking
  BOOKING_SEARCH: '/booking/search',
  BOOKING_LOCATION: '/booking/location',
  BOOKING_INSURANCE: '/booking/insurance',
  BOOKING_RESULTS: '/booking/results',
  BOOKING_DOCTOR: '/booking/doctor/:id',
  BOOKING_REVIEWS: '/booking/doctor/:id/reviews',
  BOOKING_SLOTS: '/booking/doctor/:id/slots',
  BOOKING_CONFIRM: '/booking/confirm',
  BOOKING_SUCCESS: '/booking/success',

  // History / Appointments
  HISTORY: '/history',
  HISTORY_DETAIL: '/history/:id',
  HISTORY_ARCHIVE: '/history/archive',
  APPOINTMENT_DETAIL: '/appointments/:id',

  // Reschedule flow (R01-R03)
  RESCHEDULE: '/reschedule/:id',
  RESCHEDULE_REASON: '/reschedule/:id/reason',
  RESCHEDULE_CONFIRM: '/reschedule/:id/confirm',
  RESCHEDULE_SUCCESS: '/reschedule/:id/success',

  // Book Again flow (B01)
  BOOK_AGAIN: '/book-again/:id',
  BOOK_AGAIN_ALTERNATIVES: '/book-again/:id/alternatives',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_LANGUAGE: '/settings/language',
  SETTINGS_PRIVACY: '/settings/privacy',
  SETTINGS_FAQ: '/settings/faq',
  SETTINGS_CONTACT: '/settings/contact-support',
  SETTINGS_HELP: '/settings/help-centre',

  // Assistants (optional enhancement)
  ASSISTANT: '/assistant',
  ASSISTANT_VOICE: '/assistant/voice',
  ASSISTANT_RECOMMENDATIONS: '/assistant/recommendations',
  ASSISTANT_DOCTOR: '/assistant/doctor/:id',
  ASSISTANT_CONFIRM: '/assistant/confirm',
} as const

export function assistantDoctorPath(id: string) {
  return `/assistant/doctor/${id}`
}

export function doctorPath(id: string) {
  return `/booking/doctor/${id}`
}

export function doctorSlotsPath(id: string) {
  return `/booking/doctor/${id}/slots`
}

export function historyDetailPath(id: string) {
  return `/history/${id}`
}

export function appointmentDetailPath(id: string) {
  return `/appointments/${id}`
}

export function reschedulePath(appointmentId: string) {
  return `/reschedule/${appointmentId}`
}

export function rescheduleConfirmPath(appointmentId: string) {
  return `/reschedule/${appointmentId}/confirm`
}

export function rescheduleSuccessPath(appointmentId: string) {
  return `/reschedule/${appointmentId}/success`
}

export function bookAgainPath(appointmentId: string) {
  return `/book-again/${appointmentId}`
}

export function familyMemberDetailPath(memberId: string) {
  return `/profile/family/${memberId}`
}
