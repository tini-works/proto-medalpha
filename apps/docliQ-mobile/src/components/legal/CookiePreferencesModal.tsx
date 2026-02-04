import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCookie, IconSquare, IconSquareCheckFilled } from '@tabler/icons-react'
import { Button, Sheet } from '../ui'
import { PATHS } from '../../routes'
import { useNotificationToast } from '../../contexts/NotificationToastContext'
import { getCookiePreferences, updateCookiePreferences } from './CookieConsentBanner'
import type { CookieConsent } from '../../types/legal'

interface CookiePreferencesModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Modal for editing cookie preferences in-place.
 * GDPR Art. 7 compliant: consent withdrawal is as easy as granting.
 * Shows current preferences and allows toggling without reset/reload.
 */
export default function CookiePreferencesModal({ open, onClose }: CookiePreferencesModalProps) {
  const { t } = useTranslation('legal')
  const { showToast } = useNotificationToast()
  const [isSaving, setIsSaving] = useState(false)
  const [preferences, setPreferences] = useState<CookieConsent | null>(null)

  // Load current preferences when modal opens
  useEffect(() => {
    if (open) {
      const current = getCookiePreferences()
      setPreferences(current)
    }
  }, [open])

  const togglePreference = (key: keyof Pick<CookieConsent, 'functional' | 'analytics' | 'marketingEmails'>) => {
    if (!preferences) return
    setPreferences(prev => prev ? { ...prev, [key]: !prev[key] } : null)
  }

  const handleSave = async () => {
    if (!preferences) return

    setIsSaving(true)
    try {
      await updateCookiePreferences({
        functional: preferences.functional,
        analytics: preferences.analytics,
        marketingEmails: preferences.marketingEmails,
      })

      showToast({
        type: 'success',
        title: t('cookies.banner.preferencesSaved'),
      })
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  // Don't render if no preferences loaded yet
  if (!preferences && open) {
    return null
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      variant="bottom"
      size="auto"
      showDragHandle
      testId="cookie-preferences-modal"
      footer={
        <div className="flex flex-col gap-3">
          <Button onClick={handleSave} fullWidth loading={isSaving}>
            {t('cookies.banner.savePreferences')}
          </Button>
          <Button onClick={onClose} variant="tertiary" fullWidth disabled={isSaving}>
            {t('deleteWarning.cancel')}
          </Button>
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
            {t('privacyHub.cookiePreferences')}
          </h3>
        </div>

        <p className="text-sm text-slate-600">
          {t('cookies.manage.content')}
        </p>

        {/* Preference toggles */}
        {preferences && (
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

            {/* Marketing Emails */}
            <button
              type="button"
              onClick={() => togglePreference('marketingEmails')}
              className="flex items-center justify-between w-full text-left"
              aria-pressed={preferences.marketingEmails}
            >
              <div>
                <span className="text-sm font-medium text-charcoal-500">
                  {t('cookies.categories.marketingEmails.title')}
                </span>
                <p className="text-xs text-slate-500">
                  {t('cookies.categories.marketingEmails.description')}
                </p>
              </div>
              {preferences.marketingEmails ? (
                <IconSquareCheckFilled size={24} className="text-teal-600 flex-shrink-0" />
              ) : (
                <IconSquare size={24} className="text-slate-300 flex-shrink-0" />
              )}
            </button>

            <Link
              to={PATHS.LEGAL_COOKIES}
              className="block text-xs text-teal-600 hover:text-teal-700 mt-2"
              onClick={onClose}
            >
              {t('cookies.title')} →
            </Link>
          </div>
        )}
      </div>
    </Sheet>
  )
}
