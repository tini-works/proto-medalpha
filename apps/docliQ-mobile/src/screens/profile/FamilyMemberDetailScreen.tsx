import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, StickyActionBar } from '../../components'
import { Button } from '../../components/ui'
import { useProfile, usePreferences } from '../../state'
import { PATHS } from '../../routes'
import { EditFamilyMemberSheet } from '../../components/forms'
import { getLocale } from '../../utils'
import type { FamilyMember } from '../../types'

export default function FamilyMemberDetailScreen() {
  const { t } = useTranslation('profile')
  // Route param is :id per PATHS.PROFILE_FAMILY_DETAIL
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile, removeFamilyMember, updateFamilyMember } = useProfile()
  const { language } = usePreferences()
  const [showEditSheet, setShowEditSheet] = useState(false)

  if (!id) {
    navigate(PATHS.PROFILE_FAMILY)
    return null
  }

  const member = profile.familyMembers.find((m) => m.id === id)

  if (!member) {
    navigate(PATHS.PROFILE_FAMILY)
    return null
  }

  // Dynamically get relationship label based on translation
  const getRelationshipLabel = (rel: FamilyMember['relationship']): string => {
    const labels: Record<FamilyMember['relationship'], string> = {
      child: t('relationship.child'),
      spouse: t('relationship.spouse'),
      parent: t('relationship.parent'),
      other: t('relationship.other'),
    }
    return labels[rel]
  }

  // Icon mapping
  const relationshipIcons: Record<FamilyMember['relationship'], string> = {
    child: '👶',
    spouse: '👤',
    parent: '🚶',
    other: '👤',
  }

  const age = member.dateOfBirth
    ? Math.floor((Date.now() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  const handleRemove = () => {
    if (window.confirm(t('detail.removeConfirm'))) {
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
              {getRelationshipLabel(member.relationship)}
              {age !== null && ` • ${age} ${t('detail.yearsOld')}`}
            </p>
          </div>
        </div>

        {/* Verification status */}
        <div className="bg-cream-100 rounded-lg p-4 border border-cream-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-charcoal-500">{t('detail.verification.title')}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {member.verified === true
                  ? t('detail.verification.verified')
                  : t('detail.verification.pending')}
              </p>
            </div>
            {member.verified !== true && (
              <button
                onClick={handleVerify}
                className="px-3 py-1.5 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                {t('detail.verification.verifyButton')}
              </button>
            )}
            {member.verified === true && (
              <span className="text-sm font-medium text-teal-700">{t('detail.verifiedCheckmark')}</span>
            )}
          </div>
        </div>

        {/* Basic information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-charcoal-500">{t('detail.basicInfo')}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">{t('detail.dateOfBirth')}</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1">
                {new Date(member.dateOfBirth).toLocaleDateString(getLocale(language))}
              </p>
            </div>
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">{t('detail.relationshipLabel')}</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1">
                {getRelationshipLabel(member.relationship)}
              </p>
            </div>
          </div>

          {member.insuranceType && (
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">{t('detail.insuranceType')}</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1">{member.insuranceType}</p>
            </div>
          )}

          {member.egkNumber && (
            <div className="bg-cream-100 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase">{t('detail.egkNumber')}</p>
              <p className="text-sm font-medium text-charcoal-500 mt-1 font-mono">{member.egkNumber}</p>
            </div>
          )}
        </div>

        {/* Emergency contact */}
        {member.emergencyContact && (
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal-500">{t('detail.emergencyContact')}</h3>
            <div className="bg-cream-100 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t('detail.emergency.name')}</p>
                <p className="text-sm font-medium text-charcoal-500 mt-1">{member.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t('detail.emergency.relationship')}</p>
                <p className="text-sm font-medium text-charcoal-500 mt-1">{member.emergencyContact.relationship}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{t('detail.emergency.phone')}</p>
                <p className="text-sm font-medium text-charcoal-500 mt-1">{member.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Medical notes */}
        {member.medicalNotes && (
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal-500">{t('detail.medicalNotes')}</h3>
            <div className="bg-cream-100 rounded-lg p-4">
              <p className="text-sm text-charcoal-500">{member.medicalNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons - sticky footer */}
      <StickyActionBar containerClassName="py-3">
        <div className="space-y-3">
          <button
            onClick={() => setShowEditSheet(true)}
            className="w-full py-3 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
          >
            {t('detail.edit')}
          </button>
          <Button
            onClick={handleRemove}
            variant="destructive"
            fullWidth
          >
            {t('detail.remove')}
          </Button>
        </div>
      </StickyActionBar>

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
