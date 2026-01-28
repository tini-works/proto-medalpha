import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'
import { FeaturedStory } from '../../types'
import { PATHS } from '../../routes'

interface FeaturedStoryCardProps {
  story: FeaturedStory
}

function FeaturedStoryCard({ story }: FeaturedStoryCardProps) {
  const { t } = useTranslation('notifications')
  return (
    <div className="mb-8 px-4">
      {/* Featured story section header */}
      <h2 className="text-base font-semibold text-charcoal-500 mb-4">{t('featuredStory')}</h2>

      {/* Featured card */}
      <Link
        to={`${PATHS.ARTICLE_DETAIL}`.replace(':articleId', story.id)}
        className="block rounded-2xl overflow-hidden bg-gray-200 hover:shadow-md transition-shadow duration-normal ease-out-brand group"
      >
        {/* Hero image container */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal ease-out-brand"
          />

          {/* "NEW" badge */}
          {story.isNew && (
            <div className="absolute top-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {t('new')}
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-5 bg-white">
          <h3 className="text-lg font-semibold text-charcoal-500 mb-2 group-hover:text-teal-700 transition-colors duration-normal ease-out-brand line-clamp-2">
            {story.title}
          </h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {story.description}
          </p>

          {/* Read Full Story link */}
          <div className="flex items-center gap-2 text-teal-700 font-medium text-sm">
            <span>{t('readFullStory')}</span>
            <IconChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-normal ease-out-brand" stroke={2} />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default FeaturedStoryCard
