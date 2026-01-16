# Monorepo Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the polyrepo workspace into a single pnpm workspaces monorepo with fresh git history.

**Architecture:** Single git repo with `packages/` for shared libraries (@meda/tokens, @meda/ui) and `apps/` for deployable applications (admin, mobile, design-system). pnpm workspaces handles all dependency linking automatically.

**Tech Stack:** pnpm workspaces, TypeScript, React, Tailwind CSS, Vite, Expo, tsup, Storybook

---

## Phase 1: Backup and Prepare

### Task 1: Backup Current State

Before making destructive changes, create a backup of the entire workspace.

**Step 1: Create backup directory**

```bash
cp -r /Users/lia/Documents/tini-works/proto-medalpha /Users/lia/Documents/tini-works/proto-medalpha-backup-$(date +%Y%m%d)
```

**Step 2: Verify backup exists**

```bash
ls -la /Users/lia/Documents/tini-works/ | grep proto-medalpha
```

Expected: See both `proto-medalpha` and `proto-medalpha-backup-YYYYMMDD`

---

## Phase 2: Clean Slate

### Task 2: Remove All Git Directories

Remove all existing git repos to start fresh.

**Step 1: Remove nested git directories**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
rm -rf design-system/.git
rm -rf ma-admin/.git
rm -rf ma-mobile/.git
```

**Step 2: Remove root git directory**

```bash
rm -rf .git
```

**Step 3: Verify no git directories remain**

```bash
find /Users/lia/Documents/tini-works/proto-medalpha -name ".git" -type d
```

Expected: No output (no .git directories found)

---

### Task 3: Remove Old Infrastructure

Remove files that are no longer needed in monorepo setup.

**Step 1: Remove linking scripts (no longer needed)**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
rm -f scripts/dev-link.sh
rm -f scripts/clone-workspace.sh
rm -f scripts/push-all.sh
```

**Step 2: Remove infra directory (configs move to root)**

```bash
rm -rf infra/
```

**Step 3: Remove old workspace files**

```bash
rm -f design-system/pnpm-workspace.yaml
rm -f design-system/package.json
```

**Step 4: Clean up node_modules everywhere**

```bash
rm -rf design-system/node_modules
rm -rf design-system/packages/tokens/node_modules
rm -rf design-system/packages/ui/node_modules
rm -rf design-system/apps/storybook/node_modules
rm -rf ma-admin/node_modules
rm -rf ma-mobile/node_modules
```

---

## Phase 3: Create Monorepo Structure

### Task 4: Reorganize Directory Structure

Move packages and apps to their new locations.

**Step 1: Create new directory structure**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
mkdir -p packages
mkdir -p apps
```

**Step 2: Move packages to packages/**

```bash
mv design-system/packages/tokens packages/tokens
mv design-system/packages/ui packages/ui
```

**Step 3: Move apps to apps/**

```bash
mv design-system/apps/storybook apps/design-system
mv ma-admin apps/admin
mv ma-mobile apps/mobile
```

**Step 4: Remove empty design-system directory**

```bash
rm -rf design-system
```

**Step 5: Verify new structure**

```bash
ls -la packages/
ls -la apps/
```

Expected:
- `packages/`: tokens, ui
- `apps/`: admin, design-system, mobile

---

### Task 5: Create Root package.json

**Files:**
- Create: `package.json`

**Step 1: Create root package.json**

Create `package.json`:

```json
{
  "name": "proto-medalpha",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "build:packages": "pnpm --filter @meda/tokens build && pnpm --filter @meda/ui build",
    "dev:admin": "pnpm --filter admin dev",
    "dev:mobile": "pnpm --filter mobile start",
    "dev:design-system": "pnpm --filter design-system dev",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r exec rm -rf dist node_modules"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  },
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

### Task 6: Create pnpm-workspace.yaml

**Files:**
- Create: `pnpm-workspace.yaml`

**Step 1: Create workspace config**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

---

### Task 7: Create Shared TypeScript Config

**Files:**
- Create: `tsconfig.base.json`

**Step 1: Create base tsconfig**

Create `tsconfig.base.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

### Task 8: Create Shared ESLint Config

**Files:**
- Create: `.eslintrc.js`

**Step 1: Create root eslint config**

Create `.eslintrc.js`:

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
}
```

---

### Task 9: Create Shared Prettier Config

**Files:**
- Create: `.prettierrc`

**Step 1: Create prettier config**

Create `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

### Task 10: Create Root .gitignore

**Files:**
- Create: `.gitignore`

**Step 1: Create gitignore**

Create `.gitignore`:

```
# Dependencies
node_modules/

# Build outputs
dist/
.expo/

# Generated files
packages/tokens/generated/
!packages/tokens/generated/.gitkeep

# Logs
*.log

# OS files
.DS_Store

# IDE
.idea/
.vscode/

# Environment
.env
.env.local
```

---

## Phase 4: Update Package Configurations

### Task 11: Update @meda/tokens package.json

**Files:**
- Modify: `packages/tokens/package.json`

**Step 1: Update tokens package.json**

Replace `packages/tokens/package.json`:

```json
{
  "name": "@meda/tokens",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/src/index.js",
  "types": "./dist/src/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/src/index.js",
      "require": "./dist/src/index.cjs",
      "types": "./dist/src/index.d.ts"
    },
    "./tailwind": {
      "import": "./dist/generated/tailwind-preset.js",
      "require": "./dist/generated/tailwind-preset.cjs",
      "types": "./dist/generated/tailwind-preset.d.ts"
    },
    "./css": "./generated/css-variables.css"
  },
  "files": ["dist", "generated"],
  "scripts": {
    "build:tokens": "tsx scripts/build-tokens.ts",
    "build": "pnpm build:tokens && tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsup": "^8.0.1",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

---

### Task 12: Update @meda/ui package.json

**Files:**
- Modify: `packages/ui/package.json`

**Step 1: Update ui package.json**

Replace `packages/ui/package.json`:

```json
{
  "name": "@meda/ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@meda/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
```

---

### Task 13: Update Admin App package.json

**Files:**
- Modify: `apps/admin/package.json`

**Step 1: Update admin package.json**

Replace `apps/admin/package.json`:

```json
{
  "name": "admin",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@meda/tokens": "workspace:*",
    "@meda/ui": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  }
}
```

---

### Task 14: Update Mobile App package.json

**Files:**
- Modify: `apps/mobile/package.json`

**Step 1: Update mobile package.json**

Replace `apps/mobile/package.json`:

```json
{
  "name": "mobile",
  "version": "1.0.0",
  "private": true,
  "main": "index.ts",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clean": "rm -rf .expo"
  },
  "dependencies": {
    "@meda/tokens": "workspace:*",
    "expo": "~54.0.31",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "typescript": "~5.9.2"
  }
}
```

---

### Task 15: Update Design System (Storybook) package.json

**Files:**
- Modify: `apps/design-system/package.json`

**Step 1: Update design-system package.json**

Replace `apps/design-system/package.json`:

```json
{
  "name": "design-system",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build",
    "clean": "rm -rf storybook-static"
  },
  "dependencies": {
    "@meda/tokens": "workspace:*",
    "@meda/ui": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/addon-interactions": "^8.0.0",
    "@storybook/addon-links": "^8.0.0",
    "@storybook/blocks": "^8.0.0",
    "@storybook/react": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "@storybook/test": "^8.0.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "storybook": "^8.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  }
}
```

---

### Task 16: Update Tailwind Configs for New Paths

**Files:**
- Modify: `apps/admin/tailwind.config.ts`
- Modify: `apps/design-system/tailwind.config.ts`

**Step 1: Update admin tailwind config**

Replace `apps/admin/tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [medaPreset],
} satisfies Config
```

**Step 2: Update design-system tailwind config**

Replace `apps/design-system/tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

export default {
  content: [
    './stories/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [medaPreset],
} satisfies Config
```

---

### Task 17: Fix Mobile App Import Path

**Files:**
- Modify: `apps/mobile/App.tsx`

The mobile app imports from `./src/theme` but the file is at that location. Verify the import path is correct.

**Step 1: Check current App.tsx**

Read `apps/mobile/App.tsx` and verify the import path `./src/theme` is correct. If the `src/` folder exists with `theme.ts`, no change needed.

**Step 2: Verify src/theme.ts exists**

```bash
ls -la /Users/lia/Documents/tini-works/proto-medalpha/apps/mobile/src/
```

Expected: Should see `theme.ts`

---

## Phase 5: Initialize Git and Install

### Task 18: Initialize Fresh Git Repository

**Step 1: Initialize git**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
git init
```

**Step 2: Verify git initialized**

```bash
git status
```

Expected: Shows "On branch main" or "On branch master" with untracked files

---

### Task 19: Install Dependencies

**Step 1: Install all dependencies**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
pnpm install
```

Expected: pnpm creates `node_modules` and links workspace packages automatically

**Step 2: Verify workspace packages are linked**

```bash
pnpm ls --depth 0
```

Expected: Shows all packages in the workspace

---

### Task 20: Build All Packages

**Step 1: Build packages in order**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
pnpm build:packages
```

Expected: @meda/tokens builds first, then @meda/ui builds successfully

**Step 2: Verify dist folders exist**

```bash
ls packages/tokens/dist/
ls packages/ui/dist/
```

Expected: Both have built files (index.js, index.d.ts, etc.)

---

## Phase 6: Verify Everything Works

### Task 21: Test Admin App

**Step 1: Start admin dev server**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
pnpm dev:admin
```

Expected: Vite starts at http://localhost:5173

**Step 2: Verify in browser**

Open http://localhost:5173 - should see the admin UI with design system components.

Press Ctrl+C to stop the server.

---

### Task 22: Test Design System (Storybook)

**Step 1: Start storybook**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
pnpm dev:design-system
```

Expected: Storybook starts at http://localhost:6006

**Step 2: Verify in browser**

Open http://localhost:6006 - should see Button stories with working components.

Press Ctrl+C to stop the server.

---

### Task 23: Test Mobile App

**Step 1: Start expo**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
pnpm dev:mobile
```

Expected: Expo CLI starts and shows QR code

**Step 2: Verify tokens work**

The app should compile without errors. Scan QR code with Expo Go to verify UI renders with correct colors.

Press Ctrl+C to stop the server.

---

## Phase 7: Commit and Update Docs

### Task 24: Create Initial Commit

**Step 1: Stage all files**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
git add -A
```

**Step 2: Create initial commit**

```bash
git commit -m "chore: migrate to pnpm workspaces monorepo

- Consolidate design-system, ma-admin, ma-mobile into single repo
- packages/: @meda/tokens, @meda/ui
- apps/: admin, mobile, design-system (storybook)
- Remove linking scripts (workspace:* handles deps)
- Shared configs at root (tsconfig, eslint, prettier)"
```

---

### Task 25: Update README

**Files:**
- Modify: `README.md`

**Step 1: Replace README with monorepo docs**

Replace `README.md`:

```markdown
# Proto MedAlpha

Monorepo for the MedAlpha healthcare product prototype.

## Quick Start

```bash
# Clone the repo
git clone git@github.com:tini-works/proto-medalpha.git
cd proto-medalpha

# Install dependencies
pnpm install

# Build packages
pnpm build:packages

# Start an app
pnpm dev:admin          # Web admin at http://localhost:5173
pnpm dev:design-system  # Storybook at http://localhost:6006
pnpm dev:mobile         # Expo dev server
```

## Structure

```
proto-medalpha/
├── packages/
│   ├── tokens/          # @meda/tokens - Design tokens
│   └── ui/              # @meda/ui - React components
│
├── apps/
│   ├── admin/           # Web admin (Vite + React)
│   ├── mobile/          # Mobile app (Expo)
│   └── design-system/   # Storybook documentation
│
└── docs/                # Design docs and plans
```

## Development

| Task | Command |
|------|---------|
| Start admin app | `pnpm dev:admin` |
| Start mobile app | `pnpm dev:mobile` |
| Start Storybook | `pnpm dev:design-system` |
| Build all packages | `pnpm build:packages` |
| Build everything | `pnpm build` |
| Clean all | `pnpm clean` |

## Packages

### @meda/tokens

Design tokens exported as:
- TypeScript constants (for React Native)
- Tailwind preset (for web apps)
- CSS variables

### @meda/ui

React components (Button, Input, Card) using Tailwind CSS classes.

## Adding Dependencies

```bash
# Add to a specific package
pnpm --filter @meda/ui add lodash

# Add to an app
pnpm --filter admin add react-router-dom

# Add to root (dev tools)
pnpm add -D -w prettier
```
```

---

### Task 26: Update Scripts Directory

**Files:**
- Remove: `scripts/` directory (if empty)
- OR Create: `scripts/README.md`

**Step 1: Check if scripts directory has anything**

```bash
ls -la /Users/lia/Documents/tini-works/proto-medalpha/scripts/
```

**Step 2: If empty, remove it**

```bash
rmdir scripts/ 2>/dev/null || echo "scripts has files, keeping it"
```

**Step 3: If it has files, update or keep as needed**

---

### Task 27: Final Commit

**Step 1: Stage any remaining changes**

```bash
git add -A
```

**Step 2: Commit docs update**

```bash
git commit -m "docs: update README for monorepo structure" --allow-empty
```

---

### Task 28: Push to GitHub

**Step 1: Add remote (if not exists)**

```bash
git remote add origin git@github.com:tini-works/proto-medalpha.git 2>/dev/null || echo "Remote already exists"
```

**Step 2: Push with force (fresh history)**

```bash
git push --force -u origin master
```

Note: Using `--force` because we're replacing history with fresh start.

---

## Phase 8: Remove Deprecated GitHub Repos

### Task 29: Delete Old GitHub Repositories

The old polyrepo structure had separate repos that are now deprecated. Delete them from GitHub.

**Step 1: List current repos to confirm names**

```bash
gh repo list tini-works --limit 20
```

Expected: Should see repos like `meda-design-system`, `ma-admin`, `ma-mobile`

**Step 2: Delete design-system repo**

```bash
gh repo delete tini-works/meda-design-system --yes
```

**Step 3: Delete ma-admin repo**

```bash
gh repo delete tini-works/ma-admin --yes
```

**Step 4: Delete ma-mobile repo**

```bash
gh repo delete tini-works/ma-mobile --yes
```

**Step 5: Verify repos are deleted**

```bash
gh repo list tini-works --limit 20
```

Expected: Only `proto-medalpha` should remain (plus any other unrelated repos)

---

## Summary

After completing all tasks:

1. **Single monorepo** at `proto-medalpha/`
2. **packages/** - `@meda/tokens`, `@meda/ui`
3. **apps/** - `admin`, `mobile`, `design-system`
4. **No linking scripts** - `workspace:*` handles everything
5. **Single clone** - `git clone && pnpm install && pnpm build:packages`
6. **Fresh git history** - clean start

## Rollback

If something goes wrong, restore from backup:

```bash
rm -rf /Users/lia/Documents/tini-works/proto-medalpha
mv /Users/lia/Documents/tini-works/proto-medalpha-backup-YYYYMMDD /Users/lia/Documents/tini-works/proto-medalpha
```
