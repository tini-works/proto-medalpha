import { useState } from 'react'
import { Header, Page, FamilyMemberCard, EmptyState } from '../../components'
import { Field, Select } from '../../components/forms'
import { useProfile } from '../../state'
import type { FamilyMember, InsuranceType } from '../../types'

export default function FamilyMembersScreen() {
  const { profile, addFamilyMember, removeFamilyMember } = useProfile()
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
      newErrors.name = 'Name is required'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required'
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

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      removeFamilyMember(id)
    }
  }

  return (
    <Page>
      <Header title="Family Members" subtitle="Manage profiles for your dependents" showBack />

      <div className="px-4 py-6">
        {/* Existing members */}
        {profile.familyMembers.length > 0 ? (
          <div className="space-y-3 mb-6">
            {profile.familyMembers.map((member) => (
              <FamilyMemberCard key={member.id} member={member} onRemove={() => handleRemove(member.id)} />
            ))}
          </div>
        ) : (
          !showForm && (
            <EmptyState
              icon="user"
              title="No family members"
              description="Add family members to book appointments on their behalf."
              action={
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Add Family Member
                </button>
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
            + Add Family Member
          </button>
        )}

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-cream-400 p-4 space-y-4">
            <h3 className="font-semibold text-charcoal-500">Add Family Member</h3>

            <Field
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              error={errors.name}
              required
            />

            <Field
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />

            <Select
              label="Relationship"
              value={formData.relationship}
              onChange={(e) => handleChange('relationship', e.target.value)}
              options={[
                { value: 'child', label: 'Child' },
                { value: 'spouse', label: 'Spouse' },
                { value: 'parent', label: 'Parent' },
                { value: 'other', label: 'Other' },
              ]}
              placeholder="Select relationship"
              error={errors.relationship}
              required
            />

            <Select
              label="Insurance Type (optional)"
              value={formData.insuranceType}
              onChange={(e) => handleChange('insuranceType', e.target.value)}
              options={[
                { value: 'GKV', label: 'GKV (Statutory)' },
                { value: 'PKV', label: 'PKV (Private)' },
              ]}
              placeholder="Same as primary account"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-tertiary flex-1 h-11 py-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 h-11 py-0"
              >
                Add Member
              </button>
            </div>
          </form>
        )}
      </div>
    </Page>
  )
}
