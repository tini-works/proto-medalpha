/**
 * Translation helpers for dynamic content like specialty names and languages
 */

type TFunction = (key: string, options?: Record<string, unknown>) => string

/**
 * Maps English specialty values to i18n translation keys
 */
const specialtyKeyByValue: Record<string, string> = {
  'Primary care': 'specialtyPrimaryCare',
  'General Medicine': 'specialtyGeneral',
  Cardiology: 'specialtyCardiology',
  Dermatology: 'specialtyDermatology',
  Orthopedics: 'specialtyOrthopedics',
  Gynecology: 'specialtyGynecology',
  Ophthalmology: 'specialtyOphthalmology',
  Pediatrics: 'specialtyPediatrics',
  Neurology: 'specialtyNeurology',
  Psychiatry: 'specialtyPsychiatry',
  Dentistry: 'specialtyDentistry',
  ENT: 'specialtyENT',
  'ENT (HNO)': 'specialtyENT',
  Gastroenterology: 'specialtyGastroenterology',
  Pulmonology: 'specialtyPulmonology',
  Rheumatology: 'specialtyRheumatology',
  Endocrinology: 'specialtyEndocrinology',
}

/**
 * Translates a specialty name using i18n
 * Falls back to the original value if no translation key exists
 */
export function translateSpecialty(t: TFunction, specialty: string): string {
  const key = specialtyKeyByValue[specialty]
  if (!key) return specialty
  return t(key, { ns: 'booking' })
}

/**
 * Maps English language names to i18n translation keys
 */
const languageKeyByValue: Record<string, string> = {
  German: 'langGerman',
  English: 'langEnglish',
  French: 'langFrench',
  Italian: 'langItalian',
  Spanish: 'langSpanish',
  Turkish: 'langTurkish',
  Russian: 'langRussian',
  Arabic: 'langArabic',
  Polish: 'langPolish',
  Portuguese: 'langPortuguese',
}

/**
 * Translates a language name using i18n
 * Falls back to the original value if no translation key exists
 */
export function translateLanguage(t: TFunction, language: string): string {
  const key = languageKeyByValue[language]
  if (!key) return language
  return t(key, { ns: 'booking' })
}

/**
 * Translates a list of languages and joins them with comma
 */
export function translateLanguageList(t: TFunction, languages: string[]): string {
  return languages.map((lang) => translateLanguage(t, lang)).join(', ')
}
