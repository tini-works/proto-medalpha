import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type {
  AppState,
  FamilyMember,
  UserProfile,
  Doctor,
  TimeSlot,
  SearchFilters,
  HistoryItem,
  Appointment,
  RescheduleContext,
  BookAgainContext,
} from '../types'
import { initialState } from '../types'
import { clearState, loadState, saveState } from './storage'

// Extended state for reschedule and book again flows (not persisted)
interface ExtendedState {
  reschedule: RescheduleContext | null
  bookAgain: BookAgainContext | null
}

type AppStateApi = {
  state: AppState
  extendedState: ExtendedState
  // Auth
  signIn: (email: string) => void
  signOut: () => void
  markVerified: () => void
  // Profile
  updateProfile: (patch: Partial<UserProfile>) => void
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void
  removeFamilyMember: (id: string) => void
  updateFamilyMember: (id: string, patch: Partial<FamilyMember>) => void
  updateGdprConsent: (consent: Partial<AppState['profile']['gdprConsent']>) => void
  // Preferences
  setFontScale: (scale: AppState['preferences']['fontScale']) => void
  setLanguage: (language: AppState['preferences']['language']) => void
  setNotificationPreferences: (patch: Partial<AppState['preferences']['notifications']>) => void
  // Booking
  setSearchFilters: (filters: SearchFilters) => void
  selectDoctor: (doctor: Doctor | null) => void
  selectSlot: (slot: TimeSlot | null) => void
  selectFamilyMember: (id: string | null) => void
  resetBooking: () => void
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, patch: Partial<Appointment>) => void
  cancelAppointment: (id: string) => void
  // History
  addHistoryItem: (item: HistoryItem) => void
  updateHistoryItem: (id: string, patch: Partial<HistoryItem>) => void
  // Reschedule
  setRescheduleContext: (context: RescheduleContext | null) => void
  setRescheduleNewSlot: (slot: TimeSlot | null) => void
  // Book Again
  setBookAgainContext: (context: BookAgainContext | null) => void
  // Computed
  isProfileComplete: boolean
  getAppointmentById: (id: string) => Appointment | undefined
  getHistoryItemById: (id: string) => HistoryItem | undefined
  // Reset
  resetAll: () => void
}

const Ctx = createContext<AppStateApi | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState(initialState))
  const [extendedState, setExtendedState] = useState<ExtendedState>({
    reschedule: null,
    bookAgain: null,
  })

  useEffect(() => {
    saveState(state)
    const scale = state.preferences.fontScale
    document.documentElement.style.setProperty('--scale', String(scale))
  }, [state])

  const isProfileComplete = Boolean(
    state.profile.fullName.trim() &&
      state.profile.email.trim() &&
      state.auth.isAuthenticated &&
      state.auth.verified &&
      state.profile.egkNumber.trim() &&
      state.profile.address.street.trim() &&
      state.profile.address.postalCode.trim() &&
      state.profile.address.city.trim() &&
      state.profile.gdprConsent.dataProcessing
  )

  const api = useMemo<AppStateApi>(
    () => ({
      state,
      extendedState,
      isProfileComplete,

      // Auth
      signIn: (email) =>
        setState((s) => ({
          ...s,
          auth: { isAuthenticated: true, verified: false, userId: `user_${Date.now()}` },
          profile: { ...s.profile, email },
        })),
      signOut: () =>
        setState((s) => ({
          ...s,
          auth: { isAuthenticated: false, verified: false, userId: null },
        })),
      markVerified: () =>
        setState((s) => ({
          ...s,
          auth: { ...s.auth, verified: true },
        })),

      // Profile
      updateProfile: (patch) =>
        setState((s) => ({
          ...s,
          profile: { ...s.profile, ...patch },
        })),
      addFamilyMember: (member) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            familyMembers: [
              ...s.profile.familyMembers,
              { ...member, id: `fam_${Date.now()}`, verified: false },
            ],
          },
        })),
      removeFamilyMember: (id) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            familyMembers: s.profile.familyMembers.filter((m) => m.id !== id),
          },
        })),
      updateFamilyMember: (id, patch) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            familyMembers: s.profile.familyMembers.map((m) =>
              m.id === id ? { ...m, ...patch } : m
            ),
          },
        })),
      updateGdprConsent: (consent) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            gdprConsent: {
              ...s.profile.gdprConsent,
              ...consent,
              consentDate: consent.dataProcessing ? new Date().toISOString() : s.profile.gdprConsent.consentDate,
            },
          },
        })),

      // Preferences
      setFontScale: (fontScale) =>
        setState((s) => ({
          ...s,
          preferences: { ...s.preferences, fontScale },
        })),
      setLanguage: (language) =>
        setState((s) => ({
          ...s,
          preferences: { ...s.preferences, language },
        })),
      setNotificationPreferences: (patch) =>
        setState((s) => ({
          ...s,
          preferences: {
            ...s.preferences,
            notifications: { ...s.preferences.notifications, ...patch },
          },
        })),

      // Booking
      setSearchFilters: (filters) =>
        setState((s) => ({
          ...s,
          booking: { ...s.booking, currentSearch: filters },
        })),
      selectDoctor: (doctor) =>
        setState((s) => ({
          ...s,
          booking: { ...s.booking, selectedDoctor: doctor },
        })),
      selectSlot: (slot) =>
        setState((s) => ({
          ...s,
          booking: { ...s.booking, selectedSlot: slot },
        })),
      selectFamilyMember: (id) =>
        setState((s) => ({
          ...s,
          booking: { ...s.booking, selectedFamilyMemberId: id },
        })),
      resetBooking: () =>
        setState((s) => ({
          ...s,
          booking: {
            currentSearch: null,
            selectedDoctor: null,
            selectedSlot: null,
            selectedFamilyMemberId: null,
          },
        })),
      addAppointment: (appointment) =>
        setState((s) => ({
          ...s,
          appointments: [...s.appointments, appointment],
        })),
      updateAppointment: (id, patch) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((apt) => (apt.id === id ? { ...apt, ...patch } : apt)),
        })),
      cancelAppointment: (id) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((apt) =>
            apt.id === id ? { ...apt, status: 'cancelled_patient' as const } : apt
          ),
        })),

      // History
      addHistoryItem: (item) =>
        setState((s) => ({
          ...s,
          history: { ...s.history, items: [item, ...s.history.items] },
        })),
      updateHistoryItem: (id, patch) =>
        setState((s) => ({
          ...s,
          history: {
            ...s.history,
            items: s.history.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
          },
        })),

      // Reschedule
      setRescheduleContext: (context) =>
        setExtendedState((s) => ({ ...s, reschedule: context })),
      setRescheduleNewSlot: (slot) =>
        setExtendedState((s) => ({
          ...s,
          reschedule: s.reschedule ? { ...s.reschedule, selectedNewSlot: slot } : null,
        })),

      // Book Again
      setBookAgainContext: (context) =>
        setExtendedState((s) => ({ ...s, bookAgain: context })),

      // Computed/getters
      getAppointmentById: (id) => state.appointments.find((apt) => apt.id === id),
      getHistoryItemById: (id) => state.history.items.find((item) => item.id === id),

      // Reset
      resetAll: () => {
        clearState()
        setState(initialState)
        setExtendedState({ reschedule: null, bookAgain: null })
      },
    }),
    [state, extendedState, isProfileComplete]
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useAppState() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppState must be used within AppStateProvider')
  return v
}

// Convenience hooks
export function useAuth() {
  const { state, signIn, signOut, markVerified } = useAppState()
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerified: state.auth.verified,
    userId: state.auth.userId,
    signIn,
    signOut,
    markVerified,
  }
}

export function useProfile() {
  const {
    state,
    updateProfile,
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMember,
    updateGdprConsent,
    isProfileComplete,
  } = useAppState()
  return {
    profile: state.profile,
    isProfileComplete,
    updateProfile,
    addFamilyMember,
    removeFamilyMember,
    updateFamilyMember,
    updateGdprConsent,
  }
}

export function useBooking() {
  const {
    state,
    setSearchFilters,
    selectDoctor,
    selectSlot,
    selectFamilyMember,
    resetBooking,
    addAppointment,
    updateAppointment,
    cancelAppointment,
  } = useAppState()
  return {
    search: state.booking.currentSearch,
    selectedDoctor: state.booking.selectedDoctor,
    selectedSlot: state.booking.selectedSlot,
    selectedFamilyMemberId: state.booking.selectedFamilyMemberId,
    appointments: state.appointments,
    setSearchFilters,
    selectDoctor,
    selectSlot,
    selectFamilyMember,
    resetBooking,
    addAppointment,
    updateAppointment,
    cancelAppointment,
  }
}

export function useHistory() {
  const { state, addHistoryItem, updateHistoryItem } = useAppState()
  return {
    items: state.history.items,
    addHistoryItem,
    updateHistoryItem,
    getFilteredItems: (filters: { type?: string; familyMemberId?: string; dateFrom?: string; dateTo?: string }) => {
      return state.history.items.filter((item) => {
        if (filters.type && filters.type !== 'all' && item.type !== filters.type) return false
        if (filters.familyMemberId && filters.familyMemberId !== 'all' && item.forUserId !== filters.familyMemberId)
          return false
        if (filters.dateFrom && item.dateISO < filters.dateFrom) return false
        if (filters.dateTo && item.dateISO > filters.dateTo) return false
        return true
      })
    },
  }
}

export function usePreferences() {
  const { state, setFontScale, setLanguage, setNotificationPreferences } = useAppState()
  return {
    fontScale: state.preferences.fontScale,
    language: state.preferences.language,
    notifications: state.preferences.notifications,
    setFontScale,
    setLanguage,
    setNotificationPreferences,
  }
}

export function useReschedule() {
  const {
    extendedState,
    setRescheduleContext,
    setRescheduleNewSlot,
    updateAppointment,
    cancelAppointment,
    addAppointment,
    addHistoryItem,
    getAppointmentById,
  } = useAppState()
  return {
    rescheduleContext: extendedState.reschedule,
    setRescheduleContext,
    setRescheduleNewSlot,
    updateAppointment,
    cancelAppointment,
    addAppointment,
    addHistoryItem,
    getAppointmentById,
  }
}

export function useBookAgain() {
  const { extendedState, setBookAgainContext, getHistoryItemById, getAppointmentById } = useAppState()
  return {
    bookAgainContext: extendedState.bookAgain,
    setBookAgainContext,
    getHistoryItemById,
    getAppointmentById,
  }
}
