import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconPlus } from '@tabler/icons-react'
import { Header, Page, FamilyMemberCard, EmptyState } from '../../components'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { PATHS, familyMemberDetailPath } from '../../routes'

export default function FamilyMembersScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const { profile } = useProfile()

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
          <Button
            variant="icon"
            size="sm"
            onClick={() => navigate(PATHS.PROFILE_FAMILY_ADD)}
            aria-label={t('family.form.addButton')}
          >
            <IconPlus size={20} stroke={2} className="text-slate-700" />
          </Button>
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
          <div className="space-y-3">
            <EmptyState
              icon="user"
              title={t('family.empty.title')}
              description={t('family.empty.description')}
            />
            <div className="pt-2 flex justify-center">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<IconPlus size={18} stroke={2} />}
                onClick={() => navigate(PATHS.PROFILE_FAMILY_ADD)}
              >
                {t('family.form.addButton')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}
