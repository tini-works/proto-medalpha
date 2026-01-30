import { useTranslation } from 'react-i18next'
import { IconBuilding, IconPhone, IconMail, IconWorld, IconUser, IconScale, IconCopyright } from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { LegalFooter } from '../../components/legal'

/**
 * Impressum (Legal Notice) screen - German TMG §5 required.
 * Must be accessible from every screen and without authentication.
 */
export default function ImpressumScreen() {
  const { t } = useTranslation('legal')

  return (
    <Page safeBottom={false}>
      <Header title={t('impressum.title')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <p className="text-slate-600">{t('impressum.subtitle')}</p>
        </div>

        {/* Company Information */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <IconBuilding size={18} className="text-teal-600" />
            <h2 className="text-lg font-semibold text-charcoal-500">
              {t('impressum.company.title')}
            </h2>
          </div>

          <div className="bg-cream-100 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-charcoal-500">
              {t('impressum.company.name')}
            </p>
            <p className="text-sm text-slate-600">
              {t('impressum.company.legalForm')}
            </p>
            <p className="text-sm text-slate-600 whitespace-pre-line mt-2">
              {t('impressum.company.address')}
            </p>
            <p className="text-sm text-slate-600 whitespace-pre-line mt-2">
              {t('impressum.company.register')}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              {t('impressum.company.vatId')}
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <IconPhone size={18} className="text-teal-600" />
            <h2 className="text-lg font-semibold text-charcoal-500">
              {t('impressum.contact.title')}
            </h2>
          </div>

          <div className="bg-white rounded-lg border border-cream-300 divide-y divide-cream-200">
            <div className="flex items-center gap-3 p-3">
              <IconPhone size={18} className="text-slate-400" />
              <span className="text-sm text-charcoal-500">
                {t('impressum.contact.phone')}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3">
              <IconMail size={18} className="text-slate-400" />
              <a
                href={`mailto:${t('impressum.contact.email')}`}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                {t('impressum.contact.email')}
              </a>
            </div>
            <div className="flex items-center gap-3 p-3">
              <IconWorld size={18} className="text-slate-400" />
              <span className="text-sm text-charcoal-500">
                {t('impressum.contact.website')}
              </span>
            </div>
          </div>
        </section>

        {/* Representatives */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <IconUser size={18} className="text-teal-600" />
            <h2 className="text-lg font-semibold text-charcoal-500">
              {t('impressum.representatives.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            {t('impressum.representatives.content')}
          </p>
        </section>

        {/* Regulatory Information */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <IconScale size={18} className="text-teal-600" />
            <h2 className="text-lg font-semibold text-charcoal-500">
              {t('impressum.regulatory.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {t('impressum.regulatory.content')}
          </p>
        </section>

        {/* Liability for Content */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-charcoal-500">
            {t('impressum.liability.title')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('impressum.liability.content')}
          </p>
        </section>

        {/* Copyright */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <IconCopyright size={18} className="text-teal-600" />
            <h2 className="text-lg font-semibold text-charcoal-500">
              {t('impressum.copyright.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            {t('impressum.copyright.content')}
          </p>
        </section>

        <LegalFooter />
      </div>
    </Page>
  )
}
