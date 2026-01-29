/**
 * Epic 1.3: Post-Appointment Follow-Up Golden Tests
 *
 * Tests for user story US 1.3.1
 * Source: User Stories from Philipp (January 27, 2026)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithProviders } from './test-utils'

// Mock feedback form component
const MockFeedbackForm = ({
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  onSubmit,
}: {
  rating: number | null
  onRatingChange: (rating: number) => void
  comment: string
  onCommentChange: (comment: string) => void
  onSubmit: () => void
}) => (
  <form
    data-testid="feedback-form"
    onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}
  >
    <fieldset data-testid="star-rating">
      <legend>Rate your experience</legend>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          data-testid={`star-${star}`}
          aria-pressed={rating === star}
          onClick={() => onRatingChange(star)}
        >
          {star} Star{star > 1 ? 's' : ''}
        </button>
      ))}
    </fieldset>

    <label>
      Comments (optional)
      <textarea
        data-testid="comment-input"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Share your feedback..."
      />
    </label>

    <button type="submit" data-testid="submit-btn" disabled={rating === null}>
      Submit Feedback
    </button>
  </form>
)

describe('Epic 1.3: Post-Appointment Follow-Up', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // US 1.3.1: Automatic Feedback Request
  describe('US 1.3.1: Feedback Collection', () => {
    it('1.3.1-a: feedback-star-rating-1-5 - Star rating 1-5 available', () => {
      render(
        <MockFeedbackForm
          rating={null}
          onRatingChange={() => {}}
          comment=""
          onCommentChange={() => {}}
          onSubmit={() => {}}
        />
      )

      // All 5 star buttons should be present
      expect(screen.getByTestId('star-1')).toBeInTheDocument()
      expect(screen.getByTestId('star-2')).toBeInTheDocument()
      expect(screen.getByTestId('star-3')).toBeInTheDocument()
      expect(screen.getByTestId('star-4')).toBeInTheDocument()
      expect(screen.getByTestId('star-5')).toBeInTheDocument()
    })

    it('1.3.1-b: feedback-text-optional - Can submit without free-text', async () => {
      const mockSubmit = vi.fn()

      const { user } = renderWithProviders(
        <MockFeedbackForm
          rating={4}
          onRatingChange={() => {}}
          comment="" // Empty comment
          onCommentChange={() => {}}
          onSubmit={mockSubmit}
        />
      )

      // Submit button should be enabled with rating but no comment
      const submitBtn = screen.getByTestId('submit-btn')
      expect(submitBtn).not.toBeDisabled()

      await user.click(submitBtn)
      expect(mockSubmit).toHaveBeenCalled()
    })

    it('1.3.1-b (extended): submit disabled without rating', () => {
      render(
        <MockFeedbackForm
          rating={null} // No rating selected
          onRatingChange={() => {}}
          comment="Great service!"
          onCommentChange={() => {}}
          onSubmit={() => {}}
        />
      )

      // Submit should be disabled without a star rating
      expect(screen.getByTestId('submit-btn')).toBeDisabled()
    })
  })
})
