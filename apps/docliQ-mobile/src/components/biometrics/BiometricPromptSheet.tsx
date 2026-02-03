import { useTranslation } from 'react-i18next'
import { IconFingerprint } from '@tabler/icons-react'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'

export interface BiometricPromptSheetProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  onFailure: () => void
  error?: string | null
  onRetry?: () => void
  onUsePassword?: () => void
}

export function BiometricPromptSheet({
  open,
  onCancel,
  onSuccess,
  onFailure,
  error,
  onRetry,
  onUsePassword,
}: BiometricPromptSheetProps) {
  const { t } = useTranslation('settings')

  const hasError = Boolean(error)

  return (
    <Sheet
      open={open}
      onClose={onCancel}
      variant="bottom"
      size="auto"
      showCloseButton={false}
      testId="biometric-prompt-sheet"
      description={t('biometricPrompt.subtitle')}
    >
      <div className="px-6 pb-8 pt-4">
        {/* Fingerprint icon with pulse/shake animation */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              hasError ? 'bg-red-50 animate-shake' : 'bg-teal-50 animate-pulse-gentle'
            }`}
          >
            <IconFingerprint
              size={48}
              className={hasError ? 'text-red-500' : 'text-teal-500'}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Title and subtitle */}
        <h2 className="text-xl font-semibold text-charcoal-500 text-center mb-2">
          {t('biometricPrompt.title')}
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          {hasError ? error : t('biometricPrompt.subtitle')}
        </p>

        {/* Error state buttons */}
        {hasError ? (
          <div className="space-y-3">
            <Button onClick={onRetry} variant="primary" fullWidth>
              {t('biometricPrompt.tryAgain')}
            </Button>
            <button
              onClick={onUsePassword}
              className="w-full text-sm text-teal-600 hover:text-teal-700 hover:underline py-2"
            >
              {t('biometricPrompt.usePassword')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Cancel button */}
            <Button onClick={onCancel} variant="tertiary" fullWidth>
              {t('biometricPrompt.cancel')}
            </Button>

            {/* DEV simulation buttons - only shown in development mode */}
            {import.meta.env.DEV && (
              <div className="pt-4 border-t border-cream-300">
                <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-wider">
                  Development Only
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={onSuccess}
                    variant="primary"
                    fullWidth
                    testId="biometric-dev-success"
                  >
                    {t('biometricPrompt.mockSuccess')}
                  </Button>
                  <Button
                    onClick={onFailure}
                    variant="destructive-filled"
                    fullWidth
                    testId="biometric-dev-failure"
                  >
                    {t('biometricPrompt.mockFailure')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Sheet>
  )
}
