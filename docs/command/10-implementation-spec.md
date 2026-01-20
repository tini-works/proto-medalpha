---
description: Generate comprehensive implementation specification from approved design
---

## Input

**Required:**
- Approved scope and metrics (Step 8)
- UX interaction flows and edge cases (Step 9)
- Selected solution approach (Step 6)
- Problem framing and hypothesis (Step 1, Step 3)

**Optional:**
- Design system guidelines
- Existing codebase structure (src/ directory layout)
- Technical constraints or requirements
- User personas (from Step 1 context)
- Design Goals criteria (Step 4)

📎 Attach file OR paste inline below

---

## Command

Generate a comprehensive implementation specification document that serves as the technical blueprint for development.

### Part 1: Product Overview

Extract from Steps 1, 3, 6:

**Purpose of the feature:**
- What problem does this solve? (from Step 1 problem framing)
- What hypothesis are we testing? (from Step 3)

**Target users:**
- Which personas benefit most? (reference Step 1, Step 7 Jobs)
- What are their key goals and constraints?

**How it fits into the overall product:**
- Where does this sit in the information architecture?
- What existing features does it connect to?
- What's the strategic value? (from Step 8 scope rationale)

### Part 2: Core Feature Description

Based on Step 7 (User Flows):

**1. User Flow:**
Translate the UX interaction flow into step-by-step user actions:
```
1. User [action] → System [response]
2. User [action] → System [response]
3. [End state]
```

**2. Key Details:**
- **Specific UI behaviors**: What happens on tap, swipe, focus, blur?
- **Performance requirements**: Target load time, response time constraints
- **Feedback mechanisms**: Toasts, animations, haptic feedback, loading states

### Part 3: User Experience Rules

Extract from Step 9 edge cases and Step 6 trade-offs:

**Speed requirements:**
- Maximum acceptable time per user action
- Loading state thresholds
- Perceived performance optimizations

**Friction reduction strategies:**
- Minimize taps/steps (from Step 7 flow)
- Smart defaults and pre-fill logic
- Progressive disclosure patterns

**Tone/voice guidelines:**
- Error message style (supportive, technical, brief)
- Success confirmation style
- Empty state messaging

**Accessibility considerations:**
- Touch target sizes (minimum 44x44px)
- Color contrast requirements
- Screen reader support
- Keyboard navigation

**Undo/edit forgiveness rules:**
- Can users undo this action?
- Time window for undo
- What happens after time expires?

**Clear feedback expectations:**
- Every action must have visible feedback within Xms
- Loading states for operations >Xms
- Error states with recovery path

### Part 4: Design Guidelines

If design system or codebase style exists, extract patterns. Otherwise, specify:

**Visual Style:**
- **Colors**: Primary, secondary, background, text colors
  - Example: `bg-blue-500`, `text-gray-900`
- **Backgrounds**: Solid, gradient, glassmorphism
- **Text styles**: Font sizes, weights, line heights
- **Restrictions**: What NOT to use (deprecated patterns)

**Layout Principles:**
- **Minimum width**: Mobile-first? Desktop minimum?
- **Touch targets**: Minimum 44x44px for interactive elements
- **Padding/Spacing**: Standard spacing scale (4px, 8px, 16px, 24px)
- **Border radius**: Consistent rounding (0, 4px, 8px, 16px, full)
- **Section gaps**: Vertical spacing between sections

**Component Patterns:**
- **Cards**: Border, shadow, padding standards
- **Progress indicators**: Rings, bars, percentage display
- **Bars**: Height, color coding, labels
- **Bottom sheets**: Height, dismissal, backdrop
- **Toasts**: Position, duration, dismissal
- **FABs**: Size, position, elevation

### Part 5: Key Edge Cases to Handle

Extract from Step 9 edge cases table and expand:

**First launch:**
- No data state - what shows?
- Onboarding flow required?
- Default values to pre-populate

**Empty state:**
- User has no items/data
- Visual empty state design
- Call-to-action to get started

**Reset/rollover logic:**
- Daily/weekly/monthly reset behavior
- Data archival strategy
- History preservation

**Undo timing:**
- Time window for undo
- Where is undo shown? (toast, persistent button)
- What can't be undone?

**Over-goal or error states:**
- User exceeds limits (daily goal, max items)
- API failures or timeout
- Invalid input handling

**Offline behavior:**
- What works offline?
- How is offline state communicated?
- Sync strategy when reconnected

---

## Part 6: Technical Implementation Details

### Technical Requirements

**Framework/library:**
- React 19 + TypeScript
- Vite build tool
- Other libraries: date-fns, lucide-react, etc.

**Styling approach:**
- Tailwind CSS utility classes
- shadcn/ui components (if applicable)
- Custom CSS modules (if needed)

**Offline/online requirements:**
- localStorage persistence
- IndexedDB for SQLite (sql.js)
- Network dependency (none, optional, required)

**Browser/device support:**
- Target browsers: Chrome, Safari, Firefox
- Mobile-first responsive design
- PWA requirements (if any)

### Data Model

For each entity introduced or modified by this feature:

**[Entity Name] Structure:**
```json
{
  "id": "string (UUID or auto-increment)",
  "field1": "type (description)",
  "field2": "type (description)",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

**Storage location:**
- localStorage key: `calo-tracker:entity-name`
- SQLite table: `entity_name` with schema
- In-memory only (session state)

**Relationships:**
- Foreign keys or reference IDs
- One-to-many, many-to-many relationships
- Cascading delete behavior

**Migrations:**
- Does this require data migration from existing structure?
- Migration strategy (versioning, backwards compatibility)

### API Contracts (if applicable)

If this feature requires API endpoints:

**Endpoint:** `POST /api/resource`
**Request:**
```json
{
  "field": "value"
}
```
**Response:**
```json
{
  "success": true,
  "data": {}
}
```
**Error codes:** 400, 401, 404, 500 with meanings

### State Management

**React state structure:**
```typescript
interface FeatureState {
  field1: Type;
  field2: Type;
  isLoading: boolean;
  error: string | null;
}
```

**State persistence:**
- What persists to localStorage/IndexedDB?
- What's session-only?
- Sync strategy

**State updates:**
- Optimistic updates or wait for confirmation?
- Error rollback strategy

### Navigation

**Routes (if applicable):**
- New routes: `/feature-path`
- Modified routes
- Deep linking requirements

**Navigation state:**
- Does this modify `appNavReducer` state?
- Navigation actions: PUSH, POP, REPLACE
- Back button behavior

### Performance Considerations

**Optimization strategies:**
- Lazy loading components
- Debouncing/throttling user input
- Virtual scrolling for long lists
- Image optimization

**Target metrics:**
- Time to interactive: <Xs
- First contentful paint: <Xs
- Bundle size impact: +X KB

---

## Output Format (choose one)

### Format 1: Decision Card 📋 ⭐ Recommended

One-page summary card optimized for:
- 30-second scan by managers
- Clear decision checkboxes
- AI recommendation with rationale
- Decision history tracking

**Use when:** Need quick approval, tracking decisions, or scaling across many CRs.

```
┌─────────────────────────────────────────────────────────────┐
│ CR-ID: ________            Step: 10-Implementation Spec     │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Implementing: [solution + scope from Steps 5-8]             │
├─────────────────────────────────────────────────────────────┤
│ 🛠️ IMPLEMENTATION OVERVIEW                                  │
│ ┌──────────────────┬──────────┬──────────┬─────────┐        │
│ │ Component        │ Type     │ Priority │ Deps    │        │
│ ├──────────────────┼──────────┼──────────┼─────────┤        │
│ │ [component 1]    │ New      │ P0       │ None    │        │
│ │ [component 2]    │ Modify   │ P0       │ #1      │        │
│ │ [component 3]    │ New      │ P1       │ #1, #2  │        │
│ └──────────────────┴──────────┴──────────┴─────────┘        │
│                                                             │
│ 📁 Files: X new, Y modified                                 │
│ 📊 Data model changes: [Yes/No]                             │
│ 📎 Full spec: /artifacts/[CR]/step-10-spec.md               │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [Ready/Needs review] because [reason] │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ [ ] Approve for dev  [ ] Needs revision  [ ] Split scope    │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-10-full.md            │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-10-card.md`

---

### Format 2: Markdown Implementation Spec

Complete markdown document with all sections above, saved to:
```
outputs/9b-implementation-spec.md
```

**Frontmatter:**
```yaml
---
workflow: [TASK_TYPE]
date: [ISO_DATE]
status: Complete
cr_id: [CR_ID if applicable]
feature: [FEATURE_NAME]
step: 9b-implementation-spec
---
```

**Structure:**
```markdown
# [FEATURE NAME] – Complete Implementation Spec

## Product Overview
[Purpose, target users, product fit]

## Core Feature Description
[User flow, key details]

## User Experience Rules
[Speed, friction, tone, accessibility, undo, feedback]

## Design Guidelines
[Visual style, layout, components]

## Key Edge Cases to Handle
[First launch, empty state, reset, undo, over-goal, offline]

## Technical Implementation Details
[Tech requirements, data model, API contracts, state management, navigation, performance]
```

---

## Example Workflow

### Input: Steps 1-9 Outputs

From Step 1 (Problem Framing):
> "Couples eating together can't easily log the same meal once"

From Step 8 (Scope):
> In scope: Shared meal logging (one-tap attribution to multiple users)

From Step 9 (UX Flow):
```
1. User taps "Share Meal" button
2. System shows partner selector modal
3. User selects partner → meal copied
4. System shows confirmation toast
```

### Output: Implementation Spec (Excerpt)

```markdown
# Family/Couple Mode – Complete Implementation Spec

## Product Overview

**Purpose:**
Enable couples and household members to log shared meals once and attribute calories to multiple people with a single tap, reducing friction in the calorie tracking experience.

**Target Users:**
- Trang (busy intern persona) - drops off if logging >30s
- Couples/roommates who eat together frequently

**How it fits:**
Extends existing QuickAdd flow with shared meal capability. Foundation for future social features (streaks, shared goals).

## Core Feature Description

### User Flow
1. User logs a meal via QuickAdd → Meal appears in today's log
2. User taps "Share Meal" icon on logged meal → Partner selector modal opens
3. User selects partner from household list → Meal copied to partner's log
4. System shows toast: "Meal shared with [Partner Name]" → Modal closes

### Key Details
- **UI behavior**: Share button appears on hover/long-press on meal items
- **Performance**: Modal opens <100ms, share action completes <50ms (localStorage write)
- **Feedback**: Success toast 2s duration, haptic feedback on share (mobile)

## User Experience Rules

**Speed requirements:**
- Share action must complete in <50ms (localStorage constraint)
- Partner selector loads instantly (pre-cached household list)

**Friction reduction:**
- Share button visible on recent meals (last 3 logged)
- Last-shared partner becomes default selection

**Tone/voice:**
- Success: "Meal shared with [Name]" (friendly, brief)
- Error: "Couldn't share meal. Try again?" (supportive with CTA)

**Undo/forgiveness:**
- Undo available for 5s after share (toast with undo button)
- After 5s, must manually delete from partner's log

## Technical Implementation Details

### Data Model

**LogEntry (Modified):**
```json
{
  "id": "string (UUID)",
  "userId": "string (owner of this log entry)",
  "foodId": "string",
  "portionSize": "S|M|L",
  "calories": "number",
  "loggedAt": "ISO timestamp",
  "sharedFrom": "string | null (userId who shared this meal)",
  "sharedAt": "ISO timestamp | null"
}
```

**Storage:**
- localStorage key: `calo-tracker:logs:[userId]`
- Each user has separate log array
- Shared meal creates duplicate entry with `sharedFrom` reference

**State Management:**
```typescript
interface ShareMealState {
  isModalOpen: boolean;
  mealToShare: LogEntry | null;
  selectedPartner: string | null; // userId
  isSharing: boolean;
  error: string | null;
}
```

### Edge Cases

**Empty state:**
- No household members configured → Show "Add household member" CTA in modal

**Offline:**
- Share works offline (localStorage only)
- No sync required (no backend)

**Undo timing:**
- 5s window with toast showing "Undo" button
- After 5s, undo button disappears
```

---

## Related Steps

| Step | Relationship |
|------|--------------|
| Step 1: Reframe Problem | Provides problem framing and solution direction |
| Step 3: Form Hypothesis | Provides testable hypothesis to validate |
| Step 5: Solution Approaches with Inspiration | Provides selected solution concept |
| Step 6: Solution Tradeoffs | Provides trade-off rationale for decisions |
| Step 7: User Flows | Provides user flows and edge cases |
| Step 8: Scope and Metrics | Provides scope boundaries and success metrics |
| **Step 9: Implementation Spec** | **Synthesizes all above into technical blueprint** |
| Step 10: Design Handoff | References spec for complete engineering handoff |

---

## How to Run

Invoke after Step 9 completion:

```
/9b-implementation-spec
```

Or ask Claude:

```
"Generate the implementation specification from our approved design"
```

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 11.**

After AI generates output:
1. **Review** the implementation spec (data model, components, tech details)
2. **Decide** to approve for dev, request revision, or split scope
3. **Confirm** by telling AI: `"Step 10 decision: [your choice]"`

**Example confirmations:**
- "Step 10 decision: Approve for dev"
- "Step 10 decision: Needs revision on data model"
- "Step 10 decision: Split into 2 phases"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 11
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 11

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation
