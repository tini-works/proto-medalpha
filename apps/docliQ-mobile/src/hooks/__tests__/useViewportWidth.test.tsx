import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useViewportWidth } from '../useViewportWidth'

function WidthProbe() {
  const width = useViewportWidth()
  return <span data-testid="width">{width}</span>
}

describe('useViewportWidth', () => {
  const originalInnerWidth = window.innerWidth

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
  })

  it('returns initial window width', () => {
    render(<WidthProbe />)
    expect(screen.getByTestId('width').textContent).toBe('1024')
  })

  it('updates on resize event', () => {
    render(<WidthProbe />)
    expect(screen.getByTestId('width').textContent).toBe('1024')

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      window.dispatchEvent(new Event('resize'))
    })

    expect(screen.getByTestId('width').textContent).toBe('375')
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(<WidthProbe />)
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})
