import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { PATHS } from '../../routes'

type Message = { role: 'user' | 'assistant'; content: string }

export default function AssistantScreen() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi — I can help you navigate appointments and booking. I can’t provide medical diagnosis. How can I help?",
    },
  ])

  const quickActions = useMemo(
    () => [
      { label: 'Book an appointment', onClick: () => navigate(PATHS.BOOKING_SEARCH) },
      { label: 'My appointments', onClick: () => navigate(PATHS.HISTORY) },
      { label: 'Voice assistant', onClick: () => navigate(PATHS.ASSISTANT_VOICE) },
    ],
    [navigate]
  )

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')

    // Stubbed assistant response (no external calls / no PHI storage).
    const response =
      text.toLowerCase().includes('reschedule') || text.toLowerCase().includes('change')
        ? 'To reschedule: open “My appointments”, pick an upcoming appointment, then tap “Reschedule”.'
        : text.toLowerCase().includes('book again') || text.toLowerCase().includes('rebook')
          ? 'To book again: open “My appointments” → “Past”, then tap “Book again”.'
          : 'I can help with booking, rescheduling, or finding your appointment history. Try one of the buttons below.'

    setMessages((prev) => [...prev, { role: 'assistant', content: response }])
  }

  return (
    <Page>
      <Header title="Assistant" showBack />

      <div className="px-4 py-4 space-y-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
          This assistant is for navigation help. It is not medical advice. Avoid sharing sensitive health details.
        </div>

        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-cream-300 text-charcoal-500'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="px-3 py-2 rounded-full bg-white border border-cream-400 text-sm font-medium text-charcoal-500 hover:bg-cream-50"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md flex gap-2 items-end">
          <div className="flex-1 bg-cream-100 border border-cream-300 rounded-2xl px-3 py-2">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none leading-5"
              rows={1}
              placeholder="Ask about booking, rescheduling…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Page>
  )
}

