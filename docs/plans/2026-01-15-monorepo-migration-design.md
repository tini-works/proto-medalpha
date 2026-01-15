# Monorepo Migration Design

## Overview

Migrate the current polyrepo workspace (design-system, ma-admin, ma-mobile as separate git repos) into a single pnpm workspaces monorepo.

## Motivation

- **Simpler dependency management** - `workspace:*` protocols just work, no pnpm link scripts
- **Atomic commits** - Change tokens + UI + apps in a single commit/PR
- **Easier team onboarding** - Clone one repo instead of running clone-workspace.sh
- **CI/CD simplification** - Single pipeline instead of coordinating multiple repos

## Target Structure

```
proto-medalpha/                 # Single git repo
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Workspace package locations
├── tsconfig.base.json         # Shared TypeScript config
├── .eslintrc.js               # Shared ESLint config
├── .prettierrc                # Shared Prettier config
│
├── packages/
│   ├── tokens/                # @meda/tokens
│   └── ui/                    # @meda/ui
│
├── apps/
│   ├── admin/                 # Web admin app (Vite + React)
│   ├── mobile/                # Mobile app (Expo)
│   └── design-system/         # Storybook documentation
│
└── docs/                      # Planning docs
```

## Dependency Flow

```
┌─────────────────────────────────────────────────────┐
│                    packages/                        │
│  ┌──────────────┐      ┌──────────────┐            │
│  │    tokens    │ ───▶ │      ui      │            │
│  │ @meda/tokens │      │   @meda/ui   │            │
│  └──────────────┘      └──────────────┘            │
└─────────────────────────────────────────────────────┘
           │                     │
           ▼                     ▼
┌─────────────────────────────────────────────────────┐
│                      apps/                          │
│  ┌──────────┐   ┌──────────┐   ┌───────────────┐   │
│  │  mobile  │   │  admin   │   │ design-system │   │
│  │  (Expo)  │   │  (Vite)  │   │  (Storybook)  │   │
│  └──────────┘   └──────────┘   └───────────────┘   │
│   tokens only   tokens + ui      tokens + ui       │
└─────────────────────────────────────────────────────┘
```

## Root Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### Root package.json

```json
{
  "name": "proto-medalpha",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "dev:admin": "pnpm --filter admin dev",
    "dev:mobile": "pnpm --filter mobile start",
    "dev:design-system": "pnpm --filter design-system dev",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

## Migration Approach

**Fresh start** - No history preservation. Single initial commit with complete monorepo structure.

## What Gets Removed

- `scripts/dev-link.sh` - workspaces handle linking automatically
- `scripts/clone-workspace.sh` - single repo, just `git clone && pnpm install`
- `scripts/push-all.sh` - single repo now
- `infra/` directory - configs move to root level
- Nested `.git/` directories in design-system, ma-admin, ma-mobile
