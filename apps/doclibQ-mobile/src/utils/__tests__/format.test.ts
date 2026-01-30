import { describe, it, expect } from 'vitest'
import {
  getLocale,
  formatDate,
  formatDateLong,
  formatDateShort,
  formatDateWithWeekday,
  formatNumber,
  getRelativeDateLabel,
  formatDateRelative,
} from '../format'

describe('getLocale', () => {
  it('returns de-DE for German language', () => {
    expect(getLocale('de')).toBe('de-DE')
  })

  it('returns en-US for English language', () => {
    expect(getLocale('en')).toBe('en-US')
  })
})

describe('formatDate', () => {
  const testDate = '2025-01-15'

  it('formats date in German style by default', () => {
    const result = formatDate(testDate, 'de')
    expect(result).toBe('15.01.2025')
  })

  it('formats date in US style for English', () => {
    const result = formatDate(testDate, 'en')
    expect(result).toContain('2025')
  })
})

describe('formatDateLong', () => {
  const testDate = '2025-01-15'

  it('includes weekday, day, month, year in German', () => {
    const result = formatDateLong(testDate, 'de')
    expect(result).toContain('2025')
    expect(result).toContain('Januar')
  })

  it('includes weekday, day, month, year in English', () => {
    const result = formatDateLong(testDate, 'en')
    expect(result).toContain('2025')
    expect(result).toContain('January')
  })
})

describe('formatDateShort', () => {
  const testDate = '2025-01-15'

  it('formats short date in German', () => {
    const result = formatDateShort(testDate, 'de')
    expect(result).toContain('15')
  })

  it('formats short date in English', () => {
    const result = formatDateShort(testDate, 'en')
    expect(result).toContain('15')
  })
})

describe('formatNumber', () => {
  it('formats number with German separators', () => {
    const result = formatNumber(1234.56, 2, 'de')
    expect(result).toContain('1.234')
  })

  it('formats number with English separators', () => {
    const result = formatNumber(1234.56, 2, 'en')
    expect(result).toContain('1,234')
  })
})

describe('getRelativeDateLabel', () => {
  it('returns Today/Heute for today', () => {
    const today = new Date().toISOString().slice(0, 10)
    expect(getRelativeDateLabel(today, 'en')).toBe('Today')
    expect(getRelativeDateLabel(today, 'de')).toBe('Heute')
  })

  it('returns Tomorrow/Morgen for tomorrow', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    expect(getRelativeDateLabel(tomorrow, 'en')).toBe('Tomorrow')
    expect(getRelativeDateLabel(tomorrow, 'de')).toBe('Morgen')
  })
})

describe('formatDateRelative', () => {
  it('returns Today/Heute for today', () => {
    const today = new Date().toISOString().slice(0, 10)
    expect(formatDateRelative(today, 'en')).toBe('Today')
    expect(formatDateRelative(today, 'de')).toBe('Heute')
  })

  it('returns Yesterday/Gestern for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    expect(formatDateRelative(yesterday, 'en')).toBe('Yesterday')
    expect(formatDateRelative(yesterday, 'de')).toBe('Gestern')
  })
})
