import { useState } from 'react'
import { Field, Select } from './index'
import type { FamilyMember, InsuranceType } from '../../types'

interface EditFamilyMemberSheetProps {
  member: FamilyMember
  onSave: (updates: Partial<FamilyMember>) => void
  onClose: () => void
}

export function EditFamilyMemberSheet({ member, onSave, onClose }: EditFamilyMemberSheetProps) {
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
          <h2 className="text-lg font-semibold text-charcoal-500">Edit Member</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4 pb-24">
          {/* Basic information section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal-500 text-sm">Basic Information</h3>

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

            <Field
              label="eGK Number (optional)"
              type="text"
              value={formData.egkNumber}
              onChange={(e) => handleChange('egkNumber', e.target.value)}
              placeholder="Insurance card number"
            />
          </div>

          {/* Emergency contact section */}
          <div className="space-y-4 pt-4 border-t border-cream-300">
            <h3 className="font-semibold text-charcoal-500 text-sm">Emergency Contact (optional)</h3>

            <Field
              label="Name"
              type="text"
              value={emergencyContact.name}
              onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
              placeholder="Contact name"
            />

            <Field
              label="Relationship"
              type="text"
              value={emergencyContact.relationship}
              onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
              placeholder="e.g. Parent, Sibling, Friend"
            />

            <Field
              label="Phone Number"
              type="tel"
              value={emergencyContact.phone}
              onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
              placeholder="+49 (xxx) xxx-xxxx"
            />
          </div>

          {/* Medical notes section */}
          <div className="space-y-4 pt-4 border-t border-cream-300">
            <h3 className="font-semibold text-charcoal-500 text-sm">Medical Notes (optional)</h3>
            <div>
              <label className="block text-sm font-medium text-charcoal-500 mb-2">
                Allergies, conditions, or other notes
              </label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="e.g. Penicillin allergy, asthma..."
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
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 border border-cream-400 text-slate-500 font-medium rounded-lg hover:bg-cream-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
