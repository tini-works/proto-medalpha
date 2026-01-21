import { useEffect, useState } from 'react'
import { readJson, writeJson } from './storage'

/**
 * Business intent: localStorage-backed state so the demo survives refresh and supports ACs
 * like “selected slot persists on back/forward”.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readJson(key, initialValue as any) as any)

  useEffect(() => {
    writeJson(key, value as any)
  }, [key, value])

  return [value, setValue] as const
}

