import type { AppState } from '../types'

export interface ScreenMetadata {
  name: string
  intention: {
    userGoal: string
    uxPurpose: string
  }
  getStates?: (state: AppState) => Record<string, string | boolean | number>
}

// Centralized metadata for all screens, keyed by route path pattern
export const screenMetadata: Record<string, ScreenMetadata> = {
  // Auth screens
  '/auth/welcome': {
    name: 'Welcome',
    intention: {
      userGoal: 'Start using the app',
      uxPurpose: 'Entry point for unauthenticated users, drives sign-in/register',
    },
  },
  '/auth/register': {
    name: 'Register',
    intention: {
      userGoal: 'Create a new account',
      uxPurpose: 'Collect email/password for account creation',
    },
    getStates: () => ({ step: 'email entry' }),
  },
  '/auth/sign-in': {
    name: 'Sign In',
    intention: {
      userGoal: 'Access existing account',
      uxPurpose: 'Authenticate returning users',
    },
  },
  '/auth/verify': {
    name: 'Verify Email',
    intention: {
      userGoal: 'Confirm email ownership',
      uxPurpose: 'OTP verification to prevent fake accounts',
    },
  },
  '/auth/verify-identity': {
    name: 'Verify Identity',
    intention: {
      userGoal: 'Prove identity for healthcare access',
      uxPurpose: 'Regulatory compliance for healthcare data',
    },
  },
  '/auth/forgot-password': {
    name: 'Forgot Password',
    intention: {
      userGoal: 'Recover account access',
      uxPurpose: 'Password reset initiation',
    },
  },
  '/auth/reset-password': {
    name: 'Reset Password',
    intention: {
      userGoal: 'Set a new password',
      uxPurpose: 'Complete password recovery flow',
    },
  },

  // Onboarding screens
  '/onboarding/profile': {
    name: 'Profile Setup',
    intention: {
      userGoal: 'Complete personal information',
      uxPurpose: 'Step 1 of 3: Collect DOB, gender, phone for booking',
    },
    getStates: (state) => ({
      hasName: Boolean(state.profile.fullName),
      hasPhone: Boolean(state.profile.phone),
    }),
  },
  '/onboarding/insurance': {
    name: 'Insurance Setup',
    intention: {
      userGoal: 'Link insurance information',
      uxPurpose: 'Step 2 of 3: Insurance for billing/coverage checks',
    },
    getStates: (state) => ({
      hasInsurance: Boolean(state.profile.egkNumber),
    }),
  },
  '/onboarding/verify': {
    name: 'eGK Verification Intro',
    intention: {
      userGoal: 'Understand identity verification',
      uxPurpose: 'Step 3 of 3: Explain why card scan is needed',
    },
  },
  '/onboarding/scan': {
    name: 'Card Scan',
    intention: {
      userGoal: 'Scan insurance card',
      uxPurpose: 'NFC/camera capture for identity verification',
    },
  },
  '/onboarding/success': {
    name: 'Verification Complete',
    intention: {
      userGoal: 'Confirm setup is done',
      uxPurpose: 'Success confirmation, transition to main app',
    },
  },

  // Home & main screens
  '/home': {
    name: 'Home',
    intention: {
      userGoal: 'See dashboard and quick actions',
      uxPurpose: 'Main entry point after auth, shows appointments & CTAs',
    },
    getStates: (state) => ({
      authenticated: state.auth.isAuthenticated,
      appointmentCount: state.appointments.length,
      upcomingCount: state.appointments.filter(
        (a) => a.status === 'confirmed' || a.status === 'await_confirm' || a.status === 'matching'
      ).length,
    }),
  },
  '/notifications': {
    name: 'Updates',
    intention: {
      userGoal: 'View recent activity and alerts',
      uxPurpose: 'Centralized notification feed',
    },
  },

  // Booking flow
  '/booking': {
    name: 'Booking Type',
    intention: {
      userGoal: 'Choose how to book an appointment',
      uxPurpose: 'Entry point for booking, Fast-Lane vs Browse',
    },
  },
  '/booking/fast-lane': {
    name: 'Fast-Lane Request',
    intention: {
      userGoal: 'Get matched to a doctor quickly',
      uxPurpose: 'Urgent care flow, minimal input required',
    },
  },
  '/booking/fast-lane/matching': {
    name: 'Fast-Lane Matching',
    intention: {
      userGoal: 'Wait for doctor match',
      uxPurpose: 'Loading/progress state during AI matching',
    },
  },
  '/booking/fast-lane/success': {
    name: 'Fast-Lane Success',
    intention: {
      userGoal: 'Confirm matched appointment',
      uxPurpose: 'Show match result, next steps',
    },
  },
  '/booking/fast-lane/no-match': {
    name: 'Fast-Lane No Match',
    intention: {
      userGoal: 'Understand no match found',
      uxPurpose: 'Fallback options when no immediate match',
    },
  },
  '/booking/specialty': {
    name: 'Search Specialty',
    intention: {
      userGoal: 'Find doctors by specialty',
      uxPurpose: 'Filter entry point for browse flow',
    },
    getStates: (state) => ({
      hasFilters: Boolean(state.booking.currentSearch),
      specialty: state.booking.currentSearch?.specialty || 'none',
    }),
  },
  '/booking/symptoms': {
    name: 'Symptoms',
    intention: {
      userGoal: 'Describe symptoms for better match',
      uxPurpose: 'Optional symptom input for doctor context',
    },
  },
  '/booking/availability': {
    name: 'Availability Preferences',
    intention: {
      userGoal: 'Set preferred appointment times',
      uxPurpose: 'Time/date constraints for search',
    },
  },
  '/booking/location': {
    name: 'Location',
    intention: {
      userGoal: 'Set search location',
      uxPurpose: 'Geographic filter for nearby doctors',
    },
    getStates: (state) => ({
      city: state.booking.currentSearch?.city || 'not set',
    }),
  },
  '/booking/insurance': {
    name: 'Insurance Selection',
    intention: {
      userGoal: 'Confirm insurance for booking',
      uxPurpose: 'Ensure coverage before showing results',
    },
  },
  '/booking/results': {
    name: 'Search Results',
    intention: {
      userGoal: 'Browse available doctors',
      uxPurpose: 'List of matching doctors with availability',
    },
    getStates: (state) => ({
      hasFilters: Boolean(state.booking.currentSearch),
    }),
  },
  '/booking/doctor/:id': {
    name: 'Doctor Profile',
    intention: {
      userGoal: 'Learn about a specific doctor',
      uxPurpose: 'Details, reviews, qualifications before booking',
    },
    getStates: (state) => ({
      selectedDoctor: state.booking.selectedDoctor?.name || 'none',
    }),
  },
  '/booking/doctor/:id/reviews': {
    name: 'Doctor Reviews',
    intention: {
      userGoal: 'Read patient reviews',
      uxPurpose: 'Social proof to support booking decision',
    },
  },
  '/booking/doctor/:id/slots': {
    name: 'Slot Selection',
    intention: {
      userGoal: 'Pick appointment time',
      uxPurpose: 'Calendar view of available slots',
    },
    getStates: (state) => ({
      selectedSlot: state.booking.selectedSlot?.time || 'none',
    }),
  },
  '/booking/confirm': {
    name: 'Confirm Booking',
    intention: {
      userGoal: 'Review and confirm appointment',
      uxPurpose: 'Final check before submission',
    },
    getStates: (state) => ({
      doctor: state.booking.selectedDoctor?.name || 'none',
      slot: state.booking.selectedSlot?.time || 'none',
    }),
  },
  '/booking/success': {
    name: 'Booking Success',
    intention: {
      userGoal: 'Confirm appointment is booked',
      uxPurpose: 'Success state, calendar sync options',
    },
  },
  '/booking/request-sent': {
    name: 'Request Sent',
    intention: {
      userGoal: 'Confirm request submitted',
      uxPurpose: 'Pending state for non-instant bookings',
    },
  },

  // History screens
  '/history': {
    name: 'Appointments',
    intention: {
      userGoal: 'View all appointments',
      uxPurpose: 'Tab 2: Past and upcoming appointment list',
    },
    getStates: (state) => ({
      total: state.appointments.length,
      upcoming: state.appointments.filter(
        (a) => a.status === 'confirmed' || a.status === 'await_confirm'
      ).length,
    }),
  },
  '/history/:id': {
    name: 'Appointment Detail',
    intention: {
      userGoal: 'View appointment details',
      uxPurpose: 'Full info, actions (cancel, reschedule)',
    },
  },
  '/history/archive': {
    name: 'Archive',
    intention: {
      userGoal: 'View past appointments',
      uxPurpose: 'Historical record of completed visits',
    },
  },

  // Reschedule flow
  '/reschedule/:id': {
    name: 'Reschedule Slots',
    intention: {
      userGoal: 'Find a new time',
      uxPurpose: 'Alternative slots for existing appointment',
    },
  },
  '/reschedule/:id/reason': {
    name: 'Reschedule Reason',
    intention: {
      userGoal: 'Explain reschedule reason',
      uxPurpose: 'Optional feedback for practice',
    },
  },
  '/reschedule/:id/confirm': {
    name: 'Confirm Reschedule',
    intention: {
      userGoal: 'Review new appointment time',
      uxPurpose: 'Final confirmation before change',
    },
  },
  '/reschedule/:id/success': {
    name: 'Reschedule Success',
    intention: {
      userGoal: 'Confirm reschedule complete',
      uxPurpose: 'Success confirmation with new details',
    },
  },

  // Book Again flow
  '/book-again/:id': {
    name: 'Book Again',
    intention: {
      userGoal: 'Rebook with same doctor',
      uxPurpose: 'Quick rebooking from history',
    },
  },
  '/book-again/:id/alternatives': {
    name: 'Alternatives',
    intention: {
      userGoal: 'Find similar doctors',
      uxPurpose: 'Fallback when original doctor unavailable',
    },
  },

  // Settings screens
  '/settings': {
    name: 'Settings',
    intention: {
      userGoal: 'Manage account settings',
      uxPurpose: 'Tab 3: Central settings hub',
    },
    getStates: (state) => ({
      language: state.preferences.language,
      biometrics: state.preferences.biometricsEnabled,
    }),
  },
  '/settings/notifications': {
    name: 'Notification Settings',
    intention: {
      userGoal: 'Control notification preferences',
      uxPurpose: 'Granular push/email controls',
    },
  },
  '/settings/language': {
    name: 'Language',
    intention: {
      userGoal: 'Change app language',
      uxPurpose: 'i18n language selection',
    },
    getStates: (state) => ({
      current: state.preferences.language,
    }),
  },
  '/settings/privacy': {
    name: 'Privacy & Data',
    intention: {
      userGoal: 'Manage privacy settings',
      uxPurpose: 'GDPR compliance hub',
    },
  },
  '/settings/privacy/export': {
    name: 'Data Export',
    intention: {
      userGoal: 'Download personal data',
      uxPurpose: 'GDPR data portability',
    },
  },
  '/settings/privacy/sharing': {
    name: 'Data Sharing',
    intention: {
      userGoal: 'Control data sharing',
      uxPurpose: 'Third-party data sharing controls',
    },
  },
  '/settings/privacy/consents': {
    name: 'Consent Management',
    intention: {
      userGoal: 'Review/update consents',
      uxPurpose: 'GDPR consent tracking',
    },
  },
  '/settings/faq': {
    name: 'FAQ',
    intention: {
      userGoal: 'Find answers to common questions',
      uxPurpose: 'Self-service support',
    },
  },
  '/settings/contact-support': {
    name: 'Contact Support',
    intention: {
      userGoal: 'Get help from support team',
      uxPurpose: 'Support contact options',
    },
  },
  '/settings/help-centre': {
    name: 'Help Centre',
    intention: {
      userGoal: 'Browse help topics',
      uxPurpose: 'Comprehensive help documentation',
    },
  },
  '/settings/password': {
    name: 'Change Password',
    intention: {
      userGoal: 'Update account password',
      uxPurpose: 'Security: password change',
    },
  },
  '/settings/biometrics': {
    name: 'Biometrics',
    intention: {
      userGoal: 'Enable/disable biometric login',
      uxPurpose: 'Face ID/Touch ID settings',
    },
    getStates: (state) => ({
      enabled: state.preferences.biometricsEnabled,
    }),
  },
  '/settings/address': {
    name: 'Address',
    intention: {
      userGoal: 'Update address',
      uxPurpose: 'Profile address management',
    },
  },
  '/settings/insurance': {
    name: 'Insurance',
    intention: {
      userGoal: 'Update insurance details',
      uxPurpose: 'Insurance card management',
    },
  },

  // Profile screens
  '/profile/family': {
    name: 'Family Members',
    intention: {
      userGoal: 'Manage family member profiles',
      uxPurpose: 'Book for dependents',
    },
    getStates: (state) => ({
      memberCount: state.profile.familyMembers.length,
    }),
  },
  '/profile/family/:id': {
    name: 'Family Member Detail',
    intention: {
      userGoal: 'Edit family member info',
      uxPurpose: 'Individual family member profile',
    },
  },
  '/profile/edit': {
    name: 'Edit Profile',
    intention: {
      userGoal: 'Update personal information',
      uxPurpose: 'Profile editing',
    },
  },
  '/profile/verify-phone': {
    name: 'Verify Phone',
    intention: {
      userGoal: 'Confirm phone number',
      uxPurpose: 'Phone verification for notifications',
    },
  },

  // Assistant screens
  '/assistant': {
    name: 'AI Assistant',
    intention: {
      userGoal: 'Get help from AI',
      uxPurpose: 'Conversational booking assistant',
    },
  },
  '/assistant/voice': {
    name: 'Voice Assistant',
    intention: {
      userGoal: 'Speak to AI assistant',
      uxPurpose: 'Voice-based interaction mode',
    },
  },
  '/assistant/recommendations': {
    name: 'Recommendations',
    intention: {
      userGoal: 'View AI suggestions',
      uxPurpose: 'Personalized doctor recommendations',
    },
  },
  '/assistant/doctor/:id': {
    name: 'Assistant Doctor Profile',
    intention: {
      userGoal: 'View recommended doctor',
      uxPurpose: 'Doctor profile from AI suggestion',
    },
  },
  '/assistant/confirm': {
    name: 'Assistant Confirm',
    intention: {
      userGoal: 'Confirm AI-suggested booking',
      uxPurpose: 'Booking confirmation from assistant flow',
    },
  },

  // Appointment detail (from tab)
  '/appointments/:id': {
    name: 'Appointment Detail',
    intention: {
      userGoal: 'View appointment info',
      uxPurpose: 'Full appointment details with actions',
    },
  },

  // Legal screens
  '/legal/privacy': {
    name: 'Privacy Policy',
    intention: {
      userGoal: 'Read privacy policy',
      uxPurpose: 'Legal: GDPR transparency',
    },
  },
  '/legal/terms': {
    name: 'Terms of Service',
    intention: {
      userGoal: 'Read terms of service',
      uxPurpose: 'Legal: Terms and conditions',
    },
  },
  '/legal/impressum': {
    name: 'Impressum',
    intention: {
      userGoal: 'View company information',
      uxPurpose: 'Legal: German Impressum requirement',
    },
  },
  '/legal/cookies': {
    name: 'Cookie Policy',
    intention: {
      userGoal: 'Read cookie policy',
      uxPurpose: 'Legal: Cookie usage disclosure',
    },
  },
}

// Helper to match dynamic routes like /booking/doctor/:id
export function getScreenMetadata(pathname: string): ScreenMetadata | null {
  // Try exact match first
  if (screenMetadata[pathname]) {
    return screenMetadata[pathname]
  }

  // Try pattern matching for dynamic routes
  for (const pattern of Object.keys(screenMetadata)) {
    if (pattern.includes(':')) {
      const regex = new RegExp(
        '^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$'
      )
      if (regex.test(pathname)) {
        return screenMetadata[pattern]
      }
    }
  }

  return null
}
