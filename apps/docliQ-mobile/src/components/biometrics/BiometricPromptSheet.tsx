import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconFingerprint, IconCheck } from '@tabler/icons-react'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { haptics, announceToScreenReader } from '../../utils'

const LOADING_DURATION_MS = 1500
const SUCCESS_HOLD_MS = 800

export interface BiometricPromptSheetProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  onFailure: () => void
  error?: string | null
  onRetry?: () => void
  onUsePassword?: () => void
}

type Phase = 'idle' | 'loading' | 'success' | 'failed'

export function BiometricPromptSheet({
  open,
  onCancel,
  onSuccess,
  onFailure,
  error: externalError,
  onRetry,
  onUsePassword,
}: BiometricPromptSheetProps) {
  const { t } = useTranslation('settings')
  const [phase, setPhase] = useState<Phase>('idle')
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasError = phase === 'failed' || Boolean(externalError)
  const isBlocking = phase === 'loading'

  const resetPhase = () => setPhase('idle')

  useEffect(() => {
    if (!open) {
      resetPhase()
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    }
  }, [open])

  useEffect(
    () => () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    },
    []
  )

  const runLoadingToSuccess = () => {
    setPhase('loading')
    announceToScreenReader(t('biometricAllow.a11y.scanning'))

    loadingTimerRef.current = setTimeout(() => {
      loadingTimerRef.current = null
      setPhase('success')
      haptics.success()
      announceToScreenReader(t('biometricAllow.a11y.success'))

      successTimerRef.current = setTimeout(() => {
        successTimerRef.current = null
        onSuccess()
      }, SUCCESS_HOLD_MS)
    }, LOADING_DURATION_MS)
  }

  const runLoadingToFailed = () => {
    if (phase === 'loading' && loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current)
      loadingTimerRef.current = null
    }
    setPhase('failed')
    onFailure()
    haptics.error()
    announceToScreenReader(t('biometricAllow.a11y.failed'))
  }

  const handleCancel = () => {
    if (isBlocking) return
    onCancel()
  }

  const handleRetry = () => {
    setPhase('idle')
    onRetry?.()
  }

  const handleUsePassword = () => {
    onUsePassword?.()
  }

  const handleDevSuccess = () => {
    if (phase === 'idle') {
      runLoadingToSuccess()
    } else if (phase === 'loading') {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      loadingTimerRef.current = null
      setPhase('success')
      haptics.success()
      announceToScreenReader(t('biometricAllow.a11y.success'))
      successTimerRef.current = setTimeout(() => {
        successTimerRef.current = null
        onSuccess()
      }, SUCCESS_HOLD_MS)
    }
  }

  const handleDevFailure = () => {
    if (phase === 'idle') {
      setPhase('loading')
      announceToScreenReader(t('biometricAllow.a11y.scanning'))
      loadingTimerRef.current = setTimeout(() => {
        loadingTimerRef.current = null
        runLoadingToFailed()
      }, LOADING_DURATION_MS)
    } else if (phase === 'loading') {
      runLoadingToFailed()
    }
  }

  const displayError = phase === 'failed' ? t('biometricPrompt.errorNotRecognized') : externalError

  return (
    <Sheet
      open={open}
      onClose={handleCancel}
      variant="bottom"
      size="auto"
      showCloseButton={false}
      closeOnBackdropClick={!isBlocking}
      closeOnEscape={!isBlocking}
      testId="biometric-prompt-sheet"
      description={t('biometricPrompt.subtitle')}
    >
      <div className="px-6 pb-8 pt-4">
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              hasError ? 'bg-red-50 animate-shake-error' : phase === 'loading' ? 'bg-teal-50 animate-pulse-scan' : phase === 'success' ? 'bg-teal-50 animate-success-spring' : 'bg-teal-50'
            }`}
            aria-busy={phase === 'loading'}
            aria-live="polite"
          >
            {phase === 'success' ? (
              <IconCheck size={48} className="text-teal-600" stroke={2.5} aria-hidden="true" />
            ) : (
              <IconFingerprint
                size={48}
                className={hasError ? 'text-red-500' : 'text-teal-500'}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-charcoal-500 text-center mb-2">
          {t('biometricPrompt.title')}
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          {phase === 'loading'
            ? t('biometricAllow.scanning')
            : displayError ?? t('biometricPrompt.subtitle')}
        </p>

        {hasError ? (
          <div className="space-y-3">
            <Button onClick={handleRetry} variant="primary" fullWidth testId="biometric-try-again">
              {t('biometricPrompt.tryAgain')}
            </Button>
            <Button onClick={handleUsePassword} variant="link" fullWidth testId="biometric-use-password">
              {t('biometricPrompt.usePassword')}
            </Button>
          </div>
        ) : phase === 'success' ? (
          <div className="h-12" aria-hidden="true" />
        ) : (
          <>
            <Button
              onClick={handleCancel}
              variant="tertiary"
              fullWidth
              disabled={isBlocking}
              testId="biometric-cancel"
            >
              {t('biometricPrompt.cancel')}
            </Button>

            {import.meta.env.DEV && (
              <div className="pt-4 border-t border-cream-300">
                <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-wider">
                  Development Only
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDevSuccess}
                    variant="primary"
                    fullWidth
                    testId="biometric-dev-success"
                  >
                    {t('biometricPrompt.mockSuccess')}
                  </Button>
                  <Button
                    onClick={handleDevFailure}
                    variant="destructive-filled"
                    fullWidth
                    testId="biometric-dev-failure"
                  >
                    {t('biometricPrompt.mockFailure')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Sheet>
  )
}
