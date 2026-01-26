/**
 * European formatting utilities for German market
 * - Dates: DD.MM.YYYY
 * - Numbers: 1.000,00 (dot for thousands, comma for decimal)
 * - Currency: Always explicit with € symbol
 */

/**
 * Format date in German format: DD.MM.YYYY
 */
export function formatDate(dateISO: string): string {
  const date = new Date(dateISO)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Format date with weekday: Mo, 23.01.2026
 */
export function formatDateWithWeekday(dateISO: string): string {
  const date = new Date(dateISO)
  const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const weekday = weekdays[date.getDay()]
  return `${weekday}, ${formatDate(dateISO)}`
}

/**
 * Format date long: Montag, 23. Januar 2026
 */
export function formatDateLong(dateISO: string): string {
  const date = new Date(dateISO)
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format date short: 23. Jan
 */
export function formatDateShort(dateISO: string): string {
  const date = new Date(dateISO)
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Format number with German locale: 1.234,56
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format currency in EUR: 1.234,56 €
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })
}

/**
 * Format percentage with German locale: 8,65 %
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} %`
}

/**
 * Format time: 09:30
 */
export function formatTime(time: string): string {
  return time // Already in HH:MM format
}

/**
 * Format distance in km: 2,5 km
 */
export function formatDistance(km: number): string {
  return `${formatNumber(km, 1)} km`
}

/**
 * Get relative date label for hero card display
 * Returns "Today", "Tomorrow", or formatted date (e.g., "23. Jan")
 */
export function getRelativeDateLabel(dateISO: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const appointmentDate = new Date(dateISO)
  appointmentDate.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Tomorrow'
  return formatDateShort(dateISO)
}
