import { Link, useNavigate } from 'react-router-dom'
import { Header, Page, TabBar, Avatar, Pill } from '../../components'
import { useProfile, useAuth } from '../../state'
import { PATHS } from '../../routes'

/**
 * Settings screen with grouped sections:
 * - Profile card
 * - Menu items (Family Members, Language, Notifications, Privacy & Data)
 * - Support section (FAQs, Contact Support, Help Centre)
 * - Log Out button
 */
export default function SettingsScreen() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { signOut } = useAuth()

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      signOut()
      navigate(PATHS.AUTH_WELCOME)
    }
  }

  return (
    <Page>
      <Header title="Settings" />

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
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-charcoal-500">Family Members</p>
                <p className="text-sm text-slate-500">Linked health accounts</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Language */}
          <Link
            to={PATHS.SETTINGS_LANGUAGE}
            className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-charcoal-500">Language</p>
                <p className="text-sm text-slate-500">Set app language</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-teal-600 font-medium">English</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Notifications */}
          <Link
            to={PATHS.SETTINGS_NOTIFICATIONS}
            className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-charcoal-500">Notifications</p>
                <p className="text-sm text-slate-500">Alerts and reminders</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Privacy & Data */}
          <Link
            to={PATHS.SETTINGS_PRIVACY}
            className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-charcoal-500">Privacy & Data</p>
                <p className="text-sm text-slate-500">Manage your security</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Support section */}
        <div>
          <h3 className="text-sm font-semibold text-charcoal-500 mb-3">Support</h3>
          <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
            {/* FAQs */}
            <Link
              to={PATHS.SETTINGS_FAQ}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">FAQs</p>
                  <p className="text-sm text-slate-500">Common questions and answers</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Contact Support */}
            <Link
              to={PATHS.SETTINGS_CONTACT}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">Contact Support</p>
                  <p className="text-sm text-slate-500">Get help from our team</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Help Centre */}
            <Link
              to={PATHS.SETTINGS_HELP}
              className="flex items-center justify-between p-4 hover:bg-cream-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">Help Centre</p>
                  <p className="text-sm text-slate-500">Browse guides and tutorials</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Log Out button */}
        <div className="bg-cream-100 rounded-xl">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-4 text-slate-600 font-medium hover:bg-cream-200 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Log Out</span>
          </button>
        </div>

        {/* Version */}
        <p className="text-center text-sm text-slate-400">DocliQ N3 v1.0.0</p>
      </div>

      <TabBar />
    </Page>
  )
}
