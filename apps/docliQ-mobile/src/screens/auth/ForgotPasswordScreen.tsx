import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { Field } from '../../components/forms'
import { Button } from '../../components/ui'
import { PATHS } from '../../routes'

export default function ForgotPasswordScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleChange = (value: string) => {
    setEmail(value)
    if (error) {
      setError('')
    }
  }

  const validate = () => {
    if (!email.trim()) {
      setError(t('validation.emailRequired'))
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Navigate to verify screen with password reset flow type
    navigate(PATHS.AUTH_VERIFY, { state: { flowType: 'passwordReset', email } })
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('forgotPassword.title')} showBack subtitle={t('forgotPassword.subtitle')} />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <Field
          label={t('forgotPassword.emailLabel')}
          type="email"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t('forgotPassword.emailPlaceholder')}
          error={error}
          required
          autoComplete="email"
        />

        <div className="pt-4">
          <Button variant="primary" fullWidth type="submit">
            {t('forgotPassword.sendCodeButton')}
          </Button>
        </div>
      </form>
    </Page>
  )
}
