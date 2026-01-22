# Gate 4b — Ethics & Inclusive UX (Approach I: Predictive Booking)

**Input concept:** “Approach I: Predictive Booking” in `docs/appointment-booking/step-5-solution-approaches-full.md:333`  
**Date:** 2026-01-22

## 1) Cognitive & Emotional Load

- **10-second understanding:** Yes (“We’ll suggest a good slot; tap to book”). But the mental model can quickly become unclear: “Why did it pick this?” and “Did I miss something?”
- **Overload moments:**
  - **Push notification moment**: user is interrupted, often in a different context. Booking is a task that benefits from attention; interruptions increase error likelihood.
  - **Modify vs accept** path: if modification is hard, users feel trapped between “accept wrong” and “abandon”.
  - If “auto-confirm” is literal, it removes the clarity gate and raises anxiety.
- **Progressive disclosure:** Must be strong: notification should contain minimal info and open to a full, scannable review before any commitment.
- **Defaults and wellbeing:** Defaults can easily drift into “maximize engagement” by sending more suggestions. Wellbeing defaults should be low-frequency and user-controlled.

## 2) Manipulation & Dark Patterns

- **Nudge risk:** Push timing can be used manipulatively (e.g., “limited availability”, “book now”) even if not intended.
- **Soft penalties:** If opting out is buried, or if reminders/suggestions keep returning after dismissal, that becomes coercive.
- Any implication that “this is the perfect slot for you” crosses into undue influence in a health context unless carefully framed as convenience.

## 3) Inclusion & Fairness

- **Disadvantaged groups:**
  - Users who can’t reliably receive notifications (battery saving, older devices, OS settings).
  - Users with anxiety or cognitive overload who experience push as pressure.
  - Privacy-sensitive users who don’t want behavior patterns inferred.
- **Forgotten user:** A user who shares a device or has notifications visible on lock screen—healthcare suggestions can reveal sensitive intent.

## 4) Intentional Trade-offs

- **Wellbeing upside:** Can reduce decision fatigue for routine care if done sparingly and transparently.
- **Wellbeing downside:** Shifts control from user-initiated action to system initiation; increases surveillance perception and notification fatigue.
- **Misuse risk:** Over-notifying becomes a “growth loop” if treated as success; should be treated as a harm signal.

## Concrete Changes (prioritized)

- **P1:** Make predictive suggestions **opt-in** with clear frequency controls (e.g., “never / monthly / weekly”) and a prominent “turn off” toggle.
- **P1:** Never “auto-confirm” from a push. Always land on a **review/confirm** screen with full details and explicit consent.
- **P1:** Data minimization: explain what data is used; allow “use only my explicit preferences” mode (no health-history inference).
- **P1:** Lock-screen safety: default notifications should be generic (“Appointment suggestion available”) with details only after unlock.
- **P2:** Provide a “why this suggestion” explainer (earliest slot, preferred time window, distance) using only non-sensitive signals where possible.
- **P3:** Treat dismissal as strong signal; do not re-suggest the same item repeatedly.

## One Hard Question

Is proactive booking a **user-controlled reminder** (wellbeing-supportive) or a **conversion channel** (engagement-driven)? How do we prevent it from becoming the latter?

## Gate Result (AI)

**FAIL ❌** as described (“auto-confirm” + extensive inference).  
**CAUTION 🟡** only if opt-in, low-frequency, privacy-minimized, and always gated by explicit review/confirm.

