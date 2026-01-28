import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Calendar, Users, Shield } from 'tabler-icons-react'
import { Button } from '../../components/ui'
import { PATHS } from '../../routes'

export default function WelcomeScreen() {
  const { t } = useTranslation('auth')
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header section - conservative, professional */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-sm">
          <Heart size="32" className="text-white" fill="currentColor" />
        </div>

        <h1 className="text-2xl font-semibold text-charcoal-500 text-center">{t('appName')}</h1>
        <p className="mt-3 text-slate-500 text-center max-w-xs leading-relaxed">
          {t('tagline')}
        </p>

        {/* Features - factual, trust-focused */}
        <div className="mt-10 space-y-5 w-full max-w-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <Calendar size="20" stroke="2" className="text-slate-600" />
            </div>
            <div>
              <p className="font-medium text-charcoal-500">{t('feature.appointmentBooking.title')}</p>
              <p className="text-sm text-slate-500 mt-0.5">{t('feature.appointmentBooking.description')}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <Users size="20" stroke="2" className="text-slate-600" />
            </div>
            <div>
              <p className="font-medium text-charcoal-500">{t('feature.familyManagement.title')}</p>
              <p className="text-sm text-slate-500 mt-0.5">{t('feature.familyManagement.description')}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
              <Shield size="20" stroke="2" className="text-slate-600" />
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
