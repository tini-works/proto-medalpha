import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconPlus, IconX } from '@tabler/icons-react'
import { Header, Page, FamilyMemberCard, EmptyState } from '../../components'
import { AddFamilyMemberSheet } from '../../components/forms'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { familyMemberDetailPath } from '../../routes'

export default function FamilyMembersScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const { profile, addFamilyMember } = useProfile()
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleCardClick = (memberId: string) => {
    navigate(familyMemberDetailPath(memberId))
  }

  return (
    <Page>
      <Header
        title={t('family.title')}
        subtitle={t('family.subtitle')}
        showBack
        rightAction={
          isAddOpen ? (
            <Button variant="icon" size="sm" onClick={() => setIsAddOpen(false)} aria-label={t('family.form.cancel')}>
              <IconX size={20} stroke={2} className="text-slate-700" />
            </Button>
          ) : (
            <Button variant="icon" size="sm" onClick={() => setIsAddOpen(true)} aria-label={t('family.form.addButton')}>
              <IconPlus size={20} stroke={2} className="text-slate-700" />
            </Button>
          )
        }
      />

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
          !isAddOpen && (
            <div className="space-y-3">
              <EmptyState
                icon="user"
                title={t('family.empty.title')}
                description={t('family.empty.description')}
              />
              <p className="text-sm text-slate-500 text-center">
                {t('family.form.addHint')}
              </p>
            </div>
          )
        )}
      </div>

      <AddFamilyMemberSheet
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addFamilyMember}
      />
    </Page>
  )
}
