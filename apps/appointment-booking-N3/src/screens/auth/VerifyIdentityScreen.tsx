import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, ProgressIndicator } from '../../components'
import { PATHS } from '../../routes'

export default function VerifyIdentityScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const handleVerifyIdentity = () => {
    // Navigate to Complete Profile screen
    navigate(PATHS.PROFILE_COMPLETE)
  }

  const handleSkip = () => {
    // Navigate to Home, user remains unverified
    navigate(PATHS.HOME)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('verifyIdentity.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Progress Indicator */}
        <div className="pb-2">
          <ProgressIndicator currentStep={2} totalSteps={3} variant="dots" showLabel={false} showPercentage={false} />
        </div>

        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-charcoal-500">{t('verifyIdentity.heading')}</h1>
          <p className="text-sm text-slate-500">{t('verifyIdentity.step')}</p>
        </div>

        {/* Document Illustration */}
        <div className="border-2 border-dashed border-cream-400 rounded-lg p-6 bg-cream-50">
          <div className="flex items-center justify-center mb-4">
            {/* eGK Card Illustration */}
            <div className="relative">
              {/* Background card */}
              <div className="absolute -right-2 top-2 w-32 h-20 bg-white rounded-lg border border-cream-400 opacity-50" />
              {/* Foreground card */}
              <div className="relative w-32 h-20 bg-white rounded-lg border-2 border-teal-500 flex items-center justify-between px-3">
                {/* Medical cross icon */}
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                {/* eGK text */}
                <div className="flex-1 ml-2">
                  <div className="text-xs font-semibold text-charcoal-500">eGK</div>
                  <div className="h-1 bg-cream-300 rounded mt-1" />
                  <div className="h-1 bg-cream-300 rounded mt-0.5 w-3/4" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">{t('verifyIdentity.documentHint')}</p>
        </div>

        {/* Information Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-500">{t('verifyIdentity.prepareDocuments')}</h2>
          <p className="text-sm text-slate-500">
            {t('verifyIdentity.regulationsInfo')}
          </p>

          {/* Benefit Cards */}
          <div className="space-y-3">
            {/* End-to-End Encrypted Card */}
            <div className="bg-cream-50 rounded-lg p-4 border border-cream-400">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-1">{t('verifyIdentity.encrypted.title')}</h3>
                  <p className="text-xs text-slate-500">{t('verifyIdentity.encrypted.description')}</p>
                </div>
              </div>
            </div>

            {/* Quick Process Card */}
            <div className="bg-cream-50 rounded-lg p-4 border border-cream-400">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-1">{t('verifyIdentity.quickProcess.title')}</h3>
                  <p className="text-xs text-slate-500">{t('verifyIdentity.quickProcess.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            type="button"
            onClick={handleVerifyIdentity}
            className="w-full py-3.5 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
          >
            {t('verifyIdentity.submit')}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-3.5 px-4 text-slate-500 font-medium hover:bg-cream-200 rounded-lg transition-colors"
          >
            {t('verifyIdentity.skip')}
          </button>
        </div>
      </div>
    </Page>
  )
}
