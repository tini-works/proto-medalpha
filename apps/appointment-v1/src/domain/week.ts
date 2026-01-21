function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function toYmd(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/**
 * Business intent: week navigation for the schedule view (BOOK-008).
 * Monday is treated as week start.
 */
export function getWeekStartMonday(date: Date) {
  const day = date.getDay() // 0..6 (Sun..Sat)
  const diffToMonday = (day + 6) % 7
  const monday = new Date(date)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(date.getDate() - diffToMonday)
  return monday
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(date.getDate() + days)
  return d
}

