---
name: prototype-gated:5-build
description: Build interactive HTML prototypes for selected approach(es) from FILTER gate
---

# Step: PROTOTYPE (BUILD)

**Purpose:** Build interactive HTML prototypes for selected approach(es) from FILTER gate

## Input

- Selected approach(es) from FILTER gate decision
- Hypothesis and success metrics from Framing
- IA, User Flow, Scope, UX context from Gate 1

## Process

1. **Confirm scope** per prototype - what's IN, what's OUT
2. **Build interactive HTML** for each selected approach
3. **Include features:**
   - Click/tap interactions
   - Screen transitions
   - Basic state changes
   - Mobile-responsive (if applicable)
4. **Track deliverables** - file status and location
5. **Mark ready** for Gate 2 review

## Output Format

```
┌─────────────────────────────────────────────────────────────────┐
│ PROTOTYPE BUILD                Status: 🟡 IN PROGRESS           │
├─────────────────────────────────────────────────────────────────┤
│ 📋 BUILDING FROM FILTER DECISION                                │
│ Selected approach(es): [A, B, ...] from FILTER gate             │
│ Hypothesis: [IF-THEN-FOR-BECAUSE]                               │
├─────────────────────────────────────────────────────────────────┤
│ 🎯 VALIDATION TARGET                                            │
│ Success metric: [metric] → Pass: [X]  Fail: [Y]                 │
│ Key assumptions to test: • [1] • [2]                            │
├─────────────────────────────────────────────────────────────────┤
│ 📐 BUILD SCOPE PER PROTOTYPE                                    │
│                                                                 │
│ Prototype A: [Approach name]                                    │
│ ✅ IN SCOPE:                                                    │
│ • [Screen/interaction 1] - validates [aspect]                   │
│ • [Screen/interaction 2] - validates [aspect]                   │
│ ❌ OUT OF SCOPE:                                                │
│ • [Feature X] - not needed for validation                       │
│                                                                 │
│ Prototype B: [Approach name] (if multiple selected)             │
│ ✅ IN SCOPE:                                                    │
│ • [Screen/interaction 1] - validates [aspect]                   │
│ ❌ OUT OF SCOPE:                                                │
│ • [Feature Y] - not needed for validation                       │
├─────────────────────────────────────────────────────────────────┤
│ 📦 DELIVERABLES (Interactive HTML)                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ File                        │ Status │ Location             │ │
│ ├─────────────────────────────┼────────┼──────────────────────┤ │
│ │ prototype-A-[name].html     │ ✅/🟡/❌│ outputs/prototypes/  │ │
│ │ prototype-B-[name].html     │ ✅/🟡/❌│ outputs/prototypes/  │ │
│ └─────────────────────────────┴────────┴──────────────────────┘ │
│                                                                 │
│ HTML Features:                                                  │
│ • Click/tap interactions                                        │
│ • Screen transitions                                            │
│ • Basic state changes                                           │
│ • Mobile-responsive (if applicable)                             │
├─────────────────────────────────────────────────────────────────┤
│ 🔗 PROTOTYPE LINKS                                              │
│ • Prototype A: [file path or localhost URL]                     │
│ • Prototype B: [file path or localhost URL]                     │
├─────────────────────────────────────────────────────────────────┤
│ ✅ BUILD STATUS:                                                │
│ [ ] All prototypes complete                                     │
│ [ ] Partial (blocked on: _______)                               │
│ [ ] Ready for Gate 2 review                                     │
│ Notes: _______________________                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Output Location

```
outputs/prototypes/
├── prototype-A-[name].html
├── prototype-B-[name].html
└── ...
```

## HTML Prototype Features

| Feature | Description |
|---------|-------------|
| **Click/tap interactions** | Buttons, links, cards respond to clicks |
| **Screen transitions** | Navigate between views/states |
| **Basic state changes** | Toggle, expand/collapse, show/hide |
| **Mobile-responsive** | Works on phone viewport (if applicable) |

## Scope Per Prototype

For each prototype, explicitly define:

| Category | Description |
|----------|-------------|
| **IN SCOPE** | Screens/interactions that validate the hypothesis |
| **OUT OF SCOPE** | Features intentionally excluded (would slow learning) |

## Build Status

| Status | Meaning |
|--------|---------|
| ✅ Complete | HTML file ready for review |
| 🟡 In Progress | Currently building |
| ❌ Blocked | Can't proceed (note reason) |

## Quality Checklist

- [ ] Each prototype validates the hypothesis
- [ ] Interactions work (click, tap, transitions)
- [ ] Scope is minimal (only what's needed to test)
- [ ] Files are in correct location
- [ ] Links/paths are documented

## Next Step

After build complete → **Gate 2: UI & A11y Check** (recommended) or **Step: Validation**
