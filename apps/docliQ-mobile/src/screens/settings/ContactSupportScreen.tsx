import { useTranslation } from 'react-i18next'
import { IconMail, IconPhone, IconMessageCircle, IconChevronRight } from '@tabler/icons-react'
import { Header, Page } from '../../components'

/**
 * Contact Support screen with support channels.
 * Placeholder content for prototype demonstration.
 */
export default function ContactSupportScreen() {
  const { t } = useTranslation('settings')

  return (
    <Page safeBottom={false}>
      <Header title={t('contactSupport')} showBack />

      <div className="px-4 py-6 space-y-6">
        <p className="text-sm text-slate-500">{t('supportChannels')}</p>

        {/* Support channels */}
        <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
          {/* Email support */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-cream-100 transition-colors text-left">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <IconMail size={24} className="text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-500">{t('emailSupport')}</p>
              <p className="text-sm text-slate-500">{t('emailAddress')}</p>
            </div>
            <IconChevronRight size={20} className="text-slate-400" />
          </button>

          {/* Phone support */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-cream-100 transition-colors text-left">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <IconPhone size={24} className="text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-500">{t('phoneSupport')}</p>
              <p className="text-sm text-slate-500">{t('phoneNumber')}</p>
              <p className="text-xs text-slate-400">{t('phoneSupportHours')}</p>
            </div>
            <IconChevronRight size={20} className="text-slate-400" />
          </button>

          {/* Live chat */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-cream-100 transition-colors text-left">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <IconMessageCircle size={24} className="text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-500">{t('liveChat')}</p>
              <p className="text-sm text-slate-500">{t('chatWithTeam')}</p>
            </div>
            <IconChevronRight size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Additional info */}
        <div className="p-4 bg-cream-100 rounded-xl">
          <p className="text-sm text-slate-600">
            <span className="font-medium">{t('urgentMedical')}</span> {t('urgentMedicalText')}
          </p>
        </div>
      </div>
    </Page>
  )
}
