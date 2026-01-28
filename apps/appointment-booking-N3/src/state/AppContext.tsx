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
    setState((s) => {
      const now = Date.now()

      const isoDay = (offsetDays: number) =>
        new Date(now + offsetDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      const isoAt = (offsetMinutes: number) => new Date(now + offsetMinutes * 60 * 1000).toISOString()

      const seed = [
        {
          id: 'seed_matching',
          doctorId: 'd1',
          doctorName: 'Dr. Sarah Weber',
          specialty: 'Dermatology',
          dateISO: isoDay(2),
          time: '09:30',
          forUserId: s.profile.id || 'self',
          forUserName: s.profile.fullName || 'You',
          status: 'matching' as const,
          reminderSet: true,
          calendarSynced: false,
          createdAt: isoAt(-1440),
          updatedAt: isoAt(-20),
        },
        {
          id: 'seed_await_confirm',
          doctorId: 'd2',
          doctorName: 'Dr. Mark Fischer',
          specialty: 'Cardiology',
          dateISO: isoDay(3),
          time: '11:00',
          forUserId: s.profile.id || 'self',
          forUserName: s.profile.fullName || 'You',
          status: 'await_confirm' as const,
          reminderSet: true,
          calendarSynced: false,
          createdAt: isoAt(-1430),
          updatedAt: isoAt(-15),
        },
        {
          id: 'seed_confirmed',
          doctorId: 'd3',
          doctorName: 'Dr. Lena Hoffmann',
          specialty: 'General Medicine',
          dateISO: isoDay(1),
          time: '10:15',
          forUserId: s.profile.id || 'self',
          forUserName: s.profile.fullName || 'You',
          status: 'confirmed' as const,
          reminderSet: true,
          calendarSynced: false,
          createdAt: isoAt(-1420),
          updatedAt: isoAt(-10),
        },
        {
          id: 'seed_cancelled_doctor',
          doctorId: 'd4',
          doctorName: 'Dr. Nina Bauer',
          specialty: 'Orthopedics',
          dateISO: isoDay(4),
          time: '14:00',
          forUserId: s.profile.id || 'self',
          forUserName: s.profile.fullName || 'You',
          status: 'cancelled_doctor' as const,
          reminderSet: false,
          calendarSynced: false,
          createdAt: isoAt(-1410),
          updatedAt: isoAt(-5),
        },
        {
          id: 'seed_cancelled_patient',
          doctorId: 'd5',
          doctorName: 'Dr. Jonas Klein',
          specialty: 'Neurology',
          dateISO: isoDay(-7),
          time: '16:30',
          forUserId: s.profile.id || 'self',
          forUserName: s.profile.fullName || 'You',
          status: 'cancelled_patient' as const,
          reminderSet: false,
          calendarSynced: false,
          createdAt: isoAt(-3000),
          updatedAt: isoAt(-1500),
        },
        {
          id: 'seed_completed',
          doctorId: 'd6',
          doctorName: 'Dr. Paul Schneider',
          specialty: 'ENT',
          dateISO: isoDay(-14),
          time: '08:45',
          forUserId: s.profile.id || 'self',
          forUserName: s.profile.fullName || 'You',
          status: 'completed' as const,
          reminderSet: false,
          calendarSynced: false,
          createdAt: isoAt(-6000),
          updatedAt: isoAt(-4000),
        },
      ]

      const nextAppointments = [...s.appointments]
      let changed = false

      // Demo seed: ensure at least 1 appointment exists per status.
      // Uses stable IDs so it won't duplicate across reloads (state is persisted).
      // If the user actions changed a seeded appointment's status, reset it back so the demo
      // always contains one example for each status.
      for (const apt of seed) {
        const idx = nextAppointments.findIndex((a) => a.id === apt.id)
        if (idx === -1) {
          nextAppointments.push(apt)
          changed = true
          continue
        }

        if (nextAppointments[idx].status !== apt.status) {
          nextAppointments[idx] = { ...nextAppointments[idx], status: apt.status, updatedAt: isoAt(-5) }
          changed = true
        }
      }

      return changed ? { ...s, appointments: nextAppointments } : s
    })
  }, [])

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
          appointments: [
            ...s.appointments,
            {
              ...appointment,
              createdAt: appointment.createdAt ?? new Date().toISOString(),
              updatedAt: appointment.updatedAt ?? new Date().toISOString(),
            },
          ],
        })),
      updateAppointment: (id, patch) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((apt) =>
            apt.id === id ? { ...apt, ...patch, updatedAt: new Date().toISOString() } : apt
          ),
        })),
      cancelAppointment: (id) =>
        setState((s) => ({
          ...s,
          appointments: s.appointments.map((apt) =>
            apt.id === id
              ? { ...apt, status: 'cancelled_patient' as const, updatedAt: new Date().toISOString() }
              : apt
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
