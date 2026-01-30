import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { Field, RadioGroup } from '../../components/forms'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

export default function ProfileCompletionScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const { profile, updateProfile, updateGdprConsent, isProfileComplete } = useProfile()

  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    insuranceType: profile.insuranceType || '',
    egkNumber: profile.egkNumber || '',
    street: profile.address.street || '',
    postalCode: profile.address.postalCode || '',
    city: profile.address.city || '',
    dataProcessing: profile.gdprConsent.dataProcessing,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted && isProfileComplete) {
      navigate(PATHS.HOME, { replace: true })
    }
  }, [submitted, isProfileComplete, navigate])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('validation.fullNameRequired')
    }

    if (!formData.egkNumber.trim()) {
      newErrors.egkNumber = t('validation.egkRequired')
    }

    if (!formData.street.trim()) {
      newErrors.street = t('validation.streetRequired')
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t('validation.postalCodeRequired')
    }

    if (!formData.city.trim()) {
      newErrors.city = t('validation.cityRequired')
    }

    if (!formData.dataProcessing) {
      newErrors.dataProcessing = t('validation.gdprRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return
    setSubmitted(true)

    // Update profile
    updateProfile({
      fullName: formData.fullName,
      insuranceType: formData.insuranceType as InsuranceType,
      egkNumber: formData.egkNumber,
      address: {
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city,
      },
    })

    // Update GDPR consent
    updateGdprConsent({
      dataProcessing: formData.dataProcessing,
    })
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('completion.title')} subtitle={t('completion.subtitle')} />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        <Field
          label={t('fullName.label')}
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder={t('fullName.placeholder')}
          error={errors.fullName}
          required
          autoComplete="name"
        />

        {/* Insurance (Optional) */}
        <RadioGroup
          label={t('insurance.label')}
          name="insuranceType"
          value={formData.insuranceType}
          onChange={(value) => handleChange('insuranceType', value)}
          options={[
            { value: 'GKV', label: t('insurance.gkv'), description: t('insurance.gkvDescription') },
            { value: 'PKV', label: t('insurance.pkv'), description: t('insurance.pkvDescription') },
          ]}
          error={errors.insuranceType}
        />

        <Field
          label={t('egkNumber.label')}
          type="text"
          value={formData.egkNumber}
          onChange={(e) => handleChange('egkNumber', e.target.value)}
          placeholder={t('egkNumber.placeholder')}
          error={errors.egkNumber}
          hint={t('egkNumber.hint')}
          required
        />

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-charcoal-500">{t('address.title')}</h3>

          <Field
            label={t('address.street.label')}
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder={t('address.street.placeholder')}
            error={errors.street}
            required
            autoComplete="street-address"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t('address.postalCode.label')}
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder={t('address.postalCode.placeholder')}
              error={errors.postalCode}
              required
              autoComplete="postal-code"
            />

            <Field
              label={t('address.city.label')}
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Berlin"
              error={errors.city}
              required
              autoComplete="address-level2"
            />
          </div>
        </div>

        {/* GDPR Consent */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.dataProcessing}
              onChange={(e) => handleChange('dataProcessing', e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-cream-400 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-slate-700">
              {t('gdpr.consent')}{' '}
              <a href="#" className="text-charcoal-500 font-medium hover:underline">
                {t('gdpr.privacyPolicy')}
              </a>
              .
              <span className="text-coral-600 ml-0.5">{t('gdpr.asterisk')}</span>
            </span>
          </label>
          {errors.dataProcessing && <p className="text-body-sm text-coral-800">{errors.dataProcessing}</p>}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            {t('completion.submit')}
          </Button>
        </div>
      </form>
    </Page>
  )
}
