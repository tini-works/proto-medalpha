import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconFingerprint, IconFaceId, IconLock, IconCheck, IconX } from '@tabler/icons-react'
import { Sheet, Button } from '../ui'
import { useDevMode } from '../../contexts/DevModeContext'
import { haptics, announceToScreenReader } from '../../utils'

const LOADING_DURATION_MS = 1500
const SUCCESS_HOLD_MS = 800

export interface AllowBiometricsModalProps {
  open: boolean
  onClose: () => void
  onAllow: () => void
}

type Phase = 'idle' | 'loading' | 'success' | 'failed'

export function AllowBiometricsModal({
  open,
  onClose,
  onAllow,
}: AllowBiometricsModalProps) {
  const { t } = useTranslation('settings')
  const { biometricSimulationRequest, clearBiometricSimulationRequest } = useDevMode()
  const [phase, setPhase] = useState<Phase>('idle')
  const allowButtonRef = useRef<HTMLButtonElement>(null)
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Consume panel-driven biometric simulation for allow modal
  useEffect(() => {
    if (
      !open ||
      !biometricSimulationRequest ||
      biometricSimulationRequest.target !== 'allow-modal'
    ) {
      return
    }
    if (biometricSimulationRequest.type === 'success') {
      handleAllow()
    } else {
      handleDevFail()
    }
    clearBiometricSimulationRequest()
  }, [open, biometricSimulationRequest, clearBiometricSimulationRequest])

  const handleAllow = () => {
    setPhase('loading')
    announceToScreenReader(t('biometricAllow.a11y.scanning'))

    loadingTimerRef.current = setTimeout(() => {
      loadingTimerRef.current = null
      setPhase('success')
      haptics.success()
      announceToScreenReader(t('biometricAllow.a11y.success'))

      successTimerRef.current = setTimeout(() => {
        successTimerRef.current = null
        onAllow()
        onClose()
      }, SUCCESS_HOLD_MS)
    }, LOADING_DURATION_MS)
  }

  const handleDevFail = () => {
    if (phase === 'loading') {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      loadingTimerRef.current = null
    }
    setPhase('failed')
    haptics.error()
    announceToScreenReader(t('biometricAllow.a11y.failed'))
  }

  const handleTryAgain = () => {
    setPhase('loading')
    announceToScreenReader(t('biometricAllow.a11y.scanning'))
    loadingTimerRef.current = setTimeout(() => {
      loadingTimerRef.current = null
      setPhase('success')
      haptics.success()
      announceToScreenReader(t('biometricAllow.a11y.success'))
      successTimerRef.current = setTimeout(() => {
        successTimerRef.current = null
        onAllow()
        onClose()
      }, SUCCESS_HOLD_MS)
    }, LOADING_DURATION_MS)
  }

  const handleDonAllow = () => {
    if (isBlocking) return
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={handleDonAllow}
      variant="center"
      size="auto"
      showDragHandle={false}
      showCloseButton={false}
      closeOnBackdropClick={!isBlocking}
      closeOnEscape={!isBlocking}
      initialFocusRef={allowButtonRef}
      testId="allow-biometrics-modal"
    >
      <div className="p-6">
        <div className="flex justify-end -mt-1 -mr-1 mb-4">
          <button
            type="button"
            onClick={handleDonAllow}
            disabled={isBlocking}
            className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label={t('cancel')}
          >
            <IconX size={20} stroke={2} className="text-slate-600" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                phase === 'success'
                  ? 'bg-teal-100 animate-success-spring'
                  : phase === 'failed'
                    ? 'bg-red-50 animate-shake-error'
                    : phase === 'loading'
                      ? 'bg-teal-50 animate-pulse-scan'
                      : 'bg-teal-50'
              }`}
              aria-busy={phase === 'loading'}
              aria-live="polite"
              aria-label={
                phase === 'loading'
                  ? t('biometricAllow.a11y.scanning')
                  : phase === 'success'
                    ? t('biometricAllow.a11y.success')
                    : phase === 'failed'
                      ? t('biometricAllow.a11y.failed')
                      : undefined
              }
            >
              {phase === 'success' ? (
                <IconCheck size={48} className="text-teal-600" stroke={2.5} />
              ) : (
                <IconFingerprint
                  size={40}
                  className={
                    phase === 'failed' ? 'text-red-500' : 'text-teal-600'
                  }
                  aria-hidden="true"
                />
              )}
            </div>
            {phase !== 'success' && phase !== 'failed' && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-charcoal-200 flex items-center justify-center">
                <IconFaceId size={16} className="text-white" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        <h2
          id="allow-biometrics-title"
          className="text-xl font-semibold text-charcoal-500 text-center mb-2"
        >
          {t('biometricAllow.title')}
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          {phase === 'loading'
            ? t('biometricAllow.scanning')
            : phase === 'failed'
              ? t('biometricAllow.failed')
              : t('biometricAllow.description')}
        </p>

        {phase === 'failed' ? (
          <div className="space-y-3">
            <Button
              ref={allowButtonRef}
              onClick={handleTryAgain}
              variant="primary"
              fullWidth
              testId="allow-biometrics-try-again"
            >
              {t('biometricAllow.tryAgain')}
            </Button>
            <Button
              onClick={handleDonAllow}
              variant="link"
              fullWidth
              testId="allow-biometrics-dont-allow"
            >
              {t('biometricAllow.denyButton')}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              ref={phase === 'idle' ? allowButtonRef : undefined}
              onClick={handleAllow}
              variant="primary"
              fullWidth
              disabled={isBlocking}
              testId="allow-biometrics-allow"
            >
              {phase === 'loading' ? t('biometricAllow.scanning') : t('biometricAllow.allowButton')}
            </Button>
            {phase === 'idle' && (
              <Button
                onClick={handleDonAllow}
                variant="link"
                fullWidth
                testId="allow-biometrics-dont-allow"
              >
                {t('biometricAllow.denyButton')}
              </Button>
            )}
          </div>
        )}

        <p className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
          <IconLock size={14} stroke={2} aria-hidden="true" />
          <span>{t('biometricAllow.secureEncryption')}</span>
        </p>
      </div>
    </Sheet>
  )
}
