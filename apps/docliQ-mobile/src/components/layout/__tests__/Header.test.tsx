import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../Header'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock booking state
vi.mock('../../../state', () => ({
  useBooking: () => ({
    selectedDoctor: { id: 'd1', name: 'Dr. Test' },
  }),
}))

function renderHeader(props: { title: string; showBack?: boolean; onBack?: () => void }) {
  return render(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>
  )
}

describe('Header', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response())
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  it('does not make debug HTTP requests on back button click', async () => {
    const user = userEvent.setup()
    renderHeader({ title: 'Test', showBack: true })

    const backButton = screen.getByRole('button', { name: /go back/i })
    await user.click(backButton)

    // Verify no fetch calls to debug endpoint
    const debugCalls = fetchSpy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('127.0.0.1:7244')
    )
    expect(debugCalls).toHaveLength(0)
  })

  it('renders title', () => {
    renderHeader({ title: 'Test Title' })
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders back button when showBack is true', () => {
    renderHeader({ title: 'Test', showBack: true })
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })

  it('does not render back button when showBack is false', () => {
    renderHeader({ title: 'Test', showBack: false })
    expect(screen.queryByRole('button', { name: /go back/i })).not.toBeInTheDocument()
  })

  it('does not render back button by default', () => {
    renderHeader({ title: 'Test' })
    expect(screen.queryByRole('button', { name: /go back/i })).not.toBeInTheDocument()
  })

  it('calls custom onBack handler when provided', async () => {
    const onBack = vi.fn()
    const user = userEvent.setup()

    renderHeader({ title: 'Test', showBack: true, onBack })

    await user.click(screen.getByRole('button', { name: /go back/i }))

    expect(onBack).toHaveBeenCalledTimes(1)
    // Should not call navigate when custom handler is provided
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('calls navigate(-1) when no custom handler and no route match', async () => {
    const user = userEvent.setup()
    renderHeader({ title: 'Test', showBack: true })

    await user.click(screen.getByRole('button', { name: /go back/i }))

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
