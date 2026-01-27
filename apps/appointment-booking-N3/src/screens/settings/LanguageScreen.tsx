import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'

/**
 * Language options for the app.
 * Currently only English is available; other languages are disabled for now.
 */
const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', enabled: true },
]

/**
 * Disabled languages kept for future reference.
 * These will be enabled in future releases.
 */
const DISABLED_LANGUAGES = [
  { code: 'de', name: 'German', native: 'Deutsch', enabled: false },
  { code: 'fr', name: 'French', native: 'Français', enabled: false },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', enabled: false },
  { code: 'es', name: 'Spanish', native: 'Español', enabled: false },
  { code: 'it', name: 'Italian', native: 'Italiano', enabled: false },
  { code: 'pt', name: 'Portuguese', native: 'Português', enabled: false },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', enabled: false },
  { code: 'pl', name: 'Polish', native: 'Polski', enabled: false },
  { code: 'ru', name: 'Russian', native: 'Русский', enabled: false },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', enabled: false },
  { code: 'ro', name: 'Romanian', native: 'Română', enabled: false },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', enabled: false },
  { code: 'cs', name: 'Czech', native: 'Čeština', enabled: false },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', enabled: false },
  { code: 'sv', name: 'Swedish', native: 'Svenska', enabled: false },
  { code: 'da', name: 'Danish', native: 'Dansk', enabled: false },
  { code: 'fi', name: 'Finnish', native: 'Suomi', enabled: false },
  { code: 'no', name: 'Norwegian', native: 'Norsk', enabled: false },
  { code: 'bg', name: 'Bulgarian', native: 'Български', enabled: false },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', enabled: false },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', enabled: false },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', enabled: false },
  { code: 'sr', name: 'Serbian', native: 'Српски', enabled: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', enabled: false },
]

export default function LanguageScreen() {
  const navigate = useNavigate()
  // Mock: default to English, no persistence
  const [selected, setSelected] = useState('en')

  const handleSave = () => {
    // Mock: just navigate back, no actual language change
    navigate(-1)
  }

  return (
    <Page safeBottom={false} className="flex flex-col h-screen">
      <Header title="Language Settings" showBack />

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
                  selected === lang.code ? 'border-teal-500 bg-white' : 'border-cream-400 bg-white'
                }`}
              >
                {selected === lang.code && <div className="w-3 h-3 rounded-full bg-teal-500" />}
              </div>
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={selected === lang.code}
                onChange={() => setSelected(lang.code)}
                className="sr-only"
              />
            </label>
          ))}
        </div>

        {/* Info text */}
        <p className="mt-4 text-center text-sm text-slate-500">
          Currently only English is available. More languages coming soon.
        </p>
      </div>

      {/* Save button fixed to bottom */}
      <div className="flex-shrink-0 p-4 bg-cream-50 border-t border-cream-200">
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </Page>
  )
}
