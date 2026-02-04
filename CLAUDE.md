# Claude Code Guidelines for Proto MedAlpha

## Project Overview

This is a pnpm workspaces monorepo for the DocliQ healthcare prototype. It contains shared packages and multiple applications.

## Architecture

```
proto-medalpha/
├── packages/           # Shared libraries
│   ├── tokens/         # @meda/tokens - Design tokens (colors, spacing, typography)
│   └── ui/             # @meda/ui - React UI components
├── apps/               # Deployable applications
│   ├── admin/          # Web admin dashboard (Vite + React)
│   ├── docliQ-mobile/  # DocliQ mobile app
│   ├── design-system/  # Storybook documentation
│   └── mobile/         # Mobile app (Expo + React Native)
└── docs/               # Design documents and plans
```

## Key Commands

```bash
pnpm install            # Install all dependencies
pnpm build:packages     # Build @meda/tokens then @meda/ui (order matters)
pnpm dev:admin          # Start admin app at http://localhost:5196
pnpm dev:mobile         # Start Expo dev server
pnpm dev:design-system  # Start Storybook at http://localhost:6006
pnpm dev:docliQ        # DocliQ mobile app at http://localhost:5190
```

## Development Rules

### Package Dependencies

- Use `workspace:*` for internal package references
- Build order: tokens -> ui -> apps (tokens must build first)
- After modifying packages, rebuild with `pnpm build:packages`

### Adding Dependencies

```bash
# To a specific package
pnpm --filter @meda/tokens add <package>

# To an app
pnpm --filter admin add <package>

# To root (shared dev tools only)
pnpm add -D -w <package>
```

### Design Tokens

- All design tokens live in `packages/tokens/`
- Tokens are exported as: TypeScript constants, Tailwind preset, CSS variables
- When modifying tokens, run `pnpm --filter @meda/tokens build` to regenerate

### UI Components

- Components in `packages/ui/` use Tailwind CSS classes
- Components should use tokens from `@meda/tokens`
- Test components in Storybook before using in apps

### Tailwind Configuration

- Apps use the shared preset from `@meda/tokens/tailwind`
- Don't duplicate color/spacing values - use the preset

## Code Style

- TypeScript strict mode enabled
- Prettier for formatting (see `.prettierrc`)
- ESLint for linting (see `.eslintrc.js`)
- No semicolons, single quotes, trailing commas

## File Naming

- React components: PascalCase (`Button.tsx`)
- Utilities/hooks: camelCase (`useTheme.ts`)
- Config files: lowercase with dots (`tailwind.config.ts`)

## Testing Changes

Before committing:
1. `pnpm build:packages` - Ensure packages build
2. Start the relevant app to verify changes work
3. Check Storybook if UI components were modified
