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

// News Feed types for the updates/news feed screen
export type ContentCategory = 'CARDIOLOGY' | 'NUTRITION' | 'MENTAL_HEALTH' | 'FITNESS' | 'GENERAL'

export interface Author {
  name: string
  title: string
  avatarUrl?: string
}

export interface ShortGuide {
  id: string
  title: string
  imageUrl: string
  hasVideo: boolean
}

export interface FeaturedStory {
  id: string
  title: string
  description: string
  imageUrl: string
  isNew: boolean
}

export interface NewsArticle {
  id: string
  category: ContentCategory
  title: string
  readTimeMinutes: number
  imageUrl: string
  publishedAt: Date
  author: Author
  content: string // Rich text / markdown for detail view
  keyTakeaway?: string // Optional callout box content
  relatedTopics: string[]
}

export interface AppState {
  auth: AuthState
  profile: UserProfile
  preferences: {
    fontScale: 1 | 1.15 | 1.3
    language: 'en' | 'de'
    disableDemoAppointmentsSeed: boolean
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
    analytics: false,
    thirdPartySharing: false,
    consentDate: null,
    policyVersion: '1.0.0',
    cookiePreferences: {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    },
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
    language: 'de', // DocliQ default for Germany market
    disableDemoAppointmentsSeed: false,
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
    availabilityPrefs: null,
  },
}
