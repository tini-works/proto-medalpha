import { useTranslation } from 'react-i18next'
import { ShortGuide } from '../../types'

interface ShortGuidesSectionProps {
  guides: ShortGuide[]
}

function ShortGuidesSection({ guides }: ShortGuidesSectionProps) {
  const { t } = useTranslation('notifications')
  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-semibold text-charcoal-500">{t('shortGuides')}</h2>
      </div>

      {/* Horizontal scrolling cards container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-4" style={{ minWidth: 'min-content' }}>
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden bg-gray-200 relative group cursor-pointer transition-transform duration-normal ease-out-brand hover:scale-105"
            >
              {/* Guide card with image background */}
              <img
                src={guide.imageUrl}
                alt={guide.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Title at bottom */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-3">
                <h3 className="text-white text-sm font-semibold text-center line-clamp-2">
                  {guide.title}
                </h3>
              </div>

              {/* Play icon badge - top right (if video) */}
              {guide.hasVideo && (
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar styling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default ShortGuidesSection
