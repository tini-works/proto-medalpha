export const PATHS = {
  // Auth
  AUTH_WELCOME: '/auth/welcome',
  AUTH_REGISTER: '/auth/register',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_VERIFY: '/auth/verify',
  AUTH_VERIFY_IDENTITY: '/auth/verify-identity',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  // OAuth flow
  AUTH_OAUTH_CONSENT: '/auth/oauth-consent',
  AUTH_OAUTH_ERROR: '/auth/oauth-error',
  AUTH_INSURANCE_REQUEST: '/auth/insurance-request',

  // Onboarding flow (3-step identity verification)
  ONBOARDING_PROFILE: '/onboarding/profile',       // Step 1: DOB, Gender, Phone
  ONBOARDING_INSURANCE: '/onboarding/insurance',   // Step 2: Insurance selection
  ONBOARDING_VERIFY: '/onboarding/verify',         // Step 3: eGK scan intro
  ONBOARDING_SCAN: '/onboarding/scan',             // Step 3b: Camera mock
  ONBOARDING_SUCCESS: '/onboarding/success',       // Verification complete

  // Profile
  PROFILE_COMPLETE: '/profile/complete',           // Deprecated - redirects to ONBOARDING_PROFILE
  PROFILE_FAMILY: '/profile/family',
  PROFILE_FAMILY_DETAIL: '/profile/family/:id',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_VERIFY_PHONE: '/profile/verify-phone',

  // Home
  HOME: '/home',
  NOTIFICATIONS: '/notifications',
  ARTICLE_DETAIL: '/news/:articleId',

  // Booking - Entry point
  BOOKING: '/booking',

  // Fast-Lane flow
  FAST_LANE: '/booking/fast-lane',
  FAST_LANE_MATCHING: '/booking/fast-lane/matching',
  FAST_LANE_SUCCESS: '/booking/fast-lane/success',
  FAST_LANE_NO_MATCH: '/booking/fast-lane/no-match',

  // Book by Specialty flow (existing flow, renamed)
  BOOKING_SPECIALTY: '/booking/specialty',
  BOOKING_CONSTRAINTS: '/booking/constraints', // Deprecated - redirects to specialty
  BOOKING_SYMPTOMS: '/booking/symptoms', // Doctor-first flow symptom description
  BOOKING_AVAILABILITY: '/booking/availability',
  BOOKING_LOCATION: '/booking/location',
  BOOKING_INSURANCE: '/booking/insurance',
  BOOKING_RESULTS: '/booking/results',
  BOOKING_DOCTOR: '/booking/doctor/:id',
  BOOKING_REVIEWS: '/booking/doctor/:id/reviews',
  BOOKING_SLOTS: '/booking/doctor/:id/slots',
  BOOKING_CONFIRM: '/booking/confirm',
  BOOKING_SUCCESS: '/booking/success',
  BOOKING_REQUEST_SENT: '/booking/request-sent',

  // Book by Doctor flow (future)
  BOOKING_DOCTOR_SEARCH: '/booking/doctor-search',

  // Legacy alias for backward compatibility
  BOOKING_SEARCH: '/booking/specialty',

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
  SETTINGS_PASSWORD: '/settings/password',
  SETTINGS_BIOMETRICS: '/settings/biometrics',
  SETTINGS_ADDRESS: '/settings/address',
  SETTINGS_INSURANCE: '/settings/insurance',

  // Assistants (optional enhancement)
  ASSISTANT: '/assistant',
  ASSISTANT_VOICE: '/assistant/voice',
  ASSISTANT_RECOMMENDATIONS: '/assistant/recommendations',
  ASSISTANT_DOCTOR: '/assistant/doctor/:id',
  ASSISTANT_CONFIRM: '/assistant/confirm',

  // Legal pages
  LEGAL_PRIVACY: '/legal/privacy',
  LEGAL_TERMS: '/legal/terms',
  LEGAL_IMPRESSUM: '/legal/impressum',
  LEGAL_COOKIES: '/legal/cookies',

  // Privacy settings sub-screens (GDPR)
  SETTINGS_PRIVACY_EXPORT: '/settings/privacy/export',
  SETTINGS_PRIVACY_SHARING: '/settings/privacy/sharing',
  SETTINGS_PRIVACY_CONSENTS: '/settings/privacy/consents',

  // Account deletion
  SETTINGS_DELETE_EMAIL_CONFIRM: '/settings/delete-email-confirm',
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
