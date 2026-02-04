import { useTranslation } from 'react-i18next'
import { IconCookie, IconLock, IconSettings, IconChartBar, IconSpeakerphone } from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { LegalFooter, resetCookiePreferences } from '../../components/legal'
import { Button } from '../../components/ui'

/**
 * Cookie Policy screen - TTDSG §25 compliant.
 * Explains cookie categories and provides link to manage preferences.
 */
export default function CookiePolicyScreen() {
  const { t } = useTranslation('legal')

  const handleManagePreferences = () => {
    // Reset preferences to trigger banner on next page load
    resetCookiePreferences()
    window.location.reload()
  }

  const categories = [
    {
      icon: <IconLock size={20} className="text-teal-600" />,
      key: 'essential',
      required: true,
    },
    {
      icon: <IconSettings size={20} className="text-teal-600" />,
      key: 'functional',
      required: false,
    },
    {
      icon: <IconChartBar size={20} className="text-teal-600" />,
      key: 'analytics',
      required: false,
    },
    {
      icon: <IconSpeakerphone size={20} className="text-teal-600" />,
      key: 'marketingEmails',
      required: false,
    },
  ] as const

  return (
    <Page safeBottom={false}>
      <Header title={t('cookies.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
            <IconCookie size={24} className="text-teal-600" />
          </div>
          <div>
            <p className="text-slate-600">{t('cookies.subtitle')}</p>
            <p className="text-xs text-slate-400 mt-1">
              {t('common.lastUpdated', { date: '29.01.2026' })}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <p className="text-sm text-slate-600">
          {t('cookies.intro')}
        </p>

        {/* Cookie Categories */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">
            Cookie Categories
          </h2>

          <div className="space-y-3">
            {categories.map(({ icon, key, required }) => (
              <div
                key={key}
                className="bg-white rounded-lg border border-cream-300 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-charcoal-500">
                        {t(`cookies.categories.${key}.title`)}
                      </h3>
                      {required && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {t(`cookies.categories.${key}.description`)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {t(`cookies.categories.${key}.examples`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TTDSG Compliance */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('cookies.ttdsg.title')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('cookies.ttdsg.content')}
          </p>
        </section>

        {/* Managing Preferences */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('cookies.manage.title')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('cookies.manage.content')}
          </p>

          <Button
            onClick={handleManagePreferences}
            variant="secondary"
            fullWidth
          >
            {t('cookies.banner.customize')}
          </Button>
        </section>

        <LegalFooter />
      </div>
    </Page>
  )
}
