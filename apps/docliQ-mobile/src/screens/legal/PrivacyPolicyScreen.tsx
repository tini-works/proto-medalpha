import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { LegalFooter } from '../../components/legal'

/**
 * Privacy Policy screen - GDPR Art. 13-14 compliant.
 * Accessible without authentication per transparency requirements.
 */
export default function PrivacyPolicyScreen() {
  const { t } = useTranslation('legal')

  return (
    <Page safeBottom={false}>
      <Header title={t('privacy.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <p className="text-slate-600">{t('privacy.subtitle')}</p>
          <p className="text-xs text-slate-400 mt-1">
            {t('common.version', { version: '1.0.0' })} • {t('common.lastUpdated', { date: '29.01.2026' })}
          </p>
        </div>

        {/* Section 1: Data Controller */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.dataController.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('privacy.dataController.content')}
          </p>
        </section>

        {/* Section 2: Data Collected */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.dataCollected.title')}
          </h2>

          <div className="space-y-2">
            <h3 className="text-base font-medium text-charcoal-500">
              {t('privacy.dataCollected.personal.title')}
            </h3>
            <p className="text-sm text-slate-600">
              {t('privacy.dataCollected.personal.content')}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium text-charcoal-500">
              {t('privacy.dataCollected.health.title')}
            </h3>
            <p className="text-sm text-slate-600">
              {t('privacy.dataCollected.health.content')}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium text-charcoal-500">
              {t('privacy.dataCollected.usage.title')}
            </h3>
            <p className="text-sm text-slate-600">
              {t('privacy.dataCollected.usage.content')}
            </p>
          </div>
        </section>

        {/* Section 3: Legal Basis */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.legalBasis.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('privacy.legalBasis.content')}
          </p>
        </section>

        {/* Section 4: Your Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.yourRights.title')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('privacy.yourRights.content')}
          </p>

          <div className="bg-teal-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-slate-700">{t('privacy.yourRights.access')}</p>
            <p className="text-sm text-slate-700">{t('privacy.yourRights.rectification')}</p>
            <p className="text-sm text-slate-700">{t('privacy.yourRights.erasure')}</p>
            <p className="text-sm text-slate-700">{t('privacy.yourRights.restriction')}</p>
            <p className="text-sm text-slate-700">{t('privacy.yourRights.portability')}</p>
            <p className="text-sm text-slate-700">{t('privacy.yourRights.objection')}</p>
            <p className="text-sm text-slate-700">{t('privacy.yourRights.withdraw')}</p>
          </div>
        </section>

        {/* Section 5: Data Retention */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.retention.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('privacy.retention.content')}
          </p>
        </section>

        {/* Section 6: Data Transfers */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.transfers.title')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('privacy.transfers.content')}
          </p>
        </section>

        {/* Section 7: Security */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.security.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('privacy.security.content')}
          </p>
        </section>

        {/* Section 8: Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('privacy.contact.title')}
          </h2>

          <div className="bg-cream-100 rounded-lg p-4 space-y-3">
            <div>
              <h3 className="text-sm font-medium text-charcoal-500">
                {t('privacy.contact.dpo.title')}
              </h3>
              <p className="text-sm text-slate-600">
                {t('privacy.contact.dpo.content')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-charcoal-500">
                {t('privacy.contact.authority.title')}
              </h3>
              <p className="text-sm text-slate-600 whitespace-pre-line">
                {t('privacy.contact.authority.content')}
              </p>
            </div>
          </div>
        </section>

        <LegalFooter />
      </div>
    </Page>
  )
}
