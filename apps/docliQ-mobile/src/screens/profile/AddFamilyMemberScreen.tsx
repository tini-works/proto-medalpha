import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { AddFamilyMemberSheet } from '../../components/forms'
import { useProfile } from '../../state'
import { PATHS } from '../../routes'

export default function AddFamilyMemberScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const { addFamilyMember } = useProfile()

  const handleClose = () => {
    navigate(PATHS.PROFILE_FAMILY)
  }

  const handleAdd = (member: Parameters<typeof addFamilyMember>[0]) => {
    addFamilyMember(member)
    navigate(PATHS.PROFILE_FAMILY)
  }

  return (
    <Page>
      <Header title={t('family.form.title')} showBack onBack={handleClose} />
      <AddFamilyMemberSheet open onClose={handleClose} onAdd={handleAdd} />
    </Page>
  )
}
