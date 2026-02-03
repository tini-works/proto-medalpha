const STORAGE_KEY = 'docliq_n3_state_v1'
const BIOMETRIC_USER_KEY = 'docliq_biometric_user_v1'

export function loadState<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveState<T>(state: T): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore - private mode or quota exceeded
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}

export function loadBiometricUserId(): string | null {
  try {
    return localStorage.getItem(BIOMETRIC_USER_KEY)
  } catch {
    return null
  }
}

export function saveBiometricUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(BIOMETRIC_USER_KEY, userId)
    } else {
      localStorage.removeItem(BIOMETRIC_USER_KEY)
    }
  } catch {
    // Ignore
  }
}

export function clearBiometricUserId(): void {
  try {
    localStorage.removeItem(BIOMETRIC_USER_KEY)
  } catch {
    // Ignore
  }
}
