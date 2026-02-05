import React from 'react'
import type { Decorator } from '@storybook/react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import { MemoryRouter } from 'react-router-dom'

// Initialize minimal i18n for Storybook
const i18nInstance = i18n.createInstance()
i18nInstance.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'booking'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        retry: 'Retry',
        noResults: 'No results found',
      },
      booking: {
        findingDoctor: 'Finding a doctor...',
        patient: 'Patient',
        timeUnit: 'Uhr',
        'status.matching': 'Matching',
        'status.awaitConfirm': 'Pending',
        'status.confirmed': 'Confirmed',
        'status.modifiedByPractice': 'Modified',
        'status.completed': 'Completed',
        'status.cancelledPatient': 'Cancelled',
        'status.cancelledDoctor': 'Cancelled',
      },
    },
    de: {
      common: {
        cancel: 'Abbrechen',
        confirm: 'Bestätigen',
        close: 'Schließen',
        save: 'Speichern',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        loading: 'Lädt...',
        retry: 'Erneut versuchen',
        noResults: 'Keine Ergebnisse gefunden',
      },
      booking: {
        findingDoctor: 'Arzt wird gesucht...',
        patient: 'Patient',
        timeUnit: 'Uhr',
        'status.matching': 'Wird gesucht',
        'status.awaitConfirm': 'Ausstehend',
        'status.confirmed': 'Bestätigt',
        'status.modifiedByPractice': 'Geändert',
        'status.completed': 'Abgeschlossen',
        'status.cancelledPatient': 'Storniert',
        'status.cancelledDoctor': 'Storniert',
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
})

/**
 * Decorator that provides docliQ-mobile context (i18n, router)
 */
export const DocliQDecorator: Decorator = (Story, context) => {
  // Switch language based on Storybook globals
  const locale = context.globals?.locale || 'en'
  i18nInstance.changeLanguage(locale)

  return (
    <I18nextProvider i18n={i18nInstance}>
      <MemoryRouter>
        <div className="font-sans">
          <Story />
        </div>
      </MemoryRouter>
    </I18nextProvider>
  )
}

/**
 * Mobile frame wrapper for realistic previews
 */
export const MobileFrameDecorator: Decorator = (Story) => (
  <div className="max-w-[390px] mx-auto bg-cream-100 min-h-[600px] relative">
    <Story />
  </div>
)
