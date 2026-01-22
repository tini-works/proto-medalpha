import { Link } from 'react-router-dom'
import { Page } from '../../components'
import { PATHS } from '../../routes'

export default function SuccessScreen() {
  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Success icon - neutral, not celebratory */}
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-2">Appointment Booked</h1>
        <p className="text-neutral-600 mb-8 max-w-xs leading-relaxed">
          Your appointment has been successfully submitted. A confirmation will be sent via email.
        </p>

        {/* Calendar sync option */}
        <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors mb-8">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Add to Calendar
        </button>

        {/* Actions - conservative styling */}
        <div className="w-full space-y-3">
          <Link
            to={PATHS.HISTORY}
            className="block w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors text-center"
          >
            View Appointments
          </Link>

          <Link
            to={PATHS.HOME}
            className="block w-full py-3.5 px-4 bg-white text-neutral-800 font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Page>
  )
}
