import { Link, useNavigate } from 'react-router-dom'
import { Header, Page, TabBar, Avatar, Pill } from '../../components'
import { useProfile, useAuth, useAppState } from '../../state'
import { PATHS } from '../../routes'

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { signOut } = useAuth()
  const { resetAll } = useAppState()

  const handleSignOut = () => {
    if (window.confirm('Möchten Sie sich wirklich abmelden?')) {
      signOut()
      navigate(PATHS.AUTH_WELCOME)
    }
  }

  const handleResetAll = () => {
    if (window.confirm('Alle Ihre Daten werden gelöscht und Sie werden abgemeldet. Fortfahren?')) {
      resetAll()
      navigate(PATHS.AUTH_WELCOME)
    }
  }

  return (
    <Page>
      <Header title="Einstellungen" />

      <div className="px-4 py-6 space-y-6">
        {/* Profile card */}
        <Link
          to={PATHS.PROFILE_EDIT}
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
        >
          <Avatar name={profile.fullName || 'N'} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-neutral-900 truncate">{profile.fullName || 'Nutzer'}</h2>
            <p className="text-sm text-neutral-500 truncate">{profile.email}</p>
            {profile.insuranceType && (
              <div className="mt-1">
                <Pill tone={profile.insuranceType === 'GKV' ? 'info' : 'neutral'}>{profile.insuranceType}</Pill>
              </div>
            )}
          </div>
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Menu items */}
        <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100">
          <Link
            to={PATHS.PROFILE_FAMILY}
            className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Familienmitglieder</p>
                <p className="text-sm text-neutral-500">{profile.familyMembers.length} Mitglieder</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to={PATHS.SETTINGS_NOTIFICATIONS}
            className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Benachrichtigungen</p>
                <p className="text-sm text-neutral-500">Erinnerungen verwalten</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full py-3.5 px-4 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Abmelden
          </button>

          <button
            onClick={handleResetAll}
            className="w-full py-3.5 px-4 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            Alle Daten löschen
          </button>
        </div>

        {/* Version */}
        <p className="text-center text-sm text-neutral-400">MedAlpha N3 v1.0.0</p>
      </div>

      <TabBar />
    </Page>
  )
}
