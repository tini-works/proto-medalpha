import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconChevronLeft,
  IconDeviceMobile,
  IconHandFinger,
  IconShieldCheck,
  IconSquare,
  IconSquareCheckFilled,
} from '@tabler/icons-react'
import { Page, ProgressIndicator } from '../../components'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'

export default function VerifyIntroScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { profile, updateGdprConsent } = useProfile()

  const [consentChecked, setConsentChecked] = useState(profile.gdprConsent.dataProcessing)

  const handleScan = () => {
    if (!consentChecked) return
    updateGdprConsent({ dataProcessing: true })
    navigate(PATHS.ONBOARDING_SCAN)
  }

  const handleSkip = () => {
    // Skip verification - go to home
    // User can verify later from Settings
    navigate(PATHS.HOME)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Page safeBottom={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg hover:bg-cream-200 transition-colors"
          aria-label="Go back"
        >
          <IconChevronLeft size={24} className="text-charcoal-500" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-charcoal-500">
          {t('onboarding.verify.title')}
        </h1>
      </div>

      {/* Progress */}
      <div className="px-4 pb-4">
        <ProgressIndicator
          currentStep={3}
          totalSteps={3}
          variant="segments"
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-charcoal-500">
            {t('onboarding.verify.heading')}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {t('onboarding.verify.description')}
          </p>
        </div>

        {/* Card illustration */}
        <div className="flex justify-center py-4">
          <div className="relative w-48 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-lg p-4">
            {/* eGK card mock */}
            <div className="absolute top-3 left-3 w-8 h-6 bg-amber-400 rounded-sm" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="h-2 bg-white/30 rounded mb-1 w-3/4" />
              <div className="h-2 bg-white/30 rounded w-1/2" />
            </div>
            {/* Phone overlay */}
            <div className="absolute -right-6 -bottom-4 w-16 h-24 bg-charcoal-800 rounded-lg border-4 border-charcoal-600 flex items-center justify-center">
              <div className="w-10 h-16 bg-teal-100 rounded" />
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-cream-100 rounded-lg border border-cream-300">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconDeviceMobile size={22} className="text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal-500">
                {t('onboarding.verify.nfcTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('onboarding.verify.nfcDescription')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-cream-100 rounded-lg border border-cream-300">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconHandFinger size={22} className="text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal-500">
                {t('onboarding.verify.positionTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('onboarding.verify.positionDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <IconShieldCheck size={16} className="text-teal-600" />
          <span>{t('onboarding.verify.secure')}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-6 space-y-4">
        {/* GDPR Consent */}
        <button
          type="button"
          onClick={() => setConsentChecked(!consentChecked)}
          className="flex items-start gap-3 w-full text-left"
        >
          {consentChecked ? (
            <IconSquareCheckFilled size={28} className="text-teal-600 flex-shrink-0" />
          ) : (
            <IconSquare size={28} className="text-cream-400 flex-shrink-0" />
          )}
          <span className="text-sm text-slate-600 leading-relaxed pt-0.5">
            {t('onboarding.verify.gdprConsent')}{' '}
            <Link
              to={PATHS.LEGAL_PRIVACY}
              onClick={(e) => e.stopPropagation()}
              className="text-teal-600 underline hover:text-teal-700"
            >
              {t('oauth.privacyLink')}
            </Link>
          </span>
        </button>

        <Button
          variant="primary"
          fullWidth
          disabled={!consentChecked}
          onClick={handleScan}
        >
          {t('onboarding.verify.scan')}
        </Button>
        <Button variant="tertiary" fullWidth onClick={handleSkip}>
          {t('onboarding.verify.doItLater')}
        </Button>
      </div>
    </Page>
  )
}
