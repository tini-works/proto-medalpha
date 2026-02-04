/**
 * Test fixtures for user-related scenarios.
 * Used across integration and contract tests.
 */

import type { AppState } from '../../../types'

/**
 * Authenticated and verified user state.
 */
export const authenticatedUser: Partial<AppState> = {
  auth: {
    isAuthenticated: true,
    verified: true,
    userId: 'test-user-1',
  },
  profile: {
    id: 'test-user-1',
    fullName: 'Maria Schmidt',
    email: 'maria@example.com',
    phone: '+49 151 12345678',
    phoneVerified: true,
    phoneVerifiedAt: '2024-01-15T10:00:00Z',
    dateOfBirth: '1985-06-15',
    gender: 'female',
    insuranceType: 'public',
    insuranceProvider: 'TK',
    insuranceNumber: 'A123456789',
    egkNumber: 'EGK123456789',
    identityVerified: true,
    identityVerifiedAt: '2024-01-15T10:30:00Z',
    address: {
      street: 'Hauptstraße 42',
      postalCode: '10115',
      city: 'Berlin',
    },
    familyMembers: [],
    gdprConsent: {
      dataProcessing: true,
      marketing: false,
      consentDate: '2024-01-15T10:00:00Z',
    },
  },
}

/**
 * Authenticated but not verified user state.
 */
export const unverifiedUser: Partial<AppState> = {
  auth: {
    isAuthenticated: true,
    verified: false,
    userId: 'test-user-2',
  },
  profile: {
    id: 'test-user-2',
    fullName: 'Hans Müller',
    email: 'hans@example.com',
    phone: '',
    phoneVerified: false,
    phoneVerifiedAt: null,
    dateOfBirth: '',
    gender: null,
    insuranceType: null,
    insuranceProvider: '',
    insuranceNumber: '',
    egkNumber: '',
    identityVerified: false,
    identityVerifiedAt: null,
    address: {
      street: '',
      postalCode: '',
      city: '',
    },
    familyMembers: [],
    gdprConsent: {
      dataProcessing: false,
      marketing: false,
      consentDate: null,
    },
  },
}

/**
 * Unauthenticated user state (visitor).
 */
export const guestUser: Partial<AppState> = {
  auth: {
    isAuthenticated: false,
    verified: false,
    userId: null,
  },
}
