/**
 * Golden Test Utilities
 *
 * Shared utilities for testing user story acceptance criteria from
 * User Stories from Philipp (January 27, 2026)
 */

import { ReactNode } from 'react'
import { render, RenderOptions, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'

// Initialize test i18n with common translations
export const initTestI18n = (resources?: Record<string, Record<string, unknown>>) => {
  if (i18n.isInitialized) return i18n

  i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: resources ?? {
      en: {
        common: {
          loading: 'Loading...',
          error: 'Error',
          retry: 'Retry',
          cancel: 'Cancel',
          confirm: 'Confirm',
          save: 'Save',
          delete: 'Delete',
          offline: 'Offline',
          online: 'Online',
        },
        booking: {
          bookAppointment: 'Book Appointment',
          confirmAppointment: 'Confirm Appointment',
          confirmAppointmentBtn: 'Confirm',
          cancelAppointment: 'Cancel Appointment',
          modifyAppointment: 'Modify Appointment',
          appointmentType: 'Appointment Type',
          acute: 'Acute Appointment',
          prevention: 'Prevention',
          followUp: 'Follow-Up',
          whoIsAppointmentFor: 'Who is this for?',
          symptomDescription: 'Describe your symptoms',
          selectSpecialty: 'Select Specialty',
          selectDoctor: 'Select Doctor',
          noResults: 'No results found',
          offline: 'Offline',
          myDoctors: 'My Doctors',
        },
        auth: {
          signIn: 'Log In',
          signUp: 'Register',
          signOut: 'Log Out',
          forgotPassword: 'Forgot Password',
          resetPassword: 'Reset Password',
          verifyEmail: 'Verify Email',
          verifyPhone: 'Verify Phone',
          googleSignIn: 'Continue with Google',
          appleSignIn: 'Continue with Apple',
          emailPassword: 'Email & Password',
          biometric: 'Face ID / Touch ID',
        },
        profile: {
          myProfile: 'My Profile',
          familyMembers: 'Family Members',
          addFamilyMember: 'Add Family Member',
          removeFamilyMember: 'Remove',
          myDoctors: 'My Doctors',
          addToFavorites: 'Add to Favorites',
          removeFromFavorites: 'Remove from Favorites',
        },
        appointments: {
          upcoming: 'Upcoming',
          past: 'Past',
          inProgress: 'In Progress',
          confirmed: 'Confirmed',
          rejected: 'Rejected',
          cancelled: 'Cancelled',
          modified: 'Modified',
          modifiedByPractice: 'Modified by Practice',
          exportToCalendar: 'Add to Calendar',
        },
        settings: {
          notifications: 'Notifications',
          privacy: 'Privacy',
          deleteAccount: 'Delete Account',
          changePassword: 'Change Password',
          language: 'Language',
          dataConsent: 'Data Consent',
          necessaryCookies: 'Necessary Cookies',
          analytics: 'Analytics',
          marketing: 'Marketing',
          biometric: 'Biometric Login',
          imprint: 'Imprint',
          privacyPolicy: 'Privacy Policy',
          termsOfService: 'Terms of Service',
        },
        home: {
          bookAppointment: 'Book Appointment',
        },
      },
      de: {
        common: {
          loading: 'Laden...',
          error: 'Fehler',
          retry: 'Erneut versuchen',
        },
      },
    },
  })
  return i18n
}

// Initialize i18n on module load
initTestI18n()

// Test wrapper with all providers
interface TestWrapperProps {
  children: ReactNode
  routerProps?: Partial<MemoryRouterProps>
}

export const TestWrapper = ({ children, routerProps }: TestWrapperProps) => {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter {...routerProps}>{children}</MemoryRouter>
    </I18nextProvider>
  )
}

// Custom render with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { routerProps?: Partial<MemoryRouterProps> }
) => {
  const { routerProps, ...renderOptions } = options ?? {}
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => <TestWrapper routerProps={routerProps}>{children}</TestWrapper>,
      ...renderOptions,
    }),
  }
}

// Mock online/offline status
export const mockOnlineStatus = (online: boolean) => {
  Object.defineProperty(navigator, 'onLine', { value: online, writable: true })
  window.dispatchEvent(new Event(online ? 'online' : 'offline'))
}

// Mock localStorage for state persistence tests
export const createMockLocalStorage = () => {
  const store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => Object.keys(store).forEach((k) => delete store[k]),
    get length() {
      return Object.keys(store).length
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
  }
}

// Form validation helpers - OWASP compliant
export const formValidation = {
  // OWASP password requirements: min 8 chars, upper, lower, number, special
  isValidPassword: (password: string): boolean => {
    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial
  },

  // Password strength levels
  getPasswordStrength: (
    password: string
  ): 'weak' | 'fair' | 'good' | 'strong' => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++

    if (score <= 2) return 'weak'
    if (score <= 3) return 'fair'
    if (score <= 5) return 'good'
    return 'strong'
  },

  // Phone number validation (international formats)
  isValidPhone: (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, '')
    // Supports +43 (Austria), +41 (Switzerland), +49 (Germany) etc.
    return /^\+?[0-9]{10,15}$/.test(cleaned)
  },

  // Email validation
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },

  // SMS code validation (6 digits)
  isValidSmsCode: (code: string): boolean => {
    return /^[0-9]{6}$/.test(code)
  },

  // Symptom description min length
  isValidSymptomDescription: (text: string): boolean => {
    return text.trim().length >= 10
  },
}

// API mock helpers for rate limiting tests
export const createApiMock = () => {
  const calls: Array<{ endpoint: string; params?: unknown; timestamp: number }> = []

  return {
    call: (endpoint: string, params?: unknown) => {
      calls.push({ endpoint, params, timestamp: Date.now() })
    },
    getCalls: () => [...calls],
    getCallCount: (endpoint?: string) => {
      if (!endpoint) return calls.length
      return calls.filter((c) => c.endpoint === endpoint).length
    },
    getCallsInLastMinute: () => {
      const oneMinuteAgo = Date.now() - 60000
      return calls.filter((c) => c.timestamp > oneMinuteAgo).length
    },
    reset: () => {
      calls.length = 0
    },
  }
}

// Appointment status types
export type AppointmentStatus =
  | 'in_progress'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'modified'
  | 'modified_by_practice'

export type AppointmentType = 'acute' | 'prevention' | 'follow_up'

// Mock data factories
export const createMockDoctor = (
  overrides?: Partial<{
    id: string
    name: string
    specialty: string
    city: string
    address: string
    phone: string
    rating: number
    acceptsGKV: boolean
    acceptsPKV: boolean
    lastBookedAt: string
  }>
) => ({
  id: 'd1',
  name: 'Dr. Maria Schmidt',
  specialty: 'General Medicine',
  city: 'Berlin',
  address: 'Hauptstraße 123, 10115 Berlin',
  phone: '+49 30 123456',
  rating: 4.5,
  acceptsGKV: true,
  acceptsPKV: true,
  lastBookedAt: undefined as string | undefined,
  ...overrides,
})

export const createMockAppointment = (
  overrides?: Partial<{
    id: string
    doctorId: string
    doctorName: string
    specialty: string
    date: string
    time: string
    status: AppointmentStatus
    type: AppointmentType
    patientId: string
    patientName: string
    rejectionReason: string
    lastUpdated: string
  }>
) => ({
  id: 'apt1',
  doctorId: 'd1',
  doctorName: 'Dr. Maria Schmidt',
  specialty: 'General Medicine',
  date: '2025-02-15',
  time: '10:00',
  status: 'confirmed' as AppointmentStatus,
  type: 'acute' as AppointmentType,
  patientId: 'user1',
  patientName: 'Test User',
  rejectionReason: undefined as string | undefined,
  lastUpdated: new Date().toISOString(),
  ...overrides,
})

export const createMockUser = (
  overrides?: Partial<{
    id: string
    fullName: string
    email: string
    phone: string
    insuranceType: 'GKV' | 'PKV'
    familyMembers: Array<{ id: string; name: string; dob: string; insuranceType: string }>
    favoriteDoctors: string[]
    consents: { necessary: boolean; analytics: boolean; marketing: boolean }
  }>
) => ({
  id: 'user1',
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '+49 170 1234567',
  insuranceType: 'GKV' as const,
  familyMembers: [],
  favoriteDoctors: [],
  consents: { necessary: true, analytics: false, marketing: false },
  ...overrides,
})

export const createMockFamilyMember = (
  overrides?: Partial<{
    id: string
    name: string
    dob: string
    insuranceType: string
    relationship: string
  }>
) => ({
  id: 'fm1',
  name: 'Child User',
  dob: '2015-03-20',
  insuranceType: 'GKV',
  relationship: 'child',
  ...overrides,
})

// Specialties list for booking tests
export const SPECIALTIES = [
  { id: 'gp', name: 'General Practitioner' },
  { id: 'cardio', name: 'Cardiologist' },
  { id: 'gastro', name: 'Gastroenterologist' },
  { id: 'derma', name: 'Dermatologist' },
  { id: 'neuro', name: 'Neurologist' },
  { id: 'ortho', name: 'Orthopedist' },
]

// Prevention reasons for dropdown
export const PREVENTION_REASONS = [
  { id: 'checkup', name: 'Check-Up' },
  { id: 'vaccination', name: 'Vaccination' },
  { id: 'screening', name: 'Screening' },
  { id: 'counseling', name: 'Counseling' },
]

// Helper to check if appointment can be modified (>24h before)
export const canModifyAppointment = (appointmentDate: string, appointmentTime: string): boolean => {
  const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`)
  const now = new Date()
  const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursUntilAppointment > 24
}

// Re-export testing library utilities for convenience
export { screen, within, userEvent }
