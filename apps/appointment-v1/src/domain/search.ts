import { specialtySynonyms } from '../mock/specialties'

function normalize(s: string) {
  return s.trim().toLowerCase()
}

/**
 * Business intent: allow flexible specialty search (EN + DE abbreviations like “HNO”).
 */
export function specialtyMatches(query: string, specialtyLabel: string) {
  const q = normalize(query)
  if (!q) return true

  const label = normalize(specialtyLabel)
  if (label.includes(q)) return true

  const synonymGroups = Object.values(specialtySynonyms)
  for (const group of synonymGroups) {
    for (const term of group) {
      const t = normalize(term)
      if (t.includes(q) && label.includes(normalize(group[0]))) return true
      if (label.includes(t) && q.includes(t)) return true
    }
  }

  return false
}

