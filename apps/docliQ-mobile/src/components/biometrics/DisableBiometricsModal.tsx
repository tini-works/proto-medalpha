import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconFingerprint } from '@tabler/icons-react'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { PasswordField } from '../forms/PasswordField'
import { announceToScreenReader } from '../../utils'

export interface DisableBiometricsModalProps {
  open: boolean
  onClose: () => void
  onDisable: () => void
}

export function DisableBiometricsModal({
  open,
  onClose,
  onDisable,
}: DisableBiometricsModalProps) {
  const { t } = useTranslation('settings')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  // Security UX: prevent accidental disables until user confirms with password.
  const isDisableDisabled = password.trim().length === 0

  useEffect(() => {
    if (open) {
      setPassword('')
      setError(null)
      requestAnimationFrame(() => passwordInputRef.current?.focus())
    }
  }, [open])

  const handleDisable = () => {
    const trimmed = password.trim()
    if (!trimmed) {
      setError(t('biometricDisable.passwordRequired'))
      announceToScreenReader(t('biometricDisable.passwordRequired'), 'assertive')
      return
    }
    onDisable()
    onClose()
  }

  const handleKeepEnabled = () => {
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={handleKeepEnabled}
      variant="center"
      size="auto"
      showDragHandle={false}
      showCloseButton={false}
      initialFocusRef={passwordInputRef as React.RefObject<HTMLElement>}
      testId="disable-biometrics-modal"
    >
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center">
            <IconFingerprint
              size={40}
              className="text-coral-600"
              stroke={1.5}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div className="w-full h-0.5 bg-coral-600 rotate-45 origin-center" />
            </div>
          </div>
        </div>

        <h2
          id="disable-biometrics-title"
          className="text-xl font-semibold text-charcoal-500 text-center mb-2"
        >
          {t('biometricDisable.title')}
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          {t('biometricDisable.description')}
        </p>

        <div className="mb-6">
          <PasswordField
            ref={passwordInputRef}
            label={t('biometricDisable.passwordLabel')}
            placeholder={t('biometricDisable.passwordPlaceholder')}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError(null)
            }}
            error={error ?? undefined}
            aria-describedby={error ? 'disable-password-error' : undefined}
          />
          {error && (
            <p
              id="disable-password-error"
              role="alert"
              className="mt-1 text-sm text-coral-600"
              aria-live="assertive"
            >
              {error}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleDisable}
            variant="destructive-filled"
            fullWidth
            disabled={isDisableDisabled}
            testId="disable-biometrics-confirm"
          >
            {t('biometricDisable.disableButton')}
          </Button>
          <Button
            onClick={handleKeepEnabled}
            // UX intent: keep-safe choice is lower-emphasis than the destructive action.
            variant="secondary"
            fullWidth
            testId="disable-biometrics-keep-enabled"
          >
            {t('biometricDisable.keepEnabled')}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
