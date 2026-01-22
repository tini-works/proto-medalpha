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
      newErrors.fullName = 'Name ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich'
    }

    if (!formData.insuranceType) {
      newErrors.insuranceType = 'Versicherungsart ist erforderlich'
    }

    if (!formData.egkNumber.trim()) {
      newErrors.egkNumber = 'eGK-Nummer ist erforderlich'
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Straße ist erforderlich'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'PLZ ist erforderlich'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Ort ist erforderlich'
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
      <Header title="Profil bearbeiten" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="font-medium text-neutral-900">Persönliche Daten</h3>

          <Field
            label="Vollständiger Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={errors.fullName}
            required
          />

          <Field
            label="E-Mail-Adresse"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Field
            label="Telefon (optional)"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+49 123 456789"
          />
        </div>

        {/* Insurance */}
        <RadioGroup
          label="Versicherungsart"
          name="insuranceType"
          value={formData.insuranceType}
          onChange={(value) => handleChange('insuranceType', value)}
          options={[
            { value: 'GKV', label: 'Gesetzlich (GKV)' },
            { value: 'PKV', label: 'Privat (PKV)' },
          ]}
          error={errors.insuranceType}
          required
        />

        <Field
          label="eGK-Kartennummer"
          type="text"
          value={formData.egkNumber}
          onChange={(e) => handleChange('egkNumber', e.target.value)}
          error={errors.egkNumber}
          required
        />

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-neutral-900">Adresse</h3>

          <Field
            label="Straße und Hausnummer"
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            error={errors.street}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="PLZ"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              error={errors.postalCode}
              required
            />

            <Field
              label="Ort"
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
            className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
          >
            Änderungen speichern
          </button>
        </div>
      </form>
    </Page>
  )
}
