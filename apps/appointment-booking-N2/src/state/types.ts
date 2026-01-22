export type InsuranceType = 'GKV' | 'PKV'

export type FamilyMember = {
  id: string
  name: string
  dateOfBirth: string
  relationship: string
}

export type UserProfile = {
  fullName: string
  emailOrPhone: string
  insuranceType: InsuranceType | ''
  egkNumber: string
  addressLine: string
  postalCode: string
  city: string
  familyMembers: FamilyMember[]
}

export type NotificationPreference = {
  appointmentReminders: boolean
  prescriptionUpdates: boolean
  deals: boolean
}

export type AppState = {
  auth: {
    isAuthenticated: boolean
    verified: boolean
  }
  profile: UserProfile
  preferences: {
    fontScale: 1 | 1.15 | 1.3
    notifications: NotificationPreference
  }
  history: {
    items: Array<{
      id: string
      type: 'appointment' | 'telemedicine' | 'rx'
      title: string
      subtitle: string
      dateISO: string
      status: 'planned' | 'done' | 'canceled'
    }>
  }
}

