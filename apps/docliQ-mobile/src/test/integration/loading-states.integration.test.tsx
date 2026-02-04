/**
 * Loading States Integration Tests
 *
 * Tests loading state patterns across the app:
 * - Skeleton components and variants
 * - Loading indicators
 * - Screen loading states
 *
 * HIGH priority - ensures loading states provide good UX.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React, { useState, useEffect } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'

import { Skeleton, DoctorCardSkeleton, AppointmentCardSkeleton } from '../../components/display/Skeleton'
import { simulateApiDelay } from '../../data/api'
import { AppStateProvider } from '../../state/AppContext'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  resources: { en: { common: {} } },
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

describe('Loading States Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Skeleton Component', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <Skeleton />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('w-full')
      expect(skeleton).toHaveClass('h-4')
      expect(skeleton).toHaveClass('rounded')
    })

    it('renders with custom width and height', () => {
      render(
        <TestWrapper>
          <Skeleton width="w-32" height="h-8" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toHaveClass('w-32')
      expect(skeleton).toHaveClass('h-8')
    })

    it('renders text variant with rounded corners', () => {
      render(
        <TestWrapper>
          <Skeleton variant="text" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toHaveClass('rounded')
    })

    it('renders circular variant with rounded-full', () => {
      render(
        <TestWrapper>
          <Skeleton variant="circular" width="w-12" height="h-12" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toHaveClass('rounded-full')
    })

    it('renders rectangular variant without border radius', () => {
      render(
        <TestWrapper>
          <Skeleton variant="rectangular" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toHaveClass('rounded-none')
    })

    it('renders rounded variant with rounded-lg', () => {
      render(
        <TestWrapper>
          <Skeleton variant="rounded" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toHaveClass('rounded-lg')
    })

    it('applies additional custom className', () => {
      render(
        <TestWrapper>
          <Skeleton className="mt-4 mx-2" />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toHaveClass('mt-4')
      expect(skeleton).toHaveClass('mx-2')
    })

    it('is hidden from accessibility tree', () => {
      render(
        <TestWrapper>
          <Skeleton />
        </TestWrapper>
      )

      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('DoctorCardSkeleton', () => {
    it('renders complete skeleton structure', () => {
      render(
        <TestWrapper>
          <DoctorCardSkeleton />
        </TestWrapper>
      )

      // Should have multiple skeleton elements for different parts
      const skeletons = document.querySelectorAll('.skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('has avatar placeholder (circular)', () => {
      render(
        <TestWrapper>
          <DoctorCardSkeleton />
        </TestWrapper>
      )

      // Look for circular skeleton (avatar)
      const circularSkeleton = document.querySelector('.rounded-full')
      expect(circularSkeleton).toBeInTheDocument()
    })

    it('has text placeholders', () => {
      render(
        <TestWrapper>
          <DoctorCardSkeleton />
        </TestWrapper>
      )

      // Should have multiple text skeleton lines
      const skeletons = document.querySelectorAll('.skeleton')
      const textSkeletons = Array.from(skeletons).filter(
        (el) => !el.classList.contains('rounded-full') && !el.classList.contains('rounded-lg')
      )
      expect(textSkeletons.length).toBeGreaterThan(0)
    })

    it('has time slot placeholders (rounded)', () => {
      render(
        <TestWrapper>
          <DoctorCardSkeleton />
        </TestWrapper>
      )

      // Should have rounded skeleton elements for time slots
      const roundedSkeletons = document.querySelectorAll('.rounded-lg')
      expect(roundedSkeletons.length).toBeGreaterThan(0)
    })
  })

  describe('AppointmentCardSkeleton', () => {
    it('renders complete skeleton structure', () => {
      render(
        <TestWrapper>
          <AppointmentCardSkeleton />
        </TestWrapper>
      )

      const skeletons = document.querySelectorAll('.skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('has status badge placeholder', () => {
      render(
        <TestWrapper>
          <AppointmentCardSkeleton />
        </TestWrapper>
      )

      // Status badge is typically a rounded skeleton
      const roundedSkeletons = document.querySelectorAll('.rounded-lg, .rounded')
      expect(roundedSkeletons.length).toBeGreaterThan(0)
    })

    it('has action button placeholders', () => {
      render(
        <TestWrapper>
          <AppointmentCardSkeleton />
        </TestWrapper>
      )

      // Should have button placeholders at the bottom
      const skeletons = document.querySelectorAll('.skeleton')
      expect(skeletons.length).toBeGreaterThanOrEqual(4) // At minimum: status, avatar, title, button
    })
  })

  describe('Loading State Patterns', () => {
    it('shows skeleton during data loading', async () => {
      function DoctorList() {
        const [loading, setLoading] = useState(true)
        const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([])

        useEffect(() => {
          const fetch = async () => {
            const data = await simulateApiDelay(
              [
                { id: '1', name: 'Dr. Weber' },
                { id: '2', name: 'Dr. Fischer' },
              ],
              100
            )
            setDoctors(data)
            setLoading(false)
          }
          fetch()
        }, [])

        if (loading) {
          return (
            <div data-testid="loading-state">
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
            </div>
          )
        }

        return (
          <div data-testid="loaded-state">
            {doctors.map((doc) => (
              <div key={doc.id}>{doc.name}</div>
            ))}
          </div>
        )
      }

      render(
        <TestWrapper>
          <DoctorList />
        </TestWrapper>
      )

      // Initially shows loading state
      expect(screen.getByTestId('loading-state')).toBeInTheDocument()

      // After data loads, shows content
      await waitFor(() => {
        expect(screen.getByTestId('loaded-state')).toBeInTheDocument()
      })
      expect(screen.getByText('Dr. Weber')).toBeInTheDocument()
    })

    it('transitions smoothly from skeleton to content', async () => {
      function DataDisplay() {
        const [state, setState] = useState<'loading' | 'loaded'>('loading')
        const [data, setData] = useState<string>('')

        useEffect(() => {
          const fetch = async () => {
            const result = await simulateApiDelay('Loaded content', 50)
            setData(result)
            setState('loaded')
          }
          fetch()
        }, [])

        return (
          <div>
            {state === 'loading' ? (
              <Skeleton data-testid="skeleton" />
            ) : (
              <p data-testid="content">{data}</p>
            )}
          </div>
        )
      }

      render(
        <TestWrapper>
          <DataDisplay />
        </TestWrapper>
      )

      // Skeleton visible initially
      const skeleton = document.querySelector('.skeleton')
      expect(skeleton).toBeInTheDocument()

      // Content replaces skeleton
      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('Loaded content')
      })
      expect(document.querySelector('.skeleton')).not.toBeInTheDocument()
    })

    it('maintains skeleton count matching expected content', async () => {
      const expectedItemCount = 3

      function ItemList() {
        const [loading, setLoading] = useState(true)
        const [items, setItems] = useState<string[]>([])

        useEffect(() => {
          const fetch = async () => {
            const data = await simulateApiDelay(['Item 1', 'Item 2', 'Item 3'], 50)
            setItems(data)
            setLoading(false)
          }
          fetch()
        }, [])

        if (loading) {
          return (
            <ul data-testid="skeleton-list">
              {Array.from({ length: expectedItemCount }).map((_, i) => (
                <li key={i}>
                  <Skeleton width="w-full" height="h-6" />
                </li>
              ))}
            </ul>
          )
        }

        return (
          <ul data-testid="item-list">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      }

      render(
        <TestWrapper>
          <ItemList />
        </TestWrapper>
      )

      // Skeleton count matches expected items
      const skeletonList = screen.getByTestId('skeleton-list')
      const skeletons = skeletonList.querySelectorAll('.skeleton')
      expect(skeletons).toHaveLength(expectedItemCount)

      // Loaded items count matches
      await waitFor(() => {
        expect(screen.getByTestId('item-list')).toBeInTheDocument()
      })
      const items = screen.getByTestId('item-list').querySelectorAll('li')
      expect(items).toHaveLength(expectedItemCount)
    })
  })

  describe('Loading State with Multiple Sections', () => {
    it('handles independent loading states for different sections', async () => {
      function Dashboard() {
        const [appointmentsLoading, setAppointmentsLoading] = useState(true)
        const [doctorsLoading, setDoctorsLoading] = useState(true)
        const [appointments, setAppointments] = useState<string[]>([])
        const [doctors, setDoctors] = useState<string[]>([])

        useEffect(() => {
          // Appointments load faster
          simulateApiDelay(['Appointment 1'], 50).then((data) => {
            setAppointments(data)
            setAppointmentsLoading(false)
          })

          // Doctors load slower
          simulateApiDelay(['Doctor 1', 'Doctor 2'], 150).then((data) => {
            setDoctors(data)
            setDoctorsLoading(false)
          })
        }, [])

        return (
          <div>
            <section data-testid="appointments-section">
              {appointmentsLoading ? (
                <AppointmentCardSkeleton />
              ) : (
                appointments.map((apt, i) => <div key={i}>{apt}</div>)
              )}
            </section>
            <section data-testid="doctors-section">
              {doctorsLoading ? (
                <>
                  <DoctorCardSkeleton />
                  <DoctorCardSkeleton />
                </>
              ) : (
                doctors.map((doc, i) => <div key={i}>{doc}</div>)
              )}
            </section>
          </div>
        )
      }

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      )

      // Both sections start loading
      expect(screen.getByTestId('appointments-section').querySelector('.skeleton')).toBeInTheDocument()
      expect(screen.getByTestId('doctors-section').querySelector('.skeleton')).toBeInTheDocument()

      // Appointments load first
      await waitFor(() => {
        expect(screen.getByText('Appointment 1')).toBeInTheDocument()
      })
      // Doctors still loading
      expect(screen.getByTestId('doctors-section').querySelector('.skeleton')).toBeInTheDocument()

      // Finally doctors load
      await waitFor(() => {
        expect(screen.getByText('Doctor 1')).toBeInTheDocument()
        expect(screen.getByText('Doctor 2')).toBeInTheDocument()
      })
    })
  })

  describe('Skeleton Accessibility', () => {
    it('all skeleton elements are aria-hidden', () => {
      render(
        <TestWrapper>
          <div>
            <Skeleton />
            <Skeleton variant="circular" />
            <Skeleton variant="rounded" />
          </div>
        </TestWrapper>
      )

      const skeletons = document.querySelectorAll('.skeleton')
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('loading state announces to screen readers', () => {
      function LoadingWithAnnouncement() {
        const [loading, setLoading] = useState(true)

        useEffect(() => {
          const timer = setTimeout(() => setLoading(false), 50)
          return () => clearTimeout(timer)
        }, [])

        return (
          <div>
            {loading && (
              <div role="status" aria-live="polite" aria-busy="true">
                <span className="sr-only">Loading content...</span>
                <Skeleton />
              </div>
            )}
            {!loading && <div data-testid="content">Content loaded</div>}
          </div>
        )
      }

      render(
        <TestWrapper>
          <LoadingWithAnnouncement />
        </TestWrapper>
      )

      const loadingRegion = screen.getByRole('status')
      expect(loadingRegion).toHaveAttribute('aria-busy', 'true')
      expect(loadingRegion).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Loading State Edge Cases', () => {
    it('handles instant loading (no skeleton flash)', async () => {
      // Use a small delay to test the component still works
      function QuickLoader() {
        const [loading, setLoading] = useState(true)
        const [data, setData] = useState<string>('')

        useEffect(() => {
          // Very fast response
          simulateApiDelay('Quick data', 10).then((result) => {
            setData(result)
            setLoading(false)
          })
        }, [])

        return loading ? <Skeleton /> : <div data-testid="content">{data}</div>
      }

      render(
        <TestWrapper>
          <QuickLoader />
        </TestWrapper>
      )

      // Should quickly transition to content
      await waitFor(
        () => {
          expect(screen.getByTestId('content')).toBeInTheDocument()
        },
        { timeout: 100 }
      )
    })

    it('handles loading state reset on refetch', async () => {
      function RefetchableComponent({ refetchTrigger }: { refetchTrigger: number }) {
        const [loading, setLoading] = useState(true)
        const [data, setData] = useState<string>('')

        useEffect(() => {
          setLoading(true)
          simulateApiDelay(`Data ${refetchTrigger}`, 50).then((result) => {
            setData(result)
            setLoading(false)
          })
        }, [refetchTrigger])

        return loading ? (
          <div data-testid="loading">
            <Skeleton />
          </div>
        ) : (
          <div data-testid="content">{data}</div>
        )
      }

      const { rerender } = render(
        <TestWrapper>
          <RefetchableComponent refetchTrigger={1} />
        </TestWrapper>
      )

      // First load
      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('Data 1')
      })

      // Trigger refetch
      rerender(
        <TestWrapper>
          <RefetchableComponent refetchTrigger={2} />
        </TestWrapper>
      )

      // Should show loading again
      expect(screen.getByTestId('loading')).toBeInTheDocument()

      // Then show new data
      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveTextContent('Data 2')
      })
    })
  })
})
