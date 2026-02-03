import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  loadBiometricUserId,
  saveBiometricUserId,
  clearBiometricUserId,
} from '../storage'

const BIOMETRIC_USER_KEY = 'docliq_biometric_user_v1'

describe('biometric storage', () => {
  let localStorageMock: Storage

  beforeEach(() => {
    // Create a fresh localStorage mock for each test
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('loadBiometricUserId', () => {
    it('returns userId when present in localStorage', () => {
      const mockEmail = 'user@example.com'
      localStorageMock.getItem = vi.fn().mockReturnValue(mockEmail)

      const result = loadBiometricUserId()

      expect(result).toBe(mockEmail)
      expect(localStorageMock.getItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY)
      expect(localStorageMock.getItem).toHaveBeenCalledTimes(1)
    })

    it('returns null when no userId in localStorage', () => {
      localStorageMock.getItem = vi.fn().mockReturnValue(null)

      const result = loadBiometricUserId()

      expect(result).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY)
    })

    it('returns null when localStorage throws', () => {
      localStorageMock.getItem = vi.fn().mockImplementation(() => {
        throw new Error('Quota exceeded')
      })

      const result = loadBiometricUserId()

      expect(result).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY)
    })

    it('returns null in Safari private browsing mode', () => {
      // Safari private mode throws on localStorage access
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      })

      const result = loadBiometricUserId()

      expect(result).toBeNull()
    })
  })

  describe('saveBiometricUserId', () => {
    it('saves userId to localStorage when provided', () => {
      const mockEmail = 'user@example.com'

      saveBiometricUserId(mockEmail)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY, mockEmail)
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
      expect(localStorageMock.removeItem).not.toHaveBeenCalled()
    })

    it('removes key from localStorage when userId is null', () => {
      saveBiometricUserId(null)

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY)
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(1)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })

    it('removes key from localStorage when userId is undefined', () => {
      saveBiometricUserId(undefined as unknown as null)

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })

    it('silently handles localStorage quota exceeded error', () => {
      localStorageMock.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Quota exceeded')
      })

      // Should not throw
      expect(() => saveBiometricUserId('user@example.com')).not.toThrow()
    })

    it('silently handles localStorage private mode error', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      })

      // Should not throw
      expect(() => saveBiometricUserId('user@example.com')).not.toThrow()
    })
  })

  describe('clearBiometricUserId', () => {
    it('removes key from localStorage', () => {
      clearBiometricUserId()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY)
      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(1)
    })

    it('silently handles localStorage errors', () => {
      localStorageMock.removeItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage disabled')
      })

      // Should not throw
      expect(() => clearBiometricUserId()).not.toThrow()
    })

    it('silently handles undefined localStorage', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      })

      // Should not throw
      expect(() => clearBiometricUserId()).not.toThrow()
    })
  })

  describe('integration: save and load cycle', () => {
    it('saved userId can be loaded back', () => {
      const mockEmail = 'test@docliq.de'
      
      // Simulate actual localStorage behavior
      const storage: Record<string, string> = {}
      localStorageMock.setItem = vi.fn((key, value) => {
        storage[key] = value
      })
      localStorageMock.getItem = vi.fn((key) => storage[key] || null)
      localStorageMock.removeItem = vi.fn((key) => {
        delete storage[key]
      })

      // Save
      saveBiometricUserId(mockEmail)
      
      // Load
      const loaded = loadBiometricUserId()
      
      expect(loaded).toBe(mockEmail)
    })

    it('cleared userId returns null when loaded', () => {
      const mockEmail = 'test@docliq.de'
      
      // Simulate actual localStorage behavior
      const storage: Record<string, string> = {}
      localStorageMock.setItem = vi.fn((key, value) => {
        storage[key] = value
      })
      localStorageMock.getItem = vi.fn((key) => storage[key] || null)
      localStorageMock.removeItem = vi.fn((key) => {
        delete storage[key]
      })

      // Save then clear
      saveBiometricUserId(mockEmail)
      clearBiometricUserId()
      
      // Load
      const loaded = loadBiometricUserId()
      
      expect(loaded).toBeNull()
    })

    it('overwrites previous userId with new one', () => {
      const firstEmail = 'old@docliq.de'
      const secondEmail = 'new@docliq.de'
      
      const storage: Record<string, string> = {}
      localStorageMock.setItem = vi.fn((key, value) => {
        storage[key] = value
      })
      localStorageMock.getItem = vi.fn((key) => storage[key] || null)

      saveBiometricUserId(firstEmail)
      saveBiometricUserId(secondEmail)
      
      const loaded = loadBiometricUserId()
      
      expect(loaded).toBe(secondEmail)
      expect(loaded).not.toBe(firstEmail)
    })
  })

  describe('edge cases', () => {
    it('handles empty string userId by saving it', () => {
      // Empty string is falsy but valid to store
      saveBiometricUserId('')
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY, '')
    })

    it('handles special characters in email', () => {
      const specialEmail = 'user+test@docliq.de'
      
      saveBiometricUserId(specialEmail)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY, specialEmail)
    })

    it('handles very long email addresses', () => {
      const longEmail = 'a'.repeat(200) + '@docliq.de'
      
      saveBiometricUserId(longEmail)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(BIOMETRIC_USER_KEY, longEmail)
    })
  })
})
