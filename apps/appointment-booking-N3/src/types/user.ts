export type InsuranceType = 'GKV' | 'PKV'

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
    consentDate: string | null
  }
}

export interface AuthState {
  isAuthenticated: boolean
  verified: boolean
  userId: string | null
}
