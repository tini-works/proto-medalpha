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
  AvailabilityPrefs,
  InsuranceType,
} from '../types'
import { initialState } from '../types'
import { clearState, loadState, saveState } from './storage'
import type { MyDoctorEntry } from '../types/user'

// Fast-Lane request type
interface FastLaneRequestState {
  specialty: string
  symptom?: string
  city: string
  insuranceType: InsuranceType
  patientId: string
  patientName: string
}

// Specialty-first matching request type
interface SpecialtyMatchRequestState {
  specialty: string
  city: string
  insuranceType: InsuranceType
  doctorId: string
  doctorName: string
  availabilityPrefs: AvailabilityPrefs
  patientId: string
  patientName: string
}

// Booking flow type
type BookingFlow = 'fast_lane' | 'by_specialty' | 'by_doctor' | null

// Symptom info for doctor-first flow
interface SymptomInfo {
  symptoms: string[]
  additionalNotes: string
}

// Extended state for reschedule and book again flows (not persisted)
interface ExtendedState {
  reschedule: RescheduleContext | null
  bookAgain: BookAgainContext | null
  fastLane: FastLaneRequestState | null
  specialtyMatch: SpecialtyMatchRequestState | null
  availabilityPrefs: AvailabilityPrefs | null
  bookingFlow: BookingFlow
  symptomInfo: SymptomInfo | null
}

type AppStateApi = {
  state: AppState
  extendedState: ExtendedState
  // Auth
  signIn: (email: string, options?: { isRegistration?: boolean }) => void
  signOut: () => void
  markVerified: () => void
  markIdentityVerified: () => void
  markPhoneVerified: () => void
  // Profile
  updateProfile: (patch: Partial<UserProfile>) => void
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void
  removeFamilyMember: (id: string) => void
  updateFamilyMember: (id: string, patch: Partial<FamilyMember>) => void
  updateGdprConsent: (consent: Partial<AppState['profile']['gdprConsent']>) => void
  upsertMyDoctor: (doctor: Doctor, bookedAtISO?: string) => void
  toggleMyDoctor: (doctor: Doctor) => void
  // Preferences
  setFontScale: (scale: AppState['preferences']['fontScale']) => void
  setLanguage: (language: AppState['preferences']['language']) => void
  setBiometricsEnabled: (enabled: boolean) => void
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
  // Fast-Lane
  setFastLaneRequest: (request: FastLaneRequestState | null) => void
  clearFastLaneRequest: () => void
  // Specialty-first matching
  setAvailabilityPrefs: (prefs: AvailabilityPrefs | null) => void
  setSpecialtyMatchRequest: (request: SpecialtyMatchRequestState | null) => void
  clearSpecialtyMatchRequest: () => void
  // Symptom info (doctor-first flow)
  setSymptomInfo: (info: SymptomInfo | null) => void
  clearSymptomInfo: () => void
  // Booking flow tracking
  setBookingFlow: (flow: BookingFlow) => void
  clearBookingFlow: () => void
  // Computed
  isProfileComplete: boolean
  isIdentityVerified: boolean
  getAppointmentById: (id: string) => Appointment | undefined
  getHistoryItemById: (id: string) => HistoryItem | undefined
  // Reset
  resetAll: () => void
}

const Ctx = createContext<AppStateApi | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState(initialState) as any
    return {
      ...initialState,
      ...loaded,
      auth: { ...initialState.auth, ...(loaded?.auth ?? {}) },
      preferences: { ...initialState.preferences, ...(loaded?.preferences ?? {}) },
      profile: {
        ...initialState.profile,
        ...(loaded?.profile ?? {}),
        familyMembers: loaded?.profile?.familyMembers ?? initialState.profile.familyMembers,
        myDoctors: loaded?.profile?.myDoctors ?? initialState.profile.myDoctors,
        gdprConsent: { ...initialState.profile.gdprConsent, ...(loaded?.profile?.gdprConsent ?? {}) },
        address: { ...initialState.profile.address, ...(loaded?.profile?.address ?? {}) },
      },
      booking: { ...initialState.booking, ...(loaded?.booking ?? {}) },
      history: { ...initialState.history, ...(loaded?.history ?? {}) },
      appointments: loaded?.appointments ?? initialState.appointments,
    }
  })
  const [extendedState, setExtendedState] = useState<ExtendedState>({
    reschedule: null,
    bookAgain: null,
    fastLane: null,
    specialtyMatch: null,
    availabilityPrefs: null,
    bookingFlow: null,
    symptomInfo: null,
  })

  const normalizeMyDoctors = (entries: MyDoctorEntry[]) => {
    const sorted = [...entries].sort((a, b) => {
      const aKey = a.lastBookedAt ?? a.addedAt
      const bKey = b.lastBookedAt ?? b.addedAt
      return bKey.localeCompare(aKey)
    })
    return sorted.slice(0, 5)
  }

  const snapshotDoctor = (doctor: Doctor) => ({
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    city: doctor.city,
    address: doctor.address,
    accepts: doctor.accepts,
    languages: doctor.languages,
    rating: doctor.rating,
    reviewCount: doctor.reviewCount,
    nextAvailableISO: doctor.nextAvailableISO,
    imageUrl: doctor.imageUrl,
    about: doctor.about,
  })

  useEffect(() => {
    setState((s) => {
      if (s.preferences.disableDemoAppointmentsSeed) return s
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
          createdAt: isoAt(-30),
          updatedAt: isoAt(-5),
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
          updatedAt: isoAt(-60),
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
          cancelReason: 'The practice is unavailable at the requested time.',
          reminderSet: false,
          calendarSynced: false,
          createdAt: isoAt(-1410),
          updatedAt: isoAt(-5),
        },
        {
          id: 'seed_cancelled_patient',
          doctorId: 'd5',
          doctorName: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          dateISO: '2025-01-28',
          time: '10:30',
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

        const needsReason =
          apt.id === 'seed_cancelled_doctor' && !nextAppointments[idx].cancelReason && apt.cancelReason

        if (nextAppointments[idx].status !== apt.status || needsReason) {
          nextAppointments[idx] = {
            ...nextAppointments[idx],
            status: apt.status,
            cancelReason: needsReason ? apt.cancelReason : nextAppointments[idx].cancelReason,
            updatedAt: isoAt(-5),
          }
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

  useEffect(() => {
    const handleOnline = () => {
      setState((s) => ({
        ...s,
        appointments: s.appointments.map((apt) => ({
          ...apt,
          updatedAt: new Date().toISOString(),
        })),
      }))
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

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

  const isIdentityVerified = Boolean(state.profile.identityVerified)

  const api = useMemo<AppStateApi>(
    () => ({
      state,
      extendedState,
      isProfileComplete,
      isIdentityVerified,

      // Auth
      signIn: (email, options) =>
        setState((s) => {
          const isRegistration = options?.isRegistration ?? false
          return {
            ...s,
            auth: { isAuthenticated: true, verified: false, userId: `user_${Date.now()}` },
            profile: { ...s.profile, email },
            preferences: isRegistration ? { ...s.preferences, disableDemoAppointmentsSeed: true } : s.preferences,
            appointments: isRegistration ? [] : s.appointments,
            history: isRegistration ? { items: [] } : s.history,
          }
        }),
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
      markIdentityVerified: () =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            identityVerified: true,
            identityVerifiedAt: new Date().toISOString(),
          },
        })),
      markPhoneVerified: () =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            phoneVerified: true,
            phoneVerifiedAt: new Date().toISOString(),
          },
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

      upsertMyDoctor: (doctor, bookedAtISO) => {
        const now = bookedAtISO ?? new Date().toISOString()
        setState((s) => {
          const existing = s.profile.myDoctors ?? []
          const idx = existing.findIndex((e) => e.doctor.id === doctor.id)
          const next: MyDoctorEntry[] =
            idx >= 0
              ? existing.map((e, i) => (i === idx ? { ...e, doctor: snapshotDoctor(doctor), lastBookedAt: now } : e))
              : [{ doctor: snapshotDoctor(doctor), lastBookedAt: now, addedAt: now }, ...existing]

          return { ...s, profile: { ...s.profile, myDoctors: normalizeMyDoctors(next) } }
        })
      },

      toggleMyDoctor: (doctor) => {
        const now = new Date().toISOString()
        setState((s) => {
          const existing = s.profile.myDoctors ?? []
          const idx = existing.findIndex((e) => e.doctor.id === doctor.id)
          const next: MyDoctorEntry[] =
            idx >= 0
              ? existing.filter((e) => e.doctor.id !== doctor.id)
              : [{ doctor: snapshotDoctor(doctor), addedAt: now }, ...existing]

          return { ...s, profile: { ...s.profile, myDoctors: normalizeMyDoctors(next) } }
        })
      },

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
      setBiometricsEnabled: (biometricsEnabled) =>
        setState((s) => ({
          ...s,
          preferences: { ...s.preferences, biometricsEnabled },
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
            availabilityPrefs: null,
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

      // Fast-Lane
      setFastLaneRequest: (request) =>
        setExtendedState((s) => ({ ...s, fastLane: request })),
      clearFastLaneRequest: () =>
        setExtendedState((s) => ({ ...s, fastLane: null })),

      // Specialty-first matching
      setAvailabilityPrefs: (prefs) =>
        setExtendedState((s) => ({ ...s, availabilityPrefs: prefs })),
      setSpecialtyMatchRequest: (request) =>
        setExtendedState((s) => ({ ...s, specialtyMatch: request })),
      clearSpecialtyMatchRequest: () =>
        setExtendedState((s) => ({ ...s, specialtyMatch: null, availabilityPrefs: null, symptomInfo: null })),

      // Symptom info (doctor-first flow)
      setSymptomInfo: (info) =>
        setExtendedState((s) => ({ ...s, symptomInfo: info })),
      clearSymptomInfo: () =>
        setExtendedState((s) => ({ ...s, symptomInfo: null })),

      // Booking flow tracking
      setBookingFlow: (flow) =>
        setExtendedState((s) => ({ ...s, bookingFlow: flow })),
      clearBookingFlow: () =>
        setExtendedState((s) => ({ ...s, bookingFlow: null })),

      // Computed/getters
      getAppointmentById: (id) => state.appointments.find((apt) => apt.id === id),
      getHistoryItemById: (id) => state.history.items.find((item) => item.id === id),

      // Reset
      resetAll: () => {
        clearState()
        setState(initialState)
        setExtendedState({ reschedule: null, bookAgain: null, fastLane: null, specialtyMatch: null, availabilityPrefs: null, bookingFlow: null, symptomInfo: null })
      },
    }),
    [state, extendedState, isProfileComplete, isIdentityVerified]
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
  const { state, signIn, signOut, markVerified, markIdentityVerified, isIdentityVerified } = useAppState()
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerified: state.auth.verified,
    isIdentityVerified,
    userId: state.auth.userId,
    signIn,
    signOut,
    markVerified,
    markIdentityVerified,
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
    upsertMyDoctor,
    toggleMyDoctor,
    markPhoneVerified,
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
    upsertMyDoctor,
    toggleMyDoctor,
    markPhoneVerified,
  }
}

export function useBooking() {
  const {
    state,
    extendedState,
    setSearchFilters,
    selectDoctor,
    selectSlot,
    selectFamilyMember,
    resetBooking,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    setFastLaneRequest,
    clearFastLaneRequest,
    setAvailabilityPrefs,
    setSpecialtyMatchRequest,
    clearSpecialtyMatchRequest,
    setSymptomInfo,
    clearSymptomInfo,
    setBookingFlow,
    clearBookingFlow,
  } = useAppState()
  return {
    search: state.booking.currentSearch,
    selectedDoctor: state.booking.selectedDoctor,
    selectedSlot: state.booking.selectedSlot,
    selectedFamilyMemberId: state.booking.selectedFamilyMemberId,
    appointments: state.appointments,
    fastLaneRequest: extendedState.fastLane,
    specialtyMatchRequest: extendedState.specialtyMatch,
    availabilityPrefs: extendedState.availabilityPrefs,
    bookingFlow: extendedState.bookingFlow,
    symptomInfo: extendedState.symptomInfo,
    setSearchFilters,
    selectDoctor,
    selectSlot,
    selectFamilyMember,
    resetBooking,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    setFastLaneRequest,
    clearFastLaneRequest,
    setAvailabilityPrefs,
    setSpecialtyMatchRequest,
    clearSpecialtyMatchRequest,
    setSymptomInfo,
    clearSymptomInfo,
    setBookingFlow,
    clearBookingFlow,
  }
}

export function useHistory() {
  const { state, addHistoryItem, updateHistoryItem, getHistoryItemById } = useAppState()
  return {
    items: state.history.items,
    addHistoryItem,
    updateHistoryItem,
    getHistoryItemById,
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
  const { state, setFontScale, setLanguage, setBiometricsEnabled, setNotificationPreferences } = useAppState()
  return {
    fontScale: state.preferences.fontScale,
    language: state.preferences.language,
    biometricsEnabled: state.preferences.biometricsEnabled,
    notifications: state.preferences.notifications,
    setFontScale,
    setLanguage,
    setBiometricsEnabled,
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
