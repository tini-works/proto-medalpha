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

// Initialize i18next with English and German translation resources
// Namespaced approach allows incremental translation of additional domains (booking, auth, etc.)
i18n.use(initReactI18next).init({
  resources: {
    en: {
      settings: enSettings,
      home: enHome,
      notifications: enNotifications,
      appointments: enAppointments,
    },
    de: {
      settings: deSettings,
      home: deHome,
      notifications: deNotifications,
      appointments: deAppointments,
    },
  },
  lng: 'en', // default language - will be overridden by persisted preference
  fallbackLng: 'en',
  ns: ['settings', 'home', 'notifications', 'appointments'], // available namespaces
  defaultNS: 'settings',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense for now
  },
})

export default i18n
