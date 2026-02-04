# Guideline: Feature Impact Analysis for IA Maps

## Purpose

Create a comprehensive **impact analysis** when planning to implement a new feature or enhance existing functionality. This shows how the proposed feature integrates with the **current product's information architecture**.

---

## Guideline

### INPUT

**Two documents required:**

1. **Current/Latest IA Map** (e.g., `2-ia-map.md`)
   - The most up-to-date information architecture of the app
   - Represents the CURRENT production state
   - Contains: mermaid flowchart, routes, object locations, navigation paths, screen sections
   - Format: comprehensive IA documentation

2. **Proposed Feature IA Map** (e.g., `CR05-multi-user-support/7-ia-map.md`)
   - Feature-specific information architecture design
   - Contains: new objects, modified locations, decision rationale, navigation paths for feature objects
   - Format: focused on PROPOSED changes/integrations
   - **This is NOT the output** - it's the input design for the feature

---

### COMMAND

```
Create a feature impact analysis IA map that:
1. Shows the FUTURE STATE of the app after implementing the feature
2. Clearly identifies what's NEW vs. MODIFIED relative to current state
3. Maintains the structure of the current IA document
4. Highlights integration points and data model impacts

Structure:
1. Title: "IA Map - [App Name] with [Feature Name]"
2. Updated Mermaid flowchart (future state with NEW/MODIFIED indicators)
3. Summary of Changes section:
   - NEW Elements table
   - MODIFIED Elements table
   - Navigation Changes (before/after)
   - Data Model Additions
4. Updated Route Structure (with Change column)
5. Updated Object Location Mapping (with Change column)
6. Updated Screen Sections
7. Key Features Delivered
8. Implementation Notes

Use "NEW" for new elements
Use "MODIFIED" for modified elements
Color-code: green for new, yellow for modified
```

---

### OUTPUT

**Format:** Feature Impact Analysis IA Map (e.g., `2-ia-map-cr05.md`)

**Content:**

```markdown
# IA Map - [App Name] with [Feature Name]

## Updated Information Architecture with [Feature Name]

```mermaid
[Complete mermaid flowchart showing FUTURE STATE]
- Use "MODIFIED" for modified nodes (relative to current state)
- Use "NEW" for new nodes (relative to current state)
- Apply highlighting colors: green for new, yellow for modified
```

---

## Summary of Changes

### NEW Elements

| Component | Location | Purpose |
|-----------|----------|---------|
| [New component to be added] | [Where it will live] | [Why it's needed] |

### MODIFIED Elements

| Component | Change | Impact |
|-----------|--------|--------|
| [Existing component that changes] | [What will change] | [How it affects current functionality] |

### Navigation Changes

| Navigation | Current | After Feature |
|------------|---------|---------------|
| [User path] | [Existing flow] | [New flow with feature] |

### Data Model Additions

```
[New objects or enhancements to existing objects]
Show how data structure evolves
```

---

## Route Structure Updates

| Route | Screen Name | Protection | Change | Purpose |
|-------|-------------|------------|--------|---------|
| [/path] | [Screen] | [Auth level] | [NEW/MODIFIED/Unchanged] | [Description] |
| [/new-path] | [New screen] | [Auth level] | NEW | [Feature adds this route] |

---

## Object Location Mapping Updates

| Object | Primary Location | Secondary Location(s) | Change | Access From |
|--------|------------------|----------------------|--------|-------------|
| [Existing object] | [Current location] | [Alt locations] | MODIFIED | [New access point] |
| [New object] | [Where it will live] | [Alt locations] | NEW | [Access point] |

---

## Screen Sections Updates

### [Screen Name] Sections

```
[ASCII diagram showing updated layout]
Highlight changes with "NEW" or "MODIFIED" annotations
```

### Pop-ups & Sheets (Enhanced)

| Name | Type | Trigger | Change | Purpose |
|------|------|---------|--------|---------|
| [Existing modal] | [Modal type] | [How it opens] | MODIFIED | [New behavior] |
| [New modal] | [Modal type] | [How it opens] | NEW | [Feature adds this] |

---

## Key Features Delivered

1. [Feature 1] - [Brief description of what will be delivered]
2. [Feature 2] - [Brief description]
...

---

## [Feature ID] Implementation Notes

- **Storage:** [Where new data will be stored]
- **Loading:** [Async considerations]
- **UI Behaviors:** [Interaction patterns]
- **Migration:** [Any data migration needed]
```

---

## Key Rules

1. **Always compare to CURRENT state** - Changes are relative to the base IA (latest app state)
2. **Show COMPLETE future state** - Don't just show the delta; show what the app will look like after
3. **Text markers are mandatory** - Use "NEW" and "MODIFIED" throughout
4. **Color coding in mermaid** - Green for new additions, yellow for modifications
5. **Maintain base structure** - Keep all sections from current IA document
6. **Add implementation notes** - Include technical considerations at the end
7. **Show before/after** - For navigation and major changes, show state transitions (current → future)

---

## Workflow Example

**Scenario:** Adding multi-user support (CR05) to current Calo Tracker

1. **Input - Current IA:** `2-ia-map.md` → Shows app as it exists today
2. **Input - Feature Design:** `CR05-multi-user-support/7-ia-map.md` → Shows what CR05 needs
3. **Output - Impact Analysis:** `2-ia-map-cr05.md` → Shows complete app after CR05 is implemented

**This output becomes:**
- The implementation blueprint for developers
- The QA test plan reference
- Documentation for the updated feature
- **Becomes the NEW base IA for future feature work**
