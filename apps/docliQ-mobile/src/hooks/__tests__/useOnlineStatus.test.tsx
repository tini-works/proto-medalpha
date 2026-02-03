import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useOnlineStatus } from '../useOnlineStatus'

function StatusProbe({ label }: { label: string }) {
  const { isOnline, refreshOnlineStatus } = useOnlineStatus()
  return (
    <div>
      <span data-testid={`status-${label}`}>{isOnline ? 'online' : 'offline'}</span>
      <button type="button" onClick={refreshOnlineStatus}>
        refresh
      </button>
    </div>
  )
}

describe('useOnlineStatus', () => {
  const originalNavigator = window.navigator

  beforeEach(() => {
    delete (window as any).__devOnlineOverride
  })

  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true,
    })
    delete (window as any).__devOnlineOverride
  })

  it('refresh clears dev override and syncs all listeners via online event', () => {
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator, onLine: true },
      configurable: true,
    })

    ;(window as any).__devOnlineOverride = false
    window.dispatchEvent(new Event('offline'))

    render(
      <>
        <StatusProbe label="a" />
        <StatusProbe label="b" />
      </>
    )

    expect(screen.getByTestId('status-a').textContent).toBe('offline')
    expect(screen.getByTestId('status-b').textContent).toBe('offline')

    fireEvent.click(screen.getAllByText('refresh')[0])

    expect(screen.getByTestId('status-a').textContent).toBe('online')
    expect(screen.getByTestId('status-b').textContent).toBe('online')
    expect((window as any).__devOnlineOverride).toBeUndefined()
  })
})
