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
      newErrors.name = 'Name ist erforderlich'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Geburtsdatum ist erforderlich'
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Beziehung ist erforderlich'
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
    if (window.confirm('Möchten Sie dieses Familienmitglied wirklich entfernen?')) {
      removeFamilyMember(id)
    }
  }

  return (
    <Page>
      <Header title="Familienmitglieder" subtitle="Profile für Angehörige verwalten" showBack />

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
              title="Keine Familienmitglieder"
              description="Fügen Sie Familienmitglieder hinzu, um Termine für diese zu buchen."
              action={
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2.5 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  Familienmitglied hinzufügen
                </button>
              }
            />
          )
        )}

        {/* Add button (when there are existing members) */}
        {profile.familyMembers.length > 0 && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 font-medium hover:border-neutral-400 hover:text-neutral-700 transition-colors"
          >
            + Familienmitglied hinzufügen
          </button>
        )}

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-4 space-y-4">
            <h3 className="font-semibold text-neutral-900">Familienmitglied hinzufügen</h3>

            <Field
              label="Vollständiger Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Vor- und Nachname"
              error={errors.name}
              required
            />

            <Field
              label="Geburtsdatum"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />

            <Select
              label="Beziehung"
              value={formData.relationship}
              onChange={(e) => handleChange('relationship', e.target.value)}
              options={[
                { value: 'child', label: 'Kind' },
                { value: 'spouse', label: 'Ehepartner/in' },
                { value: 'parent', label: 'Elternteil' },
                { value: 'other', label: 'Sonstige' },
              ]}
              placeholder="Bitte auswählen"
              error={errors.relationship}
              required
            />

            <Select
              label="Versicherungsart (optional)"
              value={formData.insuranceType}
              onChange={(e) => handleChange('insuranceType', e.target.value)}
              options={[
                { value: 'GKV', label: 'Gesetzlich (GKV)' },
                { value: 'PKV', label: 'Privat (PKV)' },
              ]}
              placeholder="Wie Hauptkonto"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-2.5 px-4 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                Hinzufügen
              </button>
            </div>
          </form>
        )}
      </div>
    </Page>
  )
}
