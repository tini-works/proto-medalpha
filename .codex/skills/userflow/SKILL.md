---
name: userflow
description: Use when generating user flow diagrams in D2 for JTBD ideation, CR approval, or current app inventory - outputs .d2 files only, uses the standard palette, with screen labels matching the sitemap and English action labels.
---

# User Flow (D2)

## Purpose

Generate D2 user flow diagrams from:
- JTBD (ideation flows),
- CR (approval flows, tied to scope and screen IDs), or
- Inventory (document existing app flows for impact analysis).

All outputs are pure `.d2` files (no Markdown, no frontmatter, no metadata blocks).

Canonical rules: `calo-tracker/docs/visual-artifacts-rules.md`.

## Dependencies

- JTBD mode: run `jtbd` skill first if no JTBD document exists.
- CR mode: requires a CR file (typically ready for `/approve-change`).
- Inventory mode: requires sitemap at `artifacts/information-architecture/sitemap.mermaid`.

## When to Use

**JTBD/CR modes:**
- "Create a user flow for this job"
- "How could users accomplish [job]?"
- "Explore approaches for [job]"
- "Generate user flow from JTBD"
- "draw userflow"
- "ideate userflow"
- "brainstorming userflow"
- "/approve-change needs user flows"

**Inventory mode:**
- "capture inventory flows"
- "document current app flows"
- "inventory userflow"
- "capture existing user flows"

## Quick Reference

| Mode | Input | Output folder | Filename pattern | Labels |
|------|-------|---------------|------------------|--------|
| JTBD | `*-jtbd-*.md` | `docs/artifacts/userflows/` | `FLOWYYMMDD-[job]-[approach].d2` | Screen: sitemap text if applicable. Action: English. |
| CR | CR file | `docs/change-requests/<cr-group>/<CR##-##>/` | `FLOWYYMMDD-CR##-##-[slug].d2` | Screen: sitemap text if applicable. Action: English. |
| Inventory | sitemap + router | `artifacts/userflow-inventory/` | `[journey-slug].d2` | Screen: must match sitemap text. Action: English. |

## Process

### Step 1: Locate JTBD Input

**If user provides file path:**
- Read the specified JTBD file

**If no path provided:**
- Search `artifacts/` for files matching `*-jtbd-*.md`
- If multiple found → ask user to pick one
- If none found → ask user for file path or paste content

### Step 2: Parse & Present Jobs

Extract all jobs from the JTBD file and present as numbered list:

```
Found 5 jobs in accountee-jtbd-2025-12-04.md:

1. [Functional] Record expenses quickly - "When I receive a receipt..."
2. [Functional] Track spending by category - "When I review my month..."
3. [Emotional] Feel confident about finances - "When tax season approaches..."
4. [Functional] Generate reports for accountant - "When my accountant asks..."
5. [Social] Appear organized to investors - "When presenting to stakeholders..."

Which job would you like to explore? (enter number)
```

### Step 3: Validate Job Type

**If functional job** → proceed to brainstorming

**If emotional/social job** → ask clarifying questions:
- "This is an emotional job. What specific actions might help users feel [outcome]?"
- "What triggers this feeling? What would resolve it?"
- "Should we explore a functional job that supports this emotional need instead?"

### Step 4: Brainstorm Approaches

For the selected job, propose 2-4 different approaches:

```
Job: "When I receive a receipt, I want to record it quickly, so I can stay on top of expenses"

Possible approaches:
A) Manual entry - User types expense details into a form
B) Photo capture - User takes photo, app extracts details via OCR
C) Email forwarding - User forwards receipt email, app parses it
D) Bank sync - App imports transaction, user just confirms category

Which approaches should I generate flows for? (e.g., "A, B" or "all")
```

### Step 5: Generate D2 User Flows (.d2 only)

For each selected approach, generate a D2 file following this structure:

**Design Philosophy Integration:**

- **Hierarchy:** Emphasize primary actions (larger nodes or thicker arrows for speed-critical paths)
- **Language:** Screen labels must match sitemap text exactly (e.g., "CAL-001 | Dashboard"). Action labels are in English.
- **Motion:** Annotate transitions only when critical to UX (e.g., "Modal slides up", "Toast fades in 150ms")
- **States:** Reference state matrix from wireframes. Flows show happy path, wireframes show states.
- **Progressive Disclosure:** Show collapsed/expanded states in decision diamonds when advanced features hidden
- **Speed Heuristics:** Minimize nodes (2-tap confirm = 3 nodes: screen → action → screen). Annotate defaults ("M portion auto-selected").

**D2 Shape Mapping:**

| Element | Shape | Color | D2 Syntax |
|---------|-------|-------|-----------|
| Start/End point | Circle | Navy fill, white text | `shape: circle` + `style.fill: "#1C2E6A"` + `style.font-color: "#FFFFFF"` |
| User Action | Rectangle | Blue fill, white text | `shape: rectangle` + `style.fill: "#2F5FD1"` + `style.font-color: "#FFFFFF"` + `style.border-radius: 6` |
| Decision (yes/no) | Diamond | Navy fill, white text | `shape: diamond` + `style.fill: "#1C2E6A"` + `style.font-color: "#FFFFFF"` |
| UI Screen/Page | Document | Green fill, white text | `shape: document` + `style.fill: "#2E7D32"` + `style.font-color: "#FFFFFF"` |
| Sequence | Arrow | Gray | `->` + `style.stroke: "#9AA0A6"` |

**D2 Template (.d2 file):**

```d2
direction: down

# Start
start: Start {
  shape: circle
  style.fill: "#1C2E6A"
  style.font-color: "#FFFFFF"
}

start -> first-screen: {
  style.stroke: "#9AA0A6"
}

# Screen → Action → Screen pattern
first-screen: SCREEN-ID | Screen Name {
  shape: document
  style.fill: "#2E7D32"
  style.font-color: "#FFFFFF"
}

first-screen -> user-action: {
  style.stroke: "#9AA0A6"
}

user-action: Tap "Button" {
  shape: rectangle
  style.fill: "#2F5FD1"
  style.font-color: "#FFFFFF"
  style.border-radius: 6
}

user-action -> next-screen: {
  style.stroke: "#9AA0A6"
}

next-screen: SCREEN-ID | Next Screen {
  shape: document
  style.fill: "#2E7D32"
  style.font-color: "#FFFFFF"
}

# Decision example
next-screen -> decision-point: {
  style.stroke: "#9AA0A6"
}

decision-point: Condition? {
  shape: diamond
  style.fill: "#1C2E6A"
  style.font-color: "#FFFFFF"
}

decision-point -> yes-action: Yes
decision-point -> no-action: No

yes-action: Action A {
  shape: rectangle
  style.fill: "#2F5FD1"
  style.font-color: "#FFFFFF"
  style.border-radius: 6
}

no-action: Action B {
  shape: rectangle
  style.fill: "#2F5FD1"
  style.font-color: "#FFFFFF"
  style.border-radius: 6
}

# Both paths converge
yes-action -> end-screen
no-action -> end-screen

end-screen: SCREEN-ID | Confirmation {
  shape: document
  style.fill: "#2E7D32"
  style.font-color: "#FFFFFF"
}

end-screen -> done: {
  style.stroke: "#9AA0A6"
}

# End
done: End {
  shape: circle
  style.fill: "#1C2E6A"
  style.font-color: "#FFFFFF"
}
```

**Flow Guidelines:**
- Keep flows high-level: 5-8 steps maximum
- Follow Screen → Action → Screen alternating pattern
- Include decision points only when essential
- Focus on happy path first, add one alternative path if needed
- Screen labels must match sitemap text exactly when the screen exists in the sitemap
- Action labels are in English
- No Markdown wrappers, no YAML frontmatter, no metadata blocks

### Step 6: Save & Present

1. Save .d2 file based on mode:
   - JTBD mode: `docs/artifacts/userflows/FLOWYYMMDD-[job]-[approach].d2` (kebab-case)
     - Example: `FLOW251209-record-expenses-photo-capture.d2`
   - CR mode: `docs/change-requests/<cr-group>/<CR##-##>/FLOWYYMMDD-CR##-##-[slug].d2`
     - Slug: First 2-3 words from feature name (before " - CR##-##"), kebab-case
     - Example: "Scan Results - Analyze and log - CR03-02" → `FLOW251217-CR03-02-scan-results.d2`
     - CRITICAL: Slug must match wireframe slug for same CR (consistency across artifact types)

2. Describe the flow in plain text:
   ```
   Flow: Start → Home Screen → Tap "Add Expense" → Camera Screen →
   Take Photo → Review Screen → Details correct? →
   Yes: Save → Confirmation → End
   No: Edit → Save → Confirmation → End
   ```

3. Ask: "Would you like to refine this flow or generate another approach?"

## Error Handling

| Situation | Response |
|-----------|----------|
| No JTBD file found | Ask user for file path or paste content |
| Multiple JTBD files | Present list, ask user to choose |
| Emotional/social job selected | Ask clarifying questions before proceeding |
| Job statement too vague | Ask for more context about trigger and outcome |
| User wants to change approach mid-flow | Start fresh with new approach |

## Validation Checklist

Before finalizing each user flow:
- [ ] Direction set to `down` (top-to-bottom layout)
- [ ] Start node uses navy circle with white text (`#1C2E6A` / `#FFFFFF`)
- [ ] End node uses navy circle with white text (`#1C2E6A` / `#FFFFFF`)
- [ ] All screens use green document shape with white text (`#2E7D32` / `#FFFFFF`)
- [ ] All actions use blue rectangle shape with white text (`#2F5FD1` / `#FFFFFF`) and radius 6
- [ ] All decisions use navy diamond shape with white text (`#1C2E6A` / `#FFFFFF`)
- [ ] All arrows use gray stroke (`#9AA0A6`)
- [ ] Flow follows Screen → Action → Screen pattern
- [ ] 5-8 steps maximum (high-level)
- [ ] File saved as `.d2` in the correct folder/prefix for the mode
- [ ] Screen labels match sitemap text exactly when applicable
- [ ] Action labels are in English
- [ ] Primary actions emphasized (visual weight or annotation)
- [ ] Motion annotated only when UX-critical (modals, critical feedback)
- [ ] Defaults and shortcuts noted ("M portion auto-selected")
- [ ] Progressive disclosure shown (collapsed/expanded branches)
- [ ] Happy path 5-8 steps maximum (speed constraint)
- [ ] No Markdown wrappers, no YAML frontmatter, no metadata blocks

## Constraints

- Level of detail is defined in `calo-tracker/docs/visual-artifacts-rules.md`.
- JTBD mode: keep flows high-level.
- CR mode: flow must match approved scope and required precision (screen IDs, decision outcomes, entry/exit points).
- Inventory mode: screen labels must match sitemap text exactly.

---

## Alternate: CR → User Flow (Approval Mode)

Use this when generating flows for `/approve-change`.

### Step 1: Locate CR Input

If user provides:
- CR file path, read it.
- Slice ID (example `CR03-01`), resolve CR file using the same rules as `/approve-change`:
  - Prefer latest `*-vN.md` (highest N) if multiple matches.

### Step 2: Extract Flow Requirements

From the CR, extract:
- User Story (As a [persona], I want [goal], so that [benefit])
- Acceptance Criteria (Given/When/Then format)
- Recommendation and rationale
- Impacted screens and screen IDs (SCR-###)
- Any required decision points and outcomes

Map User Story goal to flow start. Map each Given/When/Then to decision points and outcomes.

If multiple distinct flows exist, ask which to generate first.

### Step 3: Generate D2 (No Markdown)

Generate a .d2 file only (no Markdown, no frontmatter). Use:
- `calo-tracker/docs/visual-artifacts-rules.md`

Extract from CR:
- User Story (from CR User Story section, or generate from context if missing)
- Acceptance Criteria (from CR Acceptance Criteria section)

Do not embed User Story or Acceptance Criteria in the .d2 file. Summarize them in the plain-text report.

### Step 4: Save and Report

Save to: `<project_root>/docs/change-requests/<cr-group>/<CR##-##>/FLOWYYMMDD-CR##-##-[slug].d2`

**Slug derivation:**
- Extract first 2-3 words from feature name (before " - CR##-##" in title)
- Convert to kebab-case
- Example: "Scan Results - Analyze and log - CR03-02" → `FLOW251217-CR03-02-scan-results.d2`
- CRITICAL: Use same slug as wireframe for consistency

If the filename already exists, append `-v2`, `-v3`, etc.

Return:
- File path(s)
- One-line plain-text flow summary per file (for embedding into the CR)

---

## Alternate: Inventory Mode (Current App Documentation)

Use this mode to document existing app flows for impact analysis. Enables tracing: `Change Request → Blocks → Screens → User Flows`

### Step 1: Read Sitemap

Read the sitemap from `artifacts/information-architecture/sitemap.mermaid`.

Parse:
- Screen IDs (format: `XXX-###`)
- Screen names
- Blocks under each screen

Group screens by prefix: AUTH, ONB, CAL, PRF, etc.

### Step 2: Analyze Router

Read `src/router.tsx` to understand:
- Navigation paths between screens
- Protected routes vs public routes
- Redirects and guards

### Step 3: Present Journeys (Concise Text)

Present discovered user journeys for confirmation:

```
Found 5 user journeys in the current app:

1. First-time setup: register → onboarding → dashboard
2. Returning login: login → dashboard
3. Log meal via search: search → select food → portion → log
4. Log meal via scan: scan → results → confirm/edit → log
5. Manage profile: profile → edit → save

Generate all journeys? (yes/no, or specify numbers)
```

### Step 4: Generate Inventory D2 Flows

For each journey, generate a .d2 file only (no Markdown, no frontmatter).
Use the same D2 shape mapping and flow guidelines as JTBD/CR modes.
Screen labels must match sitemap text exactly.

### Step 5: Save & Report

Save to: `artifacts/userflow-inventory/[journey-slug].d2`

**Naming convention:**
- Slug: kebab-case journey name
- Examples:
  - `first-time-setup.d2`
  - `returning-login.d2`
  - `log-meal-search.d2`
  - `log-meal-scan.d2`
  - `manage-profile.d2`

Report:
- File paths created
- Plain-text flow summary for each

### Inventory Validation Checklist

- [ ] Sitemap read from `artifacts/information-architecture/sitemap.mermaid`
- [ ] Journey list is concise text (no screen IDs)
- [ ] Screen labels match sitemap text exactly
- [ ] Files saved to `artifacts/userflow-inventory/`
- [ ] Naming follows `[slug].d2` pattern
- [ ] D2 follows standard shape mapping and guidelines

### Impact Analysis Usage

After inventory flows exist:

```bash
# Find flows impacted by changes to CAL-001
rg -l "CAL-001" artifacts/userflow-inventory/*.d2
```

This enables: `CR mentions block → sitemap shows screen → grep finds impacted journeys`

## Common Mistakes

- Saving `.md` files or embedding Markdown instead of `.d2` only
- Keeping YAML frontmatter or metadata blocks in flow files
- Using friendly screen names instead of exact sitemap labels
- Mixing languages (actions must be English)
- Listing screen IDs in journey summaries

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "The template is just an example; I can leave Markdown." | Examples shape behavior. Replace Markdown with .d2-only output. |
| "Frontmatter is useful for CRs, so keep it." | The requirement is no metadata; keep reports in plain text instead. |
| "Vietnamese labels are in the design philosophy; keep them." | Action labels are explicitly English; screen labels must match the sitemap. |

## Red Flags - Stop and Fix

- About to save a `.md` file for a flow
- About to include YAML frontmatter or metadata comments
- Screen label does not match sitemap text exactly
- Action label is not in English
- Journey list includes screen IDs
