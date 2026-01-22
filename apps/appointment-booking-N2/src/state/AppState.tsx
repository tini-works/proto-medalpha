import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AppState, FamilyMember } from './types'
import { clearState, loadState, saveState } from './storage'

const initialState: AppState = {
  auth: { isAuthenticated: false, verified: false },
  profile: {
    fullName: '',
    emailOrPhone: '',
    insuranceType: '',
    egkNumber: '',
    addressLine: '',
    postalCode: '',
    city: '',
    familyMembers: [],
  },
  preferences: {
    fontScale: 1,
    notifications: { appointmentReminders: true, prescriptionUpdates: true, deals: false },
  },
  history: {
    items: [
      {
        id: 'h1',
        type: 'appointment',
        title: 'Appointment: Primary care',
        subtitle: 'Dr. Wagner Clinic · Berlin',
        dateISO: '2026-01-26',
        status: 'planned',
      },
      {
        id: 'h2',
        type: 'rx',
        title: 'ePrescription redeemed',
        subtitle: 'Delivery · Status available',
        dateISO: '2026-01-18',
        status: 'done',
      },
    ],
  },
}

type AppStateApi = {
  state: AppState
  setFontScale: (scale: AppState['preferences']['fontScale']) => void
  setNotificationPreferences: (patch: Partial<AppState['preferences']['notifications']>) => void
  signIn: (emailOrPhone: string) => void
  signOut: () => void
  markVerified: () => void
  updateProfile: (patch: Partial<AppState['profile']>) => void
  addHistoryItem: (item: AppState['history']['items'][number]) => void
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void
  removeFamilyMember: (id: string) => void
  resetAll: () => void
  isProfileComplete: boolean
}

const Ctx = createContext<AppStateApi | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState(initialState))

  useEffect(() => {
    saveState(state)
    const scale = state.preferences.fontScale
    document.documentElement.style.setProperty('--scale', String(scale))
  }, [state])

  const isProfileComplete = Boolean(
    state.profile.fullName.trim() &&
      state.profile.emailOrPhone.trim() &&
      state.auth.isAuthenticated &&
      state.auth.verified &&
      state.profile.insuranceType &&
      state.profile.egkNumber.trim() &&
      state.profile.addressLine.trim() &&
      state.profile.postalCode.trim() &&
      state.profile.city.trim()
  )

  const api = useMemo<AppStateApi>(
    () => ({
      state,
      setFontScale: (fontScale) => setState((s) => ({ ...s, preferences: { ...s.preferences, fontScale } })),
      setNotificationPreferences: (patch) =>
        setState((s) => ({
          ...s,
          preferences: { ...s.preferences, notifications: { ...s.preferences.notifications, ...patch } },
        })),
      signIn: (emailOrPhone) =>
        setState((s) => ({
          ...s,
          auth: { isAuthenticated: true, verified: false },
          profile: { ...s.profile, emailOrPhone },
        })),
      signOut: () =>
        setState((s) => ({
          ...s,
          auth: { isAuthenticated: false, verified: false },
        })),
      markVerified: () => setState((s) => ({ ...s, auth: { ...s.auth, verified: true } })),
      updateProfile: (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
      addHistoryItem: (item) => setState((s) => ({ ...s, history: { ...s.history, items: [item, ...s.history.items] } })),
      addFamilyMember: (member) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            familyMembers: [...s.profile.familyMembers, { ...member, id: `fam_${Date.now()}` }],
          },
        })),
      removeFamilyMember: (id) =>
        setState((s) => ({
          ...s,
          profile: { ...s.profile, familyMembers: s.profile.familyMembers.filter((m) => m.id !== id) },
        })),
      resetAll: () => {
        clearState()
        setState(initialState)
      },
      isProfileComplete,
    }),
    [state, isProfileComplete]
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useAppState() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppState must be used within AppStateProvider')
  return v
}
