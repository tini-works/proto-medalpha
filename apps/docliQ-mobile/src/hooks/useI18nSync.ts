import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '../state'

/**
 * Hook that synchronizes the app's language preference with i18next.
 * Should be called early in the app initialization (e.g., in App component root).
 * This ensures that whenever the language preference changes, i18next is updated.
 */
export function useI18nSync() {
  const { i18n } = useTranslation()
  const { language } = usePreferences()

  useEffect(() => {
    // Sync i18n language with app state preference
    if (language !== i18n.language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])
}
