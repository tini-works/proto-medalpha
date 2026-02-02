/**
 * Mock SMS Phone Verification Service
 *
 * Requirements (US 1.1.4):
 * - 6-digit code, valid for 10 minutes
 * - Resend enabled after 3 minutes wait
 * - Rate limit: max 3 SMS per number per hour
 * - International phone numbers supported
 *
 * Note: This is a mock implementation - no actual SMS is sent.
 * For demo: any 6-digit code is accepted.
 */

import { simulateApiDelay } from '../data/api'

// Timing constants
const CODE_VALIDITY_MS = 10 * 60 * 1000 // 10 minutes
const RESEND_COOLDOWN_MS = 3 * 60 * 1000 // 3 minutes
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS_PER_HOUR = 3

// Verification state for active code
interface VerificationState {
  phone: string
  countryCode: string
  code: string
  createdAt: number
}

// Rate limit tracking per phone number
interface RateLimitEntry {
  timestamps: number[]
}

// In-memory storage (resets on refresh - intentional for demo)
let verificationState: VerificationState | null = null
const rateLimits: Map<string, RateLimitEntry> = new Map()

// Generate random 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Format phone for display (mask middle digits)
function formatPhoneForLog(countryCode: string, phone: string): string {
  const masked = phone.length > 4 ? phone.slice(0, 2) + '***' + phone.slice(-2) : '****'
  return `${countryCode} ${masked}`
}

// Validate phone number format (basic validation)
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '')
  return /^\d{6,15}$/.test(cleaned)
}

// Send verification code result
export interface SendCodeResult {
  success: boolean
  error?: 'rateLimitExceeded' | 'resendCooldown' | 'invalidPhone'
  retryAfterMs?: number
}

// Verify code result
export interface VerifyCodeResult {
  success: boolean
  error?: 'noActiveCode' | 'codeExpired' | 'invalidCode'
}

/**
 * Send a verification code to the phone number.
 * In demo mode: logs code to console.
 */
export async function sendVerificationCode(
  phone: string,
  countryCode: string
): Promise<SendCodeResult> {
  // Basic phone validation
  if (!isValidPhoneNumber(phone)) {
    return { success: false, error: 'invalidPhone' }
  }

  const fullPhone = `${countryCode}${phone.replace(/[\s-]/g, '')}`
  const now = Date.now()

  // Check rate limit (3 per hour per number)
  const rateEntry = rateLimits.get(fullPhone) || { timestamps: [] }

  // Clean old timestamps outside the window
  rateEntry.timestamps = rateEntry.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  if (rateEntry.timestamps.length >= MAX_REQUESTS_PER_HOUR) {
    const oldestTs = rateEntry.timestamps[0]
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - oldestTs)
    return {
      success: false,
      error: 'rateLimitExceeded',
      retryAfterMs,
    }
  }

  // Check resend cooldown (3 minutes)
  if (
    verificationState &&
    verificationState.phone === phone &&
    verificationState.countryCode === countryCode &&
    now - verificationState.createdAt < RESEND_COOLDOWN_MS
  ) {
    return {
      success: false,
      error: 'resendCooldown',
      retryAfterMs: RESEND_COOLDOWN_MS - (now - verificationState.createdAt),
    }
  }

  // Simulate API delay (300-600ms)
  await simulateApiDelay(null, 300 + Math.random() * 300)

  // Generate new code
  const code = generateCode()

  // Store verification state
  verificationState = {
    phone,
    countryCode,
    code,
    createdAt: now,
  }

  // Update rate limit tracking
  rateEntry.timestamps.push(now)
  rateLimits.set(fullPhone, rateEntry)

  // Log code to console for demo (masked phone for GDPR)
  console.log(`[MOCK SMS] Verification code for ${formatPhoneForLog(countryCode, phone)}: ${code}`)

  return { success: true }
}

/**
 * Verify the code entered by the user.
 * In demo mode: accepts any 6-digit code.
 */
export async function verifyCode(phone: string, code: string): Promise<VerifyCodeResult> {
  // Simulate API delay
  await simulateApiDelay(null, 300)

  // Check if there's an active verification for this phone
  if (!verificationState || verificationState.phone !== phone) {
    return { success: false, error: 'noActiveCode' }
  }

  const now = Date.now()

  // Check if code has expired (10 minutes)
  if (now - verificationState.createdAt > CODE_VALIDITY_MS) {
    verificationState = null
    return { success: false, error: 'codeExpired' }
  }

  // Validate code format (must be 6 digits)
  const isValidFormat = code.length === 6 && /^\d{6}$/.test(code)
  if (!isValidFormat) {
    return { success: false, error: 'invalidCode' }
  }

  // Demo mode: accept any 6-digit code
  // In production, would check: code === verificationState.code

  // Clear verification state on success
  verificationState = null

  return { success: true }
}

/**
 * Get remaining cooldown time before resend is allowed.
 * Returns 0 if resend is available.
 */
export function getResendCooldownMs(phone: string, countryCode: string): number {
  if (
    !verificationState ||
    verificationState.phone !== phone ||
    verificationState.countryCode !== countryCode
  ) {
    return 0
  }

  const elapsed = Date.now() - verificationState.createdAt
  return Math.max(0, RESEND_COOLDOWN_MS - elapsed)
}

/**
 * Get remaining time before code expires.
 * Returns 0 if no active code or code has expired.
 */
export function getCodeExpiryMs(phone: string): number {
  if (!verificationState || verificationState.phone !== phone) {
    return 0
  }

  const elapsed = Date.now() - verificationState.createdAt
  return Math.max(0, CODE_VALIDITY_MS - elapsed)
}

/**
 * Check if rate limited (for UI display).
 * Returns remaining ms until rate limit resets, or 0 if not limited.
 */
export function getRateLimitRemainingMs(phone: string, countryCode: string): number {
  const fullPhone = `${countryCode}${phone.replace(/[\s-]/g, '')}`
  const rateEntry = rateLimits.get(fullPhone)

  if (!rateEntry) return 0

  const now = Date.now()
  const validTimestamps = rateEntry.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  if (validTimestamps.length < MAX_REQUESTS_PER_HOUR) return 0

  const oldestTs = validTimestamps[0]
  return Math.max(0, RATE_LIMIT_WINDOW_MS - (now - oldestTs))
}

/**
 * Clear all verification state (for testing/debugging).
 */
export function clearVerificationState(): void {
  verificationState = null
  rateLimits.clear()
}
