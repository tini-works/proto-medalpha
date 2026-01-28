---
cr_id: MEDA-BOOK-FASTLANE-001
step: 5-solution-approaches
status: pending
created: 2026-01-27
updated: 2026-01-27
related_inputs:
  - docs/appointment-booking/CURRAY-flow-analyzing.md
---

# Step 5 — Solution Approaches (Fast lane / By Specialty / By Doctor)

**Related requirement notes:** [[CURRAY-flow-analyzing]]

## Problem framing

Add three booking entry points while keeping the experience fast and safe:
- **Fast lane (nearest time slot):** Specialty → QnA → Confirm info → Matching…
- **Book by specialty:** Specialty → Doctor search/list & details → “Seen this doctor before?” → Time preferences (multiple slots / flexible) → QnA → Confirm info → Matching…
- **Book by doctor:** Doctor search/list & details → “Seen this doctor before?” → Time preferences (multiple slots / flexible) → QnA → Confirm info → Matching…

Key challenge: support **flexible time preferences** and a **matching** model without making users feel they lost control or that the system is “guessing”.

## Evaluation criteria

🔴 Must-have
- **Safety & clarity:** prevent wrong booking (doctor/specialty/location/time/insurance), clear confirmation before matching.
- **Recoverability:** users can change specialty/doctor/location/time preferences late in the flow without restarting.
- **Mobile-first + i18n-first:** long German strings, no fragile layouts, calm healthcare tone.

🟡 Goal-supporting
- **Speed to first viable option:** minimize time to reach “matching…” with adequate confidence.
- **Effort:** reduce typing and repeated questions (especially across the 3 paths).

🟢 System-level
- **Composable steps:** reuse shared components (doctor search, time preference picker, QnA, confirm).
- **Explainability:** simple “why we matched this” language, even with deterministic rules.

---

## Approach A — “3-Path Wizard”: One funnel, three entry points

### Core concept
Create three explicit entry points, but converge quickly into a shared step model (Search → Preferences → QnA → Confirm → Matching). “Fast lane” is a preset that skips doctor browsing and time preference complexity by defaulting to nearest slot, while still allowing a user to expand controls.

### Cross-domain inspiration
**Airline rebooking flows (travel):** disruption tools present a fast default (“best alternative”) but keep “change flight” controls nearby. Pattern: **fast default + explicit override**.

### How it works
- Entry screen: **Fast lane / By specialty / By doctor** (with short descriptions).
- Shared primitives reused across paths:
  - Doctor search/list + doctor details
  - Time preference picker (weekday + time range + “flexible”)
  - QnA module
  - Confirm info summary (editable sections)
  - Matching state + fallback options
- “Seen this doctor before?” appears immediately after doctor selection (By specialty / By doctor):
  - If **Yes**: show “continue with this doctor” + optional context (language, accessibility needs, continuity).
  - If **No**: show reassurance copy + “continue” (no additional burden).
- “Fast lane”:
  - Requires specialty; sets time preference = “next available” (editable).
  - Skips doctor browsing; matching returns best-fit doctor + slot quickly, with “why” chips.

### Trade-offs
| Pros | Cons |
|---|---|
| Covers all three requirements without inventing a new mental model | Risk of feeling “wizard-y” if steps aren’t skippable |
| Clear recovery/edit at confirm step | Fast lane may still feel slow if QnA is heavy |
| Reuse of components reduces build cost | Needs careful copy to explain “matching” vs “booking” |

### Best suited for
Sarah + Helga (clarity, recovery), Marc (speed if fast lane is genuinely fast).

---

## Approach B — “Match Request”: Submit constraints, then receive options (async)

### Core concept
Treat booking as a **request**: users specify specialty/doctor (optional), location, insurance, and multiple acceptable time windows. The system matches and returns 1–3 options; the user confirms one. “Matching…” becomes a first-class state rather than a brief loading spinner.

### Cross-domain inspiration
**Ride-hailing dispatch (logistics):** users request “pickup + destination”, then the system finds a driver and provides ETAs. Pattern: **constraint submission → dispatch/match → confirm**.

### How it works
- All paths converge into: “Build request” → “Review request” → “Submit request”.
- Time preference picker becomes primary (multi-slot / flexible):
  - Allow multiple selections (e.g., Tue 08:00–11:00, Thu 14:00–18:00).
  - Allow “flexible within X days” as fallback.
- Doctor choice is optional unless user started in “Book by doctor”.
- QnA is split:
  - Minimal required QnA pre-submit (eligibility/safety/insurance basics).
  - Optional follow-up QnA if matching needs clarification.
- Matching state:
  - Shows progress (“Searching nearby clinics…”, “Checking insurance type…”).
  - Offers “edit request” and “keep looking in background” (if product supports notifications later).

### Trade-offs
| Pros | Cons |
|---|---|
| Best fit for “select multiple time slots or flexible” | Requires careful expectations: “request” is not “booked” |
| Scales to scarce availability (system can try many combinations) | More backend/state complexity (queued matching, retries) |
| Naturally supports “matching…” UX | Risk of users feeling loss of control if results feel opaque |

### Best suited for
Sarah (family constraints), Marc (if results are fast), users in low-availability regions.

---

## Approach C — “Conversational Router”: QnA as the front door

### Core concept
Start with a short conversational intake that routes users into Fast lane / Specialty browsing / Doctor-specific booking based on intent, then continues as guided prompts. The conversation primarily reduces navigation choices and collects QnA along the way.

### Cross-domain inspiration
**Banking support chat (fintech):** intent classification routes users into precise workflows while keeping context. Pattern: **intent-first routing + step handoff**.

### How it works
- First prompt: “What are you trying to do today?” (choose + optional free text).
- Conversation collects:
  - Specialty or doctor name
  - Location preference
  - Insurance type
  - Time preferences (multi-slot / flexible)
  - QnA (lightweight, progressive)
- When enough info is collected, the system offers a structured handoff:
  - “Show doctors” (with filters) OR “Start matching now”.
- “Seen this doctor before?” is asked only if user selected a doctor.

### Trade-offs
| Pros | Cons |
|---|---|
| Reduces choice overload and can unify the three flows | Higher implementation complexity (stateful convo + handoffs) |
| Can front-load only what’s needed | Risky in healthcare if copy feels too casual or ambiguous |
| Good for accessibility when done carefully | Error recovery can be harder than a visible stepper |

### Best suited for
Helga (if accessibility-first), users unsure which specialty they need (within policy).

---

## Approach D — “Shortlist”: Compare doctors + time preferences before matching

### Core concept
Let users shortlist 2–5 doctors (from specialty search or doctor search), then apply time preferences once and match across the shortlist. This keeps user control high while still enabling a “matching…” model.

### Cross-domain inspiration
**Shopping “compare + cart” (e-commerce):** users shortlist items, then apply constraints (price, delivery) to decide. Pattern: **shortlist first, filter second**.

### How it works
- Specialty/doctor search results support “Add to shortlist”.
- Shortlist screen:
  - Shows key doctor signals (distance, languages, insurance type supported, rating if available).
  - Asks “Seen this doctor before?” per shortlisted doctor (optional batch).
- Time preferences applied once:
  - Multiple weekday + time range combinations, plus flexible fallback.
- Matching searches across shortlist first; if no match, offers expand radius/specialty or broaden availability.

### Trade-offs
| Pros | Cons |
|---|---|
| Keeps user agency high (user picks candidate doctors) | Adds a concept (shortlist) that some users may skip |
| Works well with low trust in “auto match” | Slower than fast lane for users who just want “nearest” |
| Good stepping stone toward smarter matching | More UI states to design (empty shortlist, conflicts) |

### Best suited for
Thomas (trust + control), Elena (browsing), users with strong doctor preferences.

---

## Approach E — “Availability-first”: Nearest slot as the primary navigation

### Core concept
Make availability the main object: users browse a timeline of nearest slots within constraints, then tap into doctor details only when needed. Fast lane becomes the default browsing mode; specialty/doctor become filters rather than flow branches.

### Cross-domain inspiration
**Delivery time slot selection (retail/logistics):** users pick delivery windows first, then adjust constraints. Pattern: **availability-first discovery**.

### How it works
- Default: “Next available” list with quick filters (specialty, insurance type, location radius).
- Selecting a slot opens:
  - Doctor details (condensed) + “Seen before?” + confirm.
- “Book by doctor” becomes a filter/search overlay rather than a separate funnel.
- Time preference picker becomes “set your acceptable windows”, which re-ranks availability.

### Trade-offs
| Pros | Cons |
|---|---|
| Maximizes speed for fast lane users | Can feel opaque if users want to understand “who” before “when” |
| Naturally highlights nearest slot | Requires good availability data quality to avoid frustration |
| Reduces branching: one main screen | Harder to express multi-slot preferences without a secondary UI |

### Best suited for
Marc (speed), users booking routine visits without strong provider preference.

---

## ⛔ Decision gate

Select which approach to pursue (or combine). Suggested baseline:
- Start with **Approach A** (shared funnel + explicit entry points).
- Optionally add **Approach D** (shortlist) if trust/control becomes a top risk.
- Consider **Approach B** only if “matching…” is intended to be an async system feature (not just loading).

