import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, X, Send } from 'tabler-icons-react'
import { Button } from '../ui'
import type { Feedback } from '../../types'

interface FeedbackFormProps {
  appointmentId: string
  doctorName: string
  onSubmit: (feedback: { appointmentId: string; rating: number; comment?: string }) => Promise<void>
  onClose: () => void
  existingFeedback?: Feedback | null
}

export function FeedbackForm({ appointmentId, doctorName, onSubmit, onClose, existingFeedback }: FeedbackFormProps) {
  const { t } = useTranslation('feedback')
  const [rating, setRating] = useState(existingFeedback?.rating || 0)
  const [comment, setComment] = useState(existingFeedback?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setIsSubmitting(true)
    await onSubmit({ appointmentId, rating, comment: comment.trim() || undefined })
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-charcoal-500">{t('howWasYourVisit')}</h2>
        <button onClick={onClose} className="p-2 hover:bg-cream-100 rounded-full transition-colors">
          <X size={20} stroke={2} />
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-6">
        {t('rateYourExperienceWith', { doctorName })}
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="p-1 transition-transform hover:scale-110"
            aria-label={t('ratingStar', { star })}
          >
            <Star
              size={32}
              stroke={2}
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-cream-400'}
            />
          </button>
        ))}
      </div>

      {rating > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-charcoal-500 mb-2">
            {t('additionalComments')}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('feedbackPlaceholder')}
            className="w-full p-3 border border-cream-400 rounded-xl text-sm text-charcoal-500 placeholder:text-slate-400 resize-none"
            rows={3}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="tertiary" onClick={onClose} className="flex-1">
          {t('skip')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="flex-1"
        >
          <Send size={18} stroke={2} className="mr-2" />
          {isSubmitting ? t('submitting') : t('submitFeedback')}
        </Button>
      </div>
    </div>
  )
}

export default FeedbackForm
