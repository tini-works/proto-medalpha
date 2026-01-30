import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconHeart, IconUser, IconMail, IconShieldCheck } from '@tabler/icons-react'
import { Button } from '../../components/ui'
import { PATHS } from '../../routes'

// Mock user data for prototype
const MOCK_GOOGLE_USER = {
  provider: 'google' as const,
  name: 'Max Mustermann',
  email: 'max.mustermann@gmail.com',
  photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
}

const MOCK_APPLE_USER = {
  provider: 'apple' as const,
  name: 'Anna Schmidt',
  email: 'anna.schmidt@icloud.com',
  photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
}

export default function OAuthConsentScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()

  // Get provider from navigation state
  const provider = (location.state?.provider as 'google' | 'apple') || 'google'
  const mockUser = provider === 'google' ? MOCK_GOOGLE_USER : MOCK_APPLE_USER

  const handleContinue = () => {
    // Navigate to insurance request with OAuth data
    navigate(PATHS.AUTH_INSURANCE_REQUEST, {
      state: { oauthData: mockUser },
    })
  }

  const handleCancel = () => {
    navigate(PATHS.AUTH_WELCOME)
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-3 shadow-sm">
            <IconHeart size={32} stroke={1.5} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-semibold text-charcoal-500">DocliQ</h1>
        </div>

        {/* Description */}
        <p className="text-center text-slate-500 mb-6 leading-relaxed">
          {t('oauthConsent.description')}
        </p>

        {/* Profile Data Cards */}
        <div className="space-y-3 mb-4">
          {/* Full Name Card */}
          <div className="bg-cream-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IconUser size={20} className="text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                {t('oauthConsent.fullName')}
              </p>
              <p className="text-charcoal-500 font-medium truncate">{mockUser.name}</p>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-cream-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IconMail size={20} className="text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                {t('oauthConsent.email')}
              </p>
              <p className="text-charcoal-500 font-medium truncate">{mockUser.email}</p>
            </div>
          </div>
        </div>

        {/* Security Message */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <IconShieldCheck size={18} className="text-teal-500 flex-shrink-0" />
          <span>{t('oauthConsent.securityMessage')}</span>
        </div>

        {/* Actions */}
        <Button variant="primary" fullWidth onClick={handleContinue} data-testid="oauth-continue">
          {t('oauthConsent.continue')}
        </Button>
        <button
          onClick={handleCancel}
          className="w-full mt-3 text-teal-600 font-medium py-2 hover:text-teal-700 transition-colors"
          data-testid="oauth-cancel"
        >
          {t('oauthConsent.cancel')}
        </button>

        {/* Terms Notice */}
        <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
          {t('oauthConsent.termsNotice')}{' '}
          <Link to={PATHS.LEGAL_PRIVACY} className="text-teal-600 underline hover:text-teal-700">
            {t('oauth.privacyLink')}
          </Link>
          {' '}{t('oauth.and')}{' '}
          <Link to={PATHS.LEGAL_TERMS} className="text-teal-600 underline hover:text-teal-700">
            {t('oauth.termsLink')}
          </Link>
          {' '}{t('oauthConsent.fromDocliQ')}
        </p>
      </div>
    </div>
  )
}
