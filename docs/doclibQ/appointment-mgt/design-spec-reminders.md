# Design Specification: Appointment Reminders (US 1.2.7)

> **User Story**: As a patient, I want to receive a reminder 24 and 72 hours before the appointment, to cancel the appointment in time if needed.
> 
> **Current Coverage**: 0% (basic toggle exists) | **Target**: Full granular controls

---

## Overview

Granular reminder system allowing patients to configure:
- **Timing**: 72 hours and/or 24 hours before appointment
- **Method**: Push, Email, or both
- **Actions**: Quick Confirm/Cancel directly from notification

---

## Acceptance Criteria Mapping

| AC | Requirement | Design Solution | Priority |
|----|-------------|-----------------|----------|
| 1 | Push notification 72h before | Scheduled push with content template | High |
| 2 | Notification has Confirm/Cancel quick actions | Action buttons in push payload | High |
| 3 | Cancel opens cancellation dialog | Deep-link to cancel screen | High |
| 4 | Email reminder parallel to push | Email template + preference check | Medium |
| 5 | Email-only if push disabled | Fallback logic | Medium |

---

## Design Tokens

| Token | Usage | Value |
|-------|-------|-------|
| `$text-primary` | Section headers | `#1C2A30` |
| `$text-secondary` | Descriptions | `#5E7A86` |
| `$accent-primary` | Active toggles | `#13A3B5` |
| `$accent-warm` | Warning states | `#E88A73` |
| `$bg-surface` | Card background | `#FFFFFF` |
| `$border-subtle` | Dividers | `#E5E7EB` |
| `$status-positive` | Confirmed state | `#10B981` |
| `$status-negative` | Cancelled state | `#EF4444` |

---

## Component Specifications

### 1. Enhanced NotificationsSettings Screen

**File**: `src/screens/settings/NotificationsScreen.tsx` (existing - needs expansion)

**Current State**:
```
┌─────────────────────────────────────────┐
│ Notifications                           │
├─────────────────────────────────────────┤
│ Appointments                [toggle]    │ ← Single toggle
│ Receive reminders for...                │
├─────────────────────────────────────────┤
│ Marketing & News            [toggle]    │
└─────────────────────────────────────────┘
```

**New Design**:
```
┌─────────────────────────────────────────┐
│ Notifications                           │
├─────────────────────────────────────────┤
│ Appointment Reminders                   │
│                                         │
│ 72 hours before appointment   [toggle]  │ ← Granular timing
│ 24 hours before appointment   [toggle]  │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Notification Method                     │
│                                         │
│ ○ Push notifications only               │ ← Radio group
│ ○ Email only                            │
│ ● Push + Email (recommended)            │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Quick Actions in Notifications          │
│                                         │
│ Show "Confirm" button         [toggle]  │ ← Action toggles
│ Show "Cancel" button          [toggle]  │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ 📧 john.doe@example.com                 │ ← Email preview
│                                         │
│ [Test Reminder Now]                     │ ← Dev/test button
├─────────────────────────────────────────┤
│ Marketing & News              [toggle]  │
│ Stay updated...                         │
└─────────────────────────────────────────┘
```

**Props Interface**:
```typescript
interface ReminderPreferences {
  enabled72h: boolean
  enabled24h: boolean
  method: 'push' | 'email' | 'both'
  showConfirmAction: boolean
  showCancelAction: boolean
  emailAddress: string  // From profile
}
```

**Section Breakdown**:

#### A. Reminder Timing Section

| Setting | Default | Description |
|---------|---------|-------------|
| 72 hours before | ON | First reminder, gives time to reschedule |
| 24 hours before | ON | Final reminder, last chance to cancel |

**UI Specs**:
- Section header: 14px, font-weight 600, uppercase, tracking-wide
- Toggle size: 52×32px (iOS style)
- Toggle track: Teal (`#13A3B5`) when ON, Slate (`#5E7A86`) when OFF
- Spacing: 16px between toggles

#### B. Notification Method Section

**Radio Group Design**:
```
┌────────────────────────────────────────┐
│ ● Push notifications only              │
│   Instant alerts on your device        │
├────────────────────────────────────────┤
│ ○ Email only                           │
│   Sent to john.doe@example.com         │
├────────────────────────────────────────┤
│ ● Push + Email (recommended)           │
│   Never miss an appointment            │
└────────────────────────────────────────┘
```

**Specs**:
- Radio size: 20×20px circle
- Selected: Teal fill (`#13A3B5`) with white dot
- Unselected: Gray border (`#D1D5DB`)
- Label: 16px, font-weight 500
- Description: 13px, color `#5E7A86`
- Gap between options: 12px

#### C. Quick Actions Section

**Purpose**: Allow users to disable potentially destructive actions

| Action | Default | Risk Level |
|--------|---------|------------|
| Show "Confirm" | ON | Low |
| Show "Cancel" | ON | Medium (accidental cancel) |

**Safety Consideration**: 
If both actions disabled → Show info banner:
> "You won't be able to respond to reminders. Open the app to manage appointments."

---

### 2. ReminderPushNotification Template

**Platform**: iOS/Android push notification

**72-Hour Reminder**:
```
┌─────────────────────────────────────────┐
│ 🏥 DocliQ                    2:30 PM    │
├─────────────────────────────────────────┤
│ Upcoming appointment in 3 days          │
│                                         │
│ 👤 Dr. Anna Schmidt                     │
│ 🏥 General Practitioner                 │
│ 📅 Friday, Jan 30 at 10:30 AM           │
│ 📍 Berlin Medical Center                │
│    Friedrichstraße 123                  │
│                                         │
│ [Confirm]        [Cancel]               │
│ [View Details]                          │
└─────────────────────────────────────────┘
```

**24-Hour Reminder**:
```
┌─────────────────────────────────────────┐
│ 🏥 DocliQ                    2:30 PM    │
├─────────────────────────────────────────┤
│ 🔔 Appointment tomorrow!                │
│                                         │
│ 👤 Dr. Anna Schmidt                     │
│ 📅 Tomorrow at 10:30 AM                 │
│ 📍 Berlin Medical Center                │
│                                         │
│ [Confirm]        [Cancel]               │
└─────────────────────────────────────────┘
```

**Push Payload Structure**:
```json
{
  "notification": {
    "title": "Upcoming appointment in 3 days",
    "body": "Dr. Anna Schmidt - Friday, Jan 30 at 10:30 AM",
    "sound": "default",
    "badge": 1
  },
  "data": {
    "type": "appointment_reminder",
    "appointmentId": "apt_123",
    "reminderType": "72h",
    "actions": ["confirm", "cancel", "view"],
    "doctorName": "Dr. Anna Schmidt",
    "appointmentTime": "2026-01-30T10:30:00",
    "deepLink": "docliq://appointments/apt_123"
  }
}
```

---

### 3. ReminderEmail Template

**Subject Lines**:
- 72h: `Reminder: Your appointment with Dr. {{name}} in 3 days`
- 24h: `Tomorrow: Appointment with Dr. {{name}} at {{time}}`

**Email Body (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Reminder</title>
</head>
<body style="margin:0; padding:0; background:#FAF8F5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" max-width="400" cellpadding="0" cellspacing="0" style="background:#FFFFFF; border-radius:16px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#13A3B5; padding:24px; text-align:center;">
              <h1 style="color:#FFFFFF; margin:0; font-size:20px; font-weight:600;">🏥 Appointment Reminder</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:24px;">
              <p style="color:#5E7A86; margin:0 0 16px 0; font-size:14px;">
                Your appointment is in <strong style="color:#1C2A30;">3 days</strong>
              </p>
              
              <!-- Appointment Card -->
              <div style="background:#FAF8F5; border-radius:12px; padding:16px; margin:16px 0;">
                <h2 style="color:#1C2A30; margin:0 0 8px 0; font-size:18px;">Dr. Anna Schmidt</h2>
                <p style="color:#13A3B5; margin:0 0 12px 0; font-size:14px; font-weight:500;">General Practitioner</p>
                
                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                  <tr>
                    <td style="padding:4px 0; color:#5E7A86; font-size:14px;">📅 Friday, January 30, 2026</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; color:#5E7A86; font-size:14px;">🕐 10:30 AM</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0; color:#5E7A86; font-size:14px;">📍 Berlin Medical Center</td>
                  </tr>
                </table>
              </div>
              
              <!-- Actions -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td width="48%" style="padding-right:8px;">
                    <a href="{{confirmUrl}}" style="display:block; background:#10B981; color:#FFFFFF; text-align:center; padding:12px; border-radius:8px; text-decoration:none; font-weight:500;">✓ Confirm</a>
                  </td>
                  <td width="48%" style="padding-left:8px;">
                    <a href="{{cancelUrl}}" style="display:block; background:#EF4444; color:#FFFFFF; text-align:center; padding:12px; border-radius:8px; text-decoration:none; font-weight:500;">✕ Cancel</a>
                  </td>
                </tr>
              </table>
              
              <p style="color:#9CA3AF; margin:16px 0 0 0; font-size:12px; text-align:center;">
                <a href="{{viewUrl}}" style="color:#13A3B5;">View full appointment details →</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#FAF8F5; padding:16px; text-align:center;">
              <p style="color:#9CA3AF; margin:0; font-size:12px;">
                DocliQ Healthcare • <a href="{{unsubscribeUrl}}" style="color:#5E7A86;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

### 4. QuickActionHandler Component

**File**: `src/components/notifications/QuickActionHandler.tsx`

**Purpose**: Handle deep-links from push notification actions

**Logic Flow**:
```
App launched from push
    ↓
Parse notification.data
    ↓
Switch on action type:
    "confirm" → API call → Show toast "Confirmed"
    "cancel" → Navigate to CancelScreen with apt ID
    "view" → Navigate to AppointmentDetail
```

**Implementation**:
```typescript
export function useNotificationActions() {
  const navigate = useNavigate()
  const { updateAppointment } = useAppState()

  const handleNotificationAction = async (data: NotificationData) => {
    switch (data.action) {
      case 'confirm':
        await apiConfirmAppointment(data.appointmentId)
        updateAppointment(data.appointmentId, { status: 'confirmed' })
        showToast(t('appointmentConfirmed'))
        break
        
      case 'cancel':
        navigate(PATHS.APPOINTMENT_CANCEL, {
          state: { appointmentId: data.appointmentId }
        })
        break
        
      case 'view':
        navigate(PATHS.APPOINTMENT_DETAIL.replace(':id', data.appointmentId))
        break
    }
  }

  return { handleNotificationAction }
}
```

---

## State Management

### A. Preferences Type Update

**File**: `src/types/user.ts`

```typescript
export interface NotificationPreferences {
  // Existing
  appointmentReminders: boolean  // Legacy - remove after migration
  deals: boolean
  
  // NEW: Granular reminder settings
  reminders: {
    enabled72h: boolean
    enabled24h: boolean
    method: 'push' | 'email' | 'both'
    quickActions: {
      showConfirm: boolean
      showCancel: boolean
    }
  }
}
```

### B. Context Update

**File**: `src/state/AppContext.tsx`

```typescript
// Migration helper (run once on app launch)
const migrateNotificationPrefs = (old: NotificationPreferences): NotificationPreferences => {
  if (old.reminders) return old  // Already migrated
  
  return {
    ...old,
    reminders: {
      enabled72h: old.appointmentReminders,
      enabled24h: old.appointmentReminders,
      method: 'both',
      quickActions: { showConfirm: true, showCancel: true }
    }
  }
}

// Actions
interface AppActions {
  setReminderPreferences: (prefs: Partial<NotificationPreferences['reminders']>) => void
}
```

---

## i18n Keys Required

**File**: `src/locales/en/settings.json`

```json
{
  "appointmentReminders": "Appointment Reminders",
  "reminderTiming": "Reminder Timing",
  "reminderMethod": "Notification Method",
  "reminderQuickActions": "Quick Actions in Notifications",
  "hours72Before": "72 hours before appointment",
  "hours24Before": "24 hours before appointment",
  "pushOnly": "Push notifications only",
  "pushOnlyDesc": "Instant alerts on your device",
  "emailOnly": "Email only",
  "emailOnlyDesc": "Sent to {{email}}",
  "pushAndEmail": "Push + Email (recommended)",
  "pushAndEmailDesc": "Never miss an appointment",
  "showConfirmButton": "Show \"Confirm\" button",
  "showCancelButton": "Show \"Cancel\" button",
  "noQuickActionsWarning": "You won't be able to respond to reminders. Open the app to manage appointments.",
  "testReminder": "Test Reminder Now",
  "testReminderSent": "Test reminder sent!",
  "emailPreview": "{{email}}",
  "unsubscribe": "Unsubscribe",
  "appointmentConfirmed": "Appointment confirmed!",
  "appointmentCancelled": "Appointment cancelled"
}
```

**File**: `src/locales/en/notifications.json`

```json
{
  "reminder72hTitle": "Upcoming appointment in 3 days",
  "reminder24hTitle": "🔔 Appointment tomorrow!",
  "reminderBody": "{{doctorName}} - {{date}} at {{time}}",
  "actionConfirm": "Confirm",
  "actionCancel": "Cancel",
  "actionView": "View Details",
  "reminderTypes": {
    "72h": "3 days",
    "24h": "Tomorrow"
  }
}
```

---

## Testing Checklist

- [ ] 72h toggle enables/disables reminder
- [ ] 24h toggle enables/disables reminder
- [ ] Method radio group switches correctly
- [ ] Push-only fallback when email disabled
- [ ] Quick actions toggle visibility
- [ ] Confirm action calls API
- [ ] Cancel action opens dialog
- [ ] Email template renders correctly
- [ ] i18n EN/DE complete
- [ ] Accessibility labels on all controls

---

## Golden Tests (to add)

```typescript
it('1.2.7-a: reminder-72h-before - 72h reminder enabled', () => {
  // Toggle 72h reminder ON
  // Assert: API scheduled
})

it('1.2.7-b: reminder-24h-before - 24h reminder enabled', () => {
  // Toggle 24h reminder ON
  // Assert: API scheduled
})

it('1.2.7-c: notification-quick-actions - Confirm/Cancel in push', async () => {
  // Open notification
  // Tap Confirm
  // Assert: Status updated to confirmed
})

it('1.2.7-d: email-parallel-push - Both sent when push enabled', () => {
  // Set method to 'both'
  // Trigger reminder
  // Assert: Push + Email sent
})

it('1.2.7-e: email-fallback - Email only when push disabled', () => {
  // Disable push permission
  // Trigger reminder
  // Assert: Email sent, no push
})
```

---

## Implementation Files

| File | Action | Lines |
|------|--------|-------|
| `src/types/user.ts` | Update NotificationPreferences | +20 |
| `src/state/AppContext.tsx` | Add migration + actions | +40 |
| `src/screens/settings/NotificationsScreen.tsx` | Expand UI | +80 |
| `src/components/notifications/QuickActionHandler.tsx` | **NEW** | ~50 |
| `src/templates/email/reminder-72h.html` | **NEW** | ~100 |
| `src/templates/email/reminder-24h.html` | **NEW** | ~100 |
| `src/locales/en/settings.json` | Add keys | +20 |
| `src/locales/de/settings.json` | Add keys | +20 |

**Total New Code**: ~450 lines
**Estimated Time**: 8-10 hours (including email templates)

---

*Document Version: 1.0 | Created: 2026-01-30 | Author: UX Design*  
*Related: US 1.2.7, AC 1-5*