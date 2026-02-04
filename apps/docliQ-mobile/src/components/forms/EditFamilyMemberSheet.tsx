import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, Select, TextareaField } from '@meda/ui'
import { Button, Sheet } from '../ui'
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()

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
    <Sheet
      open={true}
      onClose={onClose}
      variant="bottom"
      size="xl"
      title={t('detail.edit')}
      testId="edit-family-member-sheet"
      footer={
        <>
          <Button onClick={() => handleSubmit()} variant="primary" fullWidth>
            {t('edit.submit')}
          </Button>
          <Button onClick={onClose} variant="tertiary" fullWidth>
            {t('family.form.cancel')}
          </Button>
        </>
      }
    >
      <Sheet.Body>
        <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
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
            <TextareaField
              label={t('detail.medicalNotesLabel')}
              value={medicalNotes}
              onChange={setMedicalNotes}
              placeholder={t('detail.medicalNotesPlaceholder')}
              rows={4}
            />
          </div>
        </form>
      </Sheet.Body>
    </Sheet>
  )
}
