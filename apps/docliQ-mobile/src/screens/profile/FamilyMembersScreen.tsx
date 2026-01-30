import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, FamilyMemberCard, EmptyState } from '../../components'
import { Field, Select } from '../../components/forms'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { familyMemberDetailPath } from '../../routes'
import type { FamilyMember, InsuranceType } from '../../types'

export default function FamilyMembersScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const { profile, addFamilyMember } = useProfile()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    relationship: '' as FamilyMember['relationship'] | '',
    insuranceType: '' as InsuranceType | '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      relationship: '',
      insuranceType: '',
    })
    setErrors({})
    setShowForm(false)
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

    addFamilyMember({
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      relationship: formData.relationship as FamilyMember['relationship'],
      insuranceType: formData.insuranceType as InsuranceType | undefined,
    })

    resetForm()
  }

  const handleCardClick = (memberId: string) => {
    navigate(familyMemberDetailPath(memberId))
  }

  return (
    <Page>
      <Header title={t('family.title')} subtitle={t('family.subtitle')} showBack />

      <div className="px-4 py-6">
        {/* Existing members */}
        {profile.familyMembers.length > 0 ? (
          <div className="space-y-3 mb-6">
            {profile.familyMembers.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onClick={() => handleCardClick(member.id)}
              />
            ))}
          </div>
        ) : (
          !showForm && (
            <EmptyState
              icon="user"
              title={t('family.empty.title')}
              description={t('family.empty.description')}
              action={
                <Button
                  onClick={() => setShowForm(true)}
                  variant="primary"
                >
                  {t('family.form.addButton')}
                </Button>
              }
            />
          )
        )}

        {/* Add button (when there are existing members) */}
        {profile.familyMembers.length > 0 && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-cream-400 rounded-lg text-slate-600 font-medium hover:border-cream-500 hover:text-charcoal-500 transition-colors duration-normal ease-out-brand"
          >
            + {t('family.form.addButton')}
          </button>
        )}

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-cream-400 p-4 space-y-4">
            <h3 className="font-semibold text-charcoal-500">{t('family.form.title')}</h3>

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
              label={t('family.form.dateOfBirth')}
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />

            <Select
              label={t('family.form.relationship')}
              value={formData.relationship}
              onChange={(e) => handleChange('relationship', e.target.value)}
              options={[
                { value: 'child', label: t('relationship.child') },
                { value: 'spouse', label: t('relationship.spouse') },
                { value: 'parent', label: t('relationship.parent') },
                { value: 'other', label: t('relationship.other') },
              ]}
              placeholder="Select relationship"
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

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={resetForm}
                variant="tertiary"
                fullWidth
                size="md"
              >
                {t('family.form.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
              >
                {t('family.form.submit')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Page>
  )
}
