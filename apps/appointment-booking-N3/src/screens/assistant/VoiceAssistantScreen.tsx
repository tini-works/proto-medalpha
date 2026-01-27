import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { Avatar } from '../../components/display/Avatar'
import { PATHS } from '../../routes'

export default function VoiceAssistantScreen() {
  const navigate = useNavigate()
  const [transcript, setTranscript] = useState("I'm looking for a dermatol")

  useEffect(() => {
    const timer = setTimeout(() => {
      setTranscript((prev) => (prev.endsWith('...') ? prev : `${prev}...`))
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Page>
      <Header title="Voice assistant" showBack />
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-start gap-3">
          <Avatar name="MedAlpha AI" size="md" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-teal-700">MedAlpha AI</p>
            <div className="mt-2 rounded-2xl rounded-tl-md bg-teal-500 text-white px-4 py-3 shadow-sm">
              <p className="text-sm font-medium">How can I help you today? Describe your symptoms or concerns.</p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center py-6">
          <span className="absolute h-24 w-24 rounded-full border border-teal-200 animate-location-pulse" />
          <span
            className="absolute h-32 w-32 rounded-full border border-teal-100 animate-location-pulse"
            style={{ animationDelay: '0.6s' }}
          />
          <button
            type="button"
            className="relative z-10 h-20 w-20 rounded-full bg-teal-500 text-white shadow-lg flex items-center justify-center active:scale-[0.98] transition-transform duration-normal ease-out-brand"
            aria-label="Start voice input"
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5a2 2 0 00-2 2v4a2 2 0 104 0V7a2 2 0 00-2-2z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 11a6 6 0 0012 0" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21h6" />
            </svg>
          </button>
          <p className="mt-4 text-xs font-semibold tracking-widest text-teal-700 uppercase">Listening...</p>
        </div>

        <div className="bg-white rounded-2xl border border-cream-400 p-4 space-y-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <svg className="h-4 w-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5a3 3 0 00-3 3v2a3 3 0 006 0V8a3 3 0 00-3-3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10a7 7 0 01-14 0" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v3" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wider">Real-time transcript</span>
            </div>
            <p className="mt-3 text-lg font-semibold text-charcoal-500">
              I'm looking for a{' '}
              <span className="text-teal-700">{transcript.split(' ').pop()}</span>
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-cream-200 pt-4">
            <button type="button" className="btn btn-secondary h-10 px-4 py-0 text-sm">
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12v12H6z" />
                </svg>
                Stop
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span className="h-2 w-2 rounded-full bg-teal-600/40" />
              <span className="h-2 w-2 rounded-full bg-teal-600/20" />
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-primary btn-block h-14" onClick={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)}>
          Send -&gt;
        </button>
      </div>
    </Page>
  )
}
