import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { Field, RadioGroup } from '../../components/forms'
import { useProfile } from '../../state'
import type { InsuranceType } from '../../types'

export default function EditProfileScreen() {
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
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    }

    if (!formData.insuranceType) {
      newErrors.insuranceType = 'Insurance type is required'
    }

    if (!formData.egkNumber.trim()) {
      newErrors.egkNumber = 'eGK number is required'
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street is required'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
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
      <Header title="Edit Profile" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="font-medium text-charcoal-500">Personal Information</h3>

          <Field
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
            required
          />

          <Field
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Field
            label="Phone (optional)"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+49 123 456789"
          />
        </div>

        {/* Insurance */}
        <RadioGroup
          label="Insurance Type"
          name="insuranceType"
          value={formData.insuranceType}
          onChange={(value) => handleChange('insuranceType', value)}
          options={[
            { value: 'GKV', label: 'GKV (Statutory)' },
            { value: 'PKV', label: 'PKV (Private)' },
          ]}
          error={errors.insuranceType}
          required
        />

        <Field
          label="eGK Card Number"
          type="text"
          value={formData.egkNumber}
          onChange={(e) => handleChange('egkNumber', e.target.value)}
          error={errors.egkNumber}
          required
        />

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-charcoal-500">Address</h3>

          <Field
            label="Street Address"
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            error={errors.street}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Postal Code"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              error={errors.postalCode}
              required
            />

            <Field
              label="City"
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={errors.city}
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-primary btn-block"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Page>
  )
}
