# States Matrix

**Date**: 2026-01-19
**Purpose**: Document empty, error, and loading states for all screens
**Related**: `sitemap.mermaid` (patient mobile IA)

---

## Overview

This matrix documents the UI states for each screen. The IA diagram shows happy-path screens only. This document ensures all states are designed and implemented.

### State Types

| State | Description | Visual Pattern |
|-------|-------------|----------------|
| **Normal** | Data is loaded and displayed | Standard screen layout |
| **Empty** | No data to display | Illustration + message + CTA |
| **Loading** | Data is being fetched | Skeleton screen |
| **Error** | Something went wrong | Error message + retry + help link |

---

## Layer 2: Main App Screens

### HOME-001 | Home

| State | Trigger | Content |
|-------|---------|---------|
| Normal | User has activity | Greeting, upcoming preview, CMS cards |
| Empty (partial) | No upcoming appointments | Hide "Upcoming" section, show CMS cards |
| Loading | Initial load | Skeleton for all sections |
| Error | API failure | "Couldn't load home. Tap to retry." |

### APT-001 | Appointments Hub

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Has upcoming appointments | Upcoming list + book options |
| Empty | No upcoming appointments | Illustration: calendar with checkmark |
| | | "No upcoming appointments" |
| | | "Book your first appointment to get started." |
| | | CTA: "Book appointment" |
| Loading | Syncing with Curaay | Skeleton list |
| Error | Curaay sync failed | "Couldn't load appointments. Tap to retry." |
| | | Link: "Contact support" |

### RX-001 | Prescriptions Hub

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Has active prescriptions | Prescription list + orders in progress |
| Empty | No prescriptions | Illustration: pill bottle with checkmark |
| | | "No active prescriptions" |
| | | "Prescriptions from your appointments will appear here." |
| | | CTA: "Book appointment" |
| Loading | Fetching prescriptions | Skeleton list |
| Error | API failure | "Couldn't load prescriptions. Tap to retry." |

### RX-004 | NFC Scan

| State | Trigger | Content |
|-------|---------|---------|
| Ready | Waiting for card | Animation: phone + card icon |
| | | "Hold card to back of your phone" |
| Scanning | Card detected | Animation: scanning pulse |
| | | "Scanning... keep card still" |
| Success | Scan complete | Checkmark animation |
| | | Auto-navigate to RX-005 |
| Error | Scan failed | X icon |
| | | "Scan failed" |
| | | "We couldn't read your card. Please try again." |
| | | Tips: bullet list of troubleshooting |
| | | CTA: "Try again" |
| | | Link: "Still not working? Get help" |

### RX-006 | Pharmacy Search

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Pharmacies found | Map + results list |
| Empty | No pharmacies nearby | Map centered on user |
| | | "No pharmacies found nearby" |
| | | "Try expanding your search area." |
| | | CTA: "Search wider area" |
| Loading | Searching | Map + skeleton list |
| Error (location) | Location denied | "Location access needed" |
| | | "Enable location to find pharmacies near you." |
| | | CTA: "Open settings" |
| Error (API) | Maps API failed | "Couldn't load pharmacies. Tap to retry." |

### HIS-001 | History

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Has history items | Chronological list grouped by month |
| Empty | No history | Illustration: clipboard with checkmark |
| | | "No activity yet" |
| | | "Your appointments and prescriptions will appear here." |
| | | CTA: "Book first appointment" |
| Loading | Fetching history | Skeleton list |
| Error | API failure | "Couldn't load history. Tap to retry." |

---

## Layer 1: Entry & Auth Screens

### AUTH-001 | Login / Register

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Default | Login/Register tabs with forms |
| Loading | Form submitted | Button shows spinner, form disabled |
| Error (credentials) | Wrong password | Inline error: "Incorrect email or password" |
| Error (network) | API failure | Toast: "Connection error. Please try again." |
| Error (validation) | Invalid input | Inline field errors |

### AUTH-003 | Forgot Password

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Default | Email input form |
| Loading | Form submitted | Button shows spinner |
| Success | Email sent | "Check your email" |
| | | "We sent a reset link to [email]" |
| | | CTA: "Back to login" |
| Error | Email not found | Inline error: "No account with this email" |

### PRF-001 | Profile Completion

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Profile incomplete | Checklist with required fields |
| Loading | Saving | Button shows spinner |
| Success | Profile complete | Auto-navigate to Main App |
| Error | Save failed | Toast: "Couldn't save. Please try again." |

---

## Layer 3: Secondary Screens

### PRF-002 | Profile

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Profile loaded | Profile sections |
| Loading | Fetching profile | Skeleton sections |
| Error | API failure | "Couldn't load profile. Tap to retry." |

### SET-001 | Settings

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Default | Settings list (no loading needed, static) |

### SET-004 | Account Actions

| State | Trigger | Content |
|-------|---------|---------|
| Normal | Default | Change password, logout, delete account |
| Delete confirm | User taps delete | Modal: "Delete your account?" |
| | | "This will permanently delete all your data." |
| | | "This action cannot be undone." |
| | | CTA: "Cancel" / "Delete account" (destructive) |
| Deleting | Confirmed delete | Full-screen loading |
| Logout confirm | User taps logout | Navigate to AUTH-001 |

---

## Common Patterns

### Empty State Template

```
┌─────────────────────────────────┐
│                                 │
│         [Illustration]          │
│                                 │
│     [Primary message]           │
│                                 │
│     [Secondary message -        │
│      explains what to do]       │
│                                 │
│  ┌───────────────────────────┐  │
│  │      [Action CTA]          │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Error State Template

```
┌─────────────────────────────────┐
│                                 │
│         [Error icon]            │
│                                 │
│     [What went wrong]           │
│                                 │
│     [How to fix / retry]        │
│                                 │
│  ┌───────────────────────────┐  │
│  │       [Retry CTA]          │  │
│  └───────────────────────────┘  │
│                                 │
│     [Help link if complex]      │
│                                 │
└─────────────────────────────────┘
```

### Loading State Template

```
┌─────────────────────────────────┐
│                                 │
│  ┌───────────────────────────┐  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │ ░░░░░░░░░░░░             │  │
│  │ ░░░░░░░░░░░░░░░░░        │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │ ░░░░░░░░░░░░             │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘

(Skeleton matches shape of expected content)
```

---

## Design Checklist

Use this checklist when designing each screen:

- [ ] Normal state designed
- [ ] Empty state designed (if applicable)
- [ ] Loading state designed (if fetches data)
- [ ] Error state designed (if can fail)
- [ ] Retry mechanism included (if error state exists)
- [ ] Help/support link included (for complex errors)

---

**Document Status**: Complete
**Next Step**: Use this matrix when designing screens in Figma/prototyping tool
