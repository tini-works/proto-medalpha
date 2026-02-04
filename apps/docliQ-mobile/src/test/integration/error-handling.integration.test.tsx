/**
 * Error Handling Integration Tests
 *
 * Tests error handling patterns across the app:
 * - API error simulation
 * - Missing data handling
 * - Network/offline scenarios
 * - Graceful degradation
 *
 * HIGH priority - ensures errors are handled gracefully.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState, useEffect } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'

import { simulateApiDelay, simulateApiError } from '../../data/api'
import { EmptyState } from '../../components/display/EmptyState'
import { AppStateProvider } from '../../state/AppContext'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'booking', 'appointments'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {
        'error.generic': 'Something went wrong',
        'error.network': 'Network error',
        'error.notFound': 'Not found',
        'retry': 'Try again',
      },
      booking: {},
      appointments: {},
    },
  },
  interpolation: { escapeValue: false },
})

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <AppStateProvider>{children}</AppStateProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('Error Handling Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('API Error Simulation', () => {
    it('simulateApiDelay resolves with data after delay', async () => {
      const data = { id: 1, name: 'Test' }
      const result = await simulateApiDelay(data, 50)

      expect(result).toEqual(data)
    })

    it('simulateApiError rejects with error after delay', async () => {
      await expect(simulateApiError('Test error', 50)).rejects.toThrow('Test error')
    })

    it('handles API timeout gracefully', async () => {
      // Test that long delays work correctly
      const start = Date.now()
      const data = await simulateApiDelay({ success: true }, 100)
      const elapsed = Date.now() - start

      expect(elapsed).toBeGreaterThanOrEqual(90) // Allow some timing variance
      expect(data.success).toBe(true)
    })
  })

  describe('EmptyState Component', () => {
    it('renders with title and description', () => {
      render(
        <TestWrapper>
          <EmptyState
            title="No results found"
            description="Try adjusting your search criteria"
          />
        </TestWrapper>
      )

      expect(screen.getByText('No results found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument()
    })

    it('renders action button when provided', async () => {
      const onAction = vi.fn()
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <EmptyState
            title="No results"
            description="Nothing here"
            action={<button onClick={onAction}>Refresh</button>}
          />
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Refresh' })
      expect(button).toBeInTheDocument()

      await user.click(button)
      expect(onAction).toHaveBeenCalled()
    })

    it('renders with icon variant', () => {
      render(
        <TestWrapper>
          <EmptyState
            title="No search results"
            description="Try adjusting your filters"
            icon="search"
          />
        </TestWrapper>
      )

      expect(screen.getByText('No search results')).toBeInTheDocument()
    })
  })

  describe('Error Recovery Patterns', () => {
    it('supports retry pattern for failed operations', async () => {
      const user = userEvent.setup()
      let attemptCount = 0

      function RetryableComponent() {
        const [data, setData] = useState<string | null>(null)
        const [error, setError] = useState<string | null>(null)
        const [loading, setLoading] = useState(false)

        const fetchData = async () => {
          setLoading(true)
          setError(null)
          attemptCount++

          try {
            // Fail first two attempts, succeed on third
            if (attemptCount < 3) {
              throw new Error('Temporary error')
            }
            const result = await simulateApiDelay('Success!', 50)
            setData(result)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
          } finally {
            setLoading(false)
          }
        }

        useEffect(() => {
          fetchData()
        }, [])

        if (loading) return <div>Loading...</div>

        if (error) {
          return (
            <div>
              <p data-testid="error">{error}</p>
              <button onClick={fetchData}>Retry</button>
            </div>
          )
        }

        return <div data-testid="success">{data}</div>
      }

      render(
        <TestWrapper>
          <RetryableComponent />
        </TestWrapper>
      )

      // First attempt fails
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Temporary error')
      })

      // Retry (second attempt also fails)
      await user.click(screen.getByRole('button', { name: 'Retry' }))
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Temporary error')
      })

      // Third retry succeeds
      await user.click(screen.getByRole('button', { name: 'Retry' }))
      await waitFor(() => {
        expect(screen.getByTestId('success')).toHaveTextContent('Success!')
      })

      expect(attemptCount).toBe(3)
    })

    it('handles state reset on error', async () => {
      function ComponentWithErrorReset() {
        const [data, setData] = useState<{ items: string[] }>({ items: ['Initial'] })
        const [error, setError] = useState<string | null>(null)

        const triggerError = () => {
          setError('Something went wrong')
        }

        const resetState = () => {
          setError(null)
          setData({ items: ['Reset'] })
        }

        if (error) {
          return (
            <div>
              <p data-testid="error">{error}</p>
              <button onClick={resetState}>Reset</button>
            </div>
          )
        }

        return (
          <div>
            <ul>
              {data.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <button onClick={triggerError}>Cause Error</button>
          </div>
        )
      }

      const user = userEvent.setup()
      render(
        <TestWrapper>
          <ComponentWithErrorReset />
        </TestWrapper>
      )

      // Initial state
      expect(screen.getByText('Initial')).toBeInTheDocument()

      // Trigger error
      await user.click(screen.getByRole('button', { name: 'Cause Error' }))
      expect(screen.getByTestId('error')).toHaveTextContent('Something went wrong')

      // Reset
      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(screen.getByText('Reset')).toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    })
  })

  describe('Missing Data Scenarios', () => {
    it('handles undefined/null data gracefully', () => {
      function DataDisplay({ data }: { data: { name?: string } | null | undefined }) {
        if (!data) {
          return <EmptyState title="No data" description="Data not available" />
        }
        return <div>{data.name ?? 'Unknown'}</div>
      }

      const { rerender } = render(
        <TestWrapper>
          <DataDisplay data={null} />
        </TestWrapper>
      )
      expect(screen.getByText('No data')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DataDisplay data={undefined} />
        </TestWrapper>
      )
      expect(screen.getByText('No data')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DataDisplay data={{}} />
        </TestWrapper>
      )
      expect(screen.getByText('Unknown')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <DataDisplay data={{ name: 'Test' }} />
        </TestWrapper>
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('handles empty array data', () => {
      function ListDisplay({ items }: { items: string[] }) {
        if (items.length === 0) {
          return <EmptyState title="No items" description="Add some items to get started" />
        }
        return (
          <ul>
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      }

      const { rerender } = render(
        <TestWrapper>
          <ListDisplay items={[]} />
        </TestWrapper>
      )
      expect(screen.getByText('No items')).toBeInTheDocument()

      rerender(
        <TestWrapper>
          <ListDisplay items={['Item 1', 'Item 2']} />
        </TestWrapper>
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Async Error Handling', () => {
    it('handles promise rejection in useEffect', async () => {
      function AsyncComponent() {
        const [error, setError] = useState<string | null>(null)
        const [loading, setLoading] = useState(true)

        useEffect(() => {
          const fetchData = async () => {
            try {
              await simulateApiError('Network error', 50)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
              setLoading(false)
            }
          }
          fetchData()
        }, [])

        if (loading) return <div>Loading...</div>
        if (error) return <div data-testid="error">{error}</div>
        return <div>Success</div>
      }

      render(
        <TestWrapper>
          <AsyncComponent />
        </TestWrapper>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error')
      })
    })

    it('handles multiple concurrent errors', async () => {
      function MultiErrorComponent() {
        const [errors, setErrors] = useState<string[]>([])
        const [loading, setLoading] = useState(true)

        useEffect(() => {
          const fetchAll = async () => {
            const results = await Promise.allSettled([
              simulateApiError('Error 1', 50),
              simulateApiDelay('Success', 50),
              simulateApiError('Error 2', 50),
            ])

            const failedResults = results
              .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
              .map((r) => r.reason.message)

            setErrors(failedResults)
            setLoading(false)
          }
          fetchAll()
        }, [])

        if (loading) return <div>Loading...</div>

        return (
          <div>
            {errors.length > 0 && (
              <ul data-testid="errors">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
            <p data-testid="error-count">{errors.length} errors occurred</p>
          </div>
        )
      }

      render(
        <TestWrapper>
          <MultiErrorComponent />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error-count')).toHaveTextContent('2 errors occurred')
      })

      expect(screen.getByText('Error 1')).toBeInTheDocument()
      expect(screen.getByText('Error 2')).toBeInTheDocument()
    })
  })

  describe('Form Error States', () => {
    it('displays field-level errors', () => {
      function FormWithErrors() {
        return (
          <form>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />
              <span id="email-error" role="alert" className="text-coral-600">
                Invalid email format
              </span>
            </div>
          </form>
        )
      }

      render(
        <TestWrapper>
          <FormWithErrors />
        </TestWrapper>
      )

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format')
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    })

    it('displays form-level error summary', () => {
      const errors = ['Email is required', 'Password is too short', 'Terms must be accepted']

      function FormErrorSummary({ errors }: { errors: string[] }) {
        if (errors.length === 0) return null

        return (
          <div role="alert" data-testid="error-summary">
            <h3>Please fix the following errors:</h3>
            <ul>
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )
      }

      render(
        <TestWrapper>
          <FormErrorSummary errors={errors} />
        </TestWrapper>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      errors.forEach((error) => {
        expect(screen.getByText(error)).toBeInTheDocument()
      })
    })
  })

  describe('Network State Handling', () => {
    it('handles offline state', async () => {
      function OfflineAwareComponent() {
        const [isOnline, setIsOnline] = useState(true)

        useEffect(() => {
          const handleOnline = () => setIsOnline(true)
          const handleOffline = () => setIsOnline(false)

          window.addEventListener('online', handleOnline)
          window.addEventListener('offline', handleOffline)

          return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
          }
        }, [])

        // Expose setIsOnline for testing
        ;(window as any).__setOnlineStatus = setIsOnline

        if (!isOnline) {
          return (
            <EmptyState
              title="You're offline"
              description="Please check your internet connection"
            />
          )
        }

        return <div data-testid="online-content">Online content</div>
      }

      render(
        <TestWrapper>
          <OfflineAwareComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('online-content')).toBeInTheDocument()

      // Simulate going offline
      ;(window as any).__setOnlineStatus(false)

      await waitFor(() => {
        expect(screen.getByText("You're offline")).toBeInTheDocument()
      })

      // Simulate coming back online
      ;(window as any).__setOnlineStatus(true)

      await waitFor(() => {
        expect(screen.getByTestId('online-content')).toBeInTheDocument()
      })

      // Cleanup
      delete (window as any).__setOnlineStatus
    })
  })

  describe('Loading and Error Composition', () => {
    it('transitions through loading -> success states', async () => {
      function DataFetcher() {
        const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
        const [data, setData] = useState<string | null>(null)

        useEffect(() => {
          const fetch = async () => {
            const result = await simulateApiDelay('Fetched data', 50)
            setData(result)
            setState('success')
          }
          fetch()
        }, [])

        if (state === 'loading') return <div data-testid="loading">Loading...</div>
        if (state === 'error') return <div data-testid="error">Error occurred</div>
        return <div data-testid="success">{data}</div>
      }

      render(
        <TestWrapper>
          <DataFetcher />
        </TestWrapper>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByTestId('success')).toHaveTextContent('Fetched data')
      })
    })

    it('transitions through loading -> error states', async () => {
      function DataFetcher() {
        const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
        const [error, setError] = useState<string | null>(null)

        useEffect(() => {
          const fetch = async () => {
            try {
              await simulateApiError('Fetch failed', 50)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unknown')
              setState('error')
            }
          }
          fetch()
        }, [])

        if (state === 'loading') return <div data-testid="loading">Loading...</div>
        if (state === 'error') return <div data-testid="error">{error}</div>
        return <div data-testid="success">Success</div>
      }

      render(
        <TestWrapper>
          <DataFetcher />
        </TestWrapper>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Fetch failed')
      })
    })
  })
})
