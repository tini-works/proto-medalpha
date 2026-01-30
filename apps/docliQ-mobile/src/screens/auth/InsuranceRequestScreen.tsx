import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronLeft } from '@tabler/icons-react'
import { Button } from '../../components/ui'
import { RadioGroup } from '../../components/forms/RadioGroup'
import { Avatar } from '../../components/display/Avatar'
import { PATHS } from '../../routes'
import { useAuth, useProfile } from '../../state'

// OAuth data type passed from OAuthConsentScreen
interface OAuthData {
  provider: 'google' | 'apple'
  name: string
  email: string
  photoUrl?: string
}

type InsuranceChoice = 'GKV' | 'PKV' | 'Selbstzahler'

export default function InsuranceRequestScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, markVerified } = useAuth()
  const { updateProfile, updateGdprConsent } = useProfile()

  // Get OAuth data from navigation state
  const oauthData = location.state?.oauthData as OAuthData | undefined

  const [insuranceType, setInsuranceType] = useState<InsuranceChoice | ''>('')
  const [consentChecked, setConsentChecked] = useState(false)

  const canContinue = insuranceType !== '' && consentChecked

  const insuranceOptions = [
    { value: 'GKV', label: t('insuranceRequest.optionGKV') },
    { value: 'PKV', label: t('insuranceRequest.optionPKV') },
    { value: 'Selbstzahler', label: t('insuranceRequest.optionSelf') },
  ]

  const handleBack = () => {
    navigate(PATHS.AUTH_OAUTH_CONSENT, {
      state: { provider: oauthData?.provider },
    })
  }

  const handleContinue = () => {
    // Update profile with OAuth data + insurance selection
    updateProfile({
      fullName: oauthData?.name || '',
      email: oauthData?.email || '',
      photoUrl: oauthData?.photoUrl,
      authProvider: oauthData?.provider,
      insuranceType: insuranceType === 'Selbstzahler' ? '' : insuranceType,
    })

    // Record GDPR consent
    updateGdprConsent({ dataProcessing: true })

    // Sign in and mark as verified (OAuth users skip email verification)
    signIn(oauthData?.email || '', { isRegistration: true })
    markVerified()

    // Navigate to home
    navigate(PATHS.HOME)
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header with back button */}
      <div className="px-4 py-3 flex items-center">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg hover:bg-cream-200 transition-colors"
          aria-label="Go back"
        >
          <IconChevronLeft size={24} className="text-charcoal-500" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-charcoal-500">
          {t('insuranceRequest.title')}
        </h1>
      </div>

      <div className="flex-1 px-6 py-4">
        {/* Profile section - shows OAuth user data */}
        <div className="flex flex-col items-center mb-8">
          <Avatar
            name={oauthData?.name || ''}
            imageUrl={oauthData?.photoUrl}
            size="lg"
          />
          <h2 className="mt-3 text-xl font-semibold text-charcoal-500">
            {t('insuranceRequest.welcome', { name: oauthData?.name?.split(' ')[0] || '' })}
          </h2>
          <p className="text-slate-500">{oauthData?.email}</p>
          <p className="mt-1 text-sm text-slate-400">
            {t('insuranceRequest.subtitle')}
          </p>
        </div>

        {/* Insurance selection using RadioGroup */}
        <div className="mb-6">
          <RadioGroup
            label={t('insuranceRequest.insuranceLabel')}
            name="insuranceType"
            options={insuranceOptions}
            value={insuranceType}
            onChange={(v) => setInsuranceType(v as InsuranceChoice)}
            required
          />
          <p className="mt-1 text-xs text-slate-400">
            {t('insuranceRequest.insuranceRequired')}
          </p>
        </div>

        {/* GDPR Consent checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-2"
            aria-label={t('insuranceRequest.consent')}
            data-testid="consent-checkbox"
          />
          <span className="text-sm text-slate-600 leading-relaxed">
            {t('insuranceRequest.consent')}{' '}
            <Link
              to={PATHS.LEGAL_PRIVACY}
              className="text-teal-600 underline hover:text-teal-700"
            >
              {t('oauth.privacyLink')}
            </Link>
          </span>
        </label>
      </div>

      {/* Continue button - fixed at bottom */}
      <div className="px-6 pb-6">
        <Button
          variant="primary"
          fullWidth
          disabled={!canContinue}
          onClick={handleContinue}
          data-testid="insurance-continue"
        >
          {t('insuranceRequest.continue')}
        </Button>
      </div>
    </div>
  )
}
