import { useTranslation } from 'react-i18next'
import { NewsArticle } from '../../types'
import NewsArticleCard from './NewsArticleCard'

interface LatestNewsSectionProps {
  articles: NewsArticle[]
}

function LatestNewsSection({ articles }: LatestNewsSectionProps) {
  const { t } = useTranslation('home')
  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-semibold text-charcoal-500">{t('latestHealthNews')}</h2>
      </div>

      {/* Articles list */}
      <div className="space-y-2">
        {articles.map((article) => (
          <NewsArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load more button */}
      <div className="flex justify-center mt-6">
        <button className="px-6 py-2 text-sm font-medium text-teal-700 border border-teal-700 rounded-lg hover:bg-teal-50 transition-colors duration-normal ease-out-brand">
          {t('loadMore')}
        </button>
      </div>
    </div>
  )
}

export default LatestNewsSection
