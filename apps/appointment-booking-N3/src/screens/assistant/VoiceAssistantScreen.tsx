import { Header, Page } from '../../components'

export default function VoiceAssistantScreen() {
  return (
    <Page>
      <Header title="Voice assistant" showBack />
      <div className="px-4 py-6 space-y-3">
        <div className="bg-white rounded-xl border border-cream-400 p-4">
          <p className="font-semibold text-charcoal-500">Coming soon</p>
          <p className="text-sm text-slate-600 mt-2">
            Voice input isn’t enabled in this prototype yet. You can use the chat assistant for navigation help.
          </p>
        </div>
      </div>
    </Page>
  )
}

