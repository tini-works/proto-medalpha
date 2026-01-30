import { useState } from 'react'
import { X } from 'tabler-icons-react'
import { useTranslation } from 'react-i18next'
import { Field, Select } from './index'
import type { FamilyMember, InsuranceType } from '../../types'

interface EditFamilyMemberSheetProps {
  member: FamilyMember
  onSave: (updates: Partial<FamilyMember>) => void
  onClose: () => void
}

export function EditFamilyMemberSheet({ member, onSave, onClose }: EditFamilyMemberSheetProps) {
  const { t } = useTranslation('profile')

  // Form state for basic fields
  const [formData, setFormData] = useState({
    name: member.name,
    dateOfBirth: member.dateOfBirth,
    relationship: member.relationship,
    insuranceType: member.insuranceType || (''),
    egkNumber: member.egkNumber || '',
  })

  // Form state for emergency contact
  const [emergencyContact, setEmergencyContact] = useState(
    member.emergencyContact || {
      name: '',
      phone: '',
      relationship: '',
    }
  )

  // Form state for medical notes
  const [medicalNotes, setMedicalNotes] = useState(member.medicalNotes || '')

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleEmergencyContactChange = (field: string, value: string) => {
    setEmergencyContact((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired')
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('validation.dateOfBirthRequired')
    }

    if (!formData.relationship) {
      newErrors.relationship = t('validation.relationshipRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Build the updates object
    const updates: Partial<FamilyMember> = {
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      relationship: formData.relationship as FamilyMember['relationship'],
      insuranceType: formData.insuranceType as InsuranceType | undefined,
      egkNumber: formData.egkNumber || undefined,
      medicalNotes: medicalNotes || undefined,
    }

    // Only include emergency contact if at least one field is filled
    if (emergencyContact.name || emergencyContact.phone || emergencyContact.relationship) {
      updates.emergencyContact = emergencyContact
    }

    onSave(updates)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-300 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-charcoal-500">{t('detail.edit')}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 transition-colors"
            aria-label={t('common.close')}
          >
            <X size="24" stroke="2" />
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4 pb-24">
          {/* Basic information section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal-500 text-sm">{t('detail.basicInfo')}</h3>

            <Field
              label={t('fullName.label')}
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t('fullName.placeholder')}
              error={errors.name}
              required
            />

            <Field
              label={t('detail.dateOfBirth')}
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />

            <Select
              label={t('detail.relationshipLabel')}
              value={formData.relationship}
              onChange={(e) => handleChange('relationship', e.target.value)}
              options={[
                { value: 'child', label: t('relationship.child') },
                { value: 'spouse', label: t('relationship.spouse') },
                { value: 'parent', label: t('relationship.parent') },
                { value: 'other', label: t('relationship.other') },
              ]}
              placeholder={t('family.form.relationshipPlaceholder')}
              error={errors.relationship}
              required
            />

            <Select
              label={t('family.form.insuranceType')}
              value={formData.insuranceType}
              onChange={(e) => handleChange('insuranceType', e.target.value)}
              options={[
                { value: 'GKV', label: t('insurance.gkv') },
                { value: 'PKV', label: t('insurance.pkv') },
              ]}
              placeholder={t('family.form.insurancePlaceholder')}
            />

            <Field
              label={`${t('egkNumber.label')} (${t('common.optional')})`}
              type="text"
              value={formData.egkNumber}
              onChange={(e) => handleChange('egkNumber', e.target.value)}
              placeholder={t('egkNumber.placeholder')}
            />
          </div>

          {/* Emergency contact section */}
          <div className="space-y-4 pt-4 border-t border-cream-300">
            <h3 className="font-semibold text-charcoal-500 text-sm">
              {t('detail.emergencyContact')} ({t('common.optional')})
            </h3>

            <Field
              label={t('detail.emergency.name')}
              type="text"
              value={emergencyContact.name}
              onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
              placeholder={t('detail.emergencyPlaceholders.name')}
            />

            <Field
              label={t('detail.emergency.relationship')}
              type="text"
              value={emergencyContact.relationship}
              onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
              placeholder={t('detail.emergencyPlaceholders.relationship')}
            />

            <Field
              label={t('detail.emergency.phone')}
              type="tel"
              value={emergencyContact.phone}
              onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
              placeholder="+49 (xxx) xxx-xxxx"
            />
          </div>

          {/* Medical notes section */}
          <div className="space-y-4 pt-4 border-t border-cream-300">
            <h3 className="font-semibold text-charcoal-500 text-sm">
              {t('detail.medicalNotes')} ({t('common.optional')})
            </h3>
            <div>
              <label className="block text-sm font-medium text-charcoal-500 mb-2">
                {t('detail.medicalNotesLabel')}
              </label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder={t('detail.medicalNotesPlaceholder')}
                className="w-full px-3 py-2 border border-cream-400 rounded-lg text-charcoal-500 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>
        </form>

        {/* Sticky footer with actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-3 space-y-3">
          <button
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
          >
            {t('edit.submit')}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 border border-cream-400 text-slate-500 font-medium rounded-lg hover:bg-cream-100 transition-colors"
          >
            {t('family.form.cancel')}
          </button>
        </div>
      </div>
    </>
  )
}
