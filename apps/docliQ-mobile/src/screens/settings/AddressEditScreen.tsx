import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { Button, Input } from '../../components/ui'
import { useProfile } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'

/**
 * Address edit screen - dedicated form for updating address.
 * Separate from EditProfileScreen per IA restructure.
 */
export default function AddressEditScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('settings')
  const { profile, updateProfile } = useProfile()
  const { showToast } = useNotificationToast()

  const [street, setStreet] = useState(profile.address.street)
  const [postalCode, setPostalCode] = useState(profile.address.postalCode)
  const [city, setCity] = useState(profile.address.city)

  const handleSave = () => {
    updateProfile({
      address: {
        street,
        postalCode,
        city,
      },
    })
    showToast({
      title: t('addressEdit.saved'),
      type: 'success',
    })
    navigate(-1)
  }

  const isValid = street.trim() && postalCode.trim() && city.trim()

  return (
    <Page safeBottom={false}>
      <Header title={t('addressEdit.title')} showBack />

      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="space-y-4">
          <Input
            label={t('addressEdit.street')}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Musterstraße 123"
          />

          <Input
            label={t('addressEdit.postalCode')}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="10115"
            maxLength={5}
          />

          <Input
            label={t('addressEdit.city')}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Berlin"
          />
        </div>

        <div className="flex-1" />

        <Button onClick={handleSave} disabled={!isValid} fullWidth>
          {t('addressEdit.save')}
        </Button>
      </div>
    </Page>
  )
}
