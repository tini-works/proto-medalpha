import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCookie, IconX } from '@tabler/icons-react'
import { Button } from '../ui'
import { PATHS } from '../../routes'

const COOKIE_CONSENT_KEY = 'docliq_cookie_consent'

interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  consentDate: string | null
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true, // Always required
  functional: false,
  analytics: false,
  marketing: false,
  consentDate: null,
}

/**
 * Cookie consent banner per TTDSG §25 requirements.
 * Shows on first visit, allows granular category selection.
 * Equal prominence for Accept/Reject per German law.
 */
export default function CookieConsentBanner() {
  const { t } = useTranslation('legal')
  const [isVisible, setIsVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    // Check if user has already made a choice
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) {
      setIsVisible(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    const toSave = { ...prefs, consentDate: new Date().toISOString() }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(toSave))
    setIsVisible(false)
  }

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      consentDate: null,
    })
  }

  const handleRejectNonEssential = () => {
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      consentDate: null,
    })
  }

  const handleSaveCustom = () => {
    savePreferences(preferences)
  }

  const togglePreference = (key: keyof Omit<CookiePreferences, 'essential' | 'consentDate'>) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-white border-t border-cream-300 shadow-lg">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
            <IconCookie size={20} className="text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-charcoal-500">
              {t('cookies.banner.title')}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {t('cookies.banner.description')}
            </p>
          </div>
          <button
            onClick={handleRejectNonEssential}
            className="p-1 text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Customize section */}
        {showCustomize && (
          <div className="mb-4 space-y-3 p-3 bg-cream-100 rounded-lg">
            {/* Essential - always on */}
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.essential.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.essential.description')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={true}
                disabled
                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-not-allowed"
              />
            </label>

            {/* Functional */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.functional.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.functional.description')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={() => togglePreference('functional')}
                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
            </label>

            {/* Analytics */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.analytics.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.analytics.description')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => togglePreference('analytics')}
                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
            </label>

            {/* Marketing */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.marketing.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.marketing.description')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={() => togglePreference('marketing')}
                className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
            </label>

            <Link
              to={PATHS.LEGAL_COOKIES}
              className="block text-xs text-teal-600 hover:text-teal-700 mt-2"
            >
              {t('cookies.title')} →
            </Link>
          </div>
        )}

        {/* Action buttons - equal prominence per TTDSG */}
        <div className="flex flex-col gap-2">
          {showCustomize ? (
            <Button onClick={handleSaveCustom} fullWidth>
              {t('cookies.banner.savePreferences')}
            </Button>
          ) : (
            <>
              <div className="flex gap-2">
                <Button onClick={handleRejectNonEssential} variant="secondary" fullWidth>
                  {t('cookies.banner.rejectNonEssential')}
                </Button>
                <Button onClick={handleAcceptAll} fullWidth>
                  {t('cookies.banner.acceptAll')}
                </Button>
              </div>
              <button
                onClick={() => setShowCustomize(true)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                {t('cookies.banner.customize')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Helper to check if user has given cookie consent
 */
export function hasCookieConsent(): boolean {
  return localStorage.getItem(COOKIE_CONSENT_KEY) !== null
}

/**
 * Helper to get current cookie preferences
 */
export function getCookiePreferences(): CookiePreferences | null {
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
  return stored ? JSON.parse(stored) : null
}

/**
 * Helper to reset cookie preferences (for testing or re-prompting)
 */
export function resetCookiePreferences(): void {
  localStorage.removeItem(COOKIE_CONSENT_KEY)
}
