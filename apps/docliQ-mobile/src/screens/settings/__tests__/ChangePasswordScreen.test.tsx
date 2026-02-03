import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import ChangePasswordScreen from '../ChangePasswordScreen'
import { PATHS } from '../../../routes'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock toast
const mockShowToast = vi.fn()
vi.mock('../../../contexts/NotificationToastContext', () => ({
  useNotificationToast: () => ({
    showToast: mockShowToast,
  }),
}))

// Mock state hooks (required by Header component)
vi.mock('../../../state', () => ({
  useBooking: () => ({
    selectedDoctor: null,
  }),
}))

// Initialize test i18n
i18n.init({
  lng: 'en',
  resources: {
    en: {
      settings: {
        changePassword: 'Change Password',
        changePasswordInfo: 'Choose a strong password with at least 8 characters.',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        updatePassword: 'Update Password',
        passwordMismatch: 'Passwords do not match',
        forgotCurrentPassword: 'Forgot your password?',
        passwordChanged: 'Password changed successfully',
        passwordSameAsCurrent: 'New password must be different from current password',
      },
      auth: {
        'password.show': 'Show password',
        'password.hide': 'Hide password',
        'password.strength.none': 'None',
        'password.strength.weak': 'Weak',
        'password.strength.fair': 'Fair',
        'password.strength.good': 'Good',
        'password.strength.strong': 'Strong',
        'password.requirements.minLength': 'At least 8 characters',
        'password.requirements.hasUppercase': 'One uppercase letter',
        'password.requirements.hasLowercase': 'One lowercase letter',
        'password.requirements.hasNumber': 'One number',
        'password.requirements.hasSpecial': 'One special character',
      },
    },
  },
})

function renderChangePasswordScreen() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ChangePasswordScreen />
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('ChangePasswordScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('renders all 3 password fields with correct labels', () => {
      renderChangePasswordScreen()

      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('renders "Forgot your password?" link', () => {
      renderChangePasswordScreen()

      expect(screen.getByRole('button', { name: /forgot your password/i })).toBeInTheDocument()
    })

    it('renders update password button', () => {
      renderChangePasswordScreen()

      expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('navigates to ForgotPasswordScreen when "Forgot your password?" clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      await user.click(screen.getByRole('button', { name: /forgot your password/i }))

      expect(mockNavigate).toHaveBeenCalledWith(PATHS.AUTH_FORGOT_PASSWORD)
    })
  })

  describe('Validation - Submit Button State', () => {
    it('submit button is disabled when fields are empty', () => {
      renderChangePasswordScreen()

      const submitButton = screen.getByRole('button', { name: /update password/i })
      expect(submitButton).toBeDisabled()
    })

    it('submit button is disabled when new password is weak (score < 4)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      // Fill in current password
      await user.type(screen.getByLabelText(/current password/i), 'OldPass123!')
      // Fill in weak new password (only lowercase, no special char)
      await user.type(screen.getByLabelText(/new password/i), 'weakpass')
      await user.type(screen.getByLabelText(/confirm password/i), 'weakpass')

      const submitButton = screen.getByRole('button', { name: /update password/i })
      expect(submitButton).toBeDisabled()
    })

    it('submit button is disabled when confirm does not match', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      await user.type(screen.getByLabelText(/current password/i), 'OldPass123!')
      await user.type(screen.getByLabelText(/new password/i), 'NewPass123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPass!')

      const submitButton = screen.getByRole('button', { name: /update password/i })
      expect(submitButton).toBeDisabled()
    })

    it('submit button is disabled when new password equals current password', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      const samePassword = 'SamePass123!'
      await user.type(screen.getByLabelText(/current password/i), samePassword)
      await user.type(screen.getByLabelText(/new password/i), samePassword)
      await user.type(screen.getByLabelText(/confirm password/i), samePassword)

      const submitButton = screen.getByRole('button', { name: /update password/i })
      expect(submitButton).toBeDisabled()
    })

    it('submit button is enabled when all validation passes', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      await user.type(screen.getByLabelText(/current password/i), 'OldPass123!')
      await user.type(screen.getByLabelText(/new password/i), 'NewPass456!')
      await user.type(screen.getByLabelText(/confirm password/i), 'NewPass456!')

      const submitButton = screen.getByRole('button', { name: /update password/i })
      expect(submitButton).toBeEnabled()
    })
  })

  describe('Error Messages', () => {
    it('shows error when confirm password does not match', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      await user.type(screen.getByLabelText(/new password/i), 'NewPass123!')
      await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPass!')

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })

    it('shows error when new password equals current password', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      const samePassword = 'SamePass123!'
      await user.type(screen.getByLabelText(/current password/i), samePassword)
      await user.type(screen.getByLabelText(/new password/i), samePassword)

      expect(screen.getByText(/new password must be different from current password/i)).toBeInTheDocument()
    })
  })

  describe('Strength Indicator', () => {
    it('shows strength indicator when typing new password', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      await user.type(screen.getByLabelText(/new password/i), 'Test')

      // Should show requirements checklist (use getAllByText since text may appear multiple times)
      expect(screen.getAllByText(/at least 8 characters/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/one uppercase letter/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/one lowercase letter/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/one number/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/one special character/i).length).toBeGreaterThan(0)
    })
  })

  describe('Submission', () => {
    it('shows success toast on valid submit', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      await user.type(screen.getByLabelText(/current password/i), 'OldPass123!')
      await user.type(screen.getByLabelText(/new password/i), 'NewPass456!')
      await user.type(screen.getByLabelText(/confirm password/i), 'NewPass456!')

      await user.click(screen.getByRole('button', { name: /update password/i }))

      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Password changed successfully',
        type: 'success',
      })
    })

    it('navigates back to settings after success', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderChangePasswordScreen()

      await user.type(screen.getByLabelText(/current password/i), 'OldPass123!')
      await user.type(screen.getByLabelText(/new password/i), 'NewPass456!')
      await user.type(screen.getByLabelText(/confirm password/i), 'NewPass456!')

      await user.click(screen.getByRole('button', { name: /update password/i }))

      // Advance timers by 1.5s for navigation
      vi.advanceTimersByTime(1500)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(PATHS.SETTINGS)
      })
    })
  })
})
