import { useState } from 'react'
import { Header, Page } from '../../components'

/**
 * FAQ screen with expandable accordion items.
 * Placeholder content for prototype demonstration.
 */

interface FAQItem {
  id: string
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I book an appointment?',
    answer:
      'You can book an appointment by navigating to the Home screen and tapping "Book Appointment". Follow the guided flow to select your specialty, location, doctor, and preferred time slot.',
  },
  {
    id: '2',
    question: 'Can I book appointments for family members?',
    answer:
      'Yes! You can add family members in Settings > Family Members. Once added, you can select them as the patient when booking an appointment.',
  },
  {
    id: '3',
    question: 'How do I cancel or reschedule an appointment?',
    answer:
      'Go to your appointment details from the Schedule tab. You\'ll find options to cancel or reschedule. Please note that some appointments may have cancellation policies.',
  },
  {
    id: '4',
    question: 'Is my health data secure?',
    answer:
      'Yes. All your medical records and personal data are encrypted with AES-256 encryption. We comply with GDPR and German health data security standards.',
  },
  {
    id: '5',
    question: 'How do I download my health records?',
    answer:
      'Go to Settings > Privacy & Data > Download Health Data. You can request a secure copy of your medical records which will be prepared and made available for download.',
  },
  {
    id: '6',
    question: 'What insurance types are supported?',
    answer:
      'DocliQ supports both GKV (statutory health insurance) and PKV (private health insurance). You can set your insurance type in your profile settings.',
  },
]

export default function FAQScreen() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <Page safeBottom={false}>
      <Header title="FAQs" showBack />

      <div className="px-4 py-6">
        <p className="text-sm text-slate-500 mb-6">Common questions and answers about using DocliQ.</p>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-cream-400 overflow-hidden">
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-cream-100 transition-colors"
              >
                <span className="font-medium text-charcoal-500 pr-4">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    expanded === item.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expanded === item.id && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}
