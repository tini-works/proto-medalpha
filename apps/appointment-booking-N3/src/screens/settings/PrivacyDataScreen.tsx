import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { useAppState } from '../../state'
import { PATHS } from '../../routes'

/**
 * Privacy & Data screen showing GDPR-compliant data management options.
 * Includes encryption status, data export, permissions, and data sharing controls.
 */
export default function PrivacyDataScreen() {
  const navigate = useNavigate()
  const { resetAll } = useAppState()

  const handleResetAll = () => {
    if (window.confirm('This will delete all your data and sign you out. Are you sure?')) {
      resetAll()
      navigate(PATHS.AUTH_WELCOME)
    }
  }

  return (
    <Page safeBottom={false}>
      <Header title="Privacy & Data" showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Encryption status banner */}
        <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-500">Data Encrypted</h3>
            <p className="text-sm text-slate-600">All medical records are stored with AES-256 encryption.</p>
          </div>
        </div>

        {/* Your Information section */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Information</h4>
          <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
            {/* Download Health Data */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-cream-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">Download Health Data</p>
                  <p className="text-sm text-slate-500">Request a secure copy of your medical records.</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Manage App Permissions */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-cream-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">Manage App Permissions</p>
                  <p className="text-sm text-slate-500">Control access to camera, mic, and health sensors.</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Data Sharing */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-cream-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-charcoal-500">Data Sharing</p>
                  <p className="text-sm text-slate-500">Manage which clinics and partners have access.</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Compliance section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            DocliQ complies with the General Data Protection Regulation (GDPR) and German health data security
            standards. You have the right to access, rectify, or delete your data at any time.
          </p>
          <button className="mt-3 text-sm font-medium text-teal-600 hover:text-teal-700">Read Privacy Policy</button>
        </div>

        {/* Reset All Data - destructive action */}
        <div className="pt-4 border-t border-cream-300">
          <button
            onClick={handleResetAll}
            className="w-full py-3.5 px-4 border border-red-300 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
          >
            Reset All Data
          </button>
          <p className="mt-2 text-xs text-center text-slate-500">
            This will permanently delete all your data and sign you out.
          </p>
        </div>

        {/* Version footer */}
        <p className="text-center text-xs text-slate-400 uppercase tracking-wider">Version 2.4.1 (Berlin, Germany)</p>
      </div>
    </Page>
  )
}
