import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Header, Page, StickyActionBar } from '../../components'
import { PasswordField } from '@meda/ui'
import { Button } from '../../components/ui'
import { PasswordStrengthIndicator } from '../../components/forms/PasswordStrengthIndicator'
import { useNotificationToast } from '../../contexts/NotificationToastContext'
import { validatePassword } from '../../utils/passwordValidation'
import { PATHS } from '../../routes'

/**
 * Change Password screen with OWASP-compliant validation.
 * GDPR: Password values never logged or exposed in error messages.
 */
export default function ChangePasswordScreen() {
  const { t } = useTranslation('settings')
  const navigate = useNavigate()
  const { showToast } = useNotificationToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // OWASP validation for new password
  const validation = validatePassword(newPassword)

  // Validation logic:
  // - Current password: required (non-empty)
  // - New password: OWASP score = 4 (strong)
  // - Confirm: must match new password
  // - New ≠ Current
  const isCurrentValid = currentPassword.trim().length > 0
  const isNewValid = validation.isValid
  const isConfirmMatch = newPassword === confirmPassword
  const isDifferentFromCurrent = newPassword !== currentPassword

  const isValid =
    isCurrentValid &&
    isNewValid &&
    isConfirmMatch &&
    isDifferentFromCurrent

  // Determine confirm password error
  const getConfirmError = () => {
    if (!confirmPassword) return undefined
    if (!isConfirmMatch) return t('passwordMismatch')
    return undefined
  }

  // Determine new password error (same as current)
  const getNewPasswordError = () => {
    if (newPassword && currentPassword && newPassword === currentPassword) {
      return t('passwordSameAsCurrent')
    }
    return undefined
  }

  const handleSubmit = () => {
    // Mock success - in production this would call backend API
    showToast({
      title: t('passwordChanged'),
      type: 'success',
    })

    // Navigate back after 1.5s
    setTimeout(() => {
      navigate(PATHS.SETTINGS)
    }, 1500)
  }

  const handleForgotPassword = () => {
    navigate(PATHS.AUTH_FORGOT_PASSWORD)
  }

  return (
    <Page safeBottom>
      <Header title={t('changePassword')} showBack />

      {/* Scrollable form content; pb-32 reserves space for sticky button */}
      <div className="px-4 py-6 pb-32 space-y-4">
        {/* Current Password Field */}
        <div>
          <PasswordField
            label={t('currentPassword')}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="********"
          />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-2 text-sm text-teal-600 hover:text-teal-700 hover:underline"
          >
            {t('forgotCurrentPassword')}
          </button>
        </div>

        {/* New Password: OWASP validation via validatePassword; strength indicator below */}
        <div>
          <PasswordField
            label={t('newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="********"
            error={getNewPasswordError()}
          />
          {newPassword.length > 0 && (
            <PasswordStrengthIndicator
              validation={validation}
              showRequirements
            />
          )}
        </div>

        {/* Confirm Password Field */}
        <PasswordField
          label={t('confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
          error={getConfirmError()}
        />
      </div>

      <StickyActionBar>
        <Button onClick={handleSubmit} disabled={!isValid} fullWidth>
          {t('updatePassword')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}
