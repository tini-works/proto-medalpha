import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { Sheet } from './Sheet'

describe('Sheet', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up body styles that might be left from scroll lock
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })

  describe('rendering', () => {
    it('renders when open is true', () => {
      render(
        <Sheet {...defaultProps}>
          <div>Sheet content</div>
        </Sheet>
      )

      expect(screen.getByText('Sheet content')).toBeInTheDocument()
    })

    it('does not render when open is false', () => {
      render(
        <Sheet {...defaultProps} open={false}>
          <div>Sheet content</div>
        </Sheet>
      )

      expect(screen.queryByText('Sheet content')).not.toBeInTheDocument()
    })

    it('renders title when provided', () => {
      render(
        <Sheet {...defaultProps} title="Test Title">
          <div>Content</div>
        </Sheet>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('renders footer when provided', () => {
      render(
        <Sheet {...defaultProps} footer={<button>Footer Button</button>}>
          <div>Content</div>
        </Sheet>
      )

      expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument()
    })

    it('renders close button by default', () => {
      render(
        <Sheet {...defaultProps}>
          <div>Content</div>
        </Sheet>
      )

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    it('hides close button when showCloseButton is false', () => {
      render(
        <Sheet {...defaultProps} showCloseButton={false}>
          <div>Content</div>
        </Sheet>
      )

      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('shows drag handle by default for bottom variant', () => {
      render(
        <Sheet {...defaultProps} variant="bottom" testId="sheet">
          <div>Content</div>
        </Sheet>
      )

      // Drag handle is the small bar at the top
      const sheet = screen.getByTestId('sheet')
      expect(sheet.querySelector('.bg-cream-400')).toBeInTheDocument()
    })

    it('hides drag handle by default for center variant', () => {
      render(
        <Sheet {...defaultProps} variant="center" testId="sheet">
          <div>Content</div>
        </Sheet>
      )

      const sheet = screen.getByTestId('sheet')
      // Center variant shouldn't have the drag handle
      const dragHandles = sheet.querySelectorAll('.w-10.h-1.rounded-full.bg-cream-400')
      expect(dragHandles.length).toBe(0)
    })

    it('respects showDragHandle override', () => {
      render(
        <Sheet {...defaultProps} variant="center" showDragHandle={true} testId="sheet">
          <div>Content</div>
        </Sheet>
      )

      const sheet = screen.getByTestId('sheet')
      expect(sheet.querySelector('.bg-cream-400')).toBeInTheDocument()
    })
  })

  describe('closing behavior', () => {
    it('calls onClose when close button is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(
        <Sheet {...defaultProps} onClose={onClose}>
          <div>Content</div>
        </Sheet>
      )

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when backdrop is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(
        <Sheet {...defaultProps} onClose={onClose} testId="sheet">
          <div>Content</div>
        </Sheet>
      )

      await user.click(screen.getByTestId('sheet-backdrop'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when backdrop click is disabled', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(
        <Sheet {...defaultProps} onClose={onClose} closeOnBackdropClick={false} testId="sheet">
          <div>Content</div>
        </Sheet>
      )

      await user.click(screen.getByTestId('sheet-backdrop'))

      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose when Escape is pressed', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(
        <Sheet {...defaultProps} onClose={onClose}>
          <div>Content</div>
        </Sheet>
      )

      await user.keyboard('{Escape}')

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when Escape is disabled', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(
        <Sheet {...defaultProps} onClose={onClose} closeOnEscape={false}>
          <div>Content</div>
        </Sheet>
      )

      await user.keyboard('{Escape}')

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has dialog role and aria-modal', () => {
      render(
        <Sheet {...defaultProps}>
          <div>Content</div>
        </Sheet>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('has aria-labelledby when title is provided', () => {
      render(
        <Sheet {...defaultProps} title="Test Title">
          <div>Content</div>
        </Sheet>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')

      const titleId = dialog.getAttribute('aria-labelledby')
      expect(screen.getByText('Test Title')).toHaveAttribute('id', titleId)
    })

    it('traps focus within the sheet', async () => {
      const user = userEvent.setup()

      render(
        <Sheet {...defaultProps}>
          <button>First</button>
          <button>Second</button>
        </Sheet>
      )

      // Focus should be on first button initially
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
      })

      // Tab to second
      await user.tab()
      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus()

      // Tab to close button
      await user.tab()
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()

      // Tab should wrap to first
      await user.tab()
      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
    })
  })

  describe('body scroll lock', () => {
    it('locks body scroll when open', () => {
      render(
        <Sheet {...defaultProps}>
          <div>Content</div>
        </Sheet>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('does not lock scroll when preventBodyScroll is false', () => {
      render(
        <Sheet {...defaultProps} preventBodyScroll={false}>
          <div>Content</div>
        </Sheet>
      )

      expect(document.body.style.overflow).not.toBe('hidden')
    })
  })

  describe('sub-components', () => {
    it('renders Sheet.Body content', () => {
      render(
        <Sheet {...defaultProps}>
          <Sheet.Body>Body content</Sheet.Body>
        </Sheet>
      )

      expect(screen.getByText('Body content')).toBeInTheDocument()
    })

    it('renders Sheet.Footer with proper styling', () => {
      render(
        <Sheet {...defaultProps}>
          <Sheet.Footer>
            <button>Action</button>
          </Sheet.Footer>
        </Sheet>
      )

      const footer = screen.getByRole('button', { name: 'Action' }).parentElement
      expect(footer).toHaveClass('border-t', 'border-cream-300')
    })

    it('renders Sheet.Header', () => {
      render(
        <Sheet {...defaultProps} showCloseButton={false}>
          <Sheet.Header>Custom Header</Sheet.Header>
        </Sheet>
      )

      expect(screen.getByText('Custom Header')).toBeInTheDocument()
    })
  })

  describe('custom initial focus', () => {
    it('focuses custom element when initialFocusRef is provided', async () => {
      function TestComponent() {
        const buttonRef = useRef<HTMLButtonElement>(null)
        return (
          <Sheet open onClose={vi.fn()} initialFocusRef={buttonRef}>
            <button>First</button>
            <button ref={buttonRef}>Should Focus</button>
          </Sheet>
        )
      }

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Should Focus' })).toHaveFocus()
      })
    })
  })
})
