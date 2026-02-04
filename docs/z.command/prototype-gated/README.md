# PROTOTYPE-GATED Workflow

Gated prototype workflow for coded UI or high-fidelity mockups.

## When to Use

Use PROTOTYPE-GATED when:
- Building interactive HTML prototypes (not paper sketches)
- Need structured decision points before investing build effort
- Want to validate hypothesis with testable artifacts

Use PROTOTYPE (lite) instead when:
- Quick paper/sketch exploration
- Speed over rigor
- Very early ideation

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  PROTOTYPE-GATED                                                │
│                                                                 │
│  FRAMING ──→ [G1] ──→ IDEATIONS ──→ [FILTER⭐] ──→ BUILD        │
│  (3-5)      (opt)     (4-6)        (MANDATORY)      │          │
│                                                     ↓          │
│                                    [G2] ──→ VALIDATION          │
│                                   (rec'd)  (results)            │
│                                                                 │
│  Steps: 4 (Framing, Ideations, Build, Validation)               │
│  Gates: 3 (G1 optional, Filter⭐ mandatory, G2 recommended)     │
│  Duration: Half-day to full day                                 │
│  Output: Validated/Invalidated hypothesis + learnings           │
└─────────────────────────────────────────────────────────────────┘
```

## Steps & Gates

| Step/Gate | Type | Required | Purpose |
|-----------|------|----------|---------|
| **FRAMING** | Step | Yes | Generate 3-5 problem framings with hypotheses |
| **G1** | Gate | Optional | Gather ideation inputs (IA, User Flow, Scope) |
| **IDEATIONS** | Step | Yes | Generate 4-6 solution approaches |
| **FILTER** | Gate | **MANDATORY** | Pick solution(s) to build |
| **BUILD** | Step | Yes | Create interactive HTML prototypes |
| **G2** | Gate | Recommended | UI consistency & A11y spot-check |
| **VALIDATION** | Step | Yes | Capture test results and learnings |

## Commands

| Command | Description |
|---------|-------------|
| `/prototype-gated:1-framing` | Generate 3-5 problem framings |
| `/prototype-gated:2-gate-1-ideation-input` | Gather ideation inputs |
| `/prototype-gated:3-ideations` | Generate 4-6 solution approaches |
| `/prototype-gated:4-filter` | Pick solution(s) to build |
| `/prototype-gated:5-build` | Build interactive HTML prototypes |
| `/prototype-gated:6-gate-2-ui-a11y` | UI & A11y check |
| `/prototype-gated:7-validation` | Capture validation results |

## Output Location

```
outputs/prototypes/
├── prototype-A-[name].html
├── prototype-B-[name].html
└── ...
```

## Key Differences from PROTOTYPE (lite)

| Aspect | PROTOTYPE (lite) | PROTOTYPE-GATED |
|--------|-----------------|-----------------|
| Gates | 0 | 3 |
| Decision points | 1 | 4+ |
| Output | Paper sketch | Interactive HTML |
| Duration | ~1 hour | Half-day to 1 day |
| Risk of waste | Higher | Lower |
| Learning speed | Faster iterations | Slower but targeted |
