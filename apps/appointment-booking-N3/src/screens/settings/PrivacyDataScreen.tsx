import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Shield,
  Download,
  Settings,
  Share2,
  CircleHelp,
  ChevronRight,
} from '@tabler/icons-react'
import { Header, Page } from '../../components'
import { Button } from '../../components/ui'
import { useAppState } from '../../state'
import { PATHS } from '../../routes'

/**
 * Privacy & Data screen showing GDPR-compliant data management options.
 * Includes encryption status, data export, permissions, and data sharing controls.
 */
export default function PrivacyDataScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('settings')
  const { resetAll } = useAppState()

  const handleResetAll = () => {
    if (window.confirm(t('resetAllDataConfirm'))) {
      resetAll()
      navigate(PATHS.AUTH_WELCOME)
    }
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('privacyData')} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Encryption status banner */}
        <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-500">{t('dataEncryptedBanner')}</h3>
            <p className="text-sm text-slate-600">{t('allMedicalRecordsEncrypted')}</p>
          </div>
        </div>

        {/* Your Information section */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('yourInformation')}</h4>
          <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
            {/* Download Health Data */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-cream-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Download size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('downloadHealthData')}</p>
                  <p className="text-sm text-slate-500">{t('requestSecureCopy')}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
            </button>

            {/* Manage App Permissions */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-cream-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Settings size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('manageAppPermissions')}</p>
                  <p className="text-sm text-slate-500">{t('controlAccess')}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
            </button>

            {/* Data Sharing */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-cream-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Share2 size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('dataSharing')}</p>
                  <p className="text-sm text-slate-500">{t('manageAccess')}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Compliance section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CircleHelp size={16} className="text-teal-600" />
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('compliance')}</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('complianceText')}
          </p>
          <button className="mt-3 text-sm font-medium text-teal-600 hover:text-teal-700">{t('readPrivacyPolicy')}</button>
        </div>

        {/* Reset All Data - destructive action */}
        <div className="pt-4 border-t border-cream-300">
          <Button
            onClick={handleResetAll}
            variant="destructive"
            fullWidth
          >
            {t('resetAllData')}
          </Button>
          <p className="mt-2 text-xs text-center text-slate-500">
            {t('resetAllDataWarning')}
          </p>
        </div>

        {/* Version footer */}
        <p className="text-center text-xs text-slate-400 uppercase tracking-wider">{t('versionFooter')}</p>
      </div>
    </Page>
  )
}
