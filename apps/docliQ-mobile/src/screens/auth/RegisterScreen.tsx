import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { Field, PasswordField } from '@meda/ui'
import { Button } from '../../components/ui'
import { useAuth, useProfile } from '../../state'
import { PATHS } from '../../routes'
import { validatePassword } from '../../utils/passwordValidation'

export default function RegisterScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { updateProfile } = useProfile()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('validation.fullNameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid')
    }

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

    // Update profile with name
    updateProfile({ fullName: formData.fullName })

    // Sign in (this sets email and marks as authenticated but not verified)
    signIn(formData.email, { isRegistration: true })

    // Navigate to verification (pass isRegistration: true for new users)
    navigate(PATHS.AUTH_VERIFY, { state: { isRegistration: true } })
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('register.title')} showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <Field
          label={t('register.fullNameLabel')}
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder={t('register.fullNamePlaceholder')}
          error={errors.fullName}
          required
          autoComplete="name"
        />

        <Field
          label={t('register.emailLabel')}
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder={t('register.emailPlaceholder')}
          error={errors.email}
          required
          autoComplete="email"
        />

        <PasswordField
          label={t('register.passwordLabel')}
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder={t('register.passwordPlaceholder')}
          error={errors.password}
          showStrengthIndicator
          showRequirements
          required
          autoComplete="new-password"
        />

        <PasswordField
          label={t('register.confirmPasswordLabel')}
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder={t('register.confirmPasswordPlaceholder')}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <div className="pt-4">
          <Button variant="primary" fullWidth type="submit">
            {t('register.submit')}
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          {t('register.hasAccount')}{' '}
          <Link to={PATHS.AUTH_SIGN_IN} className="text-neutral-700 font-medium hover:underline">
            {t('register.createLink')}
          </Link>
        </p>
      </form>
    </Page>
  )
}
