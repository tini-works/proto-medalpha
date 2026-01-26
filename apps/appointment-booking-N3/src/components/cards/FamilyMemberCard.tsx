import type { FamilyMember } from '../../types'
import { Avatar } from '../display/Avatar'
import { Pill } from '../display/Pill'

interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit?: () => void
  onRemove?: () => void
}

const relationshipLabels: Record<FamilyMember['relationship'], string> = {
  child: 'Child',
  spouse: 'Spouse',
  parent: 'Parent',
  other: 'Other',
}

export function FamilyMemberCard({ member, onEdit, onRemove }: FamilyMemberCardProps) {
  const age = member.dateOfBirth
    ? Math.floor((Date.now() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  return (
    <div className="p-4 bg-white rounded-lg border border-cream-400">
      <div className="flex items-start gap-3">
        <Avatar name={member.name} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-charcoal-500 truncate">{member.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <Pill tone="neutral">{relationshipLabels[member.relationship]}</Pill>
            {age !== null && <span className="text-sm text-slate-500">{age} years</span>}
          </div>
          {member.insuranceType && (
            <div className="mt-2">
              <Pill tone={member.insuranceType === 'GKV' ? 'info' : 'neutral'}>{member.insuranceType}</Pill>
            </div>
          )}
        </div>
      </div>

      {(onEdit || onRemove) && (
        <div className="mt-3 pt-3 border-t border-cream-200 flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 py-2 text-sm font-medium text-charcoal-500 hover:bg-cream-200 rounded-lg transition-colors duration-normal ease-out-brand"
            >
              Edit
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="flex-1 py-2 text-sm font-medium text-coral-700 hover:bg-coral-50 rounded-lg transition-colors duration-normal ease-out-brand"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}
