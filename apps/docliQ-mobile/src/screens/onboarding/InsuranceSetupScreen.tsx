import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronLeft, IconInfoCircle } from '@tabler/icons-react'
import { Page, ProgressIndicator } from '../../components'
import { InsuranceCard } from '../../components/cards'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

export default function InsuranceSetupScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()

  const [insuranceType, setInsuranceType] = useState<InsuranceType | ''>(profile.insuranceType || '')

  const canContinue = insuranceType !== ''

  const handleContinue = () => {
    if (!canContinue) return

    updateProfile({ insuranceType })

    navigate(PATHS.ONBOARDING_VERIFY)
  }

  const handleSkip = () => {
    // Skip without setting insurance - go to home
    navigate(PATHS.HOME)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Page safeBottom={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-cream-200 transition-colors"
            aria-label="Go back"
          >
            <IconChevronLeft size={24} className="text-charcoal-500" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-charcoal-500">
            {t('onboarding.insurance.title')}
          </h1>
        </div>
        <button
          onClick={handleSkip}
          className="text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors"
        >
          {t('onboarding.insurance.skip')}
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pb-4">
        <ProgressIndicator
          currentStep={2}
          totalSteps={3}
          variant="segments"
          labelFormat="default"
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-6">
        <div>
          <p className="text-sm text-teal-600 font-medium mb-1">
            {t('onboarding.insurance.almostThere')}
          </p>
          <h2 className="text-2xl font-semibold text-charcoal-500">
            {t('onboarding.insurance.heading')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('onboarding.insurance.description')}
          </p>
        </div>

        {/* Insurance cards */}
        <div className="space-y-3">
          <InsuranceCard
            type="GKV"
            title={t('onboarding.insurance.gkvTitle')}
            description={t('onboarding.insurance.gkvDescription')}
            selected={insuranceType === 'GKV'}
            onSelect={() => setInsuranceType('GKV')}
          />
          <InsuranceCard
            type="PKV"
            title={t('onboarding.insurance.pkvTitle')}
            description={t('onboarding.insurance.pkvDescription')}
            selected={insuranceType === 'PKV'}
            onSelect={() => setInsuranceType('PKV')}
          />
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 p-4 bg-cream-100 rounded-xl">
          <IconInfoCircle size={20} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            {t('onboarding.insurance.changeNote')}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-6">
        <Button
          variant="primary"
          fullWidth
          disabled={!canContinue}
          onClick={handleContinue}
        >
          {t('onboarding.insurance.nextStep')}
        </Button>
      </div>
    </Page>
  )
}
