/**
 * Configurable mock durations for matching flow (Matching → confirmed / no-match).
 * Tune these for dev/demo: shorter values speed up testing.
 */
export const MOCK_MATCHING_SUCCESS_TOTAL_MS = 10_000 // 10s for success
export const MOCK_MATCHING_FAIL_TOTAL_MS = 15_000 // 15s for fail (with matches)
export const MOCK_MATCHING_NO_DOCTORS_MS = 20_000 // 20s when no doctors found
