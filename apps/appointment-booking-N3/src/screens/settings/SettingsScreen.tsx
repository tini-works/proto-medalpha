import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconChevronRight, IconUsers, IconGlobe, IconBell, IconLock, IconHelpCircle, IconMessage, IconBook, IconLogout } from '@tabler/icons-react'
import { Header, Page, TabBar, Avatar, Pill } from '../../components'
import { ConfirmModal } from '../../components/ui'
import { useProfile, useAuth, usePreferences } from '../../state'
import { PATHS } from '../../routes'

/**
 * Settings screen with grouped sections:
 * - Profile card
 * - Menu items (Family Members, Language, Notifications, Privacy & Data)
 * - Support section (FAQs, Contact Support, Help Centre)
 * - Log Out button
 * All text is translated using i18next and pulled from translation keys.
 */
export default function SettingsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('settings')
  const { profile } = useProfile()
  const { signOut } = useAuth()
  const { language } = usePreferences()
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

  return (
    <Page>
      <Header title={t('settings')} />

      <div className="px-4 py-6 space-y-6">
        {/* Profile card */}
        <Link
          to={PATHS.PROFILE_EDIT}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-cream-400 hover:bg-cream-100 transition-colors"
        >
          <Avatar name={profile.fullName || 'U'} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-charcoal-500 truncate">{profile.fullName || 'User'}</h2>
            <p className="text-sm text-slate-500 truncate">{profile.email}</p>
            {profile.insuranceType && (
              <div className="mt-1">
                <Pill tone={profile.insuranceType === 'GKV' ? 'info' : 'neutral'}>{profile.insuranceType}</Pill>
              </div>
            )}
          </div>
          <IconChevronRight size={20} className="text-slate-400" />
        </Link>

        {/* Menu items with teal icons */}
        <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
          {/* Family Members */}
          <Link
            to={PATHS.PROFILE_FAMILY}
            className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <IconUsers size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-charcoal-500">{t('familyMembers')}</p>
                <p className="text-sm text-slate-500">{t('linkedHealthAccounts')}</p>
              </div>
            </div>
            <IconChevronRight size={20} className="text-slate-400" />
          </Link>

          {/* Language */}
          <Link
            to={PATHS.SETTINGS_LANGUAGE}
            className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <IconGlobe size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-charcoal-500">{t('language')}</p>
                <p className="text-sm text-slate-500">{t('setAppLanguage')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-teal-600 font-medium">{languageName}</span>
              <IconChevronRight size={20} className="text-slate-400" />
            </div>
          </Link>

          {/* Notifications */}
          <Link
            to={PATHS.SETTINGS_NOTIFICATIONS}
            className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <IconBell size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-charcoal-500">{t('notifications')}</p>
                <p className="text-sm text-slate-500">{t('alertsAndReminders')}</p>
              </div>
            </div>
            <IconChevronRight size={20} className="text-slate-400" />
          </Link>

          {/* Privacy & Data */}
          <Link
            to={PATHS.SETTINGS_PRIVACY}
            className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <IconLock size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-charcoal-500">{t('privacyData')}</p>
                <p className="text-sm text-slate-500">{t('manageYourSecurity')}</p>
              </div>
            </div>
            <IconChevronRight size={20} className="text-slate-400" />
          </Link>
        </div>

        {/* Support section */}
        <div>
          <h3 className="text-sm font-semibold text-charcoal-500 mb-3">{t('support')}</h3>
          <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
            {/* FAQs */}
            <Link
              to={PATHS.SETTINGS_FAQ}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconHelpCircle size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('faqs')}</p>
                  <p className="text-sm text-slate-500">{t('commonQuestionsAnswers')}</p>
                </div>
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
                <div>
                  <p className="font-medium text-charcoal-500">{t('contactSupport')}</p>
                  <p className="text-sm text-slate-500">{t('getHelpFromTeam')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>

            {/* Help Centre */}
            <Link
              to={PATHS.SETTINGS_HELP}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <IconBook size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">{t('helpCentre')}</p>
                  <p className="text-sm text-slate-500">{t('browseGuidesAndTutorials')}</p>
                </div>
              </div>
              <IconChevronRight size={20} className="text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Log Out button */}
        <div className="bg-cream-100 rounded-xl">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-4 text-slate-600 font-medium hover:bg-cream-200 rounded-xl transition-colors"
          >
            <IconLogout size={20} />
            <span>{t('logOut')}</span>
          </button>
        </div>

        {/* Version */}
        <p className="text-center text-sm text-slate-400">DocliQ N3 v1.0.0</p>
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
