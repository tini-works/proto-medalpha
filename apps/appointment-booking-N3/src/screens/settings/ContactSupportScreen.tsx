import { Header, Page } from '../../components'

/**
 * Contact Support screen with support channels.
 * Placeholder content for prototype demonstration.
 */
export default function ContactSupportScreen() {
  return (
    <Page safeBottom={false}>
      <Header title="Contact Support" showBack />

      <div className="px-4 py-6 space-y-6">
        <p className="text-sm text-slate-500">Get help from our team. We typically respond within 24 hours.</p>

        {/* Support channels */}
        <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-300">
          {/* Email support */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-cream-100 transition-colors text-left">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-500">Email Support</p>
              <p className="text-sm text-slate-500">support@docliq.de</p>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Phone support */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-cream-100 transition-colors text-left">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-500">Phone Support</p>
              <p className="text-sm text-slate-500">+49 30 1234 5678</p>
              <p className="text-xs text-slate-400">Mon-Fri, 9:00-18:00 CET</p>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Live chat */}
          <button className="w-full flex items-center gap-4 p-4 hover:bg-cream-100 transition-colors text-left">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-500">Live Chat</p>
              <p className="text-sm text-slate-500">Chat with our support team</p>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Additional info */}
        <div className="p-4 bg-cream-100 rounded-xl">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Urgent medical issues?</span> Please contact your local emergency services or
            visit the nearest hospital.
          </p>
        </div>
      </div>
    </Page>
  )
}
