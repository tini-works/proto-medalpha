# docliQ-Mobile IndexedDB Architecture Plan

**Date**: 2026-02-03  
**Duration**: 1-2 months mock phase  
**Database Strategy**: IndexedDB for persistence, static files for read-only data

---

## Executive Summary

This document outlines the complete technical architecture for implementing local data persistence in docliQ-mobile using IndexedDB. The approach balances rapid prototyping needs with data integrity requirements for a healthcare appointment booking application.

**Key Decisions**:
- No real-time sync (WebSocket/BroadcastChannel) - reduces complexity
- No encryption initially (can be added later if compliance requires)
- Browser-only deployment (no Capacitor/Cordova wrapper complexity)
- Data survives browser updates via migration framework
- Dev mode admin view leverages existing developer tools

**Estimated Effort**: 12-16 days (2.5-3 weeks)

---

## 1. Technical Architecture

### 1.1 Database Schema

```
IndexedDB v1 Schema
├── Object Store: appointments
│   ├── Key: id (string)
│   ├── Indexes:
│   │   ├── by-user (forUserId) → for listing user's appointments
│   │   ├── by-doctor (doctorId) → for slot conflict checking
│   │   └── by-date (dateISO) → for chronological listing
│   └── Fields: id, userId, doctorId, doctorName, specialty, forUserId, forUserName,
│       storeId?, dateISO, time, status, bookingType, matchingRequest, createdAt,
│       updatedAt, feedbackRating?, feedbackComment?, reminderSet, calendarSynced, version
│
├── Object Store: userProfiles
│   ├── Key: userId (string)
│   └── Fields: id, fullName, email, phone, phoneCountryCode, dateOfBirth, gender,
│       insuranceType, egkNumber, address (street, postalCode, city), familyMembers[],
│       gdprConsent, identityVerified, photoUrl, authProvider, settings
│
├── Object Store: notifications
│   ├── Key: id (string)
│   ├── Indexes:
│   │   ├── by-user (userId)
│   │   └── by-read (unread flag)
│   └── Fields: id, userId, type, category, title, message, timestamp, unread,
│       actionLabel?, actionPath?
│
└── Object Store: searchCache
    ├── Key: queryHash (string)
    └── TTL: 5 minutes (doctor availability changes frequently)
```

### 1.2 Layered Architecture

```
┌─────────────────────────────────────┐
│         React Components            │
│    (Screens, Cards, Forms)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         React Hooks                 │
│   useAppointments(), useProfile()   │
│   Optimistic UI + Cache             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         DB Abstraction Layer        │
│      src/db/repositories/          │
│   - appointmentRepository.ts      │
│   - profileRepository.ts           │
│   - notificationRepository.ts      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         IndexedDB (idb lib)         │
│    Transactions, Indexes, Cursors    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Browser Storage             │
│    IndexedDB API + localStorage     │
└─────────────────────────────────────┘
```

### 1.3 Data Storage Strategy

| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| Doctors directory | **Static files** | Read-only, version controlled, changes rarely |
| News articles, CMS | **Static files** | Content-heavy, no user edits needed |
| Time slots | **Static files** | Computed on-demand, changes daily |
| User profile | **IndexedDB** | Editable during onboarding, must persist |
| Family members | **IndexedDB** | User-generated, needs CRUD operations |
| Appointments | **IndexedDB** | Core feature, requires queries by user/doctor/date |
| Notifications | **IndexedDB** | Read/unread state must persist across sessions |
| Search cache | **IndexedDB** | Temporary, TTL-based invalidation |
| Auth session token | **localStorage** | Simple string, cleared on logout |

---

## 2. Key Implementation Patterns

### 2.1 Repository Pattern

**File**: `src/db/repositories/appointmentRepository.ts`

```typescript
import { getDB } from '../index';
import { Result, Ok, Err } from '../../types/result';

export type BookingError = 
  | { type: 'SLOT_TAKEN'; message: string }
  | { type: 'INVALID_TRANSITION'; message: string }
  | { type: 'NOT_FOUND'; message: string };

export class AppointmentRepository {
  async book(appointment: AppointmentInput): Promise<Result<Appointment, BookingError>> {
    const db = await getDB();
    const tx = db.transaction('appointments', 'readwrite');
    const store = tx.objectStore('appointments');
    
    // 1. Check for slot conflicts
    const existing = await store.index('by-doctor').getAll(appointment.doctorId);
    const conflict = existing.some(a => 
      a.dateISO === appointment.dateISO && 
      a.time === appointment.time &&
      !['cancelled_patient', 'cancelled_doctor'].includes(a.status)
    );
    
    if (conflict) {
      return Err({ type: 'SLOT_TAKEN', message: 'Slot no longer available' });
    }
    
    // 2. Create appointment with metadata
    const appt: Appointment = {
      id: `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...appointment,
      status: 'await_confirm',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    
    await store.add(appt);
    return Ok(appt);
  }
  
  async getUpcoming(userId: string): Promise<Appointment[]> {
    const db = await getDB();
    const all = await db.getAllFromIndex('appointments', 'by-user', userId);
    
    return all
      .filter(a => new Date(a.dateISO) >= new Date())
      .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
  }
  
  async getHistory(userId: string): Promise<Appointment[]> {
    const db = await getDB();
    const all = await db.getAllFromIndex('appointments', 'by-user', userId);
    
    return all
      .filter(a => new Date(a.dateISO) < new Date() || 
        ['completed', 'cancelled_patient', 'cancelled_doctor'].includes(a.status))
      .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
  }
  
  async updateStatus(
    id: string, 
    newStatus: Appointment['status']
  ): Promise<Result<void, BookingError>> {
    const db = await getDB();
    const tx = db.transaction('appointments', 'readwrite');
    const store = tx.objectStore('appointments');
    
    const appt = await store.get(id);
    if (!appt) {
      return Err({ type: 'NOT_FOUND', message: 'Appointment not found' });
    }
    
    // State machine validation
    const validTransitions: Record<string, string[]> = {
      'matching': ['await_confirm', 'cancelled_patient'],
      'await_confirm': ['confirmed', 'cancelled_patient'],
      'confirmed': ['completed', 'cancelled_patient', 'cancelled_doctor'],
      'completed': [],
      'cancelled_patient': [],
      'cancelled_doctor': []
    };
    
    if (!validTransitions[appt.status]?.includes(newStatus)) {
      return Err({ 
        type: 'INVALID_TRANSITION', 
        message: `Cannot transition from ${appt.status} to ${newStatus}` 
      });
    }
    
    appt.status = newStatus;
    appt.updatedAt = new Date().toISOString();
    appt.version += 1;
    
    await store.put(appt);
    return Ok(undefined);
  }
  
  async reschedule(
    id: string, 
    newSlot: TimeSlot
  ): Promise<Result<void, BookingError>> {
    const db = await getDB();
    const tx = db.transaction('appointments', 'readwrite');
    const store = tx.objectStore('appointments');
    
    const appt = await store.get(id);
    if (!appt) {
      return Err({ type: 'NOT_FOUND', message: 'Appointment not found' });
    }
    
    // Check if new slot is available
    const conflicts = await store.index('by-doctor').getAll(appt.doctorId);
    const taken = conflicts.some(c => 
      c.id !== id && 
      c.dateISO === newSlot.dateISO && 
      c.time === newSlot.time &&
      !['cancelled_patient', 'cancelled_doctor'].includes(c.status)
    );
    
    if (taken) {
      return Err({ type: 'SLOT_TAKEN', message: 'New slot unavailable' });
    }
    
    appt.dateISO = newSlot.dateISO;
    appt.time = newSlot.time;
    appt.updatedAt = new Date().toISOString();
    appt.version += 1;
    
    await store.put(appt);
    return Ok(undefined);
  }
  
  async cancel(id: string, byDoctor: boolean = false): Promise<Result<void, BookingError>> {
    const status = byDoctor ? 'cancelled_doctor' : 'cancelled_patient';
    return this.updateStatus(id, status);
  }
  
  // Dev mode only: Get all appointments across all users
  async getAllAppointments(): Promise<Appointment[]> {
    const db = await getDB();
    return db.getAll('appointments');
  }
}

export const appointmentRepository = new AppointmentRepository();
```

### 2.2 Database Initialization with Migrations

**File**: `src/db/index.ts`

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface DocliQDB extends DBSchema {
  appointments: {
    key: string;
    value: Appointment;
    indexes: { 'by-user': string; 'by-doctor': string; 'by-date': string };
  };
  userProfiles: {
    key: string;
    value: UserProfile;
  };
  notifications: {
    key: string;
    value: Notification & { userId: string };
    indexes: { 'by-user': string; 'by-read': boolean };
  };
  searchCache: {
    key: string;
    value: { query: string; results: Doctor[]; timestamp: number };
  };
}

type Migration = {
  version: number;
  up: (db: IDBPDatabase<DocliQDB>) => Promise<void> | void;
};

const DB_NAME = 'docliq-mock-v1';
const DB_VERSION = 1;

const migrations: Migration[] = [
  {
    version: 1,
    up: (db) => {
      // Appointments store
      const apptStore = db.createObjectStore('appointments', { keyPath: 'id' });
      apptStore.createIndex('by-user', 'forUserId');
      apptStore.createIndex('by-doctor', 'doctorId');
      apptStore.createIndex('by-date', 'dateISO');
      
      // User profiles store
      db.createObjectStore('userProfiles', { keyPath: 'id' });
      
      // Notifications store
      const notifStore = db.createObjectStore('notifications', { keyPath: 'id' });
      notifStore.createIndex('by-user', 'userId');
      notifStore.createIndex('by-read', 'unread');
      
      // Search cache store
      db.createObjectStore('searchCache', { keyPath: 'query' });
    }
  }
  // Future migrations added here
];

export async function getDB(): Promise<IDBPDatabase<DocliQDB>> {
  try {
    return await openDB<DocliQDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        console.log(`Migrating DB from v${oldVersion} to v${newVersion}`);
        
        for (let v = oldVersion + 1; v <= (newVersion || DB_VERSION); v++) {
          const migration = migrations.find(m => m.version === v);
          if (migration) {
            console.log(`Running migration v${v}`);
            migration.up(db);
          }
        }
      },
      blocked() {
        console.warn('Database upgrade blocked - close other tabs');
      },
      terminated() {
        console.error('Database connection terminated unexpectedly');
      }
    });
  } catch (error) {
    console.error('Failed to open IndexedDB:', error);
    throw new Error('Database initialization failed');
  }
}

// Graceful degradation: Check if IndexedDB is available
export function isIndexedDBAvailable(): boolean {
  return 'indexedDB' in window && 
         window.indexedDB !== null && 
         !navigator.userAgent.match(/Safari/) || 
         navigator.userAgent.match(/Chrome/);
}
```

### 2.3 Optimistic UI Pattern

**File**: `src/hooks/useAppointments.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentRepository } from '../db/repositories/appointmentRepository';
import { toast } from 'sonner';

export function useUserAppointments(userId: string) {
  return useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => appointmentRepository.getUpcoming(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: appointmentRepository.book,
    
    // Optimistic update
    onMutate: async (newAppt) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointments'] });
      
      // Snapshot previous value
      const previousAppointments = queryClient.getQueryData<Appointment[]>(['appointments']);
      
      // Optimistically update to new value
      queryClient.setQueryData(['appointments'], (old: Appointment[] = []) => [
        ...old,
        {
          ...newAppt,
          id: `temp-${Date.now()}`,
          status: 'await_confirm',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Appointment
      ]);
      
      return { previousAppointments };
    },
    
    // Rollback on error
    onError: (err, newAppt, context) => {
      queryClient.setQueryData(['appointments'], context?.previousAppointments);
      toast.error(`Booking failed: ${err.message}`);
    },
    
    // Success handling
    onSuccess: (data) => {
      toast.success(`Appointment booked with ${data.doctorName}`);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, newSlot }: { id: string; newSlot: TimeSlot }) =>
      appointmentRepository.reschedule(id, newSlot),
      
    onSuccess: () => {
      toast.success('Appointment rescheduled');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (err) => {
      toast.error(`Reschedule failed: ${err.message}`);
    }
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => appointmentRepository.cancel(id),
    onSuccess: () => {
      toast.success('Appointment cancelled');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
}
```

---

## 3. Gaps, Risks & Mitigations

### 3.1 Technical Gaps

| Gap | Severity | Impact | Mitigation |
|-----|----------|--------|------------|
| No multi-tab sync | Low | User must refresh to see updates in other tabs | Not required (decision #1) |
| No built-in encryption | Medium | eGK numbers stored plaintext | Add TODO hooks for future crypto.subtle integration |
| Database versioning complexity | Medium | Schema changes require careful migration | Implement migration runner, test on staging data |
| Query limitations (no JOINs) | Low | Must query multiple stores separately | Denormalize doctor name into appointment records |
| Storage quota (50-250MB) | Low | Large datasets may hit limits | Compress data, clear old search cache |
| Backup/Export | Medium | Data lost on browser clear | Implement JSON export in dev mode |

### 3.2 Business Logic Gaps

| Gap | Risk | Solution |
|-----|------|----------|
| Slot availability calculation static | Doesn't handle doctor unavailability patterns | Add `unavailability_patterns` table or compute on-demand from static data |
| Family member access control | No verification user can book for claimed family member | Add family relationship verification (can be mocked initially) |
| Concurrent booking simulation | Can't demo "last slot taken" properly | Add artificial delay + random conflict injection for demo purposes |

### 3.3 GDPR Compliance (Even for Mock)

| Requirement | Current State | Action Required |
|-------------|---------------|-----------------|
| Data portability (Art. 20) | Not implemented | Add "Export my data" button in settings |
| Right to erasure (Art. 17) | Clear button exists | Ensure cascade delete of related records |
| Consent history | Stored but not versioned | Add consent timestamp tracking |
| Encryption at rest | None | Add TODO for crypto integration if compliance requires |

### 3.4 Browser Compatibility

| Environment | Risk | Mitigation |
|-------------|------|------------|
| Safari Incognito | IndexedDB may not persist | Graceful degradation to memory-only mode |
| iOS WebView | Storage cleared on memory pressure | Document limitation, add warnings |
| Private browsing | Various behaviors | Feature detection + fallback UI |

---

## 4. Implementation Phases

### Phase 1: Core Infrastructure (3-4 days)

| Task | Effort | Acceptance Criteria |
|------|--------|---------------------|
| Setup IndexedDB with idb library | 2h | Database opens successfully, schema created |
| Implement migration framework | 4h | Can add v2 migration without breaking v1 data |
| Create Result<T,E> type utilities | 2h | Repository methods return typed Results |
| Build transaction wrapper | 3h | Automatic rollback on error |
| Add feature detection + fallback | 2h | Shows warning if IndexedDB unavailable |
| Type safety layer | 3h | All DB operations fully typed |
| **Subtotal** | **16h (2 days)** | |

### Phase 2: Repositories (4-5 days)

| Task | Effort | Acceptance Criteria |
|------|--------|---------------------|
| AppointmentRepository | 6h | Full CRUD, slot conflict checking, state machine |
| ProfileRepository | 4h | User CRUD, family member management |
| NotificationRepository | 3h | Read/unread tracking, action handlers |
| Search cache layer | 3h | Query hashing, TTL invalidation |
| Data export/import (JSON) | 4h | GDPR demo feature, backup/restore |
| Dev mode admin queries | 3h | Get all appointments across users |
| **Subtotal** | **23h (3 days)** | |

### Phase 3: Integration (3-4 days)

| Task | Effort | Acceptance Criteria |
|------|--------|---------------------|
| Refactor useAppointments hook | 4h | Uses repository, optimistic UI |
| Refactor useProfile hook | 3h | Persists across onboarding |
| Update booking flows | 5h | All 3 flows (fast-lane, specialty, by-doctor) persist |
| Update History screen | 3h | Reads from DB instead of static data |
| Update Notifications screen | 3h | Read/unread state persists |
| Add state machine validation | 3h | Invalid status transitions blocked |
| **Subtotal** | **21h (2.5 days)** | |

### Phase 4: Testing & Polish (2-3 days)

| Task | Effort | Acceptance Criteria |
|------|--------|---------------------|
| Unit tests (repository layer) | 6h | 80%+ coverage with fake-indexeddb |
| E2E demo scenarios | 4h | "Book → Reschedule → Cancel" flows work |
| Storage limit testing | 2h | Handles 10,000+ appointments gracefully |
| Mobile Safari testing | 3h | Works in incognito with fallback |
| Error handling verification | 2h | Graceful degradation on DB failure |
| Documentation | 2h | Architecture diagram, API reference |
| **Subtotal** | **19h (2.5 days)** | |

### Phase 5: Dev Mode Admin (1 day)

| Task | Effort | Acceptance Criteria |
|------|--------|---------------------|
| Admin view UI | 4h | Table showing all appointments |
| Export all data button | 2h | Downloads complete DB as JSON |
| Clear all data button | 2h | Resets DB to empty state |
| Data stats dashboard | 2h | Shows counts by type |
| **Subtotal** | **10h (1 day)** | |

---

## 5. Total Effort Summary

| Phase | Duration | Critical Path |
|-------|----------|---------------|
| Phase 1: Infrastructure | 2 days | **Required** |
| Phase 2: Repositories | 3 days | **Required** |
| Phase 3: Integration | 2.5 days | **Required** |
| Phase 4: Testing | 2.5 days | Recommended |
| Phase 5: Admin | 1 day | Optional (dev only) |
| **Total** | **10.5-11 days** | |

**Buffer for complexity**: +3 days  
**Final estimate**: **13-14 days** (~2.5-3 weeks)

---

## 6. Decision Log

| Date | Decision | Context | Impact |
|------|----------|---------|--------|
| 2026-02-03 | No real-time sync | Not needed for 1-2 month demo | Reduces effort by ~1 day |
| 2026-02-03 | No encryption initially | Compliance not yet defined | Add TODO hooks, can retrofit |
| 2026-02-03 | Browser-only deployment | No Capacitor/Cordova wrapper | Standard IndexedDB behavior |
| 2026-02-03 | Data survives updates | Yes (requirement #4) | Requires migration framework |
| 2026-02-03 | Admin view in dev mode | Use existing dev mode | No new auth layer needed |

---

## 7. File Structure

```
src/
├── db/
│   ├── index.ts                    # DB initialization, migrations
│   ├── repositories/
│   │   ├── appointmentRepository.ts
│   │   ├── profileRepository.ts
│   │   ├── notificationRepository.ts
│   │   └── index.ts                # Export all repositories
│   ├── migrations/
│   │   ├── index.ts                # Migration runner
│   │   └── v1_initial.ts           # Initial schema
│   └── utils/
│       ├── exportImport.ts         # JSON backup/restore
│       └── errorHandling.ts        # DB error wrappers
├── hooks/
│   ├── useAppointments.ts          # React Query + optimistic UI
│   ├── useProfile.ts
│   └── useNotifications.ts
├── types/
│   ├── result.ts                   # Result<T,E> pattern
│   └── db.ts                       # Database entity types
└── screens/
    └── dev/
        └── AdminView.tsx           # Dev mode admin dashboard
```

---

## 8. Next Steps

1. **Review and approve** this architecture plan
2. **Decide on encryption** (requirement #2) - implement now or add TODO hooks?
3. **Create tickets** for Phase 1 tasks
4. **Set up development environment** with fake-indexeddb for testing
5. **Schedule architecture review** after Phase 1 completion

---

## 9. Open Questions

- [ ] Should we implement a simple encryption layer for eGK numbers now, or add hooks for later?
- [ ] Do we need a "demo data seeder" to populate realistic appointments for demos?
- [ ] Should notifications trigger when appointments are created (simulating real-time feel)?

---

**Document Owner**: Database Architecture Specialist  
**Last Updated**: 2026-02-03  
**Review Cycle**: After Phase 1 completion
