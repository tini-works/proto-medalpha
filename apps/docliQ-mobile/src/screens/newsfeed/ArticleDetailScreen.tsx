import { useParams, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconBookmark, IconBookmarkFilled, IconShare2 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Page } from '../../components'
import { Button } from '../../components/ui'
import { usePreferences } from '../../state'
import { PATHS } from '../../routes'
import { mockNewsArticles } from '../../data/newsfeed'
import { getLocale } from '../../utils'
import { useState } from 'react'

function ArticleDetailScreen() {
  const { articleId } = useParams<{ articleId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('notifications')
  const { language } = usePreferences()
  const [isSaved, setIsSaved] = useState(false)

  // Navigate back to News Feed tab in Updates screen
  const handleBack = () => {
    navigate(PATHS.NOTIFICATIONS, { state: { activeTab: 'newsfeed' } })
  }

  // Find the article by ID
  const article = mockNewsArticles.find((a) => a.id === articleId)

  if (!article) {
    return (
      <Page>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-slate-500">{t('article.notFound')}</p>
          <button
            onClick={handleBack}
            className="mt-4 text-teal-700 font-medium hover:underline"
          >
            {t('common.goBack')}
          </button>
        </div>
      </Page>
    )
  }

  // Format date using user's language preference
  const formattedDate = article.publishedAt.toLocaleDateString(getLocale(language), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const categoryKey = `category${article.category
    .toLowerCase()
    .replace(/(^|_)([a-z])/g, (_m, _p1, p2) => p2.toUpperCase())}`

  return (
    <Page>
      {/* Header */}
      <header className="sticky top-0 z-10 h-16 bg-white border-b border-cream-300">
        <div className="flex h-full items-center justify-between px-4">
          {/* Back button */}
          {/* Back button uses shared Button component with icon variant */}
          <Button
            variant="icon"
            size="sm"
            onClick={handleBack}
            className="-ml-2"
            aria-label={t('common.goBack')}
          >
            <IconArrowLeft className="w-6 h-6 text-slate-700" stroke={2} />
          </Button>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Text resize icon (visual only) */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand"
              aria-label={t('article.textSizeAria')}
            >
              <span className="text-lg font-bold text-slate-700">Tt</span>
            </button>

            {/* Bookmark icon */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand"
              aria-label={t('article.saveAria')}
            >
              {isSaved ? (
                <IconBookmarkFilled className="w-5 h-5 text-teal-700 transition-colors duration-normal ease-out-brand" stroke={2} />
              ) : (
                <IconBookmark className="w-5 h-5 text-slate-700 transition-colors duration-normal ease-out-brand" stroke={2} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pb-24">
        {/* Hero image */}
        <div className="h-64 overflow-hidden rounded-b-3xl">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article content */}
        <div className="px-4 pt-6">
          {/* Category badge and meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-700">
              {t(categoryKey, { defaultValue: article.category.replace(/_/g, ' ') })}
            </span>
            <span className="text-xs text-slate-500">
              {t('minRead', { count: article.readTimeMinutes })}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{formattedDate}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-charcoal-500 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 py-4 border-t border-b border-cream-300 mb-6">
            {article.author.avatarUrl && (
              <img
                src={article.author.avatarUrl}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-charcoal-500">{article.author.name}</p>
              <p className="text-xs text-slate-500">{article.author.title}</p>
            </div>
          </div>

          {/* Article body content */}
          <div className="prose prose-sm max-w-none mb-6 text-slate-700">
            {article.content.split('\n\n').map((paragraph, idx) => {
              // Handle headings marked with #
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0].length || 1
                const text = paragraph.replace(/^#+\s/, '')
                const headingClass =
                  level === 1
                    ? 'text-2xl'
                    : level === 2
                      ? 'text-xl'
                      : 'text-lg'
                return (
                  <h2
                    key={idx}
                    className={`${headingClass} font-bold text-charcoal-500 mb-3 mt-4`}
                  >
                    {text}
                  </h2>
                )
              }

              // Handle bullet points
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((line) => line.startsWith('- '))
                return (
                  <ul key={idx} className="list-disc list-inside mb-3 space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="text-slate-700">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                )
              }

              // Regular paragraph
              return (
                <p key={idx} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>

          {/* Key Takeaway callout box */}
          {article.keyTakeaway && (
            <div className="p-4 bg-teal-50 border-l-4 border-teal-700 rounded mb-6">
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">
                {t('article.keyTakeaway')}
              </p>
              <p className="text-sm text-teal-900 leading-relaxed">
                "{article.keyTakeaway}"
              </p>
            </div>
          )}

          {/* Related topics */}
          {article.relatedTopics.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                {t('article.relatedTopics')}
              </p>
              <div className="flex flex-wrap gap-2">
                {article.relatedTopics.map((topic) => (
                  <button
                    key={topic}
                    className="px-3 py-1 rounded-full bg-cream-200 text-slate-600 text-sm font-medium hover:bg-cream-300 transition-colors duration-normal ease-out-brand"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 flex items-center gap-3 max-w-md mx-auto">
        {/* Share button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors duration-normal ease-out-brand">
          <IconShare2 className="w-5 h-5" stroke={2} />
          <span>{t('article.share')}</span>
        </button>

        {/* Save Article button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors duration-normal ease-out-brand"
          aria-label={t('article.saveAria')}
        >
          {isSaved ? (
            <IconBookmarkFilled className="w-5 h-5" stroke={2} />
          ) : (
            <IconBookmark className="w-5 h-5" stroke={2} />
          )}
          <span>{isSaved ? t('article.saved') : t('article.save')}</span>
        </button>
      </div>
    </Page>
  )
}

export default ArticleDetailScreen
