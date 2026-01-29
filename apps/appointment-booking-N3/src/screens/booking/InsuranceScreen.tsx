import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, ProgressIndicator } from '../../components'
import { Button } from '../../components/ui'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

type InsuranceChoice = InsuranceType | 'Selbstzahler' | ''

export default function InsuranceScreen() {
  const { t } = useTranslation('booking')
  const navigate = useNavigate()
  const { search, setSearchFilters } = useBooking()
  const { profile } = useProfile()

  const [insurance, setInsurance] = useState<InsuranceChoice>(search?.insuranceType || '')
  const [onlyPublic, setOnlyPublic] = useState<boolean>(Boolean(search?.onlyPublic))

  useEffect(() => {
    if (!search?.specialty) {
      navigate(PATHS.BOOKING_SEARCH)
      return
    }

    if (!insurance && profile.insuranceType) {
      setInsurance(profile.insuranceType)
    }
  }, [search?.specialty, insurance, profile.insuranceType, navigate])

  const handleBack = () => {
    navigate(PATHS.BOOKING_LOCATION)
  }

  const handleContinue = () => {
    if (!search) return
    if (!insurance) return

    setSearchFilters({
      ...search,
      insuranceType: insurance === 'Selbstzahler' ? '' : insurance,
      onlyPublic,
    })

    navigate(PATHS.BOOKING_RESULTS)
  }

  const isSelected = (value: InsuranceChoice) => insurance === value

  return (
    <Page safeBottom={false}>
      <Header title={t('insurance')} showBack onBack={handleBack} />

      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">{t('step3Of4')}</span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator currentStep={3} totalSteps={4} variant="bar" showLabel={false} showPercentage={false} />
      </div>

      <div className="px-4 pb-28 space-y-4">
        <h2 className="text-lg font-semibold text-charcoal-500">{t('whatInsuranceType')}</h2>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setInsurance('GKV')}
            className={`w-full text-left rounded-2xl border p-4 transition-colors duration-normal ease-out-brand ${
              isSelected('GKV') ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
            }`}
            aria-pressed={isSelected('GKV')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-charcoal-500">{t('publicGkv')}</p>
                <p className="text-sm text-slate-600 mt-1">{t('statutoryInsurance')}</p>
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected('GKV') ? 'border-teal-600' : 'border-cream-400'
                }`}
              >
                {isSelected('GKV') && <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setInsurance('PKV')}
            className={`w-full text-left rounded-2xl border p-4 transition-colors duration-normal ease-out-brand ${
              isSelected('PKV') ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
            }`}
            aria-pressed={isSelected('PKV')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-charcoal-500">{t('privatePkv')}</p>
                <p className="text-sm text-slate-600 mt-1">{t('privateInsurance')}</p>
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected('PKV') ? 'border-teal-600' : 'border-cream-400'
                }`}
              >
                {isSelected('PKV') && <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setInsurance('Selbstzahler')}
            className={`w-full text-left rounded-2xl border p-4 transition-colors duration-normal ease-out-brand ${
              isSelected('Selbstzahler') ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
            }`}
            aria-pressed={isSelected('Selbstzahler')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-charcoal-500">{t('selfPay')}</p>
                <p className="text-sm text-slate-600 mt-1">{t('selfPayDesc')}</p>
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected('Selbstzahler') ? 'border-teal-600' : 'border-cream-400'
                }`}
              >
                {isSelected('Selbstzahler') && <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
              </span>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-cream-400 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyPublic}
              onChange={(e) => setOnlyPublic(e.target.checked)}
              className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500 border-cream-400"
            />
            <div>
              <p className="font-medium text-charcoal-500">{t('showOnlyPublicDoctors')}</p>
              <p className="text-sm text-slate-600 mt-1">{t('publicInsuranceHint')}</p>
            </div>
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <Button
            onClick={handleContinue}
            disabled={!insurance}
            variant="primary"
            fullWidth
            size="lg"
          >
            {t('continueBtn')}
          </Button>
        </div>
      </div>
    </Page>
  )
}
