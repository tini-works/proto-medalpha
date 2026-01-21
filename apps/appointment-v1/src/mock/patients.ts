import type { PatientProfile } from '../domain/types'

// Business intent: enable BOOK-021 “book for children” in the confirm sheet.
export const patients: PatientProfile[] = [
  { id: 'pat_self', displayName: 'For me', insurance: 'GKV' },
  { id: 'pat_child_lena', displayName: 'For Lena (child)', insurance: 'GKV' },
  { id: 'pat_child_noah', displayName: 'For Noah (child)', insurance: 'PKV' },
]

