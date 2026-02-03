const STORAGE_KEY = 'docliq_n3_state_v1'
const PENDING_DELETION_KEY = 'docliq_pending_deletion_v1'

export function loadState<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export interface PendingDeletionData {
  requestedAt: string
  expiresAt: string
  email: string
}

export function loadPendingDeletion(): PendingDeletionData | null {
  try {
    const raw = localStorage.getItem(PENDING_DELETION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PendingDeletionData
  } catch {
    return null
  }
}

export function savePendingDeletion(data: PendingDeletionData | null): void {
  try {
    if (data) {
      localStorage.setItem(PENDING_DELETION_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(PENDING_DELETION_KEY)
    }
  } catch {
    // Ignore - private mode or quota exceeded
  }
}

export function clearPendingDeletion(): void {
  try {
    localStorage.removeItem(PENDING_DELETION_KEY)
  } catch {
    // Ignore
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
