export function formatGermanDate(date: Date) {
  // Business intent: match product expectation (German locale) without introducing i18n infra.
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatGermanTime(date: Date) {
  // Business intent: “24-hour” time for booking clarity.
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

