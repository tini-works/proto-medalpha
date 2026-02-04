import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronRight } from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { Button, SecurityBanner } from '../../components/ui'
import { Field, PhoneInput } from '@meda/ui'
import { useProfile } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'
import { PATHS } from '../../routes'

export default function EditProfileScreen() {
  const { t } = useTranslation('profile')
  const { t: tSettings } = useTranslation('settings')
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const { showToast } = useNotificationToast()

  // Form state for personal info only (address/insurance managed in sub-screens)
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone || '',
    phoneCountryCode: profile.phoneCountryCode || '+49',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Track if phone was changed (to reset verification status)
  const phoneChanged =
    formData.phone !== (profile.phone || '') ||
    formData.phoneCountryCode !== (profile.phoneCountryCode || '+49')

  // Check if phone is currently verified (and hasn't been changed)
  const isPhoneVerified = profile.phoneVerified && !phoneChanged && formData.phone !== ''

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // If phone changed, reset verification status
    const phoneVerificationReset = phoneChanged
      ? { phoneVerified: false, phoneVerifiedAt: undefined }
      : {}

    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      phoneCountryCode: formData.phoneCountryCode,
      ...phoneVerificationReset,
    })

    showToast({
      title: tSettings('profileSaved'),
      type: 'success',
    })

    navigate(PATHS.SETTINGS)
  }

  // Format address for display
  const addressSummary =
    profile.address.street && profile.address.postalCode && profile.address.city
      ? `${profile.address.street}, ${profile.address.postalCode} ${profile.address.city}`
      : t('edit.noAddress')

  // Format insurance for display
  const insuranceLabel = profile.insuranceType === 'GKV' ? t('insurance.gkv') : t('insurance.pkv')
  const insuranceSummary =
    profile.insuranceType && profile.egkNumber
      ? `${insuranceLabel} – ${profile.egkNumber}`
      : t('edit.noInsurance')

  return (
    <Page safeBottom={false}>
      <Header title={t('edit.title')} showBack onBack={() => navigate(PATHS.SETTINGS)} />

      <form id="edit-profile-form" onSubmit={handleSubmit} className="px-4 py-6 space-y-6 pb-48">
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

          <PhoneInput
            label={t('phone.label')}
            countryCode={formData.phoneCountryCode}
            phoneNumber={formData.phone}
            onCountryCodeChange={(code) => handleChange('phoneCountryCode', code)}
            onPhoneNumberChange={(number) => handleChange('phone', number)}
            error={errors.phone}
            verificationStatus={
              !formData.phone
                ? 'none'
                : isPhoneVerified
                  ? 'verified'
                  : 'pending'
            }
            onVerifyClick={() =>
              navigate(PATHS.PROFILE_VERIFY_PHONE, {
                state: {
                  phone: formData.phone,
                  phoneCountryCode: formData.phoneCountryCode,
                },
              })
            }
            verifyLabel={t('phone.verify')}
            pendingHint={t('phone.pendingVerification')}
          />
        </div>

        {/* Address - Link to sub-screen */}
        <div className="space-y-2">
          <h3 className="font-medium text-charcoal-500">{t('edit.address')}</h3>
          <button
            type="button"
            onClick={() => navigate(PATHS.SETTINGS_ADDRESS)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-300 transition-colors"
          >
            <span className="text-charcoal-500 text-left">{addressSummary}</span>
            <IconChevronRight size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Insurance - Link to sub-screen */}
        <div className="space-y-2">
          <h3 className="font-medium text-charcoal-500">{t('edit.insurance')}</h3>
          <button
            type="button"
            onClick={() => navigate(PATHS.SETTINGS_INSURANCE)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-300 transition-colors"
          >
            <span className="text-charcoal-500 text-left">{insuranceSummary}</span>
            <IconChevronRight size={20} className="text-slate-400" />
          </button>
        </div>
      </form>

      {/* Fixed bottom section */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream-100 px-4 pb-6 pt-2">
        <div className="mx-auto max-w-md space-y-4">
          <SecurityBanner />
          <Button
            type="submit"
            form="edit-profile-form"
            variant="primary"
            fullWidth
          >
            {t('edit.submit')}
          </Button>
        </div>
      </div>
    </Page>
  )
}
