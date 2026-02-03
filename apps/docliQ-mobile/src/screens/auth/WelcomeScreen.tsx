import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// Tabler: brand-apple → IconBrandApple (Apple logo for sign-in)
import { IconHeart, IconBrandApple, IconMail } from '@tabler/icons-react'
import { Button, GoogleGIcon } from '../../components/ui'
import { PATHS } from '../../routes'

export default function WelcomeScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const handleAppleSignIn = () => {
    navigate(PATHS.AUTH_OAUTH_CONSENT, { state: { provider: 'apple' } })
  }

  const handleGoogleSignIn = () => {
    navigate(PATHS.AUTH_OAUTH_CONSENT, { state: { provider: 'google' } })
  }

  return (
    <div className="min-h-[var(--app-height)] bg-cream-100 flex flex-col">
      {/* Header section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-sm">
          <IconHeart size={32} stroke={1.5} className="text-white" fill="currentColor" />
        </div>

        <h1 className="text-2xl font-semibold text-charcoal-500 text-center">{t('appName')}</h1>
        <p className="mt-3 text-slate-500 text-center max-w-xs leading-relaxed">
          {t('tagline')}
        </p>
      </div>

      {/* Action buttons - OAuth first, then email */}
      <div className="px-6 pb-6 flex flex-col gap-3 max-w-md mx-auto w-full">
        {/* Apple Sign In - Apple HIG: standalone solid black button, white text/icon */}
        <button
          type="button"
          onClick={handleAppleSignIn}
          data-testid="apple-signin"
          className="h-11 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-black text-white font-medium text-base transition-opacity hover:opacity-90 active:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <IconBrandApple size={20} stroke={1.5} fill="currentColor" />
          {t('oauth.continueWithApple', 'Continue with Apple')}
        </button>

        {/* Google Sign In - white pill, dark text, official colored G icon */}
        <Button
          variant="secondary"
          fullWidth
          leftIcon={<GoogleGIcon size={20} />}
          className="rounded-full bg-white border-neutral-300 text-charcoal-700 hover:bg-neutral-50 active:bg-neutral-100"
          onClick={handleGoogleSignIn}
          data-testid="google-signin"
        >
          {t('oauth.continueWithGoogle', 'Continue with Google')}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-sm text-neutral-400 uppercase">{t('oauth.or', 'OR')}</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Email Sign In - teal primary button */}
        <Link to={PATHS.AUTH_SIGN_IN} className="no-underline">
          <Button
            variant="primary"
            fullWidth
            leftIcon={<IconMail size={20} />}
          >
            {t('oauth.signInWithEmail', 'Sign in with Email')}
          </Button>
        </Link>

        {/* Create account link */}
        <p className="text-center text-sm text-neutral-500 mt-4">
          {t('oauth.noAccount', "Don't have an account?")}{' '}
          <Link to={PATHS.AUTH_REGISTER} className="text-teal-600 font-medium hover:underline">
            {t('oauth.createAccount', 'Create account')}
          </Link>
        </p>

        {/* Legal footer */}
        <div className="flex justify-center gap-6 mt-6 text-xs text-neutral-600 uppercase tracking-wide">
          <Link to={PATHS.LEGAL_PRIVACY || '#'} className="hover:text-charcoal-500">
            {t('legal.privacy', 'Privacy')}
          </Link>
          <Link to={PATHS.LEGAL_IMPRESSUM || '#'} className="hover:text-charcoal-500">
            {t('legal.legal', 'Legal')}
          </Link>
          <Link to={PATHS.LEGAL_TERMS || '#'} className="hover:text-charcoal-500">
            {t('legal.terms', 'Terms')}
          </Link>
        </div>
      </div>
    </div>
  )
}
