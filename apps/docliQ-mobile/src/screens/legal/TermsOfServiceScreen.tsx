import { useTranslation } from 'react-i18next'
import { Header, Page } from '../../components'
import { LegalFooter } from '../../components/legal'

/**
 * Terms of Service (AGB) screen.
 * Accessible without authentication.
 */
export default function TermsOfServiceScreen() {
  const { t } = useTranslation('legal')

  return (
    <Page safeBottom={false}>
      <Header title={t('terms.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <p className="text-slate-600">{t('terms.subtitle')}</p>
          <p className="text-xs text-slate-400 mt-1">
            {t('common.version', { version: '1.0.0' })} • {t('common.lastUpdated', { date: '29.01.2026' })}
          </p>
        </div>

        {/* Section 1: Scope */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('terms.scope.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('terms.scope.content')}
          </p>
        </section>

        {/* Section 2: Services */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('terms.services.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('terms.services.content')}
          </p>
        </section>

        {/* Section 3: User Obligations */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('terms.obligations.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('terms.obligations.content')}
          </p>
        </section>

        {/* Section 4: Liability */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('terms.liability.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('terms.liability.content')}
          </p>
        </section>

        {/* Section 5: Termination */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('terms.termination.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('terms.termination.content')}
          </p>
        </section>

        {/* Section 6: Disputes */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('terms.disputes.title')}
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('terms.disputes.content')}
          </p>
        </section>

        <LegalFooter />
      </div>
    </Page>
  )
}
