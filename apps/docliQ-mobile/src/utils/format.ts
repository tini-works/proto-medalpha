/**
 * Formatting utilities that respect user's language preference.
 * - Dates: DD.MM.YYYY (de) or MM/DD/YYYY (en)
 * - Numbers: 1.000,00 (de) or 1,000.00 (en)
 * - Currency: Always explicit with € symbol
 */

export type Language = 'en' | 'de'

/**
 * Maps language code to locale string.
 */
export function getLocale(language: Language): string {
  return language === 'de' ? 'de-DE' : 'en-US'
}

/**
 * Format date in locale-specific format: DD.MM.YYYY (de) or MM/DD/YYYY (en)
 */
export function formatDate(dateISO: string, language: Language = 'de'): string {
  const date = new Date(dateISO)
  if (language === 'de') {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }
  return date.toLocaleDateString('en-US')
}

/**
 * Format date with weekday: Mo, 23.01.2026 (de) or Mon, 01/23/2026 (en)
 */
export function formatDateWithWeekday(dateISO: string, language: Language = 'de'): string {
  const date = new Date(dateISO)
  const weekday = date.toLocaleDateString(getLocale(language), { weekday: 'short' })
  return `${weekday}, ${formatDate(dateISO, language)}`
}

/**
 * Format date long: Montag, 23. Januar 2026 (de) or Monday, January 23, 2026 (en)
 */
export function formatDateLong(dateISO: string, language: Language = 'de'): string {
  const date = new Date(dateISO)
  return date.toLocaleDateString(getLocale(language), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format date short: 23. Jan (de) or Jan 23 (en)
 */
export function formatDateShort(dateISO: string, language: Language = 'de'): string {
  const date = new Date(dateISO)
  return date.toLocaleDateString(getLocale(language), {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Format number with locale: 1.234,56 (de) or 1,234.56 (en)
 */
export function formatNumber(value: number, decimals = 0, language: Language = 'de'): string {
  return value.toLocaleString(getLocale(language), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format currency in EUR: 1.234,56 € (de) or €1,234.56 (en)
 */
export function formatCurrency(value: number, language: Language = 'de'): string {
  return value.toLocaleString(getLocale(language), {
    style: 'currency',
    currency: 'EUR',
  })
}

/**
 * Format percentage: 8,65 % (de) or 8.65% (en)
 */
export function formatPercent(value: number, decimals = 0, language: Language = 'de'): string {
  return `${formatNumber(value, decimals, language)} %`
}

/**
 * Format time: 09:30
 */
export function formatTime(time: string): string {
  return time // Already in HH:MM format
}

/**
 * Format distance in km: 2,5 km (de) or 2.5 km (en)
 */
export function formatDistance(km: number, language: Language = 'de'): string {
  return `${formatNumber(km, 1, language)} km`
}

/**
 * Get relative date label for hero card display
 * Returns "Today"/"Heute", "Tomorrow"/"Morgen", or formatted date (e.g., "23. Jan")
 */
export function getRelativeDateLabel(dateISO: string, language: Language = 'de'): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const appointmentDate = new Date(dateISO)
  appointmentDate.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return language === 'de' ? 'Heute' : 'Today'
  if (daysDiff === 1) return language === 'de' ? 'Morgen' : 'Tomorrow'
  return formatDateShort(dateISO, language)
}

/**
 * Format date relative to now for past dates
 * Returns "Today"/"Heute", "Yesterday"/"Gestern", or formatted date (e.g., "23. Jan")
 */
export function formatDateRelative(dateISO: string, language: Language = 'de'): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(dateISO)
  targetDate.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return language === 'de' ? 'Heute' : 'Today'
  if (daysDiff === 1) return language === 'de' ? 'Gestern' : 'Yesterday'
  if (daysDiff < 7) {
    return language === 'de' ? `vor ${daysDiff} Tagen` : `${daysDiff} days ago`
  }
  return formatDateShort(dateISO, language)
}
