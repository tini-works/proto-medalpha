import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { Button } from '../../components/ui'
import { Avatar } from '../../components/display/Avatar'
import { PATHS } from '../../routes'
import { IconMicrophone, IconSquare, IconMicrophoneOff } from '@tabler/icons-react'

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
    <Page safeBottom={false}>
      <Header title="Voice assistant" showBack />

      {/* Main content - flex column to push transcript to bottom */}
      <div className="flex flex-col min-h-[calc(100vh-180px)] px-4 py-6">
        {/* AI greeting at top */}
        <div className="flex items-start gap-3">
          <Avatar name="MedAlpha AI" size="md" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-teal-700">MedAlpha AI</p>
            <div className="mt-2 rounded-2xl rounded-tl-md bg-teal-500 text-white px-4 py-3 shadow-sm">
              <p className="text-sm font-medium">How can I help you today? Describe your symptoms or concerns.</p>
            </div>
          </div>
        </div>

        {/* Mic button - centered vertically in available space */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center justify-center">
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
              <IconMicrophone className="h-8 w-8" />
            </button>
            <p className="mt-4 text-xs font-semibold tracking-widest text-teal-700 uppercase">Listening...</p>
          </div>
        </div>

        {/* Real-time transcript card - at bottom of content */}
        <div className="bg-white rounded-2xl border border-cream-400 p-4 space-y-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <IconMicrophoneOff className="h-4 w-4 text-teal-600" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Real-time transcript</span>
            </div>
            <p className="mt-3 text-lg font-semibold text-charcoal-500">
              I'm looking for a{' '}
              <span className="text-teal-700">{transcript.split(' ').pop()}</span>
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-cream-200 pt-4">
            <Button variant="secondary" size="sm" type="button" className="text-sm">
              <span className="inline-flex items-center gap-2">
                <IconSquare className="h-4 w-4" />
                Stop
              </span>
            </Button>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span className="h-2 w-2 rounded-full bg-teal-600/40" />
              <span className="h-2 w-2 rounded-full bg-teal-600/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)}
          >
            Send
          </Button>
        </div>
      </div>
    </Page>
  )
}
