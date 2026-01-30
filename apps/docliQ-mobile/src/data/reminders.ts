import type { Reminder } from '../types'

export async function apiGetReminders(): Promise<Reminder[]> {
  const key = 'docliq_reminders'
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function apiScheduleReminder(reminder: Omit<Reminder, 'id' | 'sent' | 'scheduledAt'>): Promise<Reminder> {
  const reminders = await apiGetReminders()
  const newReminder: Reminder = {
    ...reminder,
    id: `rem_${Date.now()}`,
    scheduledAt: new Date().toISOString(),
    sent: false,
  }
  reminders.push(newReminder)

  localStorage.setItem('docliq_reminders', JSON.stringify(reminders))
  return newReminder
}

export async function apiCancelReminder(id: string): Promise<Reminder[]> {
  const reminders = await apiGetReminders()
  const updated = reminders.filter((r) => r.id !== id)
  localStorage.setItem('docliq_reminders', JSON.stringify(updated))
  return updated
}

export async function apiClearReminders(): Promise<void> {
  localStorage.removeItem('docliq_reminders')
}
