import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, RadioGroup } from '@meda/ui'
import { Header, Page } from '../../components'
import { Button, SecurityBanner } from '../../components/ui'
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
        <RadioGroup
          label={t('insuranceEdit.type')}
          name="insuranceType"
          value={insuranceType}
          onChange={(value) => setInsuranceType(value as InsuranceType)}
          options={[
            { value: 'GKV', label: t('insuranceEdit.gkv') },
            { value: 'PKV', label: t('insuranceEdit.pkv') },
          ]}
        />

        {/* Insurance Card Number */}
        <Field
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
