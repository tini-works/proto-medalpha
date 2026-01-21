type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * Business intent: keep the prototype “sticky” across refresh/back/forward
 * without introducing a backend.
 */
export function readJson<T extends JsonValue>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: JsonValue) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore (storage blocked); the prototype still works in-memory per session.
  }
}

