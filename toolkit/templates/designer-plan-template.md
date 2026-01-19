# Designer Plan: [Feature Name]

> **Purpose:** UX/UI specification for AI implementation. Designer reviews this plan, AI builds the prototype, designer validates output.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature/Screen** | [e.g., Food Search Screen] |
| **Problem** | [1-2 sentences: what user problem does this solve?] |
| **Copy Language** | [e.g., Vietnamese, English, Japanese] |
| **Design System** | [link or path to project's design system/components] |

---

## Anti-Goals (Out of Scope)

> What this plan does **NOT** cover. Prevents AI from over-building.

- [e.g., Dark mode not included]
- [e.g., Tablet/desktop layout — mobile only]
- [e.g., Settings integration — separate plan]
- [e.g., Animations beyond basic transitions]

---

## User Flow

> Navigation and journey through this feature. Uses D2 diagram format.

<!-- AI: Generate D2 diagram showing the user journey. Follow project's userflow conventions if available. -->

```d2
direction: down

start: {
  shape: circle
  label: "●"
}

screen_1: [Screen Name] {
  shape: document
}

action_1: [User Action] {
  shape: rectangle
}

screen_2: [Next Screen] {
  shape: document
}

end: {
  shape: circle
  label: "●"
}

start -> screen_1
screen_1 -> action_1
action_1 -> screen_2
screen_2 -> end
```

---

## Component Mapping

> **AI generates this table** based on wireframes and design system. Designer reviews only items marked **NEW**.

<!--
AI Instructions:
1. Analyze wireframes below
2. Check project's design system (path in Overview)
3. Map each UI element to existing components
4. Mark NEW only if no suitable component exists
5. Designer will review NEW items only
-->

| Wireframe Element | Component | Status |
|-------------------|-----------|--------|
| ... | ... | ... |

---

## Wireframes

> ASCII wireframes with copy embedded. One wireframe per state.

### [Screen Name]

#### Default State

```
┌─────────────────────────────────────┐
│  ← Back          Screen Title       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🔍 Search placeholder...    │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Item 1                      │    │
│  │ Description text            │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Item 2                      │    │
│  │ Description text            │    │
│  └─────────────────────────────┘    │
│                                     │
│         [ Primary Button ]          │
│                                     │
└─────────────────────────────────────┘
```

#### Empty State

```
┌─────────────────────────────────────┐
│  ← Back          Screen Title       │
├─────────────────────────────────────┤
│                                     │
│                                     │
│            ┌───────┐                │
│            │ 📭    │                │
│            └───────┘                │
│                                     │
│       Empty state message           │
│       Secondary helper text         │
│                                     │
│         [ Action Button ]           │
│                                     │
└─────────────────────────────────────┘
```

#### Loading State

```
┌─────────────────────────────────────┐
│  ← Back          Screen Title       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  │ ░░░░░░░░░░░                 │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │
│  │ ░░░░░░░░░░░                 │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

#### Error State

```
┌─────────────────────────────────────┐
│  ← Back          Screen Title       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ⚠️ Error message here       │    │
│  │                             │    │
│  │         [ Retry ]           │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

## Review Checklist

> Designer uses this to validate prototype against plan. Check each item after reviewing AI implementation.

### UX Flow
- [ ] User flow matches D2 diagram
- [ ] Navigation between screens works as specified
- [ ] All states are reachable (empty, loading, error)

### UI Accuracy
- [ ] Layout matches wireframes
- [ ] All copy matches exactly (no AI improvisation)
- [ ] Empty state shows correct illustration + message
- [ ] Loading state uses skeleton/spinner as specified
- [ ] Error state shows correct message + retry action

### Components
- [ ] Existing design system components used correctly
- [ ] NEW components match wireframe intent (if any)

### Edge Cases
- [ ] Long text truncates/wraps correctly
- [ ] Empty lists show empty state
- [ ] Error handling works as specified
