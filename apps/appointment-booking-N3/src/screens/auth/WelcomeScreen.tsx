import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui'
import { PATHS } from '../../routes'

export default function WelcomeScreen() {
  const { t } = useTranslation('auth')
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header section - conservative, professional */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-charcoal-500 text-center">{t('appName')}</h1>
        <p className="mt-3 text-slate-500 text-center max-w-xs leading-relaxed">
          {t('tagline')}
        </p>

        {/* Features - factual, trust-focused */}
        <div className="mt-10 space-y-5 w-full max-w-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-charcoal-500">{t('feature.appointmentBooking.title')}</p>
              <p className="text-sm text-slate-500 mt-0.5">{t('feature.appointmentBooking.description')}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-charcoal-500">{t('feature.familyManagement.title')}</p>
              <p className="text-sm text-slate-500 mt-0.5">{t('feature.familyManagement.description')}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-charcoal-500">{t('feature.privacySecurity.title')}</p>
              <p className="text-sm text-slate-500 mt-0.5">{t('feature.privacySecurity.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - conservative styling */}
      <div className="px-6 pb-8 flex flex-col gap-3">
        <Link
          to={PATHS.AUTH_SIGN_IN}
          className="no-underline"
        >
          <Button variant="primary" fullWidth>
            {t('signIn')}
          </Button>
        </Link>
        <Link
          to={PATHS.AUTH_REGISTER}
          className="no-underline"
        >
          <Button variant="secondary" fullWidth>
            {t('register')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
