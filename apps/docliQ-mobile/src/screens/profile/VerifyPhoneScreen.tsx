import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DeviceMobile } from 'tabler-icons-react'
import { OTPInput, ResendTimer } from '@meda/ui'
import { Header, Page } from '../../components'
import { Button } from '../../components/ui'
import { useProfile } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'
import {
  sendVerificationCode,
  verifyCode,
  isValidPhoneNumber,
} from '../../services/phoneVerification'

interface LocationState {
  phone: string
  phoneCountryCode: string
}

export default function VerifyPhoneScreen() {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const location = useLocation()
  const { markPhoneVerified } = useProfile()
  const { showToast } = useNotificationToast()

  // Get phone from navigation state
  const state = (location.state as LocationState) ?? {}
  const { phone = '', phoneCountryCode = '+49' } = state

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')

  // Send initial code on mount
  useEffect(() => {
    if (phone && isValidPhoneNumber(phone) && !codeSent) {
      sendVerificationCode(phone, phoneCountryCode).then((result) => {
        if (result.success) {
          setCodeSent(true)
        } else if (result.error === 'rateLimitExceeded') {
          const minutes = Math.ceil((result.retryAfterMs ?? 0) / 60000)
          setError(t('validation.rateLimitExceeded', { minutes }))
        }
      })
    }
  }, [phone, phoneCountryCode, codeSent, t])

  // Handle OTP completion (auto-submit)
  const handleComplete = async (code: string) => {
    if (code.length !== 6) {
      setError(t('validation.codeIncomplete'))
      return
    }

    setIsSubmitting(true)
    setError('')

    const result = await verifyCode(phone, code)

    if (result.success) {
      markPhoneVerified()
      showToast({
        title: t('phone.verificationSuccess'),
        type: 'success',
      })
      navigate(-1)
    } else {
      // Map error codes to translation keys
      const errorKey = result.error === 'codeExpired'
        ? 'validation.codeExpired'
        : result.error === 'noActiveCode'
          ? 'validation.codeExpired'
          : 'validation.invalidCode'
      setError(t(errorKey))
      showToast({
        title: t(errorKey),
        type: 'warning',
      })
      setIsSubmitting(false)
    }
  }

  // Handle resend code
  const handleResend = async () => {
    setError('')
    const result = await sendVerificationCode(phone, phoneCountryCode)

    if (!result.success) {
      if (result.error === 'rateLimitExceeded') {
        const minutes = Math.ceil((result.retryAfterMs ?? 0) / 60000)
        setError(t('validation.rateLimitExceeded', { minutes }))
      }
    }
  }

  // Format phone for display
  const displayPhone = `${phoneCountryCode} ${phone}`

  // If no phone in state, redirect back
  if (!phone) {
    return (
      <Page safeBottom={false}>
        <Header title={t('phone.verifyTitle')} showBack />
        <div className="px-4 py-6 text-center">
          <p className="text-neutral-500">{t('phone.noPhoneProvided')}</p>
          <Button variant="primary" onClick={() => navigate(-1)} className="mt-4">
            {t('common.goBack')}
          </Button>
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('phone.verifyTitle')} showBack />

      <div className="px-4 py-6">
        {/* Icon and heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <DeviceMobile size={32} stroke="1.5" className="text-neutral-600" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            {t('phone.verifyHeading')}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {t('phone.verifySubtitle', { phone: displayPhone })}
          </p>
        </div>

        {/* OTP Input */}
        <OTPInput
          onChange={(value) => {
            setCode(value)
            if (error) setError('')
          }}
          onComplete={handleComplete}
          error={error}
          disabled={isSubmitting}
          className="mb-4"
        />

        {/* Demo hint */}
        <p className="text-center text-sm text-neutral-500 mb-6">
          {t('phone.demoHint')}
        </p>

        {/* Submit button (fallback - OTPInput auto-submits) */}
        <Button
          variant="primary"
          fullWidth
          type="button"
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => {
            if (code.length === 0) {
              setError(t('validation.codeIncomplete'))
              return
            }
            handleComplete(code)
          }}
        >
          {t('phone.submit')}
        </Button>

        {/* Resend timer - 180 seconds (3 minutes) per requirements */}
        <ResendTimer
          initialSeconds={180}
          onResend={handleResend}
          label={t('phone.resend')}
          countdownLabel={t('phone.resendIn')}
          resendingLabel={t('phone.sending')}
          className="mt-3"
        />
      </div>
    </Page>
  )
}
