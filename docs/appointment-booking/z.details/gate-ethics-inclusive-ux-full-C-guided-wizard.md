# Gate 4b — Ethics & Inclusive UX (Approach C: Guided Wizard)

**Input concept:** “Guided Wizard” in `docs/appointment-booking/step-5-solution-approaches-full.md:87`  
**Date:** 2026-01-22

## 1) Cognitive & Emotional Load

- **10-second understanding:** Yes. “Answer a few questions → we find an appointment” is easy to grasp, especially for first-time users.
- **Overload moments:**
  - **Step 1: Need type + urgency** can create emotional load if it resembles diagnosis/triage. Users may worry they’ll pick the “wrong” urgency.
  - **Step 3: Insurance/coverage + cost preview** can overload if it contains legalistic disclaimers or ambiguous terms.
  - **Final confirmation** must avoid a dense wall of text; keep it scannable with clear “Edit” links.
- **Progressive disclosure:** Strong fit. The approach is explicitly built around progressive disclosure and recovery (back/save/edit).
- **Defaults and wellbeing:** This approach naturally supports “good enough” defaults (e.g., remember last location, suggest common specialties) without pushing engagement. Ensure urgency defaults don’t imply “higher urgency is better”.

## 2) Manipulation & Dark Patterns

- No built-in urgency/FOMO mechanic (unlike “slot racing”). That’s good in healthcare.
- Potential **borderline manipulation** only if:
  - “Urgency level” copy nudges users into higher urgency to “get faster access” (avoid).
  - Cost/coverage copy is framed fearfully (“you may pay a lot!”) rather than neutrally.
- Ensure opt-in/opt-out for reminders is symmetric: reminders should be configurable without hiding the “off” option.

## 3) Inclusion & Fairness

- **Likely included well:** Helga (moderate digital proficiency) due to step-by-step guidance, progress indicator, large tappable steps.
- **Potentially excluded/disadvantaged:**
  - Users with low literacy / non-native German if the questions use medical jargon (e.g., “Fachrichtung”, “Dringlichkeit”, “Überweisung”).
  - Users under stress/pain who fear making a wrong choice.
- **Forgotten user:** A stressed user booking for a child, unsure whether to choose “urgency” correctly, and afraid of being judged. The wizard should reassure: “You can change this later” and “This does not replace medical advice.”

## 4) Intentional Trade-offs

- **Protective trade-offs (good):** Wizard trades “exploration” for “clarity,” which reduces cognitive load and decision fatigue.
- **Where wellbeing could be sacrificed:** If metrics push the wizard to add more questions (“data capture”) beyond what’s necessary to book, it becomes a form of friction that burdens users.
- **Misuse handling:** Selecting “high urgency” shouldn’t be rewarded with faster access unless clinically justified and transparently explained (likely out of scope).

## Concrete Changes (prioritized)

- **P1:** Reframe urgency step as scheduling preference, not triage. Example: “Wie schnell möchten Sie einen Termin?” with safe options and a neutral helper text (no implied clinical determination).
- **P1:** Cost/coverage preview: clearly separate “known” vs “unknown”. Avoid definitive price claims unless sourced; use “kann Kosten verursachen” language with a clear “More info”.
- **P1:** Every step must have an obvious back/edit path; final confirmation should have per-section “Bearbeiten” actions.
- **P2:** Add “I’m not sure” options for specialty/urgency with a safe fallback (e.g., show popular specialties + allow free-text search).
- **P3:** Provide language simplification mode (plain German) and examples (e.g., common specialties).

## One Hard Question

Is the “urgency” input purely a **user preference for availability**, or does it imply **medical triage**? If it’s triage-adjacent, we need stronger safety copy and possibly clinical oversight.

## Gate Result (AI)

**PASS WITH NOTES** provided: urgency step is carefully framed (non-diagnostic) and cost/coverage copy avoids false certainty.

