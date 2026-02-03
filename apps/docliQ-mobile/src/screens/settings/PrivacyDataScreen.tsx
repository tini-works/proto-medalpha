import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconShield,
  IconDownload,
  IconShare2,
  IconChecks,
  IconCookie,
  IconFileText,
  IconScale,
  IconBuilding,
  IconSettings,
  IconTrash,
  IconClock,
} from '@tabler/icons-react'
import { Header, Page, SettingsListItem } from '../../components'
import { Button, ConfirmModal } from '../../components/ui'
import { DeleteWarningModal, PendingDeletionBanner } from '../../components/account'
import { useAppState } from '../../state'
import { PATHS } from '../../routes'
import { resetCookiePreferences } from '../../components/legal'

/**
 * Privacy & Data screen - GDPR compliance hub.
 * Central location for all privacy rights, legal documents, and data management.
 * Structured per GDPR Art. 12-22 requirements.
 */
export default function PrivacyDataScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('legal')
  const { t: tSettings } = useTranslation('settings')
  const { pendingDeletion, cancelDeletion, completeDeletion } = useAppState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const handleWarningContinue = () => {
    setShowDeleteModal(false)
    navigate(PATHS.SETTINGS_DELETE_EMAIL_CONFIRM)
  }

  const handleCancelDeletion = () => {
    setShowCancelModal(true)
  }

  const confirmCancelDeletion = () => {
    cancelDeletion()
    setShowCancelModal(false)
  }

  const handleSkipToDeletion = () => {
    completeDeletion()
    navigate(PATHS.AUTH_WELCOME)
  }

  const handleCookiePreferences = () => {
    // Reset to trigger banner
    resetCookiePreferences()
    window.location.reload()
  }

  return (
    <Page safeBottom={false}>
      <Header title={tSettings('privacyData')} showBack />

      {pendingDeletion && (
        <PendingDeletionBanner
          expiresAt={pendingDeletion.expiresAt}
          onCancel={handleCancelDeletion}
          onSkipToDeletion={handleSkipToDeletion}
        />
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Encryption status banner */}
        <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <IconShield size={20} className="text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-500">{tSettings('dataEncryptedBanner')}</h3>
            <p className="text-sm text-slate-600">{tSettings('allMedicalRecordsEncrypted')}</p>
          </div>
        </div>

        {/* YOUR RIGHTS (GDPR Art. 12-22) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('privacyHub.yourRights')}
            </h4>
            <span className="text-xs text-slate-400">({t('privacyHub.yourRightsGdpr')})</span>
          </div>
          <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
            <SettingsListItem
              icon={<IconDownload size={20} className="text-teal-600" />}
              title={t('privacyHub.downloadHealthData')}
              description={t('privacyHub.downloadHealthDataDesc')}
              onClick={() => navigate(PATHS.SETTINGS_PRIVACY_EXPORT)}
            />
            <SettingsListItem
              icon={<IconShare2 size={20} className="text-teal-600" />}
              title={t('privacyHub.dataSharing')}
              description={t('privacyHub.dataSharingDesc')}
              onClick={() => navigate(PATHS.SETTINGS_PRIVACY_SHARING)}
            />
            <SettingsListItem
              icon={<IconChecks size={20} className="text-teal-600" />}
              title={t('privacyHub.manageConsents')}
              description={t('privacyHub.manageConsentsDesc')}
              onClick={() => navigate(PATHS.SETTINGS_PRIVACY_CONSENTS)}
            />
            <SettingsListItem
              icon={<IconCookie size={20} className="text-teal-600" />}
              title={t('privacyHub.cookiePreferences')}
              description={t('privacyHub.cookiePreferencesDesc')}
              onClick={handleCookiePreferences}
            />
          </div>
        </div>

        {/* LEGAL DOCUMENTS */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {t('privacyHub.legalDocuments')}
          </h4>
          <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
            <SettingsListItem
              icon={<IconFileText size={20} className="text-teal-600" />}
              title={t('privacyHub.privacyPolicy')}
              onClick={() => navigate(PATHS.LEGAL_PRIVACY)}
            />
            <SettingsListItem
              icon={<IconScale size={20} className="text-teal-600" />}
              title={t('privacyHub.termsOfService')}
              onClick={() => navigate(PATHS.LEGAL_TERMS)}
            />
            <SettingsListItem
              icon={<IconBuilding size={20} className="text-teal-600" />}
              title={t('privacyHub.impressum')}
              onClick={() => navigate(PATHS.LEGAL_IMPRESSUM)}
            />
            <SettingsListItem
              icon={<IconCookie size={20} className="text-teal-600" />}
              title={t('privacyHub.cookiePolicy')}
              onClick={() => navigate(PATHS.LEGAL_COOKIES)}
            />
          </div>
        </div>

        {/* APP PERMISSIONS */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {t('privacyHub.appPermissions')}
          </h4>
          <div className="bg-white rounded-xl border border-cream-400">
            <SettingsListItem
              icon={<IconSettings size={20} className="text-teal-600" />}
              title={t('privacyHub.manageAppPermissions')}
              description={t('privacyHub.manageAppPermissionsDesc')}
              onClick={() => {
                // In a real app, this would open device settings
                alert('Opens device settings for app permissions')
              }}
            />
          </div>
        </div>

        {/* DANGER ZONE */}
        <div>
          <h4 className="text-xs font-semibold text-coral-500 uppercase tracking-wider mb-3">
            {t('privacyHub.dangerZone')}
          </h4>
          <div className="bg-white rounded-xl border border-coral-200">
            <div className="p-4">
              {pendingDeletion ? (
                <>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <IconClock size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-500">{t('deletePending.title')}</p>
                      <p className="text-sm text-slate-500">
                        {t('deleteEmail.explanation')}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleCancelDeletion}
                    variant="secondary"
                    fullWidth
                  >
                    {t('deletePending.cancelButton')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-coral-50 flex items-center justify-center flex-shrink-0">
                      <IconTrash size={20} className="text-coral-500" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-500">{t('privacyHub.deleteAccount')}</p>
                      <p className="text-sm text-slate-500" id="delete-account-warning">
                        {t('privacyHub.deleteAccountDesc')}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {t('privacyHub.deleteAccountWarning')}
                  </p>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    fullWidth
                    aria-describedby="delete-account-warning"
                  >
                    {t('privacyHub.deleteAccount')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Version footer */}
        <p className="text-center text-xs text-slate-400 uppercase tracking-wider">
          {tSettings('versionFooter')}
        </p>
      </div>

      {/* Delete Warning Modal */}
      <DeleteWarningModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onContinue={handleWarningContinue}
      />

      {/* Cancel Deletion Confirmation Modal */}
      <ConfirmModal
        open={showCancelModal}
        title={t('deleteCancel.title')}
        message={t('deleteCancel.message')}
        confirmLabel={t('deleteCancel.keepButton')}
        cancelLabel={t('deleteCancel.continueButton')}
        onConfirm={confirmCancelDeletion}
        onCancel={() => setShowCancelModal(false)}
      />
    </Page>
  )
}
