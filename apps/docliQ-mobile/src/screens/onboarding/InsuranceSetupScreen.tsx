import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronLeft, IconInfoCircle } from '@tabler/icons-react'
import { Page, ProgressIndicator } from '../../components'
import { Field } from '../../components/forms'
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
  const [egkNumber, setEgkNumber] = useState(profile.egkNumber || '')
  const [egkError, setEgkError] = useState('')

  const canContinue = insuranceType !== ''

  // Validate eGK format if provided
  const validateEgk = (value: string): boolean => {
    if (!value) return true // Optional field
    return /^[A-Za-z]\d{9}$/.test(value)
  }

  const handleContinue = () => {
    if (!canContinue) return

    // Validate eGK if provided
    if (egkNumber && !validateEgk(egkNumber)) {
      setEgkError(t('onboarding.insurance.egkInvalidFormat'))
      return
    }

    updateProfile({ insuranceType, egkNumber: egkNumber.toUpperCase() })
    navigate(PATHS.HOME)
  }

  const handleSkip = () => {
    navigate(PATHS.HOME)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Page safeBottom={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-charcoal-500">
          {t('onboarding.insurance.title')}
        </h1>
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
          totalSteps={2}
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

        {/* eGK Number (optional) */}
        <Field
          label={t('onboarding.insurance.egkNumberLabel')}
          value={egkNumber}
          onChange={(e) => {
            setEgkNumber(e.target.value.toUpperCase())
            setEgkError('')
          }}
          placeholder={t('onboarding.insurance.egkNumberPlaceholder')}
          hint={t('onboarding.insurance.egkNumberHint')}
          error={egkError}
        />

        {/* Info note */}
        <div className="flex items-start gap-3 p-4 bg-cream-100 rounded-xl">
          <IconInfoCircle size={20} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            {t('onboarding.insurance.changeNote')}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-6 flex gap-3">
        <Button variant="tertiary" onClick={handleBack}>
          <IconChevronLeft size={20} className="-ml-1" />
          {t('onboarding.insurance.back')}
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          {t('onboarding.insurance.nextStep')}
        </Button>
      </div>
    </Page>
  )
}
