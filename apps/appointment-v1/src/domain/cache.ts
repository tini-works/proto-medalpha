import type { AppointmentSlot, Doctor } from './types'
import { readJson, writeJson } from '../state/storage'

type CacheEnvelope<T> = {
  /**
   * Business intent: enforce BOOK-020 “cache for 5 minutes” without backend infra.
   * Stored as epoch ms for simple TTL checks.
   */
  ts: number
  value: T
}

export type ResultsCachePayload = {
  /**
   * Business intent: allow offline “continue the last search” for up to 5 minutes.
   * Keep the payload small and deterministic for demos.
   */
  weekStartISO: string
  visibleDoctorIds: string[]
  slotsByDoctorId: Record<string, AppointmentSlot[]>
}

const TTL_MS = 5 * 60 * 1000
const RESULTS_CACHE_KEY = 'ab.cache.resultsPayload.v1'

export function writeResultsCache(payload: ResultsCachePayload) {
  const envelope: CacheEnvelope<ResultsCachePayload> = { ts: Date.now(), value: payload }
  writeJson(RESULTS_CACHE_KEY, envelope as any)
}

export function readResultsCache(): ResultsCachePayload | null {
  const envelope = readJson<CacheEnvelope<ResultsCachePayload> | null>(RESULTS_CACHE_KEY, null)
  if (!envelope) return null
  if (Date.now() - envelope.ts > TTL_MS) return null
  return envelope.value
}

/**
 * Business intent: reuse cached generated slots in schedule/confirm flows
 * so booking still works offline (results+slots scope).
 */
export function readCachedSlotsForDoctor(params: {
  doctorId: string
  weekStartISO: string
}): AppointmentSlot[] | null {
  const cache = readResultsCache()
  if (!cache) return null
  if (cache.weekStartISO !== params.weekStartISO) return null
  return cache.slotsByDoctorId[params.doctorId] ?? null
}

/**
 * Business intent: resolve cached visible doctors while keeping the payload as IDs.
 */
export function resolveVisibleDoctors(params: {
  allDoctors: Doctor[]
  visibleDoctorIds: string[]
}): Doctor[] {
  const byId = new Map(params.allDoctors.map((d) => [d.id, d]))
  return params.visibleDoctorIds.map((id) => byId.get(id)).filter(Boolean) as Doctor[]
}

