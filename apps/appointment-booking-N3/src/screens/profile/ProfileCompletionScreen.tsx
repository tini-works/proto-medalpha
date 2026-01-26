import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { Field, RadioGroup } from '../../components/forms'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

export default function ProfileCompletionScreen() {
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
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.insuranceType) {
      newErrors.insuranceType = 'Please select your insurance type'
    }

    if (!formData.egkNumber.trim()) {
      newErrors.egkNumber = 'eGK number is required'
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.dataProcessing) {
      newErrors.dataProcessing = 'You must accept the data processing terms'
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
      <Header title="Complete Profile" subtitle="Almost there! Just a few more details." />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        <Field
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          error={errors.fullName}
          required
          autoComplete="name"
        />

        {/* Insurance */}
        <RadioGroup
          label="Insurance Type"
          name="insuranceType"
          value={formData.insuranceType}
          onChange={(value) => handleChange('insuranceType', value)}
          options={[
            { value: 'GKV', label: 'GKV (Statutory)', description: 'Gesetzliche Krankenversicherung' },
            { value: 'PKV', label: 'PKV (Private)', description: 'Private Krankenversicherung' },
          ]}
          error={errors.insuranceType}
          required
        />

        <Field
          label="eGK Card Number"
          type="text"
          value={formData.egkNumber}
          onChange={(e) => handleChange('egkNumber', e.target.value)}
          placeholder="Enter your eGK number"
          error={errors.egkNumber}
          hint="Found on your health insurance card"
          required
        />

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-neutral-900">Address</h3>

          <Field
            label="Street Address"
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Enter street address"
            error={errors.street}
            required
            autoComplete="street-address"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Postal Code"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder="12345"
              error={errors.postalCode}
              required
              autoComplete="postal-code"
            />

            <Field
              label="City"
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
              className="mt-1 w-4 h-4 rounded border-neutral-300 text-neutral-800 focus:ring-neutral-500"
            />
            <span className="text-sm text-neutral-700">
              I agree to the processing of my personal and health data in accordance with the{' '}
              <a href="#" className="text-neutral-900 font-medium hover:underline">
                Privacy Policy
              </a>
              .
              <span className="text-red-500 ml-0.5">*</span>
            </span>
          </label>
          {errors.dataProcessing && <p className="text-sm text-red-500">{errors.dataProcessing}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </form>
    </Page>
  )
}
