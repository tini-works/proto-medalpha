export type InsuranceType = 'GKV' | 'PKV'
export type InsuranceChoice = InsuranceType | 'Selbstzahler' // For UI selection only - gets converted to '' for storage
export type Gender = 'male' | 'female' | 'diverse' | 'prefer_not_to_say'
export type AddressType = 'residential' | 'work' | 'other'

/**
 * Future-prep: Structured address for multi-address support
 * Current UserProfile uses inline { street, postalCode, city }
 * Migration path: address → addresses[] with primaryAddressId
 */
export interface Address {
  id: string
  type: AddressType
  label?: string // e.g., "Home", "Office", custom name
  street: string
  postalCode: string
  city: string
  isDefault: boolean
}

/**
 * Future-prep: Structured insurance for multi-insurance support
 * Current UserProfile uses insuranceType + egkNumber
 * Migration path: insuranceType/egkNumber → insurances[] with primaryInsuranceId
 */
export interface Insurance {
  id: string
  insuranceType: InsuranceType
  egkNumber: string
  provider?: string // e.g., "TK", "AOK", "Allianz"
  isDefault: boolean
}

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
