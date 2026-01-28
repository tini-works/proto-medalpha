import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enSettings from '../locales/en/settings.json'
import deSettings from '../locales/de/settings.json'
import enHome from '../locales/en/home.json'
import deHome from '../locales/de/home.json'
import enNotifications from '../locales/en/notifications.json'
import deNotifications from '../locales/de/notifications.json'
import enAppointments from '../locales/en/appointments.json'
import deAppointments from '../locales/de/appointments.json'
import enAuth from '../locales/en/auth.json'
import deAuth from '../locales/de/auth.json'
import enBooking from '../locales/en/booking.json'
import deBooking from '../locales/de/booking.json'
import enProfile from '../locales/en/profile.json'
import deProfile from '../locales/de/profile.json'

// Initialize i18next with English and German translation resources
// Namespaced approach allows incremental translation of additional domains
i18n.use(initReactI18next).init({
  resources: {
    en: {
      settings: enSettings,
      home: enHome,
      notifications: enNotifications,
      appointments: enAppointments,
      auth: enAuth,
      booking: enBooking,
      profile: enProfile,
    },
    de: {
      settings: deSettings,
      home: deHome,
      notifications: deNotifications,
      appointments: deAppointments,
      auth: deAuth,
      booking: deBooking,
      profile: deProfile,
    },
  },
  lng: 'en', // default language - will be overridden by persisted preference
  fallbackLng: 'en',
  ns: ['settings', 'home', 'notifications', 'appointments', 'auth', 'booking', 'profile'],
  defaultNS: 'settings',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense for now
  },
})

export default i18n
