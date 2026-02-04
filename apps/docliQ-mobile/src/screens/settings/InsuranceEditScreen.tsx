import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { Button, Input, SecurityBanner } from '../../components/ui'
import { useProfile } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'
import type { InsuranceType } from '../../types'

/**
 * Insurance edit screen - dedicated form for updating insurance details.
 * Separate from EditProfileScreen per IA restructure.
 */
export default function InsuranceEditScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('settings')
  const { profile, updateProfile } = useProfile()
  const { showToast } = useNotificationToast()

  const [insuranceType, setInsuranceType] = useState<InsuranceType | ''>(profile.insuranceType)
  const [egkNumber, setEgkNumber] = useState(profile.egkNumber)

  const handleSave = () => {
    updateProfile({
      insuranceType,
      egkNumber,
    })
    showToast({
      title: t('insuranceEdit.saved'),
      type: 'success',
    })
    navigate(-1)
  }

  const isValid = insuranceType && egkNumber.trim()

  return (
    <Page safeBottom={false}>
      <Header title={t('insuranceEdit.title')} showBack />

      <div className="px-4 py-6 space-y-4">
        {/* Insurance Type Selection */}
        <div>
          <label className="block text-sm font-medium text-charcoal-500 mb-2">
            {t('insuranceEdit.type')}
          </label>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-cream-400 cursor-pointer hover:bg-cream-100 transition-colors">
              <span className="font-medium text-charcoal-500">{t('insuranceEdit.gkv')}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  insuranceType === 'GKV' ? 'border-teal-500 bg-white' : 'border-cream-400 bg-white'
                }`}
              >
                {insuranceType === 'GKV' && <div className="w-3 h-3 rounded-full bg-teal-500" />}
              </div>
              <input
                type="radio"
                name="insuranceType"
                value="GKV"
                checked={insuranceType === 'GKV'}
                onChange={() => setInsuranceType('GKV')}
                className="sr-only"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-cream-400 cursor-pointer hover:bg-cream-100 transition-colors">
              <span className="font-medium text-charcoal-500">{t('insuranceEdit.pkv')}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  insuranceType === 'PKV' ? 'border-teal-500 bg-white' : 'border-cream-400 bg-white'
                }`}
              >
                {insuranceType === 'PKV' && <div className="w-3 h-3 rounded-full bg-teal-500" />}
              </div>
              <input
                type="radio"
                name="insuranceType"
                value="PKV"
                checked={insuranceType === 'PKV'}
                onChange={() => setInsuranceType('PKV')}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Insurance Card Number */}
        <Input
          label={t('insuranceEdit.egkNumber')}
          value={egkNumber}
          onChange={(e) => setEgkNumber(e.target.value)}
          placeholder="A123456789"
        />
      </div>

      {/* Fixed bottom section */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream-100 px-4 pb-6 pt-2">
        <div className="mx-auto max-w-md space-y-4">
          <SecurityBanner />
          <Button onClick={handleSave} disabled={!isValid} fullWidth>
            {t('insuranceEdit.save')}
          </Button>
        </div>
      </div>
    </Page>
  )
}
