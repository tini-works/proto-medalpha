import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AppStateProvider, usePreferences, useAppState } from '../AppContext'
import React from 'react'

// Mock the storage module
vi.mock('../storage', () => ({
  loadState: vi.fn(() => ({
    auth: { isAuthenticated: true, verified: true, userId: 'user_123' },
    profile: {
      id: 'user_123',
      fullName: 'Test User',
      email: 'test@docliq.de',
      phone: '',
      phoneCountryCode: '+49',
      dateOfBirth: '',
      gender: '',
      insuranceType: '',
      egkNumber: '',
      address: { street: '', postalCode: '', city: '' },
      familyMembers: [],
      gdprConsent: { dataProcessing: false, marketing: false },
      identityVerified: false,
      photoUrl: '',
      authProvider: 'email',
    },
    preferences: {
      fontScale: 1,
      language: 'en',
      biometricsEnabled: false,
      notifications: {
        email: true,
        push: true,
        appointments: true,
        marketing: false,
      },
      disableDemoAppointmentsSeed: false,
    },
    booking: {
      currentSearch: null,
      selectedDoctor: null,
      selectedSlot: null,
      selectedFamilyMemberId: null,
      availabilityPrefs: null,
    },
    appointments: [],
    history: { items: [] },
    searchCache: {},
  })),
  saveState: vi.fn(),
  loadPendingDeletion: vi.fn(() => null),
  savePendingDeletion: vi.fn(),
  clearPendingDeletion: vi.fn(),
  loadBiometricUserId: vi.fn(() => null),
  saveBiometricUserId: vi.fn(),
  clearBiometricUserId: vi.fn(),
  clearState: vi.fn(),
}))

// Import mocked functions for assertions
import {
  saveBiometricUserId,
  clearBiometricUserId,
  loadBiometricUserId,
} from '../storage'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppStateProvider>{children}</AppStateProvider>
)

describe('AppContext biometrics integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset loadBiometricUserId to return null by default
    vi.mocked(loadBiometricUserId).mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('enableBiometrics', () => {
    it('sets biometricsEnabled to true in preferences', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper })

      expect(result.current.biometricsEnabled).toBe(false)

      await act(async () => {
        result.current.enableBiometrics()
      })

      expect(result.current.biometricsEnabled).toBe(true)
    })

    it('saves current user email to storage', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper })

      await act(async () => {
        result.current.enableBiometrics()
      })

      expect(saveBiometricUserId).toHaveBeenCalledWith('test@docliq.de')
      expect(saveBiometricUserId).toHaveBeenCalledTimes(1)
    })

    it('sets biometricUserId in extended state', async () => {
      const { result } = renderHook(() => useAppState(), { wrapper })

      expect(result.current.biometricUserId).toBeNull()

      await act(async () => {
        result.current.enableBiometrics()
      })

      expect(result.current.biometricUserId).toBe('test@docliq.de')
    })

    it('syncs state and storage atomically', async () => {
      const { result: prefsResult } = renderHook(() => usePreferences(), { wrapper })
      const { result: stateResult } = renderHook(() => useAppState(), { wrapper })

      await act(async () => {
        prefsResult.current.enableBiometrics()
      })

      // Both state updates should happen together
      expect(stateResult.current.biometricUserId).toBe('test@docliq.de')
      expect(prefsResult.current.biometricsEnabled).toBe(true)
      expect(saveBiometricUserId).toHaveBeenCalledWith('test@docliq.de')
    })

    it('uses current profile email when user is authenticated', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper })

      await act(async () => {
        result.current.enableBiometrics()
      })

      // Email comes from mocked profile state
      expect(saveBiometricUserId).toHaveBeenCalledWith('test@docliq.de')
    })
  })

  describe('disableBiometrics', () => {
    it('sets biometricsEnabled to false in preferences', async () => {
      // First enable
      vi.mocked(loadBiometricUserId).mockReturnValue('test@docliq.de')
      
      const { result } = renderHook(() => usePreferences(), { wrapper })

      // Enable first
      await act(async () => {
        result.current.enableBiometrics()
      })
      
      expect(result.current.biometricsEnabled).toBe(true)

      // Then disable
      await act(async () => {
        result.current.disableBiometrics()
      })

      expect(result.current.biometricsEnabled).toBe(false)
    })

    it('clears biometricUserId from storage', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper })

      // Enable then disable
      await act(async () => {
        result.current.enableBiometrics()
      })
      
      await act(async () => {
        result.current.disableBiometrics()
      })

      expect(clearBiometricUserId).toHaveBeenCalledTimes(1)
    })

    it('clears biometricUserId from extended state', async () => {
      const { result: prefsResult } = renderHook(() => usePreferences(), { wrapper })
      const { result: stateResult } = renderHook(() => useAppState(), { wrapper })

      // Enable
      await act(async () => {
        prefsResult.current.enableBiometrics()
      })
      
      expect(stateResult.current.biometricUserId).toBe('test@docliq.de')

      // Disable
      await act(async () => {
        prefsResult.current.disableBiometrics()
      })

      expect(stateResult.current.biometricUserId).toBeNull()
    })

    it('handles disable when already disabled gracefully', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper })

      // Disable without ever enabling
      await act(async () => {
        result.current.disableBiometrics()
      })

      expect(result.current.biometricsEnabled).toBe(false)
      expect(clearBiometricUserId).toHaveBeenCalled()
    })
  })

  describe('toggle flow', () => {
    it('complete enable then disable cycle', async () => {
      const { result: prefsResult } = renderHook(() => usePreferences(), { wrapper })
      const { result: stateResult } = renderHook(() => useAppState(), { wrapper })

      // Initial state
      expect(prefsResult.current.biometricsEnabled).toBe(false)
      expect(stateResult.current.biometricUserId).toBeNull()

      // Enable
      await act(async () => {
        prefsResult.current.enableBiometrics()
      })

      expect(prefsResult.current.biometricsEnabled).toBe(true)
      expect(stateResult.current.biometricUserId).toBe('test@docliq.de')
      expect(saveBiometricUserId).toHaveBeenCalledWith('test@docliq.de')

      // Disable
      await act(async () => {
        prefsResult.current.disableBiometrics()
      })

      expect(prefsResult.current.biometricsEnabled).toBe(false)
      expect(stateResult.current.biometricUserId).toBeNull()
      expect(clearBiometricUserId).toHaveBeenCalled()
    })

    it('handles rapid enable/disable toggling', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper })

      // Rapid toggling
      await act(async () => {
        result.current.enableBiometrics()
        result.current.disableBiometrics()
        result.current.enableBiometrics()
        result.current.disableBiometrics()
      })

      // Should end in disabled state
      expect(result.current.biometricsEnabled).toBe(false)
      
      // Storage should have been called multiple times
      expect(saveBiometricUserId).toHaveBeenCalledTimes(2)
      expect(clearBiometricUserId).toHaveBeenCalledTimes(2)
    })
  })

  describe('setBiometricsEnabled direct setter', () => {
    it('updates preference without touching storage', async () => {
      const { result } = renderHook(() => usePreferences(), { wrapper })

      await act(async () => {
        result.current.setBiometricsEnabled(true)
      })

      expect(result.current.biometricsEnabled).toBe(true)
      // Should not call storage functions
      expect(saveBiometricUserId).not.toHaveBeenCalled()
      expect(clearBiometricUserId).not.toHaveBeenCalled()
    })

    it('can be used independently of enableBiometrics', async () => {
      const { result: prefsResult } = renderHook(() => usePreferences(), { wrapper })
      const { result: stateResult } = renderHook(() => useAppState(), { wrapper })

      // Use direct setter
      await act(async () => {
        prefsResult.current.setBiometricsEnabled(true)
      })

      expect(prefsResult.current.biometricsEnabled).toBe(true)
      // But extended state is not updated
      expect(stateResult.current.biometricUserId).toBeNull()
    })
  })

  describe('initial state from storage', () => {
    it('loads biometricUserId from storage on mount', async () => {
      const storedEmail = 'stored@docliq.de'
      vi.mocked(loadBiometricUserId).mockReturnValue(storedEmail)

      const { result } = renderHook(() => useAppState(), { wrapper })

      await waitFor(() => {
        expect(result.current.biometricUserId).toBe(storedEmail)
      })
    })

    it('handles null from storage gracefully', async () => {
      vi.mocked(loadBiometricUserId).mockReturnValue(null)

      const { result } = renderHook(() => useAppState(), { wrapper })

      await waitFor(() => {
        expect(result.current.biometricUserId).toBeNull()
      })
    })
  })

  describe('edge cases', () => {
    it('handles storage save failure silently', async () => {
      vi.mocked(saveBiometricUserId).mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const { result } = renderHook(() => usePreferences(), { wrapper })

      // Should not throw even if storage fails
      await act(async () => {
        result.current.enableBiometrics()
      })

      // State should still be updated
      expect(result.current.biometricsEnabled).toBe(true)
    })

    it('handles storage clear failure silently', async () => {
      vi.mocked(clearBiometricUserId).mockImplementation(() => {
        throw new Error('Storage error')
      })

      const { result } = renderHook(() => usePreferences(), { wrapper })

      // Enable first
      await act(async () => {
        result.current.enableBiometrics()
      })

      // Should not throw even if storage clear fails
      await act(async () => {
        result.current.disableBiometrics()
      })

      // State should still be updated
      expect(result.current.biometricsEnabled).toBe(false)
    })

    it('uses empty string if email somehow missing', async () => {
      // Mock loadState to return empty email
      const { loadState } = await import('../storage')
      vi.mocked(loadState).mockReturnValueOnce({
        auth: { isAuthenticated: true, verified: true, userId: 'user_123' },
        profile: {
          id: 'user_123',
          fullName: 'Test User',
          email: '', // Empty email
          phone: '',
          phoneCountryCode: '+49',
          dateOfBirth: '',
          gender: '',
          insuranceType: '',
          egkNumber: '',
          address: { street: '', postalCode: '', city: '' },
          familyMembers: [],
          gdprConsent: { dataProcessing: false, marketing: false },
          identityVerified: false,
          photoUrl: '',
          authProvider: 'email',
        },
        preferences: {
          fontScale: 1,
          language: 'en',
          biometricsEnabled: false,
          notifications: {
            email: true,
            push: true,
            appointments: true,
            marketing: false,
          },
          disableDemoAppointmentsSeed: false,
        },
        booking: {
          currentSearch: null,
          selectedDoctor: null,
          selectedSlot: null,
          selectedFamilyMemberId: null,
          availabilityPrefs: null,
        },
        appointments: [],
        history: { items: [] },
        searchCache: {},
      })

      const { result } = renderHook(() => usePreferences(), { wrapper })

      await act(async () => {
        result.current.enableBiometrics()
      })

      // Should save empty string
      expect(saveBiometricUserId).toHaveBeenCalledWith('')
    })
  })
})
