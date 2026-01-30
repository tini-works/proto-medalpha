import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconAlertCircle } from '@tabler/icons-react'
import { Button } from '../../components/ui'
import { PATHS } from '../../routes'

export default function OAuthErrorScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()

  // Get provider from navigation state (defaults to 'Google')
  const provider = (location.state?.provider as string) || 'Google'
  const providerDisplay = provider.charAt(0).toUpperCase() + provider.slice(1)

  const handleTryAgain = () => {
    navigate(PATHS.AUTH_WELCOME)
  }

  const handleUseEmail = () => {
    navigate(PATHS.AUTH_SIGN_IN)
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6">
      {/* Error icon */}
      <div className="w-16 h-16 rounded-full bg-coral-100 flex items-center justify-center mb-4">
        <IconAlertCircle size={32} className="text-coral-500" />
      </div>

      {/* Error title */}
      <h1 className="text-xl font-semibold text-charcoal-500 text-center">
        {t('oauthError.title')}
      </h1>

      {/* Error message */}
      <p className="mt-2 text-slate-500 text-center max-w-xs leading-relaxed">
        {t('oauthError.message', { provider: providerDisplay })}
      </p>

      {/* Action buttons */}
      <div className="mt-8 w-full max-w-xs space-y-3">
        <Button
          variant="primary"
          fullWidth
          onClick={handleTryAgain}
          data-testid="oauth-error-retry"
        >
          {t('oauthError.tryAgain')}
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={handleUseEmail}
          data-testid="oauth-error-email"
        >
          {t('oauthError.useEmail')}
        </Button>
      </div>
    </div>
  )
}
