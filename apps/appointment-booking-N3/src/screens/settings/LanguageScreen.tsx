import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'

/**
 * European languages for mock language selection.
 * Sorted alphabetically by native name for user familiarity.
 */
const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
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
    <Page safeBottom={false}>
      <Header title="Language Settings" showBack />

      <div className="flex-1 flex flex-col">
        {/* Language list */}
        <div className="flex-1 px-4 py-6">
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
            This will update the language across all features of the DocliQ healthcare platform.
          </p>
        </div>

        {/* Save button pinned to bottom */}
        <div className="sticky bottom-0 p-4 bg-cream-50">
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Page>
  )
}
