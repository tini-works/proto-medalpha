# Gate 4b — Ethics & Inclusive UX (Approach A: Assisted Discovery)

**Input concept:** “Approach A: Assisted Discovery” in `docs/appointment-booking/step-5-solution-approaches-full.md:7`  
**Date:** 2026-01-22

## 1) Cognitive & Emotional Load

- **10-second understanding:** Usually yes (“Tell us what you need → we suggest appointments”). But in healthcare, “suggest” can feel like advice.
- **Overload moments:**
  - Natural language (symptom/need) input can create anxiety: “What should I type?” and “Am I exposing too much?”
  - Ranked list introduces a new cognitive task: **interpreting the ranking** (“is #1 best doctor or just earliest?”).
  - If “coverage estimate” is shown, users may over-trust it unless uncertainty is made explicit.
- **Progressive disclosure:** Can be good if the system first asks for minimal inputs and only requests more (insurance/family) when needed for booking.
- **Defaults & wellbeing:** If the system defaults to “fastest” or “most available” it can bias users toward convenience over preference; that’s acceptable only if explicitly communicated and easily changeable.

## 2) Manipulation & Dark Patterns

- **Borderline manipulation risk:** Ranked suggestions can become a **choice architecture nudge**—many users will pick the first item even if it’s not aligned with their true preference.
- If the UI hides manual search or makes it feel “worse,” that’s a soft penalty.
- Ensure opt-out (manual filters/browse) is equally visible and not buried.

## 3) Inclusion & Fairness

- **Disadvantaged groups:**
  - Users who can’t describe needs in the “expected” way (low literacy, non-native language, neurodiversity).
  - Users with complex care needs not captured by simple prefs.
  - Users without a history (cold start): suggestions may be generic and feel low-quality.
- **Forgotten user:** Someone who is privacy-sensitive and does not want to enter symptom text, but still wants booking—must offer “skip symptom” and choose specialty directly.

## 4) Intentional Trade-offs

- **Wellbeing upside:** Can reduce time spent searching and decision fatigue for overwhelmed users.
- **Wellbeing downside:** Can shift responsibility from user choice to system ranking; if wrong, it erodes trust in a high-stakes context.
- **Misuse risk:** Users may interpret “recommended” as medical advice. The product must clearly state this is **scheduling assistance**, not diagnosis.

## Concrete Changes (prioritized)

- **P1:** Replace “recommended” language with “best match based on your filters” and show the **why** (earliest time, distance, languages, insurance acceptance).
- **P1:** Always provide a clearly visible “Browse all results” / “Search manually” path.
- **P1:** Treat symptom text as optional; allow specialty-only.
- **P1:** Data minimization: do not store free-text symptom history by default; be explicit about what is saved.
- **P2:** Ranking transparency: allow sorting (earliest, closest, highest availability) rather than a single opaque rank.
- **P3:** Add “I’m not sure” options and example prompts to reduce fear of typing the “wrong” thing.

## One Hard Question

What exactly does the ranking optimize for (earliest slot, distance, coverage likelihood, past preferences), and are we comfortable with that being the “default choice” users follow?

## Gate Result (AI)

**CAUTION 🟡** unless ranking is transparent, manual browse is equally prominent, and privacy/data-minimization decisions are explicit.

