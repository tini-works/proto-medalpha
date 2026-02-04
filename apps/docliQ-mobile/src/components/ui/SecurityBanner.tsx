import { useTranslation } from 'react-i18next'
import { IconShieldCheck } from '@tabler/icons-react'

/**
 * Security banner displayed at the bottom of edit forms.
 * Reassures users that their data is encrypted and stored securely.
 */
export function SecurityBanner() {
  const { t } = useTranslation('settings')

  return (
    <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl">
      <IconShieldCheck size={24} className="text-teal-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-charcoal-500 leading-relaxed">
        {t('securityBanner')}
      </p>
    </div>
  )
}
