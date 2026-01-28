import { IconChevronRight } from '@tabler/icons-react'
import type { FamilyMember } from '../../types'
import { Avatar } from '../display/Avatar'
import { Pill } from '../display/Pill'

interface FamilyMemberCardProps {
  member: FamilyMember
  onClick?: () => void // Navigate to detail screen
  onEdit?: () => void
  onRemove?: () => void
}

const relationshipLabels: Record<FamilyMember['relationship'], string> = {
  child: 'Child',
  spouse: 'Spouse',
  parent: 'Parent',
  other: 'Other',
}

export function FamilyMemberCard({ member, onClick, onEdit, onRemove }: FamilyMemberCardProps) {
  const age = member.dateOfBirth
    ? Math.floor((Date.now() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  // Main card content wrapped in a clickable div when onClick is provided
  const cardContent = (
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
      {/* Chevron indicator for navigation */}
      {onClick && (
        <IconChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" stroke={2} />
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg border border-cream-400 overflow-hidden">
      {/* Clickable area for navigation */}
      {onClick ? (
        <button
          onClick={onClick}
          className="w-full p-4 text-left hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
        >
          {cardContent}
        </button>
      ) : (
        <div className="p-4">{cardContent}</div>
      )}

      {/* Inline action buttons (legacy support) */}
      {(onEdit || onRemove) && (
        <div className="px-4 pb-4 pt-0 flex gap-2 border-t border-cream-200 -mt-1 pt-3">
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
