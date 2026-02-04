import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconChevronRight,
  IconUser,
  IconMapPin,
  IconShieldCheck,
  IconUsers,
  IconLock,
  IconFingerprint,
  IconBell,
  IconGlobe,
  IconHelpCircle,
  IconMessage,
  IconBook,
  IconLogout,
} from '@tabler/icons-react'
import { Header, Page, TabBar, Avatar } from '../../components'
import { Button, ConfirmModal } from '../../components/ui'
import { useProfile, useAuth, usePreferences } from '../../state'
import { PATHS } from '../../routes'

/**
 * Profile Overview screen (redesigned Settings screen)
 * Organized into 4 sections:
 * - Profile Information
 * - Security Settings
 * - App Settings
 * - Support
 */
export default function SettingsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('settings')
  const { profile, updateProfile } = useProfile()
  const { signOut } = useAuth()
  const { language, biometricsEnabled } = usePreferences()
  const [showSignOutModal, setShowSignOutModal] = useState(false)

  const handleSignOut = () => {
    setShowSignOutModal(true)
  }

  const confirmSignOut = () => {
    signOut()
    navigate(PATHS.AUTH_WELCOME)
  }

  // Get localized language name
  const languageName = language === 'en' ? 'English' : 'Deutsch'

  // Insurance badge styling
  const insuranceBadgeStyle =
    profile.insuranceType === 'GKV'
      ? 'bg-teal-500 text-white'
      : profile.insuranceType === 'PKV'
        ? 'bg-coral-500 text-white'
        : 'bg-slate-200 text-slate-600'

  const insuranceLabel =
    profile.insuranceType === 'GKV'
      ? t('publicInsurance')
      : profile.insuranceType === 'PKV'
        ? t('privateInsurance')
        : t('noInsurance')

  return (
    <Page>
      <Header title={t('profileOverview')} />

      <div className="px-4 py-6 space-y-6">
        {/* User Identity Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            name={profile.fullName || 'User'}
            imageUrl={profile.photoUrl}
            size="xl"
            showEditOverlay
            onAvatarChange={(dataUrl) => updateProfile({ photoUrl: dataUrl })}
          />
          <h2 className="mt-4 text-lg font-semibold text-charcoal-500">
            {profile.fullName || 'User'}
          </h2>
          <p className="text-sm text-slate-500">{profile.email}</p>
          {profile.insuranceType && (
            <span
              className={`mt-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${insuranceBadgeStyle}`}
            >
              {insuranceLabel}
            </span>
          )}
        </div>

        {/* PROFILE INFORMATION */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {t('sections.profileInformation')}
          </h3>
          <div className="bg-white rounded-[20px] border border-cream-400 divide-y divide-cream-300">
            {/* Personal Information */}
            <Link
              to={PATHS.PROFILE_EDIT}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-t-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconUser size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('personalInformation')}</p>
                  <p className="text-sm text-slate-500">{t('personalInformationDesc')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Address */}
            <Link
              to={PATHS.SETTINGS_ADDRESS}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconMapPin size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('address')}</p>
                  <p className="text-sm text-slate-500">{t('addressDesc')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Insurance */}
            <Link
              to={PATHS.SETTINGS_INSURANCE}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconShieldCheck size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('insurance')}</p>
                  <p className="text-sm text-slate-500">{t('insuranceDesc')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Family Members */}
            <Link
              to={PATHS.PROFILE_FAMILY}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-b-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconUsers size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('familyMembers')}</p>
                  <p className="text-sm text-slate-500">{t('familyMembersDesc')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>
          </div>
        </section>

        {/* SECURITY SETTINGS */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {t('sections.securitySettings')}
          </h3>
          <div className="bg-white rounded-[20px] border border-cream-400 divide-y divide-cream-300">
            {/* Change Password */}
            <Link
              to={PATHS.SETTINGS_PASSWORD}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-t-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconLock size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('changePassword')}</p>
                  <p className="text-sm text-slate-500">{t('changePasswordDesc')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Biometrics */}
            <Link
              to={PATHS.SETTINGS_BIOMETRICS}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconFingerprint size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('biometrics')}</p>
                  <p className="text-sm text-slate-500">{t('biometricsDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-teal-600">
                  {biometricsEnabled ? t('biometricsOn') : t('biometricsOff')}
                </span>
                <IconChevronRight size={20} className="text-slate-400" />
              </div>
            </Link>

            {/* Privacy & Data */}
            <Link
              to={PATHS.SETTINGS_PRIVACY}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-b-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconShieldCheck size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('privacyData')}</p>
                  <p className="text-sm text-slate-500">{t('privacyDataDesc')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>
          </div>
        </section>

        {/* APP SETTINGS */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {t('sections.appSettings')}
          </h3>
          <div className="bg-white rounded-[20px] border border-cream-400 divide-y divide-cream-300">
            {/* Notifications */}
            <Link
              to={PATHS.SETTINGS_NOTIFICATIONS}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-t-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconBell size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('notifications')}</p>
                  <p className="text-sm text-slate-500">{t('notificationsDesc')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Language */}
            <Link
              to={PATHS.SETTINGS_LANGUAGE}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-b-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconGlobe size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('language')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-teal-600">{languageName}</span>
                <IconChevronRight size={20} className="text-slate-400" />
              </div>
            </Link>
          </div>
        </section>

        {/* SUPPORT */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {t('support')}
          </h3>
          <div className="bg-white rounded-[20px] border border-cream-400 divide-y divide-cream-300">
            {/* FAQs */}
            <Link
              to={PATHS.SETTINGS_FAQ}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-t-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconHelpCircle size={20} className="text-teal-600" />
                </div>
                <p className="font-medium text-charcoal-500">{t('faqs')}</p>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Contact Support */}
            <Link
              to={PATHS.SETTINGS_CONTACT}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconMessage size={20} className="text-teal-600" />
                </div>
                <p className="font-medium text-charcoal-500">{t('contactSupport')}</p>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Help Center */}
            <Link
              to={PATHS.SETTINGS_HELP}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors rounded-b-[20px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconBook size={20} className="text-teal-600" />
                </div>
                <p className="font-medium text-charcoal-500">{t('helpCenter')}</p>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>
          </div>
        </section>

        {/* Log Out button - Primary style */}
        <Button onClick={handleSignOut} fullWidth>
          <div className="flex items-center justify-center gap-2">
            <IconLogout size={20} />
            <span>{t('logOut')}</span>
          </div>
        </Button>

        {/* Version */}
        <p className="text-center text-sm text-slate-400">{t('versionFooter')}</p>
      </div>

      <TabBar />

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        open={showSignOutModal}
        title={t('signOut')}
        message={t('confirmSignOut')}
        confirmLabel={t('logOut')}
        cancelLabel={t('cancel')}
        onConfirm={confirmSignOut}
        onCancel={() => setShowSignOutModal(false)}
        variant="destructive"
      />
    </Page>
  )
}
