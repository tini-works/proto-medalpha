/**
 * Epic 1.4: Customer Account Management Contract Tests
 *
 * Business requirements from User Stories (US 1.4.1)
 * Tests for account management including deletion and settings.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React from 'react'

import { AppStateProvider } from '../../state/AppContext'
import { PATHS } from '../../routes/paths'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'settings'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {
        cancel: 'Cancel',
      },
      settings: {
        profileOverview: 'Profile',
        'sections.profileInformation': 'Profile Information',
        'sections.securitySettings': 'Security Settings',
        'sections.appSettings': 'App Settings',
        personalInformation: 'Personal Information',
        personalInformationDesc: 'Name, email, phone',
        address: 'Address',
        addressDesc: 'Home address',
        insurance: 'Insurance',
        insuranceDesc: 'Insurance provider',
        familyMembers: 'Family Members',
        familyMembersDesc: 'Manage dependents',
        changePassword: 'Change Password',
        changePasswordDesc: 'Update your password',
        biometrics: 'Biometrics',
        biometricsDesc: 'Face ID / Touch ID',
        biometricsOn: 'On',
        biometricsOff: 'Off',
        privacyData: 'Privacy & Data',
        privacyDataDesc: 'Manage your data',
        notifications: 'Notifications',
        notificationsDesc: 'Push notifications',
        language: 'Language',
        support: 'Support',
        faqs: 'FAQs',
        contactSupport: 'Contact Support',
        helpCenter: 'Help Center',
        logOut: 'Log Out',
        signOut: 'Sign Out',
        confirmSignOut: 'Are you sure you want to sign out?',
        versionFooter: 'Version 1.0.0',
        publicInsurance: 'Public Insurance',
        privateInsurance: 'Private Insurance',
        noInsurance: 'No Insurance',
      },
    },
  },
  interpolation: { escapeValue: false },
})

function ContractTestWrapper({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode
  initialEntries?: string[]
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppStateProvider>{children}</AppStateProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

/**
 * Epic 1.4: Account Management Contracts
 *
 * Business Requirement:
 * Users should be able to manage their account settings including
 * profile information, security settings, and account deletion.
 */
describe('Epic 1.4: Account Management Contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('US 1.4.1: Account Settings', () => {
    it('Contract: settings-screen-sections - Settings screen shows all sections', async () => {
      const { default: SettingsScreen } = await import(
        '../../screens/settings/SettingsScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.SETTINGS]}>
          <Routes>
            <Route path={PATHS.SETTINGS} element={<SettingsScreen />} />
            <Route path={PATHS.PROFILE_EDIT} element={<div>Edit Profile</div>} />
            <Route path={PATHS.SETTINGS_ADDRESS} element={<div>Address</div>} />
            <Route path={PATHS.SETTINGS_INSURANCE} element={<div>Insurance</div>} />
            <Route path={PATHS.PROFILE_FAMILY} element={<div>Family</div>} />
            <Route path={PATHS.SETTINGS_PASSWORD} element={<div>Password</div>} />
            <Route path={PATHS.SETTINGS_BIOMETRICS} element={<div>Biometrics</div>} />
            <Route path={PATHS.SETTINGS_PRIVACY} element={<div>Privacy</div>} />
            <Route path={PATHS.SETTINGS_NOTIFICATIONS} element={<div>Notifications</div>} />
            <Route path={PATHS.SETTINGS_LANGUAGE} element={<div>Language</div>} />
            <Route path={PATHS.SETTINGS_FAQ} element={<div>FAQ</div>} />
            <Route path={PATHS.SETTINGS_CONTACT} element={<div>Contact</div>} />
            <Route path={PATHS.SETTINGS_HELP} element={<div>Help</div>} />
            <Route path={PATHS.AUTH_WELCOME} element={<div>Welcome</div>} />
          </Routes>
        </ContractTestWrapper>
      )

      // Verify sections are present
      expect(screen.getByText('Profile Information')).toBeInTheDocument()
      expect(screen.getByText('Security Settings')).toBeInTheDocument()
      expect(screen.getByText('App Settings')).toBeInTheDocument()
      expect(screen.getByText('Support')).toBeInTheDocument()
    })

    it('Contract: settings-profile-items - Profile section shows all items', async () => {
      const { default: SettingsScreen } = await import(
        '../../screens/settings/SettingsScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.SETTINGS]}>
          <Routes>
            <Route path={PATHS.SETTINGS} element={<SettingsScreen />} />
            <Route path="*" element={<div>Other</div>} />
          </Routes>
        </ContractTestWrapper>
      )

      // Verify profile items
      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('Address')).toBeInTheDocument()
      expect(screen.getByText('Insurance')).toBeInTheDocument()
      expect(screen.getByText('Family Members')).toBeInTheDocument()
    })

    it('Contract: settings-security-items - Security section shows all items', async () => {
      const { default: SettingsScreen } = await import(
        '../../screens/settings/SettingsScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.SETTINGS]}>
          <Routes>
            <Route path={PATHS.SETTINGS} element={<SettingsScreen />} />
            <Route path="*" element={<div>Other</div>} />
          </Routes>
        </ContractTestWrapper>
      )

      // Verify security items
      expect(screen.getByText('Change Password')).toBeInTheDocument()
      expect(screen.getByText('Biometrics')).toBeInTheDocument()
      expect(screen.getByText('Privacy & Data')).toBeInTheDocument()
    })

    it('Contract: settings-logout-button - Log out button is present', async () => {
      const { default: SettingsScreen } = await import(
        '../../screens/settings/SettingsScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.SETTINGS]}>
          <Routes>
            <Route path={PATHS.SETTINGS} element={<SettingsScreen />} />
            <Route path="*" element={<div>Other</div>} />
          </Routes>
        </ContractTestWrapper>
      )

      expect(screen.getByText('Log Out')).toBeInTheDocument()
    })

    it('Contract: settings-logout-shows-confirmation - Log out shows confirmation modal', async () => {
      const user = userEvent.setup()
      const { default: SettingsScreen } = await import(
        '../../screens/settings/SettingsScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.SETTINGS]}>
          <Routes>
            <Route path={PATHS.SETTINGS} element={<SettingsScreen />} />
            <Route path="*" element={<div>Other</div>} />
          </Routes>
        </ContractTestWrapper>
      )

      // Click log out button
      const logoutButton = screen.getByRole('button', { name: /log out/i })
      await user.click(logoutButton)

      // Verify confirmation modal appears
      await waitFor(() => {
        expect(screen.getByText('Sign Out')).toBeInTheDocument()
        expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument()
      })
    })

    it('Contract: settings-paths-defined - All settings paths are configured', () => {
      expect(PATHS.SETTINGS).toBeDefined()
      expect(PATHS.PROFILE_EDIT).toBeDefined()
      expect(PATHS.SETTINGS_ADDRESS).toBeDefined()
      expect(PATHS.SETTINGS_INSURANCE).toBeDefined()
      expect(PATHS.PROFILE_FAMILY).toBeDefined()
      expect(PATHS.SETTINGS_PASSWORD).toBeDefined()
      expect(PATHS.SETTINGS_BIOMETRICS).toBeDefined()
      expect(PATHS.SETTINGS_PRIVACY).toBeDefined()
      expect(PATHS.SETTINGS_NOTIFICATIONS).toBeDefined()
      expect(PATHS.SETTINGS_LANGUAGE).toBeDefined()
    })
  })
})
