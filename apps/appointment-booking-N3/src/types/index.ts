export * from './user'
export * from './booking'
export * from './cms'
export * from './history'

import type { AuthState, UserProfile } from './user'
import type { BookingState, Appointment } from './booking'
import type { HistoryItem } from './history'

// Notification types for the updates/notifications screen
export type NotificationType = 'BOOKING_UPDATE' | 'CANCELLATION_ALERT' | 'UPCOMING' | 'SECURITY' | 'FAMILY_PROFILE'

export interface Notification {
  id: string
  type: NotificationType
  category: string // e.g., "BOOKING UPDATE", "SECURITY"
  title: string
  message: string
  timestamp: Date
  unread: boolean
  actionLabel?: string
  actionPath?: string
}

export interface AppState {
  auth: AuthState
  profile: UserProfile
  preferences: {
    fontScale: 1 | 1.15 | 1.3
    notifications: {
      appointmentReminders: boolean
      prescriptionUpdates: boolean
      deals: boolean
    }
  }
  appointments: Appointment[]
  history: {
    items: HistoryItem[]
  }
  booking: BookingState
}

export const initialProfile: UserProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  insuranceType: '',
  egkNumber: '',
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
}

export const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    verified: false,
    userId: null,
  },
  profile: initialProfile,
  preferences: {
    fontScale: 1,
    notifications: {
      appointmentReminders: true,
      prescriptionUpdates: true,
      deals: false,
    },
  },
  appointments: [],
  history: {
    items: [],
  },
  booking: {
    currentSearch: null,
    selectedDoctor: null,
    selectedSlot: null,
    selectedFamilyMemberId: null,
  },
}
