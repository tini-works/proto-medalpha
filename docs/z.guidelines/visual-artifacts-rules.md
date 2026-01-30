# Visual Artifacts Rules (Canonical)

Single source of truth for generating and updating:
- D2 user flows. `<project_root>/docs/change-requests/**/FLOW*.md` (CR) and `<project_root>/docs/artifacts/userflows/*.md` (base), markdown with embedded D2 code blocks
- Wireframes (ASCII). `<project_root>/docs/change-requests/**/WIRE*.md` (CR), markdown with ASCII art
- Mermaid IA map. `<project_root>/docs/artifacts/ia-map/IA.md`

Do not duplicate rules across commands, skills, or templates. Link here. If any other file conflicts with this doc, this doc wins.

## Related Visual Guidelines (Apply By Default)

These are complementary and should be applied by default unless a specific artifact explicitly overrides them:
- Abstract / cross-cutting constraints: `docs/z.guidelines/visual-guidelines-abstract.md`
- Concrete UI tokens (when relevant to the artifact): `docs/z.guidelines/visual-guideline.md`

## How To Use This Doc

If you are generating or updating a visual artifact:
1. Read this file first.
2. Apply the constraints in `docs/z.guidelines/visual-guidelines-abstract.md` (Germany + i18n-first + mobile-first + white-label + healthcare context).
2. Apply the relevant section (D2 or Mermaid).
3. Do not restate rules elsewhere. Just link here.

## Ownership and Entry Points

These entry points must follow this doc:
- D2 user flows: `userflow` skill, `/approve-change`, `/execute-design` (legacy), `/implement-change` (updates only)
- Wireframes: `wireframe` skill, `/approve-change`
- Mermaid IA map: `ia-map` skill, `/approve-change`, `/implement-change` (updates only)

## Common

**Goals:**
- Visualize relationships, flow, or structure clearly
- Enable quick comprehension of system behavior
- Serve as communication tool between design and implementation
- Document edge cases separately from the main flow. Sort by priority/likelihood.

**Bidirectional Linking (Obsidian):**
- All visual artifacts must link back to their source CR
- All CRs must link to their visual artifacts in "Related Artifacts" section
- Use Obsidian wikilink syntax: `[[filename-without-extension]]`
- Enables graph view navigation and backlink panel discovery
- Example in artifact: `**Related CR:** [[CR03-02-scan-results]]`
- Example in CR: `**User Flow:** [[FLOW251217-CR03-02-scan-results]]`

**Non-goals:**
<!-- - Documenting every edge case or state -->
- Replacing written specifications
- Pixel-perfect UI mockups

**Naming conventions:**
- Use clear, descriptive node labels (verb + noun: "Submit Order", not "SO")
- Be specific: "Payment Failed" not "Error"
- Match terminology in codebase/design docs

**Screen IDs:**
- Reference ID format: `SCR-###` (3-digit number, used in documentation and cross-references)
- D2 node ID format: `screen-name` (kebab-case, used in diagram code)
- Examples: `SCR-008` references `scan-camera` node, `SCR-001` references `meal-list` node
- Both must be unique within artifact
- Maintain mapping between reference IDs and node IDs in IA map or CR documentation

**Metadata:**
- Include creation date, last modified, related CR IDs
- Track diagram purpose/scope in frontmatter

**Quality bar:**
- Max 15-20 nodes per diagram (split if exceeding)
- All relationships labeled when adding clarity
- Logical grouping applied (containers/subgraphs for related components)
- Consistent styling throughout artifact
- No orphaned nodes (all connected to flow)

**After generating**
- Explain concisely what the diagram shows
- Offer to refine or expand specific sections

**Versioning policy:**
- CR files: In-place edits (no versioning). Use git history for tracking changes.
- User flows (.md): Create new dated file for scope changes. Use `-v2`, `-v3` suffix only if same-day collision occurs.
- Wireframes (.md): Create new dated file for scope changes. Use `-v2`, `-v3` suffix only if same-day collision occurs.
- Mermaid IA map: Always update in-place (single source of truth). Use git history for tracking.
- Minor fixes (typos, styling): Update in-place for all artifact types.

## D2 User Flows

**File naming:**
- Pattern: `FLOW[YYMMDD]-[CR##-##]-[slug].md` or `FLOW[YYMMDD]-[BASE-##]-[slug].md`
- Example (CR-tied): `FLOW251216-CR03-01-scan-camera-capture.md`
- Example (base feature): `FLOW251212-BASE-01-delete-logged-meal.md`
- Location (CR): `<project_root>/docs/change-requests/<cr-group>/<CR##-##>/`
- Location (BASE): `<project_root>/docs/artifacts/userflows/`
- Collision rule: if filename exists same day, append `-v2`, `-v3`, etc. before extension

**Slug derivation (CR mode):**
- Extract first 2-3 words from feature name (before " - CR##-##" in frontmatter title)
- Convert to kebab-case
- Example: "Scan Results - Analyze and log - CR03-02" → `FLOW251217-CR03-02-scan-results.md`
- CRITICAL: Use same slug as wireframe for same CR (consistency across artifact types)

**File structure:**

Markdown file with YAML frontmatter, User Story, Acceptance Criteria, and embedded D2 code block:

```markdown
---
slice_id: CR##-##
title: Feature name - CR##-##
summary: One sentence on goal
touches: [SCR-### Screen, SCR-### Screen]
depends_on: [CR##-##]
created: YYYY-MM-DD
updated: YYYY-MM-DD
last_updated_by: username
---

# Feature name - CR##-##

**User Story:** As a [persona], I want to [goal], so that [benefit].

**Acceptance Criteria:**
- Criterion 1
- Criterion 2
- Criterion 3

\```d2
direction: down
[... D2 diagram code ...]
\```
```

**Direction:**
- Use `direction: down` (top-to-bottom) for easier viewing without horizontal scrolling

**Shape mapping:**
- Circle (black fill, white text): start/end states
- Document (green fill): screens/views
- Rectangle (light blue fill): user actions
- Diamond (light red fill): decision points
- Cylinder: data stores (optional)

**Flow structure:**
- Use `->` for main flow (solid arrow)
- Use `--` for weak/optional connections (dashed)
- Use `<->` for bidirectional flow
- Label edges with user actions: `-> : "Tap Food Tile"`
- Group related screens in containers: `quick-add-flow: { ... }`

**Decision points:**
- Diamond shape with clear yes/no branches
- Format: `node -> decision: "condition"` then `decision -> outcome-a: "yes"` and `decision -> outcome-b: "no"`

**Quality checklist:**
- ☐ Frontmatter complete and accurate
- ☐ User Story displayed in body (As a... I want... So that...)
- ☐ Acceptance Criteria displayed in body (bulleted list)
- ☐ Clear node labels (screen names match codebase)
- ☐ All edges labeled with user actions or data flow
- ☐ Max 15-20 nodes (split into separate diagrams if larger)
- ☐ Containers used to group related screens
- ☐ Decision points clearly marked with branches
- ☐ No orphaned nodes

## Wireframes (ASCII)

**File naming:**
- Pattern: `WIRE[YYMMDD]-[CR##-##]-[slug].md`
- Example: `WIRE251217-CR03-02-scan-results.md`
- Location: `<project_root>/docs/change-requests/<cr-group>/<CR##-##>/`
- Legacy/base wireframes: `<project_root>/docs/artifacts/wireframes/`
- Collision rule: if filename exists same day, append `-v2`, `-v3`, etc. before extension

**Slug derivation:**
- Extract first 2-3 words from feature name (before " - CR##-##" in frontmatter title)
- Convert to kebab-case
- Example: "Scan Results - Analyze and log - CR03-02" → `WIRE251217-CR03-02-scan-results.md`
- CRITICAL: Use same slug as userflow for same CR (consistency across artifact types)

**File structure:**

Markdown file with YAML frontmatter, User Story, Acceptance Criteria, and ASCII wireframes:

```markdown
---
slice_id: CR##-##
title: Feature name - CR##-##
summary: One sentence goal
states: [default, loading, error]
depends_on: [CR##-##]
created: YYYY-MM-DD
updated: YYYY-MM-DD
last_updated_by: username
---

# Feature name - CR##-##

**User Story:** As a [persona], I want to [goal], so that [benefit].

**Acceptance Criteria:**
- Criterion 1
- Criterion 2
- Criterion 3

---

## SCR-### Screen Name. State: default

\```
┌─────────────────────────────┐
│ [Header content]            │
├─────────────────────────────┤
│                             │
│  Content area               │
│                             │
└─────────────────────────────┘
\```

**Key elements:**
- Element description
- Behavior notes

---

## State Matrix (if multiple screens)

| Surface | Default | Empty | Loading | Error |
|---------|---------|-------|---------|-------|
| SCR-### | ✓       | N/A   | ✓       | ✓     |
```

**ASCII Guidelines:**

Box drawing characters:
```
┌─┬─┐  Top corners and edges
│ │ │  Vertical edges
├─┼─┤  Middle connectors
└─┴─┘  Bottom corners and edges
```

Layout principles:
- Width: 29-33 characters (mobile-first)
- Header: 1-2 lines (title, nav, actions)
- Content: Nested boxes for components
- Footer: Tab bar, CTAs
- Whitespace: Blank lines for visual breathing room

Component conventions:
- Buttons: `[ Button Text ]` or `[Button - Style]`
- Input fields: Box with label above
- Icons: Emoji or text labels (`📷`, `[Icon]`)
- Progress: `████████░░░░░░` or percentage
- Tabs: `🏠 Home  📊 Stats  ⭐ Fav`

**When wireframes needed:**
- Any screen created or materially changed
- New empty/loading/error state introduced
- Flow introduces new decision points or actions on screen
- Or: Explicitly mark `Wireframes: N/A` with concrete reason

**Quality checklist:**
- ☐ YAML frontmatter complete (title, cr_id, screens, states, goal)
- ☐ User Story displayed in body (As a... I want... So that...)
- ☐ Acceptance Criteria displayed in body (bulleted list)
- ☐ All impacted screens documented (SCR-### IDs match CR)
- ☐ Each screen has default state
- ☐ Key states documented (empty, loading, error if applicable)
- ☐ ASCII art readable (proper box drawing characters)
- ☐ Key elements annotated below each wireframe
- ☐ Navigation flows clear (before/after if UI changes)
- ☐ State matrix provided (if multiple screens/states)
- ☐ References web-interface-guidelines.md for accessibility

## Mermaid IA Map

**File location:**
- Single file: `<project_root>/docs/artifacts/ia-map/IA.md`
- Contains Mermaid graph definition + frontmatter

**Graph direction:**
- Use `graph TD` (top-down) for hierarchical structure
- Use `graph LR` (left-right) only for shallow, wide structures

**Tier taxonomy:**
- Tier 1: Top-level navigation (e.g., Dashboard, Settings)
- Tier 2: Feature screens (e.g., Meal List, Quick Add)
- Tier 3: Sub-screens/modals (e.g., Portion Picker, Edit Meal)

**Class/color scheme:**
- `tier1` - Primary navigation screens
- `tier2` - Feature screens
- `tier3` - Detail/modal screens
- Apply via `class node-id tier1`

**Arrow styles:**
- `-->` solid arrow (main navigation flow)
- `-.->` dotted arrow (optional/conditional navigation)
- `==>` thick arrow (critical path)
- `o-->` circle end (aggregation - screen contains multiple)
- `*-->` diamond end (composition - screen owns child)

**Update rules (in-place edits):**
- Update existing IA.md file (no dated versions)
- Add new screens with appropriate tier classification
- Maintain consistent indentation and grouping
- Update frontmatter modified date

**CR IA delta block format (in CR.md):**
- Added nodes:
- Added edges:
- Removed edges:
- Notes:

**Quality checklist:**
- ☐ All screens have clear, descriptive labels
- ☐ Appropriate arrow styles for relationship types
- ☐ Tier classes applied consistently
- ☐ Max 15-20 nodes visible (use subgraphs if larger)
- ☐ No orphaned nodes
- ☐ Navigation paths logical and complete
