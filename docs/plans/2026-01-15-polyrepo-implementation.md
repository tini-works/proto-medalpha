# Polyrepo Workspace Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a polyrepo workspace with three independent git repos sharing a design system via pnpm links.

**Architecture:** Parent folder contains shared infra configs and helper scripts. Each repo (design-system, ma-admin, ma-mobile) is fully independent with its own git history. Design system exposes two packages (@meda/tokens, @meda/ui) consumed by apps.

**Tech Stack:** pnpm, TypeScript, React, Tailwind CSS, Vite, Expo, tsup, Storybook

---

## Phase 1: Workspace Foundation

### Task 1: Clean Parent Folder

The parent folder currently has a `.git/` directory. Per design, it should NOT be a git repo.

**Files:**
- Remove: `proto-medalpha/.git/`

**Step 1: Remove existing git repo from parent**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
rm -rf .git
```

**Step 2: Verify parent is not a git repo**

```bash
git status
```

Expected: `fatal: not a git repository`

---

### Task 2: Create Shared Infrastructure Configs

**Files:**
- Create: `infra/tsconfig/base.json`
- Create: `infra/eslint/base.js`
- Create: `infra/prettier/.prettierrc`
- Create: `infra/README.md`

**Step 1: Create infra directory structure**

```bash
mkdir -p infra/tsconfig infra/eslint infra/prettier
```

**Step 2: Create base TypeScript config**

Create `infra/tsconfig/base.json`:

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

**Step 3: Create base ESLint config**

Create `infra/eslint/base.js`:

```js
module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
}
```

**Step 4: Create Prettier config**

Create `infra/prettier/.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Step 5: Create infra README**

Create `infra/README.md`:

```markdown
# Shared Infrastructure Configs

Reference configurations for all repos in this workspace. Each repo should copy or extend these.

## Usage

### TypeScript
Copy `tsconfig/base.json` to your repo and extend it:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": { ... }
}
```

### ESLint
Reference in your `.eslintrc.js`:

```js
module.exports = {
  extends: ['../../infra/eslint/base.js'],
}
```

### Prettier
Copy `.prettierrc` to your repo root.
```

---

### Task 3: Create Dev Link Script

**Files:**
- Create: `scripts/dev-link.sh`

**Step 1: Create scripts directory**

```bash
mkdir -p scripts
```

**Step 2: Create dev-link.sh**

Create `scripts/dev-link.sh`:

```bash
#!/bin/bash
set -e

WORKSPACE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Building design-system packages..."
cd "$WORKSPACE_ROOT/design-system"
pnpm install
pnpm build

echo "==> Linking @meda/tokens globally..."
cd "$WORKSPACE_ROOT/design-system/packages/tokens"
pnpm link --global

echo "==> Linking @meda/ui globally..."
cd "$WORKSPACE_ROOT/design-system/packages/ui"
pnpm link --global

echo "==> Linking packages to ma-admin..."
cd "$WORKSPACE_ROOT/ma-admin"
pnpm link --global @meda/tokens @meda/ui

echo "==> Linking packages to ma-mobile..."
cd "$WORKSPACE_ROOT/ma-mobile"
pnpm link --global @meda/tokens

echo "==> Done! All packages linked."
```

**Step 3: Make script executable**

```bash
chmod +x scripts/dev-link.sh
```

---

## Phase 2: Design System Repository

### Task 4: Initialize design-system Git Repo

**Files:**
- Create: `design-system/.git/` (via git init)
- Create: `design-system/.gitignore`
- Create: `design-system/package.json`
- Create: `design-system/pnpm-workspace.yaml`

**Step 1: Create design-system directory and init git**

```bash
mkdir -p design-system
cd design-system
git init
```

**Step 2: Create .gitignore**

Create `design-system/.gitignore`:

```
node_modules/
dist/
*.log
.DS_Store
generated/
!packages/tokens/generated/.gitkeep
```

**Step 3: Create root package.json**

Create `design-system/package.json`:

```json
{
  "name": "design-system",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r --parallel dev",
    "storybook": "pnpm --filter storybook dev",
    "lint": "pnpm -r lint"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

**Step 4: Create pnpm-workspace.yaml**

Create `design-system/pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**Step 5: Commit initial structure**

```bash
git add -A
git commit -m "chore: init design-system repo"
```

---

### Task 5: Create @meda/tokens Package Structure

**Files:**
- Create: `design-system/packages/tokens/package.json`
- Create: `design-system/packages/tokens/tsconfig.json`
- Create: `design-system/packages/tokens/src/colors.json`
- Create: `design-system/packages/tokens/src/spacing.json`
- Create: `design-system/packages/tokens/src/typography.json`
- Create: `design-system/packages/tokens/src/index.ts`
- Create: `design-system/packages/tokens/generated/.gitkeep`

**Step 1: Create tokens package directory**

```bash
mkdir -p packages/tokens/src packages/tokens/generated packages/tokens/scripts
touch packages/tokens/generated/.gitkeep
```

**Step 2: Create tokens package.json**

Create `design-system/packages/tokens/package.json`:

```json
{
  "name": "@meda/tokens",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./tailwind": {
      "import": "./dist/tailwind-preset.js",
      "types": "./dist/tailwind-preset.d.ts"
    },
    "./css": "./dist/css-variables.css"
  },
  "files": ["dist"],
  "scripts": {
    "build:tokens": "tsx scripts/build-tokens.ts",
    "build": "pnpm build:tokens && tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsup": "^8.0.1",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

**Step 3: Create tokens tsconfig.json**

Create `design-system/packages/tokens/tsconfig.json`:

```json
{
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
    "outDir": "./dist",
    "rootDir": "."
  },
  "include": ["src/**/*", "generated/**/*", "scripts/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create colors.json**

Create `design-system/packages/tokens/src/colors.json`:

```json
{
  "primary": {
    "50": "#eff6ff",
    "100": "#dbeafe",
    "200": "#bfdbfe",
    "300": "#93c5fd",
    "400": "#60a5fa",
    "500": "#3b82f6",
    "600": "#2563eb",
    "700": "#1d4ed8",
    "800": "#1e40af",
    "900": "#1e3a8a"
  },
  "neutral": {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#e5e5e5",
    "300": "#d4d4d4",
    "400": "#a3a3a3",
    "500": "#737373",
    "600": "#525252",
    "700": "#404040",
    "800": "#262626",
    "900": "#171717"
  },
  "success": {
    "500": "#22c55e",
    "600": "#16a34a"
  },
  "error": {
    "500": "#ef4444",
    "600": "#dc2626"
  }
}
```

**Step 5: Create spacing.json**

Create `design-system/packages/tokens/src/spacing.json`:

```json
{
  "0": "0",
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem"
}
```

**Step 6: Create typography.json**

Create `design-system/packages/tokens/src/typography.json`:

```json
{
  "fontFamily": {
    "sans": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, monospace"
  },
  "fontSize": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem"
  },
  "fontWeight": {
    "normal": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700"
  },
  "lineHeight": {
    "tight": "1.25",
    "normal": "1.5",
    "relaxed": "1.75"
  }
}
```

**Step 7: Create src/index.ts**

Create `design-system/packages/tokens/src/index.ts`:

```ts
export { colors } from '../generated/tokens.js'
export { spacing } from '../generated/tokens.js'
export { typography } from '../generated/tokens.js'

export type { Colors, Spacing, Typography } from '../generated/tokens.js'
```

---

### Task 6: Create Token Build Script

**Files:**
- Create: `design-system/packages/tokens/scripts/build-tokens.ts`

**Step 1: Create build-tokens.ts**

Create `design-system/packages/tokens/scripts/build-tokens.ts`:

```ts
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.join(__dirname, '..', 'src')
const outDir = path.join(__dirname, '..', 'generated')

// Ensure output directory exists
fs.mkdirSync(outDir, { recursive: true })

// Read source tokens
const colors = JSON.parse(fs.readFileSync(path.join(srcDir, 'colors.json'), 'utf-8'))
const spacing = JSON.parse(fs.readFileSync(path.join(srcDir, 'spacing.json'), 'utf-8'))
const typography = JSON.parse(fs.readFileSync(path.join(srcDir, 'typography.json'), 'utf-8'))

const BASE_FONT_SIZE = 16

// Helper: convert rem string to number for RN
function remToNumber(value: string): number {
  if (value === '0') return 0
  const match = value.match(/^([\d.]+)rem$/)
  if (match) {
    return parseFloat(match[1]) * BASE_FONT_SIZE
  }
  return parseFloat(value) || 0
}

// Helper: recursively convert spacing values for RN
function convertSpacingForRN(obj: Record<string, string>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = remToNumber(value)
  }
  return result
}

// Helper: convert fontSize for RN
function convertFontSizeForRN(obj: Record<string, string>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = remToNumber(value)
  }
  return result
}

// Generate tokens.ts (RN-ready with numbers)
const tokensTs = `// AUTO-GENERATED - DO NOT EDIT
// Source: packages/tokens/src/*.json

export const colors = ${JSON.stringify(colors, null, 2)} as const

export type Colors = typeof colors

export const spacing = ${JSON.stringify(convertSpacingForRN(spacing), null, 2)} as const

export type Spacing = typeof spacing

export const typography = {
  fontFamily: ${JSON.stringify(typography.fontFamily, null, 2)},
  fontSize: ${JSON.stringify(convertFontSizeForRN(typography.fontSize), null, 2)},
  fontWeight: ${JSON.stringify(typography.fontWeight, null, 2)},
  lineHeight: ${JSON.stringify(typography.lineHeight, null, 2)},
} as const

export type Typography = typeof typography
`

fs.writeFileSync(path.join(outDir, 'tokens.ts'), tokensTs)
console.log('Generated: tokens.ts')

// Generate tailwind-preset.ts
const tailwindPreset = `// AUTO-GENERATED - DO NOT EDIT
// Source: packages/tokens/src/*.json

export const medaPreset = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6)},
      spacing: ${JSON.stringify(spacing, null, 6)},
      fontFamily: ${JSON.stringify(typography.fontFamily, null, 6)},
      fontSize: ${JSON.stringify(typography.fontSize, null, 6)},
      fontWeight: ${JSON.stringify(typography.fontWeight, null, 6)},
      lineHeight: ${JSON.stringify(typography.lineHeight, null, 6)},
    },
  },
}
`

fs.writeFileSync(path.join(outDir, 'tailwind-preset.ts'), tailwindPreset)
console.log('Generated: tailwind-preset.ts')

// Generate CSS variables
function flattenToCSS(obj: Record<string, unknown>, prefix = ''): string[] {
  const vars: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key
    if (typeof value === 'object' && value !== null) {
      vars.push(...flattenToCSS(value as Record<string, unknown>, varName))
    } else {
      vars.push(`  --${varName}: ${value};`)
    }
  }
  return vars
}

const cssVars = [
  '/* AUTO-GENERATED - DO NOT EDIT */',
  '/* Source: packages/tokens/src/*.json */',
  '',
  ':root {',
  ...flattenToCSS({ color: colors }),
  ...flattenToCSS({ spacing }),
  ...flattenToCSS({ font: typography.fontFamily }),
  ...flattenToCSS({ 'font-size': typography.fontSize }),
  '}',
].join('\n')

fs.writeFileSync(path.join(outDir, 'css-variables.css'), cssVars)
console.log('Generated: css-variables.css')

console.log('Token build complete!')
```

---

### Task 7: Create tsup Config for Tokens

**Files:**
- Create: `design-system/packages/tokens/tsup.config.ts`

**Step 1: Create tsup.config.ts**

Create `design-system/packages/tokens/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'generated/tailwind-preset.ts', 'generated/tokens.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
})
```

---

### Task 8: Build and Test Tokens Package

**Step 1: Install dependencies**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha/design-system
pnpm install
```

**Step 2: Build tokens**

```bash
cd packages/tokens
pnpm build:tokens
```

Expected: See "Generated: tokens.ts", "Generated: tailwind-preset.ts", "Generated: css-variables.css"

**Step 3: Build package**

```bash
pnpm build
```

Expected: dist/ folder created with index.js, tailwind-preset.js, tokens.js and their .d.ts files

**Step 4: Commit tokens package**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha/design-system
git add -A
git commit -m "feat: add @meda/tokens package with build pipeline"
```

---

### Task 9: Create @meda/ui Package Structure

**Files:**
- Create: `design-system/packages/ui/package.json`
- Create: `design-system/packages/ui/tsconfig.json`
- Create: `design-system/packages/ui/tsup.config.ts`
- Create: `design-system/packages/ui/src/index.ts`

**Step 1: Create ui package directory**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha/design-system
mkdir -p packages/ui/src
```

**Step 2: Create ui package.json**

Create `design-system/packages/ui/package.json`:

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
    "lint": "eslint src/"
  },
  "dependencies": {
    "@meda/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
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

**Step 3: Create ui tsconfig.json**

Create `design-system/packages/ui/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create ui tsup.config.ts**

Create `design-system/packages/ui/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
})
```

**Step 5: Create placeholder index.ts**

Create `design-system/packages/ui/src/index.ts`:

```ts
// Components will be exported here
export {}
```

---

### Task 10: Create Button Component

**Files:**
- Create: `design-system/packages/ui/src/Button/Button.tsx`
- Create: `design-system/packages/ui/src/Button/index.ts`
- Modify: `design-system/packages/ui/src/index.ts`

**Step 1: Create Button directory**

```bash
mkdir -p packages/ui/src/Button
```

**Step 2: Create Button.tsx**

Create `design-system/packages/ui/src/Button/Button.tsx`:

```tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

**Step 3: Create Button index.ts**

Create `design-system/packages/ui/src/Button/index.ts`:

```ts
export { Button, type ButtonProps } from './Button'
```

**Step 4: Update main index.ts**

Replace `design-system/packages/ui/src/index.ts`:

```ts
export { Button, type ButtonProps } from './Button'
```

---

### Task 11: Create Input Component

**Files:**
- Create: `design-system/packages/ui/src/Input/Input.tsx`
- Create: `design-system/packages/ui/src/Input/index.ts`
- Modify: `design-system/packages/ui/src/index.ts`

**Step 1: Create Input directory**

```bash
mkdir -p packages/ui/src/Input
```

**Step 2: Create Input.tsx**

Create `design-system/packages/ui/src/Input/Input.tsx`:

```tsx
import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-md border transition-colors
            ${error ? 'border-error-500 focus:ring-error-500' : 'border-neutral-300 focus:ring-primary-500'}
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-sm text-error-500">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

**Step 3: Create Input index.ts**

Create `design-system/packages/ui/src/Input/index.ts`:

```ts
export { Input, type InputProps } from './Input'
```

**Step 4: Update main index.ts**

Replace `design-system/packages/ui/src/index.ts`:

```ts
export { Button, type ButtonProps } from './Button'
export { Input, type InputProps } from './Input'
```

---

### Task 12: Create Card Component

**Files:**
- Create: `design-system/packages/ui/src/Card/Card.tsx`
- Create: `design-system/packages/ui/src/Card/index.ts`
- Modify: `design-system/packages/ui/src/index.ts`

**Step 1: Create Card directory**

```bash
mkdir -p packages/ui/src/Card
```

**Step 2: Create Card.tsx**

Create `design-system/packages/ui/src/Card/Card.tsx`:

```tsx
import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-neutral-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-neutral-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardBody({ children, className = '', ...props }: CardBodyProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-neutral-200 ${className}`} {...props}>
      {children}
    </div>
  )
}
```

**Step 3: Create Card index.ts**

Create `design-system/packages/ui/src/Card/index.ts`:

```ts
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
} from './Card'
```

**Step 4: Update main index.ts**

Replace `design-system/packages/ui/src/index.ts`:

```ts
export { Button, type ButtonProps } from './Button'
export { Input, type InputProps } from './Input'
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
} from './Card'
```

---

### Task 13: Build and Commit UI Package

**Step 1: Install dependencies**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha/design-system
pnpm install
```

**Step 2: Build all packages**

```bash
pnpm build
```

Expected: Both packages build successfully

**Step 3: Commit UI package**

```bash
git add -A
git commit -m "feat: add @meda/ui package with Button, Input, Card components"
```

---

### Task 14: Set Up Storybook

**Files:**
- Create: `design-system/apps/storybook/package.json`
- Create: `design-system/apps/storybook/.storybook/main.ts`
- Create: `design-system/apps/storybook/.storybook/preview.ts`
- Create: `design-system/apps/storybook/stories/Button.stories.tsx`

**Step 1: Create storybook app directory**

```bash
mkdir -p apps/storybook/.storybook apps/storybook/stories
```

**Step 2: Create storybook package.json**

Create `design-system/apps/storybook/package.json`:

```json
{
  "name": "storybook",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
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

**Step 3: Create storybook main.ts**

Create `design-system/apps/storybook/.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

**Step 4: Create storybook preview.ts**

Create `design-system/apps/storybook/.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react'
import '../styles.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

**Step 5: Create Tailwind config for storybook**

Create `design-system/apps/storybook/tailwind.config.ts`:

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

**Step 6: Create PostCSS config**

Create `design-system/apps/storybook/postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 7: Create styles.css**

Create `design-system/apps/storybook/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 8: Create Button stories**

Create `design-system/apps/storybook/stories/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@meda/ui'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost',
  },
}

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}
```

**Step 9: Install and test storybook**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha/design-system
pnpm install
pnpm storybook
```

Expected: Storybook opens at http://localhost:6006 with Button stories

**Step 10: Commit storybook**

```bash
git add -A
git commit -m "feat: add Storybook for component documentation"
```

---

## Phase 3: Admin App Repository

### Task 15: Initialize ma-admin Git Repo

**Files:**
- Create: `ma-admin/.git/` (via git init)
- Create: `ma-admin/.gitignore`
- Create: `ma-admin/package.json`

**Step 1: Create ma-admin directory and init git**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
mkdir -p ma-admin
cd ma-admin
git init
```

**Step 2: Create .gitignore**

Create `ma-admin/.gitignore`:

```
node_modules/
dist/
*.log
.DS_Store
```

**Step 3: Create package.json**

Create `ma-admin/package.json`:

```json
{
  "name": "ma-admin",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@meda/tokens": "^0.1.0",
    "@meda/ui": "^0.1.0",
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

### Task 16: Create ma-admin Config Files

**Files:**
- Create: `ma-admin/tsconfig.json`
- Create: `ma-admin/vite.config.ts`
- Create: `ma-admin/tailwind.config.ts`
- Create: `ma-admin/postcss.config.js`

**Step 1: Create tsconfig.json**

Create `ma-admin/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 2: Create tsconfig.node.json**

Create `ma-admin/tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts"]
}
```

**Step 3: Create vite.config.ts**

Create `ma-admin/vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Step 4: Create tailwind.config.ts**

Create `ma-admin/tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [medaPreset],
} satisfies Config
```

**Step 5: Create postcss.config.js**

Create `ma-admin/postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### Task 17: Create ma-admin Source Files

**Files:**
- Create: `ma-admin/index.html`
- Create: `ma-admin/src/main.tsx`
- Create: `ma-admin/src/App.tsx`
- Create: `ma-admin/src/index.css`

**Step 1: Create src directory**

```bash
mkdir -p src
```

**Step 2: Create index.html**

Create `ma-admin/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MA Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 3: Create main.tsx**

Create `ma-admin/src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

**Step 4: Create App.tsx**

Create `ma-admin/src/App.tsx`:

```tsx
import { Button, Card, CardHeader, CardBody, Input } from '@meda/ui'

export function App() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-neutral-900">MA Admin</h1>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Design System Demo</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input label="Email" type="email" placeholder="Enter your email" />
            <Input label="Password" type="password" placeholder="Enter your password" />
            <div className="flex gap-2">
              <Button variant="primary">Sign In</Button>
              <Button variant="secondary">Cancel</Button>
              <Button variant="ghost">Forgot Password?</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
```

**Step 5: Create index.css**

Create `ma-admin/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 6: Commit ma-admin**

```bash
git add -A
git commit -m "feat: scaffold ma-admin with Vite, React, Tailwind"
```

---

## Phase 4: Mobile App Repository

### Task 18: Initialize ma-mobile Git Repo with Expo

**Step 1: Create ma-mobile directory**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
npx create-expo-app@latest ma-mobile --template blank-typescript
cd ma-mobile
```

**Step 2: Remove existing git (Expo creates one) and reinit**

```bash
rm -rf .git
git init
```

**Step 3: Update .gitignore**

Replace `ma-mobile/.gitignore`:

```
node_modules/
.expo/
dist/
*.log
.DS_Store
```

**Step 4: Update package.json to add @meda/tokens**

Modify `ma-mobile/package.json` to add the dependency:

```json
{
  "dependencies": {
    "@meda/tokens": "^0.1.0"
  }
}
```

(Keep existing Expo dependencies, just add @meda/tokens)

---

### Task 19: Create ma-mobile Theme and Demo Screen

**Files:**
- Create: `ma-mobile/src/theme.ts`
- Modify: `ma-mobile/App.tsx`

**Step 1: Create src directory and theme.ts**

```bash
mkdir -p src
```

Create `ma-mobile/src/theme.ts`:

```ts
import { colors, spacing, typography } from '@meda/tokens'

export const theme = {
  colors,
  spacing,
  typography,
}

// Type-safe style helpers
export const getColor = (path: string): string => {
  const parts = path.split('.')
  let value: unknown = colors
  for (const part of parts) {
    value = (value as Record<string, unknown>)[part]
  }
  return value as string
}

export const getSpacing = (key: keyof typeof spacing): number => {
  return spacing[key]
}
```

**Step 2: Update App.tsx**

Replace `ma-mobile/App.tsx`:

```tsx
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { theme, getColor, getSpacing } from './src/theme'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MA Mobile</Text>
      <Text style={styles.subtitle}>Design System Demo</Text>

      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={getColor('neutral.400')} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={getColor('neutral.400')} secureTextEntry />

        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor('neutral.50'),
    alignItems: 'center',
    justifyContent: 'center',
    padding: getSpacing('4'),
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold as '700',
    color: getColor('neutral.900'),
    marginBottom: getSpacing('2'),
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: getColor('neutral.600'),
    marginBottom: getSpacing('8'),
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: getSpacing('6'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: getColor('neutral.300'),
    borderRadius: 8,
    paddingHorizontal: getSpacing('3'),
    marginBottom: getSpacing('4'),
    fontSize: theme.typography.fontSize.base,
  },
  buttonPrimary: {
    width: '100%',
    height: 48,
    backgroundColor: getColor('primary.600'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpacing('3'),
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium as '500',
  },
  buttonSecondary: {
    width: '100%',
    height: 48,
    backgroundColor: getColor('neutral.200'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    color: getColor('neutral.900'),
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium as '500',
  },
})
```

**Step 3: Commit ma-mobile**

```bash
git add -A
git commit -m "feat: scaffold ma-mobile with Expo and token integration"
```

---

## Phase 5: Link and Verify

### Task 20: Run Dev Link Script

**Step 1: Run the dev-link script**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
./scripts/dev-link.sh
```

Expected: All packages linked successfully

---

### Task 21: Verify ma-admin

**Step 1: Start ma-admin**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha/ma-admin
pnpm dev
```

Expected: Opens at http://localhost:5173 with the demo UI using design system components

---

### Task 22: Verify ma-mobile

**Step 1: Start ma-mobile**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha/ma-mobile
pnpm start
```

Expected: Expo dev server starts, scan QR code with Expo Go app to see the demo

---

### Task 23: Final Cleanup

**Step 1: Verify all repos are independent**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha

# Should fail (not a git repo)
git status

# Each should show their own status
cd design-system && git status && cd ..
cd ma-admin && git status && cd ..
cd ma-mobile && git status && cd ..
```

Expected: Parent folder is not a git repo, each subfolder has independent git history

---

## Phase 6: GitHub Sharing Setup

### Task 24: Create GitHub Repositories

**Step 1: Create GitHub repos for each project**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha

# Create design-system repo
cd design-system
gh repo create your-org/meda-design-system --private --source=. --push
cd ..

# Create ma-admin repo
cd ma-admin
gh repo create your-org/ma-admin --private --source=. --push
cd ..

# Create ma-mobile repo
cd ma-mobile
gh repo create your-org/ma-mobile --private --source=. --push
cd ..
```

Replace `your-org` with your GitHub organization or username.

---

### Task 25: Create Workspace Meta Repository

The parent folder becomes a "meta repo" that contains shared scripts and documentation, plus a clone script for team members.

**Step 1: Initialize git in parent folder**

```bash
cd /Users/lia/Documents/tini-works/proto-medalpha
git init
```

**Step 2: Create .gitignore for meta repo**

Create `proto-medalpha/.gitignore`:

```
# Child repos are cloned separately
design-system/
ma-admin/
ma-mobile/

# OS files
.DS_Store
*.log
```

**Step 3: Commit meta repo files**

```bash
git add -A
git commit -m "chore: init workspace meta repo with infra and scripts"
```

**Step 4: Create GitHub repo for workspace**

```bash
gh repo create your-org/proto-medalpha --private --source=. --push
```

---

### Task 26: Create Clone Workspace Script

**Files:**
- Create: `scripts/clone-workspace.sh`

**Step 1: Create clone-workspace.sh**

Create `scripts/clone-workspace.sh`:

```bash
#!/bin/bash
set -e

# Configuration - UPDATE THESE
ORG="your-org"
REPOS=(
  "meda-design-system:design-system"
  "ma-admin:ma-admin"
  "ma-mobile:ma-mobile"
)

WORKSPACE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$WORKSPACE_ROOT"

echo "==> Cloning workspace repos..."

for entry in "${REPOS[@]}"; do
  repo="${entry%%:*}"
  dir="${entry##*:}"

  if [ ! -d "$dir" ]; then
    echo "==> Cloning $repo into $dir..."
    git clone "git@github.com:$ORG/$repo.git" "$dir"
  else
    echo "==> $dir already exists, skipping clone..."
  fi
done

echo ""
echo "==> Installing dependencies..."

cd "$WORKSPACE_ROOT/design-system"
pnpm install
pnpm build

cd "$WORKSPACE_ROOT/ma-admin"
pnpm install

cd "$WORKSPACE_ROOT/ma-mobile"
pnpm install

echo ""
echo "==> Running dev-link..."
cd "$WORKSPACE_ROOT"
./scripts/dev-link.sh

echo ""
echo "==> Workspace ready!"
echo ""
echo "Next steps:"
echo "  cd design-system && pnpm storybook  # View component docs"
echo "  cd ma-admin && pnpm dev             # Start admin app"
echo "  cd ma-mobile && pnpm start          # Start mobile app"
```

**Step 2: Make script executable**

```bash
chmod +x scripts/clone-workspace.sh
```

**Step 3: Commit clone script**

```bash
git add scripts/clone-workspace.sh
git commit -m "feat: add clone-workspace script for team onboarding"
git push
```

---

### Task 27: Create Push All Script

**Files:**
- Create: `scripts/push-all.sh`

**Step 1: Create push-all.sh**

Create `scripts/push-all.sh`:

```bash
#!/bin/bash
set -e

WORKSPACE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Pushing all repos..."

for repo in design-system ma-admin ma-mobile; do
  if [ -d "$WORKSPACE_ROOT/$repo/.git" ]; then
    echo ""
    echo "==> Pushing $repo..."
    cd "$WORKSPACE_ROOT/$repo"

    # Check if there are changes to push
    if git status --porcelain | grep -q .; then
      echo "    Warning: $repo has uncommitted changes"
    fi

    # Check if remote exists
    if git remote get-url origin &>/dev/null; then
      git push
      echo "    Done!"
    else
      echo "    Skipped: no remote configured"
    fi
  else
    echo "==> Skipping $repo (not a git repo)"
  fi
done

echo ""
echo "==> All repos pushed!"
```

**Step 2: Make script executable**

```bash
chmod +x scripts/push-all.sh
```

**Step 3: Commit push script**

```bash
git add scripts/push-all.sh
git commit -m "feat: add push-all script for batch git push"
git push
```

---

### Task 28: Update Workspace README

**Files:**
- Create: `README.md`

**Step 1: Create README.md**

Create `proto-medalpha/README.md`:

```markdown
# Proto MedAlpha Workspace

Polyrepo workspace for the MedAlpha healthcare product prototype.

## Quick Start (New Team Members)

```bash
# 1. Clone the workspace meta repo
git clone git@github.com:your-org/proto-medalpha.git
cd proto-medalpha

# 2. Clone all child repos and set up links
./scripts/clone-workspace.sh
```

## Structure

```
proto-medalpha/           # This repo (meta/workspace)
├── infra/                # Shared configs (ESLint, TypeScript, Prettier)
├── scripts/              # Workspace automation
├── docs/                 # Design docs and plans
├── design-system/        # @meda/tokens + @meda/ui packages
├── ma-admin/             # React web admin app
└── ma-mobile/            # Expo React Native app
```

## Daily Workflow

| Task | Command |
|------|---------|
| Start design system docs | `cd design-system && pnpm storybook` |
| Start admin app | `cd ma-admin && pnpm dev` |
| Start mobile app | `cd ma-mobile && pnpm start` |
| Re-link after token changes | `./scripts/dev-link.sh` |
| Push all repos | `./scripts/push-all.sh` |

## Repositories

| Repo | Purpose |
|------|---------|
| [proto-medalpha](https://github.com/your-org/proto-medalpha) | Workspace meta repo |
| [meda-design-system](https://github.com/your-org/meda-design-system) | Design tokens + UI components |
| [ma-admin](https://github.com/your-org/ma-admin) | Admin web application |
| [ma-mobile](https://github.com/your-org/ma-mobile) | Mobile application |

## Architecture

See [docs/plans/2026-01-15-polyrepo-workspace-design.md](docs/plans/2026-01-15-polyrepo-workspace-design.md) for full architecture documentation.
```

**Step 2: Commit README**

```bash
git add README.md
git commit -m "docs: add workspace README with setup instructions"
git push
```

---

## Summary

After completing all tasks, you will have:

1. **proto-medalpha/** - Container folder (not a git repo)
   - `infra/` - Shared configs
   - `scripts/dev-link.sh` - Automation

2. **design-system/** - Independent git repo
   - `@meda/tokens` - Design tokens with multi-platform exports
   - `@meda/ui` - React components (Button, Input, Card)
   - Storybook documentation

3. **ma-admin/** - Independent git repo
   - Vite + React + Tailwind
   - Consumes @meda/tokens and @meda/ui

4. **ma-mobile/** - Independent git repo
   - Expo managed workflow
   - Consumes @meda/tokens (RN-ready numbers)

5. **GitHub Setup**
   - 4 GitHub repos (workspace + 3 child repos)
   - `clone-workspace.sh` for team onboarding
   - `push-all.sh` for batch pushing
