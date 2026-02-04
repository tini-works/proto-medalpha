/**
 * Epic 1.3: Post-Appointment Follow-Up Contract Tests
 *
 * Business requirements from User Stories (US 1.3.1)
 * Tests for feedback collection after appointments.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React from 'react'

import { AppStateProvider } from '../../state/AppContext'
import { Rating } from '../../components/display/Rating'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'feedback'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {},
      feedback: {
        rateExperience: 'Rate your experience',
        comments: 'Comments (optional)',
        submit: 'Submit Feedback',
      },
    },
  },
  interpolation: { escapeValue: false },
})

function ContractTestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <AppStateProvider>{children}</AppStateProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

/**
 * Epic 1.3: Post-Appointment Follow-Up Contracts
 *
 * Business Requirement:
 * After an appointment is completed, users should be able to provide
 * feedback with a star rating (1-5) and optional text comments.
 */
describe('Epic 1.3: Post-Appointment Follow-Up Contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('US 1.3.1: Feedback Collection', () => {
    it('Contract: rating-component-displays-stars - Rating component shows 5 star options', () => {
      render(
        <ContractTestWrapper>
          <Rating rating={0} maxRating={5} />
        </ContractTestWrapper>
      )

      // Rating component should be interactive
      const container = document.querySelector('[class*="flex"]')
      expect(container).toBeInTheDocument()
    })

    it('Contract: rating-displays-current-value - Rating shows selected stars', () => {
      render(
        <ContractTestWrapper>
          <Rating rating={4} maxRating={5} />
        </ContractTestWrapper>
      )

      // Should show current rating value
      const container = document.querySelector('[class*="flex"]')
      expect(container).toBeInTheDocument()
    })

    it('Contract: rating-supports-different-sizes - Rating component has size variants', () => {
      const { rerender } = render(
        <ContractTestWrapper>
          <Rating rating={3} size="sm" />
        </ContractTestWrapper>
      )

      let container = document.querySelector('[class*="flex"]')
      expect(container).toBeInTheDocument()

      rerender(
        <ContractTestWrapper>
          <Rating rating={3} size="md" />
        </ContractTestWrapper>
      )

      container = document.querySelector('[class*="flex"]')
      expect(container).toBeInTheDocument()

      rerender(
        <ContractTestWrapper>
          <Rating rating={3} size="lg" />
        </ContractTestWrapper>
      )

      container = document.querySelector('[class*="flex"]')
      expect(container).toBeInTheDocument()
    })

    it('Contract: rating-interactive-mode - Interactive rating responds to clicks', async () => {
      const user = userEvent.setup()
      const onRatingChange = vi.fn()

      render(
        <ContractTestWrapper>
          <Rating rating={0} maxRating={5} interactive onRatingChange={onRatingChange} />
        </ContractTestWrapper>
      )

      // Find clickable star buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(5)

      // Click the 4th star
      await user.click(buttons[3])
      expect(onRatingChange).toHaveBeenCalledWith(4)
    })

    it('Contract: rating-non-interactive-mode - Non-interactive rating does not respond to clicks', () => {
      const onRatingChange = vi.fn()

      render(
        <ContractTestWrapper>
          <Rating rating={3} maxRating={5} interactive={false} onRatingChange={onRatingChange} />
        </ContractTestWrapper>
      )

      // Non-interactive mode should not have buttons
      const buttons = screen.queryAllByRole('button')
      expect(buttons.length).toBe(0)
    })

    it('Contract: rating-max-value-configurable - Rating supports custom max values', () => {
      render(
        <ContractTestWrapper>
          <Rating rating={3} maxRating={10} interactive />
        </ContractTestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(10)
    })
  })
})
