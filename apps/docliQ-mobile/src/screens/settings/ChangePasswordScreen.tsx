import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconLock } from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { Button, Input } from '../../components/ui'
import { useNotificationToast } from '../../contexts/NotificationToastContext'

/**
 * Change Password screen - placeholder for future implementation.
 * Shows form fields but displays "Coming soon" on submit.
 */
export default function ChangePasswordScreen() {
  const { t } = useTranslation('settings')
  const { showToast } = useNotificationToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = () => {
    showToast({
      title: t('comingSoon'),
      type: 'info',
    })
  }

  const isValid =
    currentPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    newPassword === confirmPassword &&
    newPassword.length >= 8

  return (
    <Page safeBottom={false}>
      <Header title={t('changePassword')} showBack />

      <div className="flex-1 flex flex-col px-4 py-6">
        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100 mb-6">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <IconLock size={20} className="text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {t('changePasswordInfo')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label={t('currentPassword')}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="********"
          />

          <Input
            label={t('newPassword')}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="********"
          />

          <Input
            label={t('confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            error={confirmPassword && newPassword !== confirmPassword ? t('passwordMismatch') : undefined}
          />
        </div>

        <div className="flex-1" />

        <Button onClick={handleSubmit} disabled={!isValid} fullWidth>
          {t('updatePassword')}
        </Button>
      </div>
    </Page>
  )
}
