import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail } from 'tabler-icons-react'
import { OTPInput, ResendTimer } from '@meda/ui'
import { Header, Page } from '../../components'
import { useAuth } from '../../state'
import { PATHS } from '../../routes'

export default function VerifyScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()
  const { markVerified } = useAuth()

  // Flow state from navigation
  const state = (location.state as {
    isRegistration?: boolean
    flowType?: string
    email?: string
  }) ?? {}
  const isRegistration = state.isRegistration ?? false
  const flowType = state.flowType
  const email = state.email ?? ''
  const isPasswordReset = flowType === 'passwordReset'

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle OTP completion (auto-submit)
  const handleComplete = (code: string) => {
    if (code.length !== 6) {
      setError(t('validation.codeIncomplete'))
      return
    }

    setIsSubmitting(true)

    // Mock verification - any code works
    markVerified()

    // Navigate based on flow type
    if (isPasswordReset) {
      navigate(PATHS.AUTH_RESET_PASSWORD, { state: { email } })
    } else if (isRegistration) {
      navigate(PATHS.ONBOARDING_PROFILE)
    } else {
      navigate(PATHS.HOME)
    }
  }

  // Handle manual form submission (fallback)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // OTPInput auto-submits on complete, but keep form for accessibility
  }

  // Handle resend code
  const handleResend = () => {
    setError('')
    // Mock resend - in real app, call API here
  }

  return (
    <Page safeBottom={false}>
      <Header
        title={isPasswordReset ? t('verify.passwordResetTitle') : t('verify.title')}
        showBack
      />

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <Mail size="32" stroke="2" className="text-neutral-600" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            {isPasswordReset ? t('verify.passwordResetTitle') : t('verify.heading')}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {isPasswordReset
              ? t('verify.passwordResetSubtitle', { email })
              : t('verify.description')}
          </p>
        </div>

        {/* OTP Input - auto-focuses first digit on mount */}
        <OTPInput
          onComplete={handleComplete}
          error={error}
          disabled={isSubmitting}
          groupLabel={t('verify.a11y.groupLabel')}
          digitLabel={t('verify.a11y.digitLabel')}
          verifyingLabel={t('verify.a11y.verifyingLabel')}
          progressLabel={t('verify.a11y.progressLabel')}
          className="mb-4"
        />

        <p className="text-center text-sm text-neutral-500 mb-6">
          {t('verify.demoHint')}
        </p>

        {/* Resend timer with countdown */}
        <ResendTimer
          initialSeconds={60}
          onResend={handleResend}
          label={t('verify.resend')}
          countdownLabel={t('verify.resendIn')}
          resendingLabel={t('verify.sending')}
          className="mt-3"
        />
      </form>
    </Page>
  )
}
