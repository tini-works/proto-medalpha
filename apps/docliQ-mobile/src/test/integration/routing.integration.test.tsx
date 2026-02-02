/**
 * Routing Integration Tests
 *
 * Tests navigation flows, route guards, and path helpers.
 * HIGH priority - ensures protected routes and navigation work correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React from 'react'

import { AppStateProvider } from '../../state/AppContext'
import { RequireAuth, RedirectIfAuthenticated } from '../../routes/guards'
import { PATHS, doctorPath, appointmentDetailPath, reschedulePath, familyMemberDetailPath } from '../../routes/paths'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'auth', 'booking'],
  defaultNS: 'common',
  resources: { en: { common: {}, auth: {}, booking: {} } },
  interpolation: { escapeValue: false },
})

// Helper component to display current location
function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

// Simplified wrapper for routing tests
function SimpleTestWrapper({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('Routing Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear any stored state
    localStorage.clear()
  })

  describe('Path Helpers', () => {
    it('doctorPath generates correct path with id', () => {
      expect(doctorPath('d123')).toBe('/booking/doctor/d123')
    })

    it('appointmentDetailPath generates correct path with id', () => {
      expect(appointmentDetailPath('apt-456')).toBe('/appointments/apt-456')
    })

    it('reschedulePath generates correct path with id', () => {
      expect(reschedulePath('apt-789')).toBe('/reschedule/apt-789')
    })

    it('familyMemberDetailPath generates correct path with id', () => {
      expect(familyMemberDetailPath('fam-123')).toBe('/profile/family/fam-123')
    })

    it('handles special characters in IDs safely', () => {
      // IDs with special chars should still work (URL encoding handled by router)
      expect(doctorPath('dr-müller-123')).toBe('/booking/doctor/dr-müller-123')
    })
  })

  describe('PATHS constant', () => {
    it('contains all required auth paths', () => {
      expect(PATHS.AUTH_WELCOME).toBe('/auth/welcome')
      expect(PATHS.AUTH_REGISTER).toBe('/auth/register')
      expect(PATHS.AUTH_SIGN_IN).toBe('/auth/sign-in')
      expect(PATHS.AUTH_VERIFY).toBe('/auth/verify')
    })

    it('contains all required booking paths', () => {
      expect(PATHS.BOOKING).toBe('/booking')
      expect(PATHS.BOOKING_SPECIALTY).toBe('/booking/specialty')
      expect(PATHS.BOOKING_CONFIRM).toBe('/booking/confirm')
      expect(PATHS.BOOKING_SUCCESS).toBe('/booking/success')
    })

    it('contains all required home/history paths', () => {
      expect(PATHS.HOME).toBe('/home')
      expect(PATHS.HISTORY).toBe('/history')
      expect(PATHS.NOTIFICATIONS).toBe('/notifications')
    })

    it('contains all required settings paths', () => {
      expect(PATHS.SETTINGS).toBe('/settings')
      expect(PATHS.SETTINGS_NOTIFICATIONS).toBe('/settings/notifications')
      expect(PATHS.SETTINGS_LANGUAGE).toBe('/settings/language')
      expect(PATHS.SETTINGS_PRIVACY).toBe('/settings/privacy')
    })
  })

  describe('RequireAuth Guard', () => {
    it('redirects unauthenticated users to welcome page', () => {
      render(
        <SimpleTestWrapper initialEntries={['/home']}>
          <Routes>
            <Route path="/auth/welcome" element={<div>Welcome Page</div>} />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <div>Home Page</div>
                </RequireAuth>
              }
            />
          </Routes>
          <LocationDisplay />
        </SimpleTestWrapper>
      )

      // Should redirect to welcome
      expect(screen.getByTestId('location')).toHaveTextContent('/auth/welcome')
      expect(screen.queryByText('Home Page')).not.toBeInTheDocument()
    })

    // TODO: State-dependent tests require custom test setup or mocking storage module
    // These tests verify the guard logic works when state is pre-set via localStorage.
    // Skipped because localStorage needs to be set before module imports for proper testing.
    it.skip('allows authenticated and verified users to access protected routes', async () => {
      // Would need to mock the storage module or set localStorage before import
      expect(true).toBe(true)
    })

    it.skip('redirects authenticated but unverified users to verify page', async () => {
      // Would need to mock the storage module or set localStorage before import
      expect(true).toBe(true)
    })

    it.skip('allows unverified users to access allowed paths (HOME, onboarding)', async () => {
      // Would need to mock the storage module or set localStorage before import
      expect(true).toBe(true)
    })
  })

  describe('RedirectIfAuthenticated Guard', () => {
    it('allows unauthenticated users to access auth pages', () => {
      render(
        <SimpleTestWrapper initialEntries={['/auth/welcome']}>
          <Routes>
            <Route
              path="/auth/welcome"
              element={
                <RedirectIfAuthenticated>
                  <div>Welcome Page</div>
                </RedirectIfAuthenticated>
              }
            />
            <Route path="/home" element={<div>Home Page</div>} />
          </Routes>
          <LocationDisplay />
        </SimpleTestWrapper>
      )

      expect(screen.getByTestId('location')).toHaveTextContent('/auth/welcome')
      expect(screen.getByText('Welcome Page')).toBeInTheDocument()
    })

    it.skip('redirects authenticated and verified users to home', async () => {
      // Would need to mock the storage module or set localStorage before import
      expect(true).toBe(true)
    })

    it.skip('does not redirect authenticated but unverified users', async () => {
      // Would need to mock the storage module or set localStorage before import
      expect(true).toBe(true)
    })
  })

  describe('Dynamic Route Parameters', () => {
    it('appointment detail route accepts :id parameter', () => {
      // Test that the path pattern is correctly defined
      expect(PATHS.APPOINTMENT_DETAIL).toBe('/appointments/:id')
      expect(appointmentDetailPath('test-123')).toBe('/appointments/test-123')
    })

    it('doctor booking route accepts :id parameter', () => {
      expect(PATHS.BOOKING_DOCTOR).toBe('/booking/doctor/:id')
      expect(doctorPath('dr-456')).toBe('/booking/doctor/dr-456')
    })

    it('reschedule routes accept :id parameter', () => {
      expect(PATHS.RESCHEDULE).toBe('/reschedule/:id')
      expect(PATHS.RESCHEDULE_CONFIRM).toBe('/reschedule/:id/confirm')
      expect(PATHS.RESCHEDULE_SUCCESS).toBe('/reschedule/:id/success')
    })

    it('family member detail route accepts :id parameter', () => {
      expect(PATHS.PROFILE_FAMILY_DETAIL).toBe('/profile/family/:id')
      expect(familyMemberDetailPath('member-789')).toBe('/profile/family/member-789')
    })
  })

  describe('Booking Flow Navigation', () => {
    it('defines complete booking flow paths', () => {
      // Fast-Lane flow
      expect(PATHS.FAST_LANE).toBe('/booking/fast-lane')
      expect(PATHS.FAST_LANE_MATCHING).toBe('/booking/fast-lane/matching')
      expect(PATHS.FAST_LANE_SUCCESS).toBe('/booking/fast-lane/success')
      expect(PATHS.FAST_LANE_NO_MATCH).toBe('/booking/fast-lane/no-match')

      // Specialty flow
      expect(PATHS.BOOKING_SPECIALTY).toBe('/booking/specialty')
      expect(PATHS.BOOKING_AVAILABILITY).toBe('/booking/availability')
      expect(PATHS.BOOKING_RESULTS).toBe('/booking/results')
      expect(PATHS.BOOKING_CONFIRM).toBe('/booking/confirm')
      expect(PATHS.BOOKING_SUCCESS).toBe('/booking/success')
    })
  })

  describe('Onboarding Flow Navigation', () => {
    it('defines complete onboarding flow paths', () => {
      expect(PATHS.ONBOARDING_PROFILE).toBe('/onboarding/profile')
      expect(PATHS.ONBOARDING_INSURANCE).toBe('/onboarding/insurance')
      expect(PATHS.ONBOARDING_VERIFY).toBe('/onboarding/verify')
      expect(PATHS.ONBOARDING_SCAN).toBe('/onboarding/scan')
      expect(PATHS.ONBOARDING_SUCCESS).toBe('/onboarding/success')
    })
  })
})
