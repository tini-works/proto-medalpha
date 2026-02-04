import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FamilyMember, InsuranceType } from '../../types'
import { Button, Chip, Sheet } from '../ui'
import { Field } from './Field'

interface AddFamilyMemberSheetProps {
  open: boolean
  onClose: () => void
  onAdd: (member: Omit<FamilyMember, 'id'>) => void
}

export function AddFamilyMemberSheet({ open, onClose, onAdd }: AddFamilyMemberSheetProps) {
  const { t } = useTranslation('profile')
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    relationship: '' as FamilyMember['relationship'] | '',
    insuranceType: '' as InsuranceType | '',
    egkNumber: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const reset = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      relationship: '',
      insuranceType: '',
      egkNumber: '',
    })
    setErrors({})
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = t('validation.nameRequired')
    if (!formData.dateOfBirth) newErrors.dateOfBirth = t('validation.dateOfBirthRequired')
    if (!formData.relationship) newErrors.relationship = t('validation.relationshipRequired')
    if (formData.insuranceType && !formData.egkNumber.trim()) newErrors.egkNumber = t('validation.egkRequired')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = () => {
    if (!validate()) return
    onAdd({
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      relationship: formData.relationship as FamilyMember['relationship'],
      insuranceType: formData.insuranceType ? (formData.insuranceType as InsuranceType) : undefined,
      egkNumber: formData.insuranceType ? formData.egkNumber.trim() : undefined,
    })
    handleClose()
  }

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      variant="bottom"
      size="xl"
      title={t('family.form.title')}
      testId="add-family-member-sheet"
      footer={
        <Button onClick={handleSubmit} variant="primary" fullWidth>
          {t('family.form.submit')}
        </Button>
      }
    >
      <Sheet.Body>
        <div className="px-4 py-6 space-y-4">
          <Field
            label={t('fullName.label')}
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={t('fullName.placeholder')}
            error={errors.name}
            required
          />

          <Field
            label={t('family.form.dateOfBirth')}
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
            error={errors.dateOfBirth}
            required
          />

          <div>
            <p className="block text-sm font-medium text-charcoal-500 mb-2">
              {t('family.form.relationship')} <span className="text-coral-600">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'child', label: t('relationship.child') },
                { value: 'spouse', label: t('relationship.spouse') },
                { value: 'parent', label: t('relationship.parent') },
                { value: 'other', label: t('relationship.other') },
              ] as const).map((opt) => (
                <Chip
                  key={opt.value}
                  fullWidth
                  selected={formData.relationship === opt.value}
                  onClick={() => setFormData((prev) => ({ ...prev, relationship: opt.value }))}
                >
                  {opt.label}
                </Chip>
              ))}
            </div>
            {errors.relationship && <p className="text-body-sm text-coral-800 mt-1">{errors.relationship}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-500 mb-2">
              {t('family.form.insuranceType')}
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, insuranceType: 'GKV' }))}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-cream-400 hover:bg-cream-100 transition-colors"
                aria-pressed={formData.insuranceType === 'GKV'}
              >
                <span className="font-medium text-charcoal-500">{t('insurance.gkv')}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.insuranceType === 'GKV' ? 'border-teal-500 bg-white' : 'border-cream-400 bg-white'
                  }`}
                >
                  {formData.insuranceType === 'GKV' && <div className="w-3 h-3 rounded-full bg-teal-500" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, insuranceType: 'PKV' }))}
                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-cream-400 hover:bg-cream-100 transition-colors"
                aria-pressed={formData.insuranceType === 'PKV'}
              >
                <span className="font-medium text-charcoal-500">{t('insurance.pkv')}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.insuranceType === 'PKV' ? 'border-teal-500 bg-white' : 'border-cream-400 bg-white'
                  }`}
                >
                  {formData.insuranceType === 'PKV' && <div className="w-3 h-3 rounded-full bg-teal-500" />}
                </div>
              </button>
            </div>
          </div>

          <Field
            label={t('egkNumber.label')}
            type="text"
            value={formData.egkNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, egkNumber: e.target.value }))}
            placeholder={t('egkNumber.placeholder')}
            error={errors.egkNumber}
          />
        </div>
      </Sheet.Body>
    </Sheet>
  )
}
