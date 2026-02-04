import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconFingerprint } from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { Field, PasswordField } from '@meda/ui'
import { Button } from '../../components/ui'
import { BiometricPromptSheet } from '../../components/biometrics'
import { useAuth, usePreferences } from '../../state'
import { PATHS } from '../../routes'

export default function SignInScreen() {
  const { t } = useTranslation(['auth', 'settings'])
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { biometricsEnabled, biometricUserId } = usePreferences()

  const passwordInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false)
  const [biometricError, setBiometricError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = t('auth:validation.emailRequired')
    }

    if (!formData.password) {
      newErrors.password = t('auth:validation.passwordRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    signIn(formData.email)
    navigate(PATHS.AUTH_VERIFY, { state: { isRegistration: false } })
  }

  const handleBiometricTap = () => {
    setBiometricError(null)
    setShowBiometricPrompt(true)
  }

  const handleBiometricCancel = () => {
    setShowBiometricPrompt(false)
    setBiometricError(null)
  }

  const handleBiometricSuccess = () => {
    setShowBiometricPrompt(false)
    setBiometricError(null)

    if (biometricUserId) {
      signIn(biometricUserId)
      navigate(PATHS.HOME)
    } else {
      // biometricUserId unexpectedly null - user needs to re-enable biometrics
      console.warn('Biometric success but no biometricUserId found')
    }
  }

  const handleBiometricFailure = () => {
    setBiometricError(t('settings:biometricPrompt.errorNotRecognized'))
  }

  const handleBiometricRetry = () => {
    setBiometricError(null)
  }

  const handleUsePassword = () => {
    setShowBiometricPrompt(false)
    setBiometricError(null)
    // Delay focus to allow sheet close animation to complete
    setTimeout(() => {
      passwordInputRef.current?.focus()
    }, 100)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('auth:signIn.title')} showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <Field
          label={t('auth:signIn.emailLabel')}
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder={t('auth:signIn.emailPlaceholder')}
          hint={t('auth:signIn.emailHint')}
          error={errors.email}
          required
          autoComplete="email"
        />

        <div>
          <PasswordField
            ref={passwordInputRef}
            label={t('auth:signIn.passwordLabel')}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={t('auth:signIn.passwordPlaceholder')}
            hint={t('auth:signIn.passwordHint')}
            error={errors.password}
            required
            autoComplete="current-password"
          />
          <div className="mt-2 text-right">
            <Link to={PATHS.AUTH_FORGOT_PASSWORD} className="text-sm text-neutral-600 hover:text-neutral-700 hover:underline">
              {t('auth:signIn.forgotPassword')}
            </Link>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="primary" fullWidth type="submit">
            {t('auth:signIn.submit')}
          </Button>
        </div>

        {biometricsEnabled && biometricUserId && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBiometricTap}
              className="w-full flex items-center justify-center gap-2 py-3 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              aria-label={t('settings:signInWithFingerprint')}
            >
              <IconFingerprint size={24} />
              <span className="text-sm font-medium">{t('settings:signInWithFingerprint')}</span>
            </button>
          </div>
        )}

        <p className="text-center text-sm text-neutral-500">
          {t('auth:signIn.noAccount')}{' '}
          <Link to={PATHS.AUTH_REGISTER} className="text-neutral-700 font-medium hover:underline">
            {t('auth:signIn.createOne')}
          </Link>
        </p>
      </form>

      <BiometricPromptSheet
        open={showBiometricPrompt}
        onCancel={handleBiometricCancel}
        onSuccess={handleBiometricSuccess}
        onFailure={handleBiometricFailure}
        error={biometricError}
        onRetry={handleBiometricRetry}
        onUsePassword={handleUsePassword}
      />
    </Page>
  )
}
