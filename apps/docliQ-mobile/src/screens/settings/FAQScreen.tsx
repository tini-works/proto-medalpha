import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronDown } from '@tabler/icons-react'
import { Header, Page } from '../../components'

/**
 * FAQ screen with expandable accordion items.
 * Questions and answers are loaded from i18n settings namespace.
 */

interface FAQItem {
  id: string
  question: string
  answer: string
}

export default function FAQScreen() {
  const { t } = useTranslation('settings')
  const [expanded, setExpanded] = useState<string | null>(null)

  // Load FAQ items from i18n keys
  const FAQ_ITEMS: FAQItem[] = [
    {
      id: '1',
      question: t('faq_question_1'),
      answer: t('faq_answer_1'),
    },
    {
      id: '2',
      question: t('faq_question_2'),
      answer: t('faq_answer_2'),
    },
    {
      id: '3',
      question: t('faq_question_3'),
      answer: t('faq_answer_3'),
    },
    {
      id: '4',
      question: t('faq_question_4'),
      answer: t('faq_answer_4'),
    },
    {
      id: '5',
      question: t('faq_question_5'),
      answer: t('faq_answer_5'),
    },
    {
      id: '6',
      question: t('faq_question_6'),
      answer: t('faq_answer_6'),
    },
  ]

  const toggle = (id: string) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('faqs')} showBack />

      <div className="px-4 py-6">
        <p className="text-sm text-slate-500 mb-6">{t('faqIntro')}</p>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-cream-400 overflow-hidden">
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-cream-100 transition-colors"
              >
                <span className="font-medium text-charcoal-500 pr-4">{item.question}</span>
                <IconChevronDown
                  size={20}
                  className={`text-slate-400 flex-shrink-0 transition-transform ${
                    expanded === item.id ? 'rotate-180' : ''
                  }`}
                />
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
