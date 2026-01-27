import { useParams, useNavigate } from 'react-router-dom'
import { Page } from '../../components'
import { mockNewsArticles } from '../../data/newsfeed'
import { useState } from 'react'

function ArticleDetailScreen() {
  const { articleId } = useParams<{ articleId: string }>()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)

  // Find the article by ID
  const article = mockNewsArticles.find((a) => a.id === articleId)

  if (!article) {
    return (
      <Page>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-slate-500">Article not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-teal-700 font-medium hover:underline"
          >
            Go back
          </button>
        </div>
      </Page>
    )
  }

  // Format date as "Oct 24, 2023"
  const formattedDate = article.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Page>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-cream-300">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand"
            aria-label="Go back"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Text resize icon (visual only) */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand"
              aria-label="Text size"
            >
              <span className="text-lg font-bold text-slate-700">Tt</span>
            </button>

            {/* Bookmark icon */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand"
              aria-label="Save article"
            >
              <svg
                className={`w-5 h-5 transition-colors duration-normal ease-out-brand ${
                  isSaved ? 'text-teal-700' : 'text-slate-700'
                }`}
                fill={isSaved ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
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
              {article.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-500">
              {article.readTimeMinutes} min read
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
                Key Takeaway
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
                Related Topics
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
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Share</span>
        </button>

        {/* Save Article button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors duration-normal ease-out-brand">
          <svg
            className="w-5 h-5"
            fill={isSaved ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </Page>
  )
}

export default ArticleDetailScreen
