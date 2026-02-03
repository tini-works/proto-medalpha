/**
 * Epic 1.8: Additional Features Contract Tests
 *
 * Business requirements from User Stories (US 1.8.1 - US 1.8.3)
 * Tests for error handling, offline mode, and data consent.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React from 'react'

import { AppStateProvider } from '../../state/AppContext'
import { PATHS } from '../../routes/paths'
import { EmptyState } from '../../components/display/EmptyState'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'legal'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {
        retry: 'Retry',
        offline: 'Offline',
      },
      legal: {
        'consent.title': 'Consent Management',
        'consent.subtitle': 'Manage your data preferences',
        'consent.description': 'You can manage how we use your data below.',
        'consent.types.dataProcessing.title': 'Data Processing',
        'consent.types.dataProcessing.description': 'Required for app functionality',
        'consent.types.marketing.title': 'Marketing',
        'consent.types.marketing.description': 'Receive marketing communications',
        'consent.types.analytics.title': 'Analytics',
        'consent.types.analytics.description': 'Help us improve the app',
        'consent.types.thirdParty.title': 'Third Party Sharing',
        'consent.types.thirdParty.description': 'Share data with partners',
        'consent.history.title': 'Consent History',
        'consent.history.on': 'on {{date}}',
        'consent.history.granted': 'Granted',
        'consent.history.withdrawn': 'Withdrawn',
        'consent.withdraw.title': 'Withdraw Consent',
        'consent.withdraw.warning': 'This may affect app functionality',
        'consent.withdraw.confirm': 'Confirm Withdrawal',
      },
    },
  },
  interpolation: { escapeValue: false },
})

function ContractTestWrapper({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode
  initialEntries?: string[]
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppStateProvider>{children}</AppStateProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

/**
 * Epic 1.8: Additional Features Contracts
 */
describe('Epic 1.8: Additional Features Contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('US 1.8.1: Error Handling', () => {
    it('Contract: empty-state-renders - EmptyState component displays correctly', () => {
      render(
        <ContractTestWrapper>
          <EmptyState title="No results" description="Try adjusting your search" />
        </ContractTestWrapper>
      )

      expect(screen.getByText('No results')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your search')).toBeInTheDocument()
    })

    it('Contract: empty-state-with-action - EmptyState supports retry action', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()

      render(
        <ContractTestWrapper>
          <EmptyState
            title="Error loading"
            description="Something went wrong"
            action={
              <button onClick={onRetry} data-testid="retry-btn">
                Retry
              </button>
            }
          />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Error loading')).toBeInTheDocument()

      await user.click(screen.getByTestId('retry-btn'))
      expect(onRetry).toHaveBeenCalled()
    })

    it('Contract: empty-state-icons - EmptyState supports icon variants', () => {
      const icons = ['search', 'calendar', 'history', 'user'] as const

      icons.forEach((icon) => {
        const { unmount } = render(
          <ContractTestWrapper>
            <EmptyState title={`${icon} empty`} icon={icon} />
          </ContractTestWrapper>
        )

        expect(screen.getByText(`${icon} empty`)).toBeInTheDocument()
        unmount()
      })
    })

    it('Contract: empty-state-default-icon - EmptyState shows default icon when none specified', () => {
      render(
        <ContractTestWrapper>
          <EmptyState title="Default icon" />
        </ContractTestWrapper>
      )

      // Should render without error (uses default inbox icon)
      expect(screen.getByText('Default icon')).toBeInTheDocument()
    })
  })

  describe('US 1.8.2: Offline Mode (Path Configuration)', () => {
    it('Contract: history-path-defined - History screen path exists for cached appointments', () => {
      expect(PATHS.HISTORY).toBeDefined()
      expect(typeof PATHS.HISTORY).toBe('string')
    })

    it('Contract: appointment-detail-path-defined - Detail path exists for cached viewing', () => {
      expect(PATHS.APPOINTMENT_DETAIL).toBeDefined()
    })
  })

  describe('US 1.8.3: Granular Data Consent', () => {
    it('Contract: consent-screen-renders - Consent management screen loads', async () => {
      const { default: ConsentManagementScreen } = await import(
        '../../screens/settings/privacy/ConsentManagementScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.SETTINGS_PRIVACY_CONSENT || '/settings/privacy/consent']}>
          <Routes>
            <Route
              path={PATHS.SETTINGS_PRIVACY_CONSENT || '/settings/privacy/consent'}
              element={<ConsentManagementScreen />}
            />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </ContractTestWrapper>
      )

      // Verify consent screen renders
      await waitFor(() => {
        expect(screen.getByText('Data Processing')).toBeInTheDocument()
      })
    })

    it('Contract: consent-types-displayed - All consent types are shown', async () => {
      const { default: ConsentManagementScreen } = await import(
        '../../screens/settings/privacy/ConsentManagementScreen'
      )

      render(
        <ContractTestWrapper initialEntries={['/consent']}>
          <Routes>
            <Route path="/consent" element={<ConsentManagementScreen />} />
          </Routes>
        </ContractTestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Data Processing')).toBeInTheDocument()
      })

      expect(screen.getByText('Marketing')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Third Party Sharing')).toBeInTheDocument()
    })

    it('Contract: consent-required-marked - Required consent is marked', async () => {
      const { default: ConsentManagementScreen } = await import(
        '../../screens/settings/privacy/ConsentManagementScreen'
      )

      render(
        <ContractTestWrapper initialEntries={['/consent']}>
          <Routes>
            <Route path="/consent" element={<ConsentManagementScreen />} />
          </Routes>
        </ContractTestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument()
      })
    })

    it('Contract: consent-history-accessible - Consent history is accessible', async () => {
      const user = userEvent.setup()
      const { default: ConsentManagementScreen } = await import(
        '../../screens/settings/privacy/ConsentManagementScreen'
      )

      render(
        <ContractTestWrapper initialEntries={['/consent']}>
          <Routes>
            <Route path="/consent" element={<ConsentManagementScreen />} />
          </Routes>
        </ContractTestWrapper>
      )

      // Wait for screen to render
      await waitFor(() => {
        expect(screen.getByText('Data Processing')).toBeInTheDocument()
      })

      // Click history toggle
      const historyButton = screen.getByText('Consent History')
      await user.click(historyButton)

      // History should be visible (contains granted/withdrawn entries)
      await waitFor(() => {
        const historySection = document.querySelector('[class*="bg-cream-100"]')
        expect(historySection).toBeInTheDocument()
      })
    })
  })

  describe('Privacy Paths', () => {
    it('Contract: privacy-paths-defined - Privacy-related paths are configured', () => {
      expect(PATHS.SETTINGS_PRIVACY).toBeDefined()
      expect(PATHS.LEGAL_PRIVACY).toBeDefined()
      expect(PATHS.LEGAL_TERMS).toBeDefined()
    })
  })
})
