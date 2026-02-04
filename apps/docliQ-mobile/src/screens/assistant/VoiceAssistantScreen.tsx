import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, StickyActionBar } from '../../components'
import { Button } from '../../components/ui'
import { Avatar } from '../../components/display/Avatar'
import { PATHS } from '../../routes'
import { IconMicrophone, IconSquare, IconMicrophoneOff } from '@tabler/icons-react'

export default function VoiceAssistantScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const [transcript, setTranscript] = useState(t('assistant.voice.sampleTranscript'))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTranscript((prev) => (prev.endsWith('...') ? prev : `${prev}...`))
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Page safeBottom={false}>
      <Header title={t('assistant.voice.title')} showBack />

      {/* Main content - flex column to push transcript to bottom */}
      <div className="flex flex-col min-h-[calc(100vh-180px)] px-4 py-6">
        {/* AI greeting at top */}
        <div className="flex items-start gap-3">
          <Avatar name={t('assistant.voice.aiName')} size="md" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-teal-700">{t('assistant.voice.aiName')}</p>
            <div className="mt-2 rounded-2xl rounded-tl-md bg-teal-500 text-white px-4 py-3 shadow-sm">
              <p className="text-sm font-medium">{t('assistant.voice.greeting')}</p>
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
              aria-label={t('assistant.voice.startVoiceInputAria')}
            >
              <IconMicrophone className="h-8 w-8" />
            </button>
            <p className="mt-4 text-xs font-semibold tracking-widest text-teal-700 uppercase">{t('assistant.voice.listening')}</p>
          </div>
        </div>

        {/* Real-time transcript card - at bottom of content */}
        <div className="bg-white rounded-2xl border border-cream-400 p-4 space-y-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <IconMicrophoneOff className="h-4 w-4 text-teal-600" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">{t('assistant.voice.realtimeTranscript')}</span>
            </div>
            <p className="mt-3 text-lg font-semibold text-charcoal-500">
              {t('assistant.voice.transcriptPrefix')}{' '}
              <span className="text-teal-700">{transcript.split(' ').pop()}</span>
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-cream-200 pt-4">
            <Button variant="secondary" size="sm" type="button" className="text-sm">
              <span className="inline-flex items-center gap-2">
                <IconSquare className="h-4 w-4" />
                {t('assistant.voice.stop')}
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
      <StickyActionBar>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)}
        >
          {t('assistant.voice.send')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}
