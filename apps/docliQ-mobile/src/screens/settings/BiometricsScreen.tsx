import { useTranslation } from 'react-i18next'
import { IconFingerprint, IconFaceId } from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { usePreferences } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'

/**
 * Biometrics settings screen - placeholder for future implementation.
 * Shows toggle for FaceID/Fingerprint authentication.
 */
export default function BiometricsScreen() {
  const { t } = useTranslation('settings')
  const { biometricsEnabled, setBiometricsEnabled } = usePreferences()
  const { showToast } = useNotificationToast()

  const handleToggle = () => {
    setBiometricsEnabled(!biometricsEnabled)
    showToast({
      title: t('comingSoon'),
      type: 'info',
    })
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('biometrics')} showBack />

      <div className="flex-1 flex flex-col px-4 py-6">
        {/* Info section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
            <IconFaceId size={32} className="text-teal-600" />
          </div>
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
            <IconFingerprint size={32} className="text-teal-600" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-charcoal-500 mb-2">
          {t('biometricsTitle')}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {t('biometricsDescription')}
        </p>

        {/* Toggle card */}
        <div className="bg-white rounded-xl border border-cream-400 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-charcoal-500">{t('enableBiometrics')}</p>
              <p className="text-sm text-slate-500">{t('biometricsDesc')}</p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                biometricsEnabled ? 'bg-teal-500' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={biometricsEnabled}
              aria-label={biometricsEnabled ? t('disableBiometrics') : t('enableBiometrics')}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  biometricsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 p-3 bg-cream-100 rounded-lg">
          <p className="text-sm text-slate-600 text-center">
            {t('biometricsStatus')}: <span className="font-medium">{biometricsEnabled ? t('biometricsOn') : t('biometricsOff')}</span>
          </p>
        </div>
      </div>
    </Page>
  )
}
