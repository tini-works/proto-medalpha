import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { Field, RadioGroup } from '../../components/forms'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

export default function ProfileCompletionScreen() {
  const navigate = useNavigate()
  const { profile, updateProfile, updateGdprConsent } = useProfile()

  const [formData, setFormData] = useState({
    insuranceType: profile.insuranceType || '',
    egkNumber: profile.egkNumber || '',
    street: profile.address.street || '',
    postalCode: profile.address.postalCode || '',
    city: profile.address.city || '',
    dataProcessing: profile.gdprConsent.dataProcessing,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.insuranceType) {
      newErrors.insuranceType = 'Bitte wählen Sie Ihre Versicherungsart'
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

    if (!formData.dataProcessing) {
      newErrors.dataProcessing = 'Sie müssen der Datenverarbeitung zustimmen'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Update profile
    updateProfile({
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

    // Navigate to home
    navigate(PATHS.HOME)
  }

  return (
    <Page safeBottom={false}>
      <Header title="Profil vervollständigen" subtitle="Noch ein paar Angaben, dann sind Sie fertig." />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Insurance */}
        <RadioGroup
          label="Versicherungsart"
          name="insuranceType"
          value={formData.insuranceType}
          onChange={(value) => handleChange('insuranceType', value)}
          options={[
            { value: 'GKV', label: 'Gesetzlich (GKV)', description: 'Gesetzliche Krankenversicherung' },
            { value: 'PKV', label: 'Privat (PKV)', description: 'Private Krankenversicherung' },
          ]}
          error={errors.insuranceType}
          required
        />

        <Field
          label="eGK-Kartennummer"
          type="text"
          value={formData.egkNumber}
          onChange={(e) => handleChange('egkNumber', e.target.value)}
          placeholder="Kartennummer eingeben"
          error={errors.egkNumber}
          hint="Zu finden auf Ihrer Gesundheitskarte"
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
            placeholder="Musterstraße 123"
            error={errors.street}
            required
            autoComplete="street-address"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="PLZ"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder="12345"
              error={errors.postalCode}
              required
              autoComplete="postal-code"
            />

            <Field
              label="Ort"
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
              Ich stimme der Verarbeitung meiner persönlichen und gesundheitsbezogenen Daten gemäß der{' '}
              <a href="#" className="text-neutral-900 font-medium hover:underline">
                Datenschutzerklärung
              </a>{' '}
              zu.
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
            Profil speichern
          </button>
        </div>
      </form>
    </Page>
  )
}
