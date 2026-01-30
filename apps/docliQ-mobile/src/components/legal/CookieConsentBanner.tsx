import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCookie, IconSquare, IconSquareCheckFilled } from '@tabler/icons-react'
import { Button, Sheet } from '../ui'
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

  return (
    <Sheet
      open={isVisible}
      onClose={handleRejectNonEssential}
      variant="bottom"
      size="auto"
      showDragHandle={false}
      showCloseButton={false}
      closeOnBackdropClick={false}
      closeOnEscape={false}
      testId="cookie-consent-banner"
      footer={
        <div className="flex flex-col gap-3">
          {showCustomize ? (
            <>
              <Button onClick={handleSaveCustom} fullWidth>
                {t('cookies.banner.savePreferences')}
              </Button>
              <Button onClick={() => setShowCustomize(false)} variant="tertiary" fullWidth>
                {t('cookies.banner.back') || 'Back'}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAcceptAll} fullWidth>
                {t('cookies.banner.acceptAll')}
              </Button>
              <Button onClick={handleRejectNonEssential} variant="secondary" fullWidth>
                {t('cookies.banner.rejectNonEssential')}
              </Button>
              <Button onClick={() => setShowCustomize(true)} variant="tertiary" fullWidth>
                {t('cookies.banner.customize')}
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
            <IconCookie size={20} className="text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-charcoal-500">
            {t('cookies.banner.title')}
          </h3>
        </div>

        <p className="text-sm text-slate-600">
          {t('cookies.banner.description')}
        </p>

        {/* Customize section */}
        {showCustomize && (
          <div className="space-y-3 p-3 bg-cream-100 rounded-lg">
            {/* Essential - always on */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.essential.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.essential.description')}
                </p>
              </div>
              <IconSquareCheckFilled size={24} className="text-slate-400 flex-shrink-0" />
            </div>

            {/* Functional */}
            <button
              type="button"
              onClick={() => togglePreference('functional')}
              className="flex items-center justify-between w-full text-left"
              aria-pressed={preferences.functional}
            >
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.functional.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.functional.description')}
                </p>
              </div>
              {preferences.functional ? (
                <IconSquareCheckFilled size={24} className="text-teal-600 flex-shrink-0" />
              ) : (
                <IconSquare size={24} className="text-slate-300 flex-shrink-0" />
              )}
            </button>

            {/* Analytics */}
            <button
              type="button"
              onClick={() => togglePreference('analytics')}
              className="flex items-center justify-between w-full text-left"
              aria-pressed={preferences.analytics}
            >
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.analytics.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.analytics.description')}
                </p>
              </div>
              {preferences.analytics ? (
                <IconSquareCheckFilled size={24} className="text-teal-600 flex-shrink-0" />
              ) : (
                <IconSquare size={24} className="text-slate-300 flex-shrink-0" />
              )}
            </button>

            {/* Marketing */}
            <button
              type="button"
              onClick={() => togglePreference('marketing')}
              className="flex items-center justify-between w-full text-left"
              aria-pressed={preferences.marketing}
            >
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.marketing.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.marketing.description')}
                </p>
              </div>
              {preferences.marketing ? (
                <IconSquareCheckFilled size={24} className="text-teal-600 flex-shrink-0" />
              ) : (
                <IconSquare size={24} className="text-slate-300 flex-shrink-0" />
              )}
            </button>

            <Link
              to={PATHS.LEGAL_COOKIES}
              className="block text-xs text-teal-600 hover:text-teal-700 mt-2"
            >
              {t('cookies.title')} →
            </Link>
          </div>
        )}
      </div>
    </Sheet>
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
