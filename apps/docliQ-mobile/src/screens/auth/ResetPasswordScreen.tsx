import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { PasswordField } from '../../components/forms'
import { Button } from '../../components/ui'
import { useAuth } from '../../state'
import { PATHS } from '../../routes'
import { validatePassword } from '../../utils/passwordValidation'

export default function ResetPasswordScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  // Get email from state passed by VerifyScreen
  const email = (location.state as { email?: string })?.email ?? ''

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = t('validation.passwordRequired')
    } else {
      const validation = validatePassword(formData.password)
      if (!validation.isValid) {
        newErrors.password = t('validation.passwordWeak')
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordsMismatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Sign in the user with their email (mock - any password works)
    signIn(email)

    // Navigate directly to home (already verified via code)
    navigate(PATHS.HOME)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('resetPassword.title')} showBack subtitle={t('resetPassword.subtitle')} />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <PasswordField
          label={t('resetPassword.passwordLabel')}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder={t('resetPassword.passwordPlaceholder')}
          error={errors.password}
          showStrengthIndicator
          showRequirements
          required
          autoComplete="new-password"
        />

        <PasswordField
          label={t('resetPassword.confirmPasswordLabel')}
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder={t('resetPassword.confirmPasswordPlaceholder')}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <div className="pt-4">
          <Button variant="primary" fullWidth type="submit">
            {t('resetPassword.resetButton')}
          </Button>
        </div>
      </form>
    </Page>
  )
}
