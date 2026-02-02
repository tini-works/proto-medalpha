import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { usePreferences } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'

/**
 * Language selection screen with German and English options.
 * Language changes apply instantly without requiring a save button.
 * Language preference is persisted in app state and synced with i18next.
 */
const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'de', name: 'German', native: 'Deutsch' },
]

export default function LanguageScreen() {
  const { t } = useTranslation('settings')
  const { language, setLanguage } = usePreferences()
  const { showToast } = useNotificationToast()

  const handleLanguageChange = (newLanguage: 'en' | 'de') => {
    if (newLanguage === language) return

    // Apply language change immediately
    setLanguage(newLanguage)

    // Show confirmation toast
    const langName = newLanguage === 'en' ? 'English' : 'Deutsch'
    showToast({
      title: t('languageSaved', { language: langName }),
      type: 'success',
    })
  }

  return (
    <Page safeBottom={false}>
      <div className="flex flex-col h-screen">
        <Header title={t('languageSettings')} showBack />

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
            {LANGUAGES.map((lang) => (
              <label
                key={lang.code}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-cream-100 transition-colors"
              >
                <span className="font-medium text-charcoal-500">{lang.native}</span>
                {/* Custom radio button styled to match mockup */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    language === lang.code ? 'border-teal-500 bg-white' : 'border-cream-400 bg-white'
                  }`}
                >
                  {language === lang.code && <div className="w-3 h-3 rounded-full bg-teal-500" />}
                </div>
                <input
                  type="radio"
                  name="language"
                  value={lang.code}
                  checked={language === lang.code}
                  onChange={() => handleLanguageChange(lang.code as 'en' | 'de')}
                  className="sr-only"
                />
              </label>
            ))}
          </div>

          {/* Info text */}
          <p className="mt-4 text-center text-sm text-slate-500">
            {t('currentLanguageInfo')}
          </p>
        </div>
      </div>
    </Page>
  )
}
