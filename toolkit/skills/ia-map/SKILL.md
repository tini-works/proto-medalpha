---
name: ia-map
description: Generate and update the Mermaid IA map from a project or CR. Used by /approve-change.
---

# IA Map (Mermaid)

Canonical rules: `calo-tracker/docs/visual-artifacts-rules.md`.
Base structure: `.claude/templates/ia-map-template.md`.

## Modes

### Mode A: Create Baseline IA (New Project)

Goal: create `<project_root>/docs/artifacts/ia-map/IA.md` if missing.

Inputs:
- `project_root` folder name (default `calo-tracker`)
- App tiers and main workflows (ask 1 question at a time if missing)

Output:
- `<project_root>/docs/artifacts/ia-map/IA.md` (Mermaid)

Process:
1. Confirm `project_root` and output path.
2. Copy `.claude/templates/ia-map-template.md` into `<project_root>/docs/artifacts/ia-map/IA.md`.
3. Fill title, last updated date, screen count placeholder.
4. Create initial tier nodes and edges per canonical rules.

### Mode B: Update IA From CR (Approval)

Goal: update existing IA map in-place to reflect approved navigation changes.

Inputs:
- CR file (path or slice ID)
- Approved scope + impacted screens + entry/exit changes

Rules:
- Update in-place. Do not create a second IA map file.
- Preserve existing structure and class definitions.
- Add or update nodes and edges only for scope changes.

Process:
1. Read CR approved scope and `### Impacted Surfaces` / `### Visual Artifacts`.
2. Read `<project_root>/docs/artifacts/ia-map/IA.md`.
3. Apply deltas (new screens, new links, changed re-entry patterns).
4. Update `Last Updated` and screen count if tracked.

## Output Requirements

- Mermaid code block remains valid.
- Tiers and color classes follow the template.
- Screen IDs use `SCR-###` when present in CR scope.
