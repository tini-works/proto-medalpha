export type InsuranceType = 'GKV' | 'PKV'
export type InsuranceChoice = InsuranceType | 'Selbstzahler' // For UI selection only - gets converted to '' for storage
export type Gender = 'male' | 'female' | 'diverse' | 'prefer_not_to_say'

export interface FamilyMember {
  id: string
  name: string
  dateOfBirth: string // ISO format YYYY-MM-DD
  relationship: 'child' | 'spouse' | 'parent' | 'other'
  insuranceType?: InsuranceType
  egkNumber?: string
  // Verification and identity
  verified?: boolean // defaults to false when created
  photoUrl?: string // placeholder URL for design mockup
  // Extended fields
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalNotes?: string // allergies, conditions, etc.
}

export interface UserProfile {
  id: string
  fullName: string
  email: string
  phone?: string
  phoneCountryCode?: string // e.g., '+49'
  dateOfBirth?: string // ISO format YYYY-MM-DD
  gender?: Gender
  insuranceType: InsuranceType | ''
  egkNumber: string
  address: {
    street: string
    postalCode: string
    city: string
  }
  familyMembers: FamilyMember[]
  gdprConsent: {
    dataProcessing: boolean
    marketing: boolean
    analytics: boolean
    thirdPartySharing: boolean
    consentDate: string | null
    policyVersion: string
    cookiePreferences: {
      essential: boolean // always true
      functional: boolean
      analytics: boolean
      marketing: boolean
    }
  }
  // OAuth fields
  photoUrl?: string
  authProvider?: 'email' | 'google' | 'apple'
  // Identity verification
  identityVerified: boolean
  identityVerifiedAt?: string // ISO timestamp
  // Phone verification
  phoneVerified?: boolean
  phoneVerifiedAt?: string // ISO timestamp
}

export interface AuthState {
  isAuthenticated: boolean
  verified: boolean
  userId: string | null
}
