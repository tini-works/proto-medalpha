import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, Rating, Pill } from '../../components'
import { usePreferences } from '../../state'
import { apiGetDoctor } from '../../data'
import { PATHS } from '../../routes'
import { getLocale, type Language } from '../../utils'
import type { Doctor } from '../../types'

type SortOption = 'newest' | 'highest' | 'lowest'

type Review = {
  id: string
  dateISO: string
  rating: number
  title: string
  text: string
}

function formatReviewDate(dateISO: string, language: Language) {
  try {
    return new Date(dateISO).toLocaleDateString(getLocale(language), { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateISO
  }
}

function getMockReviews(doctorId: string): Review[] {
  const base = parseInt(doctorId.replace('d', ''), 10) || 1
  const today = new Date()
  const daysAgo = (n: number) => new Date(today.getTime() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return [
    {
      id: `${doctorId}-r1`,
      dateISO: daysAgo(7 + base),
      rating: 5,
      title: 'Clear and professional',
      text: 'Everything was explained clearly. The appointment started on time and I felt well cared for.',
    },
    {
      id: `${doctorId}-r2`,
      dateISO: daysAgo(21 + base),
      rating: 4,
      title: 'Good experience',
      text: 'Friendly staff and a thorough consultation. The waiting time was acceptable.',
    },
    {
      id: `${doctorId}-r3`,
      dateISO: daysAgo(35 + base),
      rating: 3,
      title: 'Okay overall',
      text: 'The visit was fine, but it felt a bit rushed. Would still come back if needed.',
    },
    {
      id: `${doctorId}-r4`,
      dateISO: daysAgo(60 + base),
      rating: 5,
      title: 'Highly recommended',
      text: 'Very attentive and helpful. I got clear next steps and helpful guidance.',
    },
  ]
}

export default function ReviewsScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { language } = usePreferences()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  useEffect(() => {
    if (!id) {
      navigate(PATHS.BOOKING_RESULTS)
      return
    }

    setLoading(true)
    apiGetDoctor(id)
      .then(setDoctor)
      .finally(() => setLoading(false))
  }, [id, navigate])

  const reviews = useMemo(() => (id ? getMockReviews(id) : []), [id])

  const sortedReviews = useMemo(() => {
    const copy = [...reviews]
    switch (sortBy) {
      case 'highest':
        return copy.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return copy.sort((a, b) => a.rating - b.rating)
      case 'newest':
      default:
        return copy.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
    }
  }, [reviews, sortBy])

  if (loading || !doctor) {
    return (
      <Page>
        <Header title={t('reviews')} showBack />
        <div className="p-4">
          <div className="h-40 bg-cream-200 rounded-xl animate-pulse" />
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <Header title={t('reviews')} subtitle={doctor.name} showBack />

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl border border-cream-400 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-600 mb-1">{t('overallRating')}</p>
              <Rating value={doctor.rating} reviewCount={doctor.reviewCount} />
            </div>
            <div className="flex items-center gap-2">
              <Pill tone="neutral" size="sm">
                {t('sort', { sortBy })}
              </Pill>
              <button
                onClick={() =>
                  setSortBy((prev) => (prev === 'newest' ? 'highest' : prev === 'highest' ? 'lowest' : 'newest'))
                }
                className="text-sm font-medium text-teal-700 hover:underline"
              >
                {t('changeSortOrder')}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-20">
          {sortedReviews.map((review) => (
            <article key={review.id} className="bg-white rounded-xl border border-cream-400 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-charcoal-500">{review.title}</p>
                  <p className="text-sm text-slate-500">{formatReviewDate(review.dateISO, language)}</p>
                </div>
                <Pill tone={review.rating >= 4 ? 'positive' : review.rating === 3 ? 'neutral' : 'negative'} size="sm">
                  {review.rating}/5
                </Pill>
              </div>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </Page>
  )
}

