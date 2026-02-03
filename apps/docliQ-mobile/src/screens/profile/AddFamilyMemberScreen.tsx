import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { AddFamilyMemberSheet } from '../../components/forms'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { FamilyMember } from '../../types'

// Screen shown when user navigates to "add family member" route.
// It wraps the reusable bottom sheet form and wires it to profile state + navigation.
export default function AddFamilyMemberScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const { addFamilyMember } = useProfile()

  // When the sheet is dismissed without saving, return to the family members list.
  const handleClose = () => {
    navigate(PATHS.PROFILE_FAMILY)
  }

  // When a new member is submitted, persist it into profile state and go back to the list.
  const handleAdd = (member: Omit<FamilyMember, 'id'>) => {
    addFamilyMember(member)
    navigate(PATHS.PROFILE_FAMILY)
  }

  return (
    <Page>
      <Header
        title={t('family.form.title')}
        subtitle={t('family.subtitle')}
        showBack
      />

      <AddFamilyMemberSheet open onClose={handleClose} onAdd={handleAdd} />
    </Page>
  )
}

