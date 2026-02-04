import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { NewsArticle } from '../../types'
import { PATHS } from '../../routes'

interface NewsArticleCardProps {
  article: NewsArticle
}

// Map category to color for the badge
const categoryColors: Record<string, string> = {
  CARDIOLOGY: 'bg-blue-100 text-blue-700',
  NUTRITION: 'bg-green-100 text-green-700',
  MENTAL_HEALTH: 'bg-purple-100 text-purple-700',
  FITNESS: 'bg-orange-100 text-orange-700',
  GENERAL: 'bg-gray-100 text-gray-700',
}

// Map category to i18n keys
const categoryToI18nKey: Record<string, string> = {
  CARDIOLOGY: 'categoryCardiology',
  NUTRITION: 'categoryNutrition',
  MENTAL_HEALTH: 'categoryMentalHealth',
  FITNESS: 'categoryFitness',
  GENERAL: 'categoryGeneral',
}

function NewsArticleCard({ article }: NewsArticleCardProps) {
  const { t } = useTranslation('notifications')
  const categoryColor = categoryColors[article.category] || categoryColors.GENERAL

  // Format date with locale-aware formatting
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-US'
  const formattedDate = article.publishedAt.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link
      to={`${PATHS.ARTICLE_DETAIL}`.replace(':articleId', article.id)}
      className="flex gap-4 py-4 px-4 rounded-lg hover:bg-cream-100 transition-colors duration-normal ease-out-brand group"
    >
      {/* Thumbnail image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal ease-out-brand"
        />
      </div>

      {/* Content section */}
      <div className="flex-1 min-w-0">
        {/* Category badge */}
        <div className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide mb-2 ${categoryColor}`}>
          {t(categoryToI18nKey[article.category] || 'categoryGeneral')}
        </div>

        {/* Title - text-sm for compact card layout */}
        <h3 className="text-sm font-semibold text-charcoal-500 mb-1 line-clamp-2 group-hover:text-teal-700 transition-colors duration-normal ease-out-brand">
          {article.title}
        </h3>

        {/* Meta info */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{t('minRead', { count: article.readTimeMinutes })}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>

        {/* Read link */}
        <div className="mt-2">
          <span className="text-sm text-teal-700 font-medium group-hover:underline">
            {t('read')}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default NewsArticleCard
