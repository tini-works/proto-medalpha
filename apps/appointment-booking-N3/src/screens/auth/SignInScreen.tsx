import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { Field } from '../../components/forms'
import { Button } from '../../components/ui'
import { useAuth } from '../../state'
import { PATHS } from '../../routes'

export default function SignInScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired')
    }

    if (!formData.password) {
      newErrors.password = t('validation.passwordRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Sign in (mock - any email/password works)
    signIn(formData.email)

    // Navigate to verification (pass isRegistration: false for sign in)
    navigate(PATHS.AUTH_VERIFY, { state: { isRegistration: false } })
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('signIn.title')} showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <Field
          label={t('signIn.emailLabel')}
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder={t('signIn.emailPlaceholder')}
          error={errors.email}
          required
          autoComplete="email"
        />

        <div>
          <Field
            label={t('signIn.passwordLabel')}
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={t('signIn.passwordPlaceholder')}
            error={errors.password}
            required
            autoComplete="current-password"
          />
          <div className="mt-2 text-right">
            <Link to={PATHS.AUTH_FORGOT_PASSWORD} className="text-sm text-neutral-600 hover:text-neutral-700 hover:underline">
              {t('signIn.forgotPassword')}
            </Link>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="primary" fullWidth type="submit">
            {t('signIn.submit')}
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          {t('signIn.noAccount')}{' '}
          <Link to={PATHS.AUTH_REGISTER} className="text-neutral-700 font-medium hover:underline">
            {t('signIn.createOne')}
          </Link>
        </p>
      </form>
    </Page>
  )
}
