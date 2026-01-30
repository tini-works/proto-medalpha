/**
 * Legal and GDPR compliance types for DocliQ
 * Supports GDPR Art. 12-22, German TMG §5, and TTDSG §25
 */

export interface CookieConsent {
  essential: boolean // Always true, required for app function
  functional: boolean // Remember preferences (language, etc.)
  analytics: boolean // Usage tracking
  marketing: boolean // Ad tracking
  consentDate: string | null
  lastUpdated: string | null
}

export type ConsentType =
  | 'data_processing'
  | 'marketing'
  | 'analytics'
  | 'third_party'
  | 'cookies'

export type ConsentSource =
  | 'registration'
  | 'settings'
  | 'banner'
  | 'profile'

export interface ConsentRecord {
  id: string
  type: ConsentType
  granted: boolean
  timestamp: string // ISO date
  version: string // Policy version at time of consent
  source: ConsentSource
}

export type DataExportStatus =
  | 'pending'
  | 'processing'
  | 'ready'
  | 'downloaded'
  | 'expired'

export type DataExportFormat = 'json' | 'pdf'

export interface DataExportRequest {
  id: string
  requestedAt: string // ISO date
  status: DataExportStatus
  format: DataExportFormat
  downloadUrl?: string
  expiresAt?: string // ISO date
}

export type ThirdPartyType = 'clinic' | 'insurance' | 'pharmacy' | 'lab'

export interface ThirdPartyAccess {
  id: string
  name: string // e.g., "Charité Berlin", "TK Insurance"
  type: ThirdPartyType
  accessGranted: boolean
  grantedAt?: string // ISO date
  revokedAt?: string // ISO date
  dataCategories: string[] // e.g., ["appointments", "prescriptions"]
}

export type LegalDocumentType = 'privacy' | 'terms' | 'impressum' | 'cookies'

export interface LegalSection {
  id: string
  title: string
  content: string // Rich text / markdown
  subsections?: LegalSection[]
}

export interface LegalDocument {
  type: LegalDocumentType
  version: string
  effectiveDate: string // ISO date
  lastUpdated: string // ISO date
  sections: LegalSection[]
}

// Current policy version - update when legal content changes
export const CURRENT_POLICY_VERSION = '1.0.0'
