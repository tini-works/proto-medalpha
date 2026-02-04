// Mock notification data for prototype demonstration
// In a production app, these would come from an API
import type { Notification } from '../types'

const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

// English notifications
export const mockNotificationsEN: Notification[] = [
  // TODAY: Booking Update
  {
    id: 'notif-1',
    type: 'BOOKING_UPDATE',
    category: 'BOOKING UPDATE',
    title: 'Appointment Confirmed',
    message: 'Dr. Sarah Johnson has confirmed your visit for tomorrow at 10:00 AM.',
    timestamp: new Date(today.getTime() + 10 * 60000), // 10 min ago
    unread: true,
    actionLabel: 'View Details',
    actionPath: '/history',
  },

  // TODAY: Cancellation Alert
  {
    id: 'notif-2',
    type: 'CANCELLATION_ALERT',
    category: 'CANCELLATION ALERT',
    title: 'Appointment Cancelled',
    message: 'Your dermatology consultation with Dr. Mark Lee has been cancelled.',
    timestamp: new Date(today.getTime() - 60 * 60000), // 1 hour ago
    unread: true,
    actionLabel: 'Reschedule',
    actionPath: '/history',
  },

  // TODAY: Upcoming Reminder
  {
    id: 'notif-3',
    type: 'UPCOMING',
    category: 'UPCOMING',
    title: 'Appointment Reminder',
    message: "Don't forget your general check-up with Dr. Julia Weber at 09:30 AM.",
    timestamp: new Date(today.getTime() - 3 * 3600000), // 3 hours ago
    unread: true,
    actionLabel: 'View Details',
    actionPath: '/history',
  },

  // YESTERDAY: Security
  {
    id: 'notif-4',
    type: 'SECURITY',
    category: 'SECURITY',
    title: 'Account Verified',
    message: 'Your identity documents have been approved. You now have full access.',
    timestamp: new Date(yesterday.getTime() + 16.5 * 3600000), // 4:30 PM yesterday
    unread: false,
    actionLabel: 'My Profile',
    actionPath: '/settings',
  },

  // YESTERDAY: Family Profile
  {
    id: 'notif-5',
    type: 'FAMILY_PROFILE',
    category: 'FAMILY PROFILE',
    title: 'New Family Member Added',
    message: "You successfully added 'Baby Leo' to your family account.",
    timestamp: new Date(yesterday.getTime() + 13.25 * 3600000), // 1:15 PM yesterday
    unread: false,
    actionLabel: 'Manage Family',
    actionPath: '/profile/family',
  },
]

// German notifications
export const mockNotificationsDE: Notification[] = [
  // TODAY: Booking Update
  {
    id: 'notif-1',
    type: 'BOOKING_UPDATE',
    category: 'BOOKING UPDATE',
    title: 'Termin bestätigt',
    message: 'Dr. Sarah Johnson hat Ihren Besuch für morgen um 10:00 Uhr bestätigt.',
    timestamp: new Date(today.getTime() + 10 * 60000), // 10 min ago
    unread: true,
    actionLabel: 'View Details',
    actionPath: '/history',
  },

  // TODAY: Cancellation Alert
  {
    id: 'notif-2',
    type: 'CANCELLATION_ALERT',
    category: 'CANCELLATION ALERT',
    title: 'Termin abgesagt',
    message: 'Ihre dermatologische Beratung mit Dr. Mark Lee wurde abgesagt.',
    timestamp: new Date(today.getTime() - 60 * 60000), // 1 hour ago
    unread: true,
    actionLabel: 'Reschedule',
    actionPath: '/history',
  },

  // TODAY: Upcoming Reminder
  {
    id: 'notif-3',
    type: 'UPCOMING',
    category: 'UPCOMING',
    title: 'Termingesprächserinnerung',
    message: 'Vergessen Sie nicht Ihre allgemeine Untersuchung mit Dr. Julia Weber um 09:30 Uhr.',
    timestamp: new Date(today.getTime() - 3 * 3600000), // 3 hours ago
    unread: true,
    actionLabel: 'View Details',
    actionPath: '/history',
  },

  // YESTERDAY: Security
  {
    id: 'notif-4',
    type: 'SECURITY',
    category: 'SECURITY',
    title: 'Konto bestätigt',
    message: 'Ihre Identitätsdokumente wurden genehmigt. Sie haben jetzt vollständigen Zugriff.',
    timestamp: new Date(yesterday.getTime() + 16.5 * 3600000), // 4:30 PM yesterday
    unread: false,
    actionLabel: 'My Profile',
    actionPath: '/settings',
  },

  // YESTERDAY: Family Profile
  {
    id: 'notif-5',
    type: 'FAMILY_PROFILE',
    category: 'FAMILY PROFILE',
    title: 'Neues Familienmitglied hinzugefügt',
    message: "Sie haben erfolgreich 'Baby Leo' zu Ihrem Familienkonto hinzugefügt.",
    timestamp: new Date(yesterday.getTime() + 13.25 * 3600000), // 1:15 PM yesterday
    unread: false,
    actionLabel: 'Manage Family',
    actionPath: '/profile/family',
  },
]

// Export function to get notifications based on language
export function getLocalizedNotifications(language: string): Notification[] {
  return language === 'de' ? mockNotificationsDE : mockNotificationsEN
}

// Default export for backward compatibility
export const mockNotifications = mockNotificationsEN

// Group notifications by date for UI display
export function groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
  const grouped: Record<string, Notification[]> = {}

  notifications.forEach((notif) => {
    const dateKey = formatNotificationDate(notif.timestamp)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(notif)
  })

  return grouped
}

// Format notification date for grouping ("TODAY", "YESTERDAY", or specific date)
// Returns a key that can be used with i18n translations
export function formatNotificationDate(date: Date, i18nT?: (key: string) => string): string {
  const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const today = new Date()
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterday = new Date(todayDate)
  yesterday.setDate(yesterday.getDate() - 1)

  // Return i18n keys that can be translated
  if (notifDate.getTime() === todayDate.getTime()) {
    return i18nT ? i18nT('today') : 'TODAY'
  }
  if (notifDate.getTime() === yesterday.getTime()) {
    return i18nT ? i18nT('yesterday') : 'YESTERDAY'
  }

  // For other dates, use locale-specific formatting with optional i18n language
  const locale = i18nT ? (typeof window !== 'undefined' && (window as any).i18n?.language) || 'en-US' : 'en-US'
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'de': 'de-DE',
  }
  const dateLocale = localeMap[locale] || 'en-US'

  return notifDate.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
