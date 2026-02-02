const RECENT_KEY = 'docliq_recent_specialties'
const MAX_RECENTS = 6

export function getRecentSpecialties(): string[] {
  const stored = localStorage.getItem(RECENT_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v) => typeof v === 'string')
  } catch {
    return []
  }
}

export function addRecentSpecialty(specialty: string): string[] {
  const value = specialty.trim()
  if (!value) return getRecentSpecialties()

  const current = getRecentSpecialties()
  const next = [value, ...current.filter((v) => v.toLowerCase() !== value.toLowerCase())].slice(0, MAX_RECENTS)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  return next
}

export function clearRecentSpecialties(): void {
  localStorage.removeItem(RECENT_KEY)
}

