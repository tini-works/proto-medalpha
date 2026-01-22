# Gate 4b — Ethics & Inclusive UX (Approach G: Voice Guided Booking)

**Input concept:** “Approach G: Voice Guided Booking” in `docs/appointment-booking/step-5-solution-approaches-full.md:255`  
**Date:** 2026-01-22

## 1) Cognitive & Emotional Load

- **10-second understanding:** Yes (“Speak what you need, we guide you”), but only if the user already trusts voice systems.
- **Overload moments:**
  - Users must **hold context in working memory** (what they already said, what the system understood) more than in a visual flow.
  - In noisy environments or with speech recognition errors, the user repeats themselves → frustration and emotional load.
  - “Insurance/coverage/cost” and “who is this for” are complex to validate purely via voice; forcing verbal confirmation increases error risk.
- **Progressive disclosure:** Voice can be progressive, but it can also hide complexity until late. Without a strong visual companion, users can’t scan/compare.
- **Defaults and wellbeing:** Voice can encourage “just get it done quickly.” That can be good, but in healthcare it risks under-reviewing details (doctor/time/location).

## 2) Manipulation & Dark Patterns

- No explicit FOMO/urgency mechanic is built-in (good).
- **Borderline manipulation risk:** “Conversational momentum” can act like a soft nudge—users may keep saying “yes” to finish. This is a known risk in voice UX where opt-out/edit paths are less visible.
- If the system uses “confirm by voice” only, it becomes harder to opt out than opt in (fails symmetry).

## 3) Inclusion & Fairness

- **Excluded/disadvantaged groups (high risk):**
  - Users with speech impairments (stutter, aphasia), low vocal strength, or temporary illness.
  - Users with strong accents/dialects, code-switching, or non-native language ability.
  - Users with hearing impairments (if the system relies on audio prompts) and users in silent environments.
  - Users with privacy constraints (shared home, public transport) who cannot speak health-related intent aloud.
- **Forgotten user:** A user who is **hard of hearing** and uses captions, or a user with a speech impairment who cannot reliably “confirm” by voice—this design can silently exclude them.

## 4) Intentional Trade-offs

- **Wellbeing benefit:** Hands-free and potentially less intimidating than complex forms.
- **Wellbeing cost:** Increases risk of booking mistakes and privacy exposure for convenience.
- **Misuse risk:** Encourages booking while distracted (explicitly mentioned “driving/cooking”). In healthcare, booking errors are higher-impact than, say, ordering groceries.

## Concrete Changes (prioritized)

- **P1:** Make voice **assistive**, not primary. Always show a parallel visual flow and never block completion behind voice.
- **P1:** Require **tap-to-confirm** on a visual summary for the final booking action (voice-only confirmation is too error-prone).
- **P1:** Provide an obvious, voice-accessible “edit” command (“change time”, “change location”, “start over”) and a visible “switch to text” control at all times.
- **P1:** Add a “privacy check” moment: “You can switch to text mode if you’re not in a private place.” (no guilt; neutral).
- **P2:** Bias to plain language prompts; avoid medical jargon; add “I’m not sure” escape hatches.
- **P2:** Treat recognition errors as expected: show what was heard in text; allow single-tap correction.
- **P3:** Consider a “safe mode” for high-risk actions: if the system detects driving context (if available) or rapid confirmations, slow down and require explicit review.

## One Hard Question

Are we willing to ship a booking experience that is measurably **less inclusive** (speech/hearing/privacy constraints) in exchange for hands-free convenience, or must voice remain purely optional?

## Gate Result (AI)

**FAIL ❌** if proposed as a default booking flow.  
**CAUTION 🟡** only if redesigned as an optional assistive mode with mandatory visual review + tap-to-confirm.

