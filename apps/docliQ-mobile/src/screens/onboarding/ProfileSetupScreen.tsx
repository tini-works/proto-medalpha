import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronLeft } from '@tabler/icons-react'
import { Page, ProgressIndicator } from '../../components'
import { PhoneInput, DateInput, GenderSelect } from '../../components/forms'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { Gender } from '../../types'

export default function ProfileSetupScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()

  const [formData, setFormData] = useState({
    dateOfBirth: profile.dateOfBirth || '',
    gender: profile.gender,
    phoneCountryCode: profile.phoneCountryCode || '+49',
    phone: profile.phone || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('validation.dobRequired')
    } else {
      // Check if user is at least 18
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      const dayDiff = today.getDate() - dob.getDate()
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

      if (actualAge < 18) {
        newErrors.dateOfBirth = t('validation.dobTooYoung')
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.phoneRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return

    updateProfile({
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phoneCountryCode: formData.phoneCountryCode,
      phone: formData.phone,
    })

    navigate(PATHS.ONBOARDING_INSURANCE)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleSkip = () => {
    navigate(PATHS.HOME)
  }

  // Calculate max date for 18+ validation hint
  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0]

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'male', label: t('onboarding.profile.genderMale') },
    { value: 'female', label: t('onboarding.profile.genderFemale') },
    { value: 'diverse', label: t('onboarding.profile.genderDiverse') },
    { value: 'prefer_not_to_say', label: t('onboarding.profile.genderPreferNot') },
  ]

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
            {t('onboarding.profile.title')}
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
          currentStep={1}
          totalSteps={3}
          variant="segments"
          labelFormat="uppercase"
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-charcoal-500">
            {t('onboarding.profile.heading')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('onboarding.profile.description')}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <DateInput
            label={t('onboarding.profile.dobLabel')}
            value={formData.dateOfBirth}
            onChange={(value) => handleChange('dateOfBirth', value)}
            error={errors.dateOfBirth}
            max={maxDate}
            required
          />

          <GenderSelect
            label={t('onboarding.profile.genderLabel')}
            value={formData.gender}
            onChange={(value) => handleChange('gender', value)}
            options={genderOptions}
          />

          <PhoneInput
            label={t('onboarding.profile.phoneLabel')}
            countryCode={formData.phoneCountryCode}
            phoneNumber={formData.phone}
            onCountryCodeChange={(code) => handleChange('phoneCountryCode', code)}
            onPhoneNumberChange={(number) => handleChange('phone', number)}
            error={errors.phone}
            required
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-6 space-y-4">
        <Button variant="primary" fullWidth onClick={handleContinue}>
          {t('onboarding.profile.continue')} →
        </Button>
        <p className="text-xs text-center text-slate-500">
          {t('onboarding.profile.privacyNote')}{' '}
          <Link to={PATHS.LEGAL_PRIVACY} className="text-teal-600 underline">
            {t('oauth.privacyLink')}
          </Link>
          .
        </p>
      </div>
    </Page>
  )
}
