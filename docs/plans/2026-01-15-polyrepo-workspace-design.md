# Polyrepo Workspace Design

## Overview

A polyrepo workspace for a healthcare product prototype consisting of three independent git repositories, developed side-by-side for fast iteration while preserving strict package boundaries.

The workspace optimizes for:
- Fast local iteration
- Clean CI behavior
- Future scalability into a platform-grade design system

The parent folder (`proto-medalpha`) is a developer convenience only, not a git repo or dependency boundary.

---

## Core Principles

1. Each repo is **fully independent**
2. No repo imports another via relative or file-system paths
3. All cross-repo sharing happens through **packages**
4. Local development uses **pnpm link**, not file references
5. Production and CI environments work **without local links**

Violating these rules collapses the setup into a brittle monorepo.

---

## Decisions

| Decision | Choice |
|----------|--------|
| Package manager | pnpm |
| Cross-repo sharing | Versioned packages + `pnpm link` (dev only) |
| Design system scope | Tokens + React web components (no RN components) |
| Token source of truth | Platform-agnostic JSON/TypeScript |
| Token outputs | Tailwind preset, CSS variables, JS exports |
| Admin stack | Vite + React + Tailwind + TypeScript |
| Mobile stack | Expo managed + TypeScript |
| Showcase | Storybook |

---

## Workspace Structure

```
proto-medalpha/                    # NOT a git repo, just a container
├── infra/                         # Shared reference configs (not a package)
│   ├── eslint/
│   ├── tsconfig/
│   ├── prettier/
│   └── README.md
├── scripts/
│   └── dev-link.sh                # Automates local linking
├── design-system/                 # Independent git repo
├── ma-admin/                      # Independent git repo
└── ma-mobile/                     # Independent git repo
```

---

## Design System (`design-system`)

### Purpose

The design system is the single source of truth for:
- Design tokens
- Web UI primitives
- Usage guidelines and visual documentation

It is treated as a **product**, not a helper folder.

### Package Scope

```
@meda/tokens      # Platform-agnostic tokens + generated outputs
@meda/ui          # React web components
```

### Folder Structure

```
design-system/
├── .git/
├── packages/
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── colors.json        # Source of truth
│   │   │   ├── spacing.json
│   │   │   ├── typography.json
│   │   │   └── index.ts
│   │   ├── generated/
│   │   │   ├── tailwind-preset.ts
│   │   │   ├── css-variables.css
│   │   │   └── tokens.ts          # RN-ready (numbers, not rem)
│   │   ├── scripts/
│   │   │   └── build-tokens.ts
│   │   └── package.json
│   └── ui/
│       ├── src/
│       │   ├── Button/
│       │   │   ├── Button.tsx
│       │   │   └── index.ts
│       │   ├── Input/
│       │   ├── Card/
│       │   └── index.ts
│       ├── tsup.config.ts
│       └── package.json
├── apps/
│   └── storybook/                 # Documentation site
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

### Token Strategy

**Source of truth:** Platform-agnostic JSON and TypeScript. No Tailwind, no CSS, no RN assumptions.

**Generated outputs:**
- Tailwind preset (for ma-admin)
- CSS custom properties
- JS/TS exports with RN-ready values (numbers, not rem strings)

```
tokens (JSON source)
       │
       ▼
  build-tokens.ts
       │
       ├──► tailwind-preset.ts
       ├──► css-variables.css
       └──► tokens.ts (RN-ready)
```

Tailwind **consumes** tokens; it does not define them.

### Token Transformation Rules

```ts
// Source (spacing.json)
{ "4": "1rem", "8": "2rem" }

// Generated for web (tailwind-preset.ts)
spacing: { '4': '1rem', '8': '2rem' }

// Generated for RN (tokens.ts) - BASE_FONT_SIZE = 16
spacing: { '4': 16, '8': 32 }
```

### Build Tooling

- pnpm workspaces (within design-system only)
- tsup for package builds with **watch mode**: `tsup --watch`
- Storybook for documentation

### Package Exports

```json
// @meda/tokens package.json exports
{
  ".": "./src/index.ts",
  "./tailwind": "./generated/tailwind-preset.ts",
  "./css": "./generated/css-variables.css"
}

// @meda/ui package.json exports
{
  ".": "./src/index.ts"
}
```

---

## Admin App (`ma-admin`)

### Purpose

React web application for content management.

### Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod

### Folder Structure

```
ma-admin/
├── .git/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    └── pages/
```

### Dependency Usage

```json
{
  "@meda/ui": "^0.x",
  "@meda/tokens": "^0.x"
}
```

No relative imports. No file references.

### Tailwind Integration

```ts
// tailwind.config.ts
import { medaPreset } from '@meda/tokens/tailwind'

export default {
  presets: [medaPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

Note: Content paths only include local source. Design system components ship their own styles.

---

## Mobile App (`ma-mobile`)

### Purpose

React Native app for iOS and Android.

### Stack

- Expo (managed workflow)
- React Native
- TypeScript
- TanStack Query

### Folder Structure

```
ma-mobile/
├── .git/
├── package.json
├── tsconfig.json
├── app.json
├── App.tsx
└── src/
    ├── theme.ts
    └── screens/
```

### Token Consumption

```ts
// theme.ts
import { colors, spacing, typography } from '@meda/tokens'

export const theme = {
  colors,
  spacing,    // Already numbers, not rem strings
  typography,
}
```

- No CSS
- No Tailwind
- No web-specific abstractions

RN components are built natively using these values.

---

## Development Workflow

### Initial Setup (One-Time)

```bash
cd proto-medalpha

# Install design-system (has internal pnpm workspace)
cd design-system && pnpm install && pnpm build
cd ..

# Install apps
cd ma-admin && pnpm install
cd ../ma-mobile && pnpm install
cd ..
```

### Local Linking (Development Only)

Use the automation script:

```bash
./scripts/dev-link.sh
```

Or manually:

```bash
# In design-system
cd design-system
pnpm build
cd packages/tokens && pnpm link --global
cd ../ui && pnpm link --global
cd ../../..

# In ma-admin
cd ma-admin
pnpm link --global @meda/tokens @meda/ui

# In ma-mobile
cd ../ma-mobile
pnpm link --global @meda/tokens
```

No links are committed. CI installs from the registry only.

### Daily Commands

| Task | Command |
|------|---------|
| Design system watch mode | `cd design-system && pnpm dev` |
| Run Storybook | `cd design-system && pnpm storybook` |
| Run ma-admin | `cd ma-admin && pnpm dev` |
| Run ma-mobile | `cd ma-mobile && pnpm start` |

### When Tokens Change

1. Edit source JSON in `design-system/packages/tokens/src/`
2. Run `pnpm build:tokens` in tokens package (or rely on watch mode)
3. Both apps pick up changes via links (may need restart)

### When Components Change

1. Edit component in `design-system/packages/ui/src/`
2. Watch mode rebuilds automatically
3. `ma-admin` picks up changes via link

---

## CI/CD Strategy

Each repo must:
- Install dependencies from registry (not local links)
- Build without sibling repos present
- Fail if undeclared dependencies are imported

This enforces boundary discipline.

### Registry Options (Choose One)

1. **npm with private scope** — Paid, but zero setup
2. **GitHub Packages** — Free for private repos, integrated with GitHub Actions
3. **Verdaccio** — Self-hosted, good for local CI testing

During early prototyping, use Verdaccio locally. Migrate to GitHub Packages when stabilizing.

---

## Git & Versioning

- Independent git histories per repo
- Independent PRs
- Lightweight version bumps even during prototyping
- Cross-repo breaking changes use commit prefix: `[tokens-v2] Update spacing scale`

If an app breaks due to a design-system change, the issue is upstream.

---

## Shared Configuration (`infra/`)

The `infra/` folder contains reference configs that each repo copies or extends:

```
infra/
├── eslint/
│   └── base.js           # Shared ESLint rules
├── tsconfig/
│   └── base.json         # Shared TypeScript config
├── prettier/
│   └── .prettierrc       # Shared formatting
└── README.md             # How to use these
```

Each repo maintains its own config files but extends from these references. This is **copy-based sharing**, not package-based, to maintain repo independence.

---

## Explicit Non-Goals

- No monorepo tooling (Nx, Turborepo, Lerna)
- No shared `node_modules`
- No shared lockfiles
- No backend code in this workspace
- No RN components in the design system (yet)
- No demo page (Storybook is sufficient)

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Link workflow forgotten | `dev-link.sh` script automates it |
| No watch mode = stale builds | tsup watch mode in design-system |
| Token transformation bugs | Explicit rules documented, unit tested |
| Config drift across repos | Shared `infra/` reference configs |
| CI can't find packages | Registry-based deps, no file references |
| Cross-repo coordination | Commit prefix convention for breaking changes |
