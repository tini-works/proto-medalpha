import { Link } from 'react-router-dom'
import { PATHS } from '../../routes'

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header section - conservative, professional */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-14 h-14 bg-neutral-800 rounded-xl flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-neutral-900 text-center">MedAlpha</h1>
        <p className="mt-3 text-neutral-600 text-center max-w-xs leading-relaxed">
          Your platform for appointment booking, prescription management, and health services.
        </p>

        {/* Features - factual, trust-focused */}
        <div className="mt-10 space-y-5 w-full max-w-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">Appointment Booking</p>
              <p className="text-sm text-neutral-500 mt-0.5">Search and book doctor appointments</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
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
              <p className="font-medium text-neutral-900">Family Management</p>
              <p className="text-sm text-neutral-500 mt-0.5">Manage appointments for family members</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-neutral-900">Privacy & Security</p>
              <p className="text-sm text-neutral-500 mt-0.5">GDPR compliant and secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - conservative styling */}
      <div className="px-6 pb-8 space-y-3">
        <Link
          to={PATHS.AUTH_REGISTER}
          className="block w-full py-3.5 px-4 bg-neutral-800 text-white text-center font-medium rounded-lg hover:bg-neutral-900 transition-colors"
        >
          Register
        </Link>
        <Link
          to={PATHS.AUTH_SIGN_IN}
          className="block w-full py-3.5 px-4 bg-white text-neutral-800 text-center font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
