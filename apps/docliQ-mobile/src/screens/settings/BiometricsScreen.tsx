import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconFingerprint, IconShieldCheck } from '@tabler/icons-react'
import { Switch } from '@meda/ui'
import { Header, Page } from '../../components'
import { AllowBiometricsModal, DisableBiometricsModal } from '../../components/biometrics'
import { usePreferences } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'
import { useDevMode } from '../../contexts/DevModeContext'
import { haptics, announceToScreenReader } from '../../utils'

const LOADING_DURATION_MS = 1500
const SUCCESS_HOLD_MS = 800

type SimulationPhase = 'idle' | 'loading' | 'success' | 'failed'

export default function BiometricsScreen() {
  const { t } = useTranslation('settings')
  const { biometricsEnabled, enableBiometrics, disableBiometrics } = usePreferences()
  const { showToast } = useNotificationToast()
  const { biometricSimulationRequest, clearBiometricSimulationRequest } = useDevMode()

  const [showAllowModal, setShowAllowModal] = useState(false)
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [simulationPhase, setSimulationPhase] = useState<SimulationPhase>('idle')

  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSimulatingRef = useRef(false)

  useEffect(
    () => () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    },
    []
  )

  // Consume panel-driven biometric simulation for settings screen (only when Allow modal is not open)
  useEffect(() => {
    if (
      !biometricSimulationRequest ||
      biometricSimulationRequest.target !== 'biometrics-settings' ||
      showAllowModal
    ) {
      return
    }
    runSimulation(biometricSimulationRequest.type === 'fail')
    clearBiometricSimulationRequest()
  }, [biometricSimulationRequest, showAllowModal, clearBiometricSimulationRequest])

  const handleToggle = (checked: boolean) => {
    // UX intent: switching ON asks for biometric permission via modal;
    // switching OFF requires password confirmation in a destructive flow.
    if (!checked) {
      setShowDisableModal(true)
    } else {
      setShowAllowModal(true)
    }
  }

  const handleAllowConfirm = () => {
    enableBiometrics()
    setShowAllowModal(false)
    showToast({
      title: t('biometricSetup.enabledToast'),
      type: 'success',
    })
  }

  const handleDisableConfirm = () => {
    disableBiometrics()
    setShowDisableModal(false)
    showToast({
      title: t('biometricSetup.disabledToast'),
      type: 'info',
    })
  }

  const handleAllowClose = () => setShowAllowModal(false)
  const handleDisableClose = () => setShowDisableModal(false)

  const runSimulation = (forceFail = false) => {
    if (simulationPhase !== 'idle' || isSimulatingRef.current) return
    isSimulatingRef.current = true

    setSimulationPhase('loading')
    announceToScreenReader(t('biometricAllow.a11y.scanning'))

    loadingTimerRef.current = setTimeout(() => {
      loadingTimerRef.current = null
      if (forceFail) {
        setSimulationPhase('failed')
        haptics.error()
        announceToScreenReader(t('biometricAllow.a11y.failed'))
      } else {
        setSimulationPhase('success')
        haptics.success()
        announceToScreenReader(t('biometricAllow.a11y.success'))
      }

      successTimerRef.current = setTimeout(() => {
        successTimerRef.current = null
        setSimulationPhase('idle')
        isSimulatingRef.current = false
      }, SUCCESS_HOLD_MS)
    }, LOADING_DURATION_MS)
  }

  const handleFingerprintTap = () => runSimulation(false)

  return (
    <Page safeBottom={false}>
      <Header title={t('biometricSettings.title')} showBack />

      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="bg-white rounded-xl border border-cream-400 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-charcoal-500">{t('biometricSettings.enableTitle')}</p>
              <p className="text-sm text-slate-500">{t('biometricSettings.enableSubtitle')}</p>
            </div>
            <Switch
              checked={biometricsEnabled}
              onChange={handleToggle}
              // Accessibility intent: clear announcement for assistive tech users.
              aria-label={biometricsEnabled ? t('disableBiometrics') : t('enableBiometrics')}
            />
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={handleFingerprintTap}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleFingerprintTap()
            }
          }}
          className={`rounded-xl p-8 flex flex-col items-center justify-center min-h-[140px] mb-6 cursor-pointer select-none transition-colors ${
            simulationPhase === 'success'
              ? 'bg-teal-50'
              : simulationPhase === 'failed'
                ? 'bg-red-50'
                : simulationPhase === 'loading'
                  ? 'bg-teal-50'
                  : 'bg-teal-50/70'
          }`}
          aria-label={t('biometricSettings.enableTitle')}
          aria-busy={simulationPhase === 'loading'}
          aria-live="polite"
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${
              simulationPhase === 'success'
                ? 'animate-success-spring'
                : simulationPhase === 'failed'
                  ? 'animate-shake-error'
                  : simulationPhase === 'loading'
                    ? 'animate-pulse-scan'
                    : ''
            }`}
          >
            {simulationPhase === 'success' ? (
              <svg
                className="w-12 h-12 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <IconFingerprint
                size={48}
                className={
                  simulationPhase === 'failed' ? 'text-red-500' : 'text-teal-600'
                }
                aria-hidden="true"
              />
            )}
          </div>
          <p className="text-sm text-slate-500 text-center">
            {simulationPhase === 'loading'
              ? t('biometricAllow.scanning')
              : simulationPhase === 'success'
                ? t('biometricAllow.success')
                : simulationPhase === 'failed'
                  ? t('biometricAllow.failed')
                  : t('biometricSettings.enableSubtitle')}
          </p>
        </div>

        <div className="mt-auto flex items-start gap-3 p-4 bg-cream-100 rounded-lg">
          <IconShieldCheck size={20} className="text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-slate-600">
            {t('biometricSettings.securityDisclaimer')}
          </p>
        </div>
      </div>

      <AllowBiometricsModal
        open={showAllowModal}
        onClose={handleAllowClose}
        onAllow={handleAllowConfirm}
      />

      <DisableBiometricsModal
        open={showDisableModal}
        onClose={handleDisableClose}
        onDisable={handleDisableConfirm}
      />
    </Page>
  )
}
