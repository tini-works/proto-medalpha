export const specialtyChips = [
  'Dermatology',
  'ENT (HNO)',
  'Pediatrics',
  'Gynecology',
  'Orthopedics',
  'Dentistry',
] as const

/**
 * Business intent: satisfy BOOK-001 with German medical abbreviations/synonyms
 * so search works for both “ENT” and “HNO”.
 */
export const specialtySynonyms: Record<string, string[]> = {
  ent: ['ENT', 'HNO', 'Hals-Nasen-Ohren'],
  dermatology: ['Dermatology', 'Dermatologe', 'Hautarzt'],
  pediatrics: ['Pediatrics', 'Kinderarzt', 'Kinderärztin'],
}

