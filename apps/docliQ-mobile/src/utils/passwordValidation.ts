export interface PasswordRequirements {
  minLength: boolean // >= 8 chars
  hasUppercase: boolean // [A-Z]
  hasLowercase: boolean // [a-z]
  hasNumber: boolean // [0-9]
  hasSpecial: boolean // special characters
}

export interface PasswordValidationResult {
  isValid: boolean
  score: 0 | 1 | 2 | 3 | 4
  strength: 'none' | 'weak' | 'fair' | 'good' | 'strong'
  requirements: PasswordRequirements
}

const SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`~;]/

export function validatePassword(password: string): PasswordValidationResult {
  const requirements: PasswordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: SPECIAL_CHARS.test(password),
  }

  // Count character type requirements met (4 total)
  const metCount = [
    requirements.hasUppercase,
    requirements.hasLowercase,
    requirements.hasNumber,
    requirements.hasSpecial,
  ].filter(Boolean).length

  // Calculate score (0-4)
  let score: 0 | 1 | 2 | 3 | 4 = 0
  if (!requirements.minLength) {
    score = 0 // Must meet length first
  } else if (metCount <= 1) {
    score = 1 // Weak: length + 0-1 types
  } else if (metCount === 2) {
    score = 2 // Fair: length + 2 types
  } else if (metCount === 3) {
    score = 3 // Good: length + 3 types
  } else {
    score = 4 // Strong: length + all 4 types
  }

  const strengthMap = ['none', 'weak', 'fair', 'good', 'strong'] as const

  return {
    isValid: requirements.minLength && metCount === 4, // OWASP: all 4 types required
    score,
    strength: strengthMap[score],
    requirements,
  }
}

export function getStrengthColor(score: number): string {
  const colors = [
    'bg-cream-300', // 0: none (gray)
    'bg-coral-500', // 1: weak (red)
    'bg-amber-500', // 2: fair (orange)
    'bg-teal-400', // 3: good (light teal)
    'bg-teal-600', // 4: strong (dark teal)
  ]
  return colors[score] || colors[0]
}
