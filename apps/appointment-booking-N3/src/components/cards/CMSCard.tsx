import type { CMSContent } from '../../types'
import { Pill } from '../display/Pill'

interface CMSCardProps {
  content: CMSContent
  onClick?: () => void
}

const typeLabels: Record<CMSContent['type'], string> = {
  deal: 'Angebot',
  'health-tip': 'Gesundheitstipp',
  payback: 'PAYBACK',
  announcement: 'Neuigkeiten',
}

// Conservative: use neutral tones for CMS content, no green for promotional content
const typeTones: Record<CMSContent['type'], 'info' | 'warning' | 'neutral'> = {
  deal: 'info',
  'health-tip': 'info',
  payback: 'warning',
  announcement: 'neutral',
}

export function CMSCard({ content, onClick }: CMSCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all"
    >
      {content.imageUrl && (
        <img
          src={content.imageUrl}
          alt=""
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">{content.title}</h3>
        <Pill tone={typeTones[content.type]} size="sm">
          {typeLabels[content.type]}
        </Pill>
      </div>
      <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{content.description}</p>
      {content.link && (
        <span className="mt-2 inline-flex items-center text-sm text-neutral-700 font-medium">
          Mehr erfahren
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </button>
  )
}
