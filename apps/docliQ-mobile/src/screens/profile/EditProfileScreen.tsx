import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { Field, RadioGroup } from '../../components/forms'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import type { InsuranceType } from '../../types'

export default function EditProfileScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone || '',
    insuranceType: profile.insuranceType,
    egkNumber: profile.egkNumber,
    street: profile.address.street,
    postalCode: profile.address.postalCode,
    city: profile.address.city,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
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

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired')
    }

    if (!formData.insuranceType) {
      newErrors.insuranceType = t('validation.insuranceRequired')
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      insuranceType: formData.insuranceType as InsuranceType,
      egkNumber: formData.egkNumber,
      address: {
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city,
      },
    })

    navigate(-1)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('edit.title')} showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="font-medium text-charcoal-500">{t('edit.personalInfo')}</h3>

          <Field
            label={t('fullName.label')}
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
            required
          />

          <Field
            label={t('edit.email.label')}
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Field
            label={t('edit.phone.label')}
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder={t('edit.phone.placeholder')}
          />
        </div>

        {/* Insurance */}
        <RadioGroup
          label={t('insurance.labelRequired')}
          name="insuranceType"
          value={formData.insuranceType}
          onChange={(value) => handleChange('insuranceType', value)}
          options={[
            { value: 'GKV', label: t('insurance.gkv') },
            { value: 'PKV', label: t('insurance.pkv') },
          ]}
          error={errors.insuranceType}
          required
        />

        <Field
          label={t('egkNumber.label')}
          type="text"
          value={formData.egkNumber}
          onChange={(e) => handleChange('egkNumber', e.target.value)}
          error={errors.egkNumber}
          required
        />

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-charcoal-500">{t('edit.address')}</h3>

          <Field
            label={t('address.street.label')}
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            error={errors.street}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t('address.postalCode.label')}
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              error={errors.postalCode}
              required
            />

            <Field
              label={t('address.city.label')}
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={errors.city}
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            {t('edit.submit')}
          </Button>
        </div>
      </form>
    </Page>
  )
}
