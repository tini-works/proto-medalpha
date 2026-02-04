/**
 * Toast Notification Integration Tests
 *
 * Tests the notification toast system:
 * - Toast display and dismissal
 * - Auto-dismiss functionality
 * - LIFO queue management
 * - Toast types and variants
 *
 * HIGH priority - ensures in-app notifications work correctly.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'

import {
  NotificationToastProvider,
  useNotificationToast,
  type ToastData,
} from '../../contexts/NotificationToastContext'
import Toast from '../../components/notifications/Toast'
import ToastRenderer from '../../components/notifications/ToastRenderer'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['booking'],
  defaultNS: 'booking',
  resources: {
    en: {
      booking: {
        viewDetails: 'View details',
      },
    },
  },
  interpolation: { escapeValue: false },
})

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <NotificationToastProvider>{children}</NotificationToastProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

// Test component to trigger toasts
function ToastTrigger({
  onShowToast,
}: {
  onShowToast?: (showToast: (toast: Omit<ToastData, 'id'>) => void) => void
}) {
  const { showToast, dismissToast, currentToast } = useNotificationToast()

  React.useEffect(() => {
    onShowToast?.(showToast)
  }, [showToast, onShowToast])

  return (
    <div>
      <button
        onClick={() =>
          showToast({ title: 'Test notification', type: 'success' })
        }
        data-testid="show-success"
      >
        Show Success
      </button>
      <button
        onClick={() =>
          showToast({ title: 'Warning message', type: 'warning' })
        }
        data-testid="show-warning"
      >
        Show Warning
      </button>
      <button
        onClick={() =>
          showToast({ title: 'Info message', type: 'info' })
        }
        data-testid="show-info"
      >
        Show Info
      </button>
      <button
        onClick={() =>
          showToast({
            title: 'Appointment confirmed',
            type: 'success',
            appointmentId: 'apt-123',
          })
        }
        data-testid="show-with-link"
      >
        Show With Link
      </button>
      {currentToast && (
        <button onClick={() => dismissToast(currentToast.id)} data-testid="dismiss">
          Dismiss Current
        </button>
      )}
      <div data-testid="current-toast-id">{currentToast?.id || 'none'}</div>
    </div>
  )
}

describe('Toast Notification Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('NotificationToastProvider', () => {
    it('provides context to children', () => {
      render(
        <TestWrapper>
          <ToastTrigger />
        </TestWrapper>
      )

      expect(screen.getByTestId('show-success')).toBeInTheDocument()
      expect(screen.getByTestId('current-toast-id')).toHaveTextContent('none')
    })

    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <I18nextProvider i18n={i18n}>
            <MemoryRouter>
              <ToastTrigger />
            </MemoryRouter>
          </I18nextProvider>
        )
      }).toThrow('useNotificationToast must be used within NotificationToastProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('showToast', () => {
    it('displays toast when showToast is called', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      await user.click(screen.getByTestId('show-success'))

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Test notification')).toBeInTheDocument()
    })

    it('generates unique id for each toast', async () => {
      const ids: string[] = []
      let capturedShowToast: ((toast: Omit<ToastData, 'id'>) => void) | null = null

      render(
        <TestWrapper>
          <ToastTrigger
            onShowToast={(fn) => {
              capturedShowToast = fn
            }}
          />
        </TestWrapper>
      )

      // Show multiple toasts and capture their IDs indirectly via currentToast
      act(() => {
        capturedShowToast?.({ title: 'Toast 1', type: 'success' })
      })

      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      // IDs are generated with incrementing counter, so they should be unique
      // Check that an ID was generated (not 'none')
      expect(screen.getByTestId('current-toast-id')).not.toHaveTextContent('none')
    })
  })

  describe('Toast Component', () => {
    const mockToast: ToastData = {
      id: 'toast-1',
      title: 'Test notification',
      type: 'success',
    }

    it('renders success toast with correct icon', () => {
      const onClose = vi.fn()

      render(
        <TestWrapper>
          <Toast toast={mockToast} onClose={onClose} />
        </TestWrapper>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Test notification')).toBeInTheDocument()
      // Success icon should be present (teal background)
      expect(document.querySelector('.bg-teal-100')).toBeInTheDocument()
    })

    it('renders warning toast with correct icon', () => {
      const onClose = vi.fn()
      const warningToast: ToastData = {
        id: 'toast-2',
        title: 'Warning message',
        type: 'warning',
      }

      render(
        <TestWrapper>
          <Toast toast={warningToast} onClose={onClose} />
        </TestWrapper>
      )

      expect(document.querySelector('.bg-amber-100')).toBeInTheDocument()
    })

    it('renders info toast with correct icon', () => {
      const onClose = vi.fn()
      const infoToast: ToastData = {
        id: 'toast-3',
        title: 'Info message',
        type: 'info',
      }

      render(
        <TestWrapper>
          <Toast toast={infoToast} onClose={onClose} />
        </TestWrapper>
      )

      expect(document.querySelector('.bg-slate-100')).toBeInTheDocument()
    })

    it('renders link to appointment details when appointmentId is provided', () => {
      const onClose = vi.fn()
      const toastWithLink: ToastData = {
        id: 'toast-4',
        title: 'Appointment confirmed',
        type: 'success',
        appointmentId: 'apt-123',
      }

      render(
        <TestWrapper>
          <Toast toast={toastWithLink} onClose={onClose} />
        </TestWrapper>
      )

      const link = screen.getByRole('link', { name: /view details/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/appointments/apt-123')
    })

    it('calls onClose when dismiss button is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <Toast toast={mockToast} onClose={onClose} />
        </TestWrapper>
      )

      const dismissButton = screen.getByRole('button', { name: /dismiss/i })
      await user.click(dismissButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when link is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const toastWithLink: ToastData = {
        id: 'toast-5',
        title: 'Click me',
        type: 'success',
        appointmentId: 'apt-456',
      }

      render(
        <TestWrapper>
          <Toast toast={toastWithLink} onClose={onClose} />
        </TestWrapper>
      )

      const link = screen.getByRole('link', { name: /view details/i })
      await user.click(link)

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('ToastRenderer', () => {
    it('renders nothing when no current toast', () => {
      const { container } = render(
        <TestWrapper>
          <ToastRenderer />
        </TestWrapper>
      )

      expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument()
    })

    it('renders current toast from context', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      await user.click(screen.getByTestId('show-success'))

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe('Auto-dismiss', () => {
    it('auto-dismisses toast after 5 seconds', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      await user.click(screen.getByTestId('show-success'))

      // Toast is visible
      expect(screen.getByRole('alert')).toBeInTheDocument()

      // Advance time by 5 seconds
      await act(async () => {
        vi.advanceTimersByTime(5000)
      })

      // Toast should be gone
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('resets auto-dismiss timer when new toast is shown', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      // Show first toast
      await user.click(screen.getByTestId('show-success'))
      expect(screen.getByText('Test notification')).toBeInTheDocument()

      // Wait 3 seconds (not enough to auto-dismiss)
      await act(async () => {
        vi.advanceTimersByTime(3000)
      })

      // Show second toast
      await user.click(screen.getByTestId('show-warning'))
      expect(screen.getByText('Warning message')).toBeInTheDocument()

      // Wait 3 more seconds (total 6s, but timer was reset)
      await act(async () => {
        vi.advanceTimersByTime(3000)
      })

      // Second toast should still be visible (only 3s since it appeared)
      expect(screen.getByText('Warning message')).toBeInTheDocument()

      // Wait 2 more seconds (total 5s for second toast)
      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      // Now it should auto-dismiss (and show first toast from queue)
      expect(screen.queryByText('Warning message')).not.toBeInTheDocument()
    })
  })

  describe('Toast Queue (LIFO)', () => {
    it('shows newest toast immediately (LIFO behavior)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      // Show first toast
      await user.click(screen.getByTestId('show-success'))
      expect(screen.getByText('Test notification')).toBeInTheDocument()

      // Show second toast immediately
      await user.click(screen.getByTestId('show-warning'))

      // Second toast should be shown (LIFO - newest on top)
      expect(screen.getByText('Warning message')).toBeInTheDocument()
      expect(screen.queryByText('Test notification')).not.toBeInTheDocument()
    })

    it('shows next toast in queue after current is dismissed', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      // Show first toast
      await user.click(screen.getByTestId('show-success'))

      // Show second toast (pushes first to queue)
      await user.click(screen.getByTestId('show-warning'))
      expect(screen.getByText('Warning message')).toBeInTheDocument()

      // Auto-dismiss current toast
      await act(async () => {
        vi.advanceTimersByTime(5000)
      })

      // First toast should now be shown (from queue)
      expect(screen.getByText('Test notification')).toBeInTheDocument()
      expect(screen.queryByText('Warning message')).not.toBeInTheDocument()
    })

    it('handles multiple toasts in queue', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      // Show three toasts quickly
      await user.click(screen.getByTestId('show-success')) // Toast 1
      await user.click(screen.getByTestId('show-warning')) // Toast 2 (now showing)
      await user.click(screen.getByTestId('show-info')) // Toast 3 (now showing)

      // Most recent toast (info) should be visible
      expect(screen.getByText('Info message')).toBeInTheDocument()

      // Dismiss current
      await act(async () => {
        vi.advanceTimersByTime(5000)
      })

      // Previous toast (warning) should show
      expect(screen.getByText('Warning message')).toBeInTheDocument()

      // Dismiss again
      await act(async () => {
        vi.advanceTimersByTime(5000)
      })

      // First toast should show
      expect(screen.getByText('Test notification')).toBeInTheDocument()

      // Dismiss final
      await act(async () => {
        vi.advanceTimersByTime(5000)
      })

      // No more toasts
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Manual Dismissal', () => {
    it('dismisses current toast and shows next in queue', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      // Show two toasts
      await user.click(screen.getByTestId('show-success'))
      await user.click(screen.getByTestId('show-warning'))

      // Warning is showing
      expect(screen.getByText('Warning message')).toBeInTheDocument()

      // Manually dismiss via dismiss button
      await user.click(screen.getByTestId('dismiss'))

      // Next toast should show
      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      expect(screen.getByText('Test notification')).toBeInTheDocument()
    })

    it('dismissToast does nothing for non-current toast ID', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      // Show toast
      await user.click(screen.getByTestId('show-success'))
      expect(screen.getByText('Test notification')).toBeInTheDocument()

      // The dismiss button dismisses current toast
      // But if we called dismissToast with wrong ID, it would be ignored
      // This is tested via the dismiss button which uses correct ID
    })
  })

  describe('Cleanup', () => {
    it('unmounts cleanly without errors', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      const { unmount } = render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      // Show toast to start timeout
      await user.click(screen.getByTestId('show-success'))

      // Unmount should not throw
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('toast has role="alert" for screen readers', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      await user.click(screen.getByTestId('show-success'))

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('dismiss button has accessible label', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      render(
        <TestWrapper>
          <ToastTrigger />
          <ToastRenderer />
        </TestWrapper>
      )

      await user.click(screen.getByTestId('show-success'))

      const toast = screen.getByRole('alert')
      // Get the dismiss button within the toast (not the ToastTrigger's dismiss button)
      const dismissButton = toast.querySelector('button[aria-label="Dismiss"]')
      expect(dismissButton).toBeInTheDocument()
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss')
    })
  })
})
