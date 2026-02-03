# Implementation Plan — Selected UX Approaches (Codex-ready, non-technical)
**Scope:** Implement the chosen UX approaches with minimal impact/refactor by layering new UI behaviors on top of existing booking + appointment surfaces.  
**Impact report:** [impact-report.md](impact-report.md)  
**Chosen approaches (your decision):**
- **EPIC 1.2:** Approach A — Progressive Disclosure Booking  
- **EPIC 1.3:** Hybrid — A (Micro‑Feedback Nudge) + C (Silent Opt‑In)  
- **EPIC 1.5:** Approach A — Timeline Diff (Transparency First)  
- **US 1.8.2:** Approach A — Offline‑First Appointment Vault (Reliability‑First)

---

## Product principles (guardrails)
These are the design constraints Codex should preserve across all work:
- **Clarity first:** users should understand *doctor, time, location, cost* before confirming.
- **Speed + low effort:** fewer screens, fewer decisions per screen, avoid “form dumps.”
- **Trust + privacy:** calm tone, never overpromise, surface “last updated” timestamps.
- **Accessibility:** large tap targets, predictable navigation, clear states, no surprise language switching.  
(Reflects design scope across US/AC notes and social-listening themes.)  

---

## Phase Plan (minimize refactors)
### Phase 0 — Shared UI foundation (enables everything else)
**Goal:** add cross-cutting UI patterns once so later EPIC work is “plug-in,” not rewrite.

**Deliverables**
1. **Unified appointment card component**
   - Used in: Upcoming/Past list, detail view, notifications deep links, offline view.
2. **Appointment status language system**
   - Status tokens: `In Progress`, `Confirmed`, `Rejected`, `Modified by Practice`, `Canceled`.
   - One visual grammar (color + icon + label + timestamp) reused everywhere.
3. **“Last updated” + “source of truth” microcopy pattern**
   - For: status refresh, practice changes, offline mode.

**UI intent**
- Build *trust via consistency*: the same appointment looks/behaves the same across the app.
- Reduce cognitive load for Helga / moderate-proficiency users by minimizing layout variation.

**Key interactions**
- Tap appointment card → detail
- Pull-to-refresh (or prominent “Refresh”) → updates status timestamp (no technical detail)

---

## Phase 1 — EPIC 1.2: Progressive Disclosure Booking (Approach A)
**Why first:** it’s the core funnel; later changes (practice diff, feedback, offline) attach to booked appointments.

### 1) How it works (user-visible behavior)
Progressive disclosure = “one decision at a time,” revealing only what’s needed next.

**Flow (high level)**
1. **Entry**
   - Home: prominent “Book appointment” CTA (keeps US 1.1.1 intent: fast start).
2. **Step 1: Who is this for?** (dependent support)
   - Default: “Me” with quick switch to dependent.
3. **Step 2: Specialty**
   - Simple picker/search with recent specialties (optional).
4. **Step 3: Doctor selection**
   - Results list with top info only (name, specialty, distance, earliest slot).
   - Optional “Favorite/Save” affordance on doctor card (supports US 1.2.2 later, without blocking MVP).
5. **Step 4: Slot selection**
   - Calendar-like slot list; user selects one.
6. **Step 5: Appointment type (Acute/Prevention/Follow‑Up)**
   - Conditional inputs:
     - Acute → symptom text field (min 10 chars)
     - Prevention → dropdown reasons
     - Follow‑Up → optional reference
7. **Step 6: Review & confirm**
   - Review card: doctor, location, time, appointment type, patient (me/dependent), cancellation policy.
   - Clear confirmation CTA.

### 2) UI intent
- **Reduce cognitive load:** one task per screen; no “everything at once” forms.
- **Make the “right” path the easiest path:** defaults + smart prefill where possible.
- **Prevent errors without scolding:** inline validation, plain-language prompts.

### 3) Interaction spec (Codex-ready)
**Screen-level interactions**
- **Progress indicator:** “Step X of Y” + back button (never trap users).
- **Inline validation:** show requirements at the moment the field appears (e.g., symptom length).
- **Contextual help:** small “Why we ask” links for insurance/dependent fields (trust).

**Micro-interactions**
- Specialty selection:
  - Tap a chip → selects; auto-advances if unambiguous.
- Doctor card:
  - Tap card → doctor detail (optional) or directly to slots.
  - “Save” (heart) → toggles; confirms with subtle toast (no modal).
- Slot selection:
  - Selecting a slot enables “Continue”.
- Review:
  - Edit sections via “Change” links (in-place return to step).

### 4) Dependencies (from master US set)
- Booking flow must feed:
  - **US 1.2.5** status tracking (needs appointment ID + status surfaces)
  - **US 1.2.6** calendar export (only once confirmed)
  - **US 1.2.9/1.2.10** modify/cancel (detail view actions)
  - **EPIC 1.3** feedback (past appointment surface)
  - **EPIC 1.5** practice changes diff (detail view change history)
- Dependent selection supports **US 1.2.4** (asked early in flow).  

---

## Phase 2 — Appointment surfaces upgrade (List + Detail)
**Why now:** every other chosen approach anchors on Appointment List + Appointment Detail.

### 1) How it works
- **Appointment list**: tabs “Upcoming” / “Past”, filter entry point, consistent appointment cards.
- **Appointment detail**: one canonical page for:
  - status + timestamp,
  - location/contact,
  - actions (cancel/modify/export),
  - change history (Phase 4),
  - feedback entry (Phase 3).

### 2) UI intent
- **Single source of truth:** users know where to look for anything appointment-related.
- **Trust through transparency:** always show status + “Last updated.”

### 3) Interactions
- List:
  - Tab switch
  - Filter open/close
  - Tap card → detail
- Detail:
  - Primary actions as bottom sticky bar or clearly grouped buttons:
    - Upcoming: Modify / Cancel / Add to calendar (if confirmed)
    - Past: Rate visit (Phase 3)

### 4) Dependencies
- Implements UX parts of **US 1.2.8** and enables **US 1.2.5/1.2.6/1.2.9/1.2.10**.

---

## Phase 3 — EPIC 1.3: Feedback (Micro‑Nudge + Silent Opt‑In)
**Goal:** collect feedback without interrupting users (especially older users who find pushy prompts frustrating).

### Approach A: Micro‑Feedback Nudge (soft prompt)
**How it works**
- After user views a **past appointment detail**, show a lightweight nudge:
  - “How was your visit?” with 1–5 stars inline.
- If user dismisses:
  - Respect dismissal; don’t show again for that appointment.

**UI intent**
- Capture high intent moment (user already reviewing the visit) without creating friction.
- Keep emotional tone supportive and non-judgmental.

**Interactions**
- Tap a star → expands to optional comment field + Submit.
- “Not now” → collapses, sets “dismissed” for that appointment.

### Approach C: Silent Opt‑In (zero interruption)
**How it works**
- Feedback is always available in:
  - Past appointment cards (“Rate visit”)
  - Past appointment detail (CTA)
- Users can optionally enable reminders in Settings:
  - “Remind me to rate visits” toggle.

**UI intent**
- Provide choice and control (privacy + wellbeing).
- Avoid dark patterns: no nag loops, no guilt copy.

**Interactions**
- Past list:
  - “Rate visit” CTA per appointment
- Settings:
  - Toggle on/off
  - If turned on: confirmation sheet explaining what they’ll receive (simple, clear)

**Dependencies**
- Requires Phase 2 appointment surfaces (Past list + Detail).
- Needs consistent appointment identity to prevent duplicate prompts.

---

## Phase 4 — EPIC 1.5: Timeline Diff for Practice‑Initiated Changes (Transparency First)
**Goal:** when practices modify appointments, users see *what changed* and *when*—not just a generic alert.

### 1) How it works
- Appointment detail includes a **“Changes”** section when updates exist:
  - A timeline list: each change entry shows timestamp + change summary.
- A **diff view** highlights changed fields:
  - Old vs new values for: date/time, location, doctor, appointment type, notes (if present).
- Status becomes **“Modified by Practice”** on card and detail.

### 2) UI intent
- **Trust through visibility:** users don’t feel tricked by silent changes.
- **Reduce anxiety:** show the smallest useful explanation first, allow deeper inspection.

### 3) Interactions
- Push deep-link opens Appointment detail:
  - Top banner: “Your appointment was changed by the practice.”
  - CTA: “Review changes”
- Diff view:
  - “Before / After” toggles or inline strikethrough + highlight.
  - “Acknowledge” button (optional) returns to detail.

### 4) Dependencies
- Requires Phase 2 (detail page) and Phase 0 (status + timestamp language).
- Plays well with cancellation/modify rules (users may choose to modify/cancel after changes).

---

## Phase 5 — US 1.8.2: Offline‑First Appointment Vault (Reliability First)
**Goal:** users can still **view** their booked appointments without internet, with clear expectations and calm messaging.

### 1) How it works (UX only)
- When offline:
  - App shows an **offline banner** (non-alarming tone).
  - Appointment list remains visible in **view-only** mode.
  - Booking CTAs are disabled with explanatory copy.
- When back online:
  - Banner updates: “Back online — updating…” then returns to normal.
  - “Last updated” timestamp refreshes.

### 2) UI intent
- **Reliability:** “My appointments are always there.”
- **Honesty:** never promise exact update timing; show “last updated” instead.

### 3) Interactions
- Offline state:
  - Disabled “Book appointment” CTA with tooltip/sheet:
    - “Booking requires an internet connection.”
  - Appointment detail remains accessible.
  - Optional “Try again” action for refreshing (user-controlled, calm).
- Back online:
  - Passive toast/banner update (no modal).

### 4) Dependencies
- Requires Phase 2 appointment surfaces and Phase 0 timestamp pattern.
- Must not break booking flow: offline disables entry points rather than branching the booking flow.

---

## Cross‑EPIC UX quality checklist (Codex acceptance cues)
Use these as “definition of done” for UI output:
- **Cognitive load:** one primary task per screen; progressive disclosure is consistent end-to-end.
- **Dark pattern check:** no forced feedback, no guilt language, no auto opt-in notifications.
- **Accessibility:** readable typography, clear contrast, large hit areas, predictable back behavior.
- **Inclusion:** stable language; avoid switching language mid-flow; plain German/English copy.
- **Privacy:** consent/feedback choices are reversible; transparency messages include “why”.
- **Wellbeing:** error/offline/change states are calm and actionable, not alarming.

---

## Suggested Codex work packages (small slices)
See also: [impact-report.md](impact-report.md)
1. **Appointment Card + Status/Stamp system** (Phase 0)  
2. **Booking Progressive Disclosure flow** (Phase 1)  
3. **Appointment List + Detail canonical** (Phase 2)  
4. **Feedback entry points + nudge logic** (Phase 3)  
5. **Practice change timeline + diff UI** (Phase 4)  
6. **Offline banner + view-only mode** (Phase 5)

---

## Appendix — Mapping to key US (design scope)
- **EPIC 1.2** booking flow: US 1.2.1–1.2.10  
- **EPIC 1.3** feedback: US 1.3.1  
- **EPIC 1.5** practice changes: US 1.5.1  
- **US 1.8.2** offline viewing (UX surfaces only)  

(Reference master US/AC and research notes for rationale and constraints.)  
