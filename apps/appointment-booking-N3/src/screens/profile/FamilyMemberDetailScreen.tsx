import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'
import { EditFamilyMemberSheet } from '../../components/forms'
import type { FamilyMember } from '../../types'

const relationshipLabels: Record<FamilyMember['relationship'], string> = {
  child: 'Child',
  spouse: 'Spouse',
  parent: 'Parent',
  other: 'Other',
}

const relationshipIcons: Record<FamilyMember['relationship'], string> = {
  child: '👶',
  spouse: '👤',
  parent: '🚶',
  other: '👤',
}

export default function FamilyMemberDetailScreen() {
  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()
  const { profile, removeFamilyMember, updateFamilyMember } = useProfile()
  const [showEditSheet, setShowEditSheet] = useState(false)

  if (!memberId) {
    navigate(PATHS.PROFILE_FAMILY)
    return null
  }

  const member = profile.familyMembers.find((m) => m.id === memberId)

  if (!member) {
    navigate(PATHS.PROFILE_FAMILY)
    return null
  }

  const age = member.dateOfBirth
    ? Math.floor((Date.now() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      removeFamilyMember(member.id)
      navigate(PATHS.PROFILE_FAMILY)
    }
  }

  const handleVerify = () => {
    // Navigate to verification screen for this member
    navigate(`${PATHS.AUTH_VERIFY_IDENTITY}?memberId=${member.id}`)
  }

  const handleEditSave = (updates: Partial<FamilyMember>) => {
    updateFamilyMember(member.id, updates)
    setShowEditSheet(false)
  }

  return (
    <Page>
      <Header title={member.name} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Profile section */}
        <div className="flex gap-4">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-3xl flex-shrink-0">
              {relationshipIcons[member.relationship]}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-charcoal-500">{member.name}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {relationshipLabels[member.relationship]}
              {age !== null && ` • ${age} years old`}
            </p>
          </div>
        </div>

        {/* Verification status */}
        <div className="bg-cream-100 rounded-lg p-4 border border-cream-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-charcoal-500">Identity Verification</h3>
              <p className="text-sm text-slate-500 mt-1">
                {member.verified === true
                  ? 'Identity verified'
                  : 'Identity verification pending'}
              </p>
            </div>
            {member.verified !== true && (
              <button
                onClick={handleVerify}
                className="px-3 py-1.5 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                Verify
              </button>
            )}
            {member.verified === true && (
              <span className="text-sm font-medium text-teal-700">✓ Verified</span>
            )}
          </div>
        </div>

        {/* Basic information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-charcoal-500">Basic Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">Date of Birth</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1">
                {new Date(member.dateOfBirth).toLocaleDateString('de-DE')}
              </p>
            </div>
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">Relationship</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1">
                {relationshipLabels[member.relationship]}
              </p>
            </div>
          </div>

          {member.insuranceType && (
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">Insurance Type</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1">{member.insuranceType}</p>
            </div>
          )}

          {member.egkNumber && (
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">eGK Number</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1 font-mono">{member.egkNumber}</p>
            </div>
          )}
        </div>

        {/* Emergency contact */}
        {member.emergencyContact && (
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal-500">Emergency Contact</h3>
            <div className="bg-cream-100 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Name</p>
                <p className="text-sm font-medium text-charcoal-500 mt-1">{member.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Relationship</p>
                <p className="text-sm font-medium text-charcoal-500 mt-1">{member.emergencyContact.relationship}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Phone</p>
                <p className="text-sm font-medium text-charcoal-500 mt-1">{member.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Medical notes */}
        {member.medicalNotes && (
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal-500">Medical Notes</h3>
            <div className="bg-cream-100 rounded-lg p-4">
              <p className="text-sm text-charcoal-500">{member.medicalNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons - sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-3 space-y-3">
        <button
          onClick={() => setShowEditSheet(true)}
          className="w-full py-3 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
        >
          Edit Member
        </button>
        <button
          onClick={handleRemove}
          className="w-full py-3 px-4 border-2 border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
        >
          Remove Member
        </button>
      </div>

      {/* Edit sheet */}
      {showEditSheet && (
        <EditFamilyMemberSheet
          member={member}
          onSave={handleEditSave}
          onClose={() => setShowEditSheet(false)}
        />
      )}
    </Page>
  )
}
