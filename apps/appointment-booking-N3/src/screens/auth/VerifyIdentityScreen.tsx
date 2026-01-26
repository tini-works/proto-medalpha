import { useNavigate } from 'react-router-dom'
import { Header, Page, ProgressIndicator } from '../../components'
import { PATHS } from '../../routes'

export default function VerifyIdentityScreen() {
  const navigate = useNavigate()

  const handleVerifyIdentity = () => {
    // Navigate to Complete Profile screen
    navigate(PATHS.PROFILE_COMPLETE)
  }

  const handleSkip = () => {
    // Navigate to Home, user remains unverified
    navigate(PATHS.HOME)
  }

  return (
    <Page safeBottom={false}>
      <Header title="Registration" showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Progress Indicator */}
        <div className="pb-2">
          <ProgressIndicator currentStep={2} totalSteps={3} variant="dots" showLabel={false} showPercentage={false} />
        </div>

        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-charcoal-500">Verify Identity</h1>
          <p className="text-sm text-slate-500">Step 2 of 3: Security Check</p>
        </div>

        {/* Document Illustration */}
        <div className="border-2 border-dashed border-cream-400 rounded-lg p-6 bg-cream-50">
          <div className="flex items-center justify-center mb-4">
            {/* eGK Card Illustration */}
            <div className="relative">
              {/* Background card */}
              <div className="absolute -right-2 top-2 w-32 h-20 bg-white rounded-lg border border-cream-400 opacity-50" />
              {/* Foreground card */}
              <div className="relative w-32 h-20 bg-white rounded-lg border-2 border-teal-500 flex items-center justify-between px-3">
                {/* Medical cross icon */}
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                {/* eGK text */}
                <div className="flex-1 ml-2">
                  <div className="text-xs font-semibold text-charcoal-500">eGK</div>
                  <div className="h-1 bg-cream-300 rounded mt-1" />
                  <div className="h-1 bg-cream-300 rounded mt-0.5 w-3/4" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">eGK or National ID Card required</p>
        </div>

        {/* Information Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-charcoal-500">Prepare your documents</h2>
          <p className="text-sm text-slate-500">
            To issue e-prescriptions and ensure maximum medical security, we need to verify your identity according to
            German healthcare regulations.
          </p>

          {/* Benefit Cards */}
          <div className="space-y-3">
            {/* End-to-End Encrypted Card */}
            <div className="bg-cream-50 rounded-lg p-4 border border-cream-400">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-1">End-to-End Encrypted</h3>
                  <p className="text-xs text-slate-500">Your data is processed via secure German servers.</p>
                </div>
              </div>
            </div>

            {/* Quick Process Card */}
            <div className="bg-cream-50 rounded-lg p-4 border border-cream-400">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-1">Quick Process</h3>
                  <p className="text-xs text-slate-500">The verification usually takes less than 2 minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            type="button"
            onClick={handleVerifyIdentity}
            className="w-full py-3.5 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
          >
            Verify Identity
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-3.5 px-4 text-slate-500 font-medium hover:bg-cream-200 rounded-lg transition-colors"
          >
            I'll do it later
          </button>
        </div>
      </div>
    </Page>
  )
}
