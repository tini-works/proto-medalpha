# Proto MedAlpha

Monorepo for the MedAlpha healthcare product prototype.

## Tech Stack

- **Package Manager:** pnpm workspaces
- **Languages:** TypeScript
- **Web:** React, Vite, Tailwind CSS
- **Mobile:** Expo, React Native
- **Documentation:** Storybook

## Quick Start

```bash
# Clone the repo (local developer setup)
git clone git@github.com:tini-works/proto-medalpha.git
cd proto-medalpha

# Install dependencies for all workspaces
pnpm install

# Build shared packages before running apps
pnpm build:packages

# Start an app for local prototyping
pnpm dev:admin             # Web admin at http://localhost:5173
pnpm dev:design-system     # Storybook at http://localhost:6006
pnpm dev:mobile            # Expo dev server
pnpm dev:appointment-v1    # Appointment booking prototype (web)
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
│   ├── appointment-v1/  # Appointment booking prototype (web)
│   └── design-system/   # Storybook documentation
│
└── docs/                # Design docs and plans
```

## Documentation & Visual Artifacts

- Canonical artifact rules: `docs/z.guidelines/visual-artifacts-rules.md`
- Default cross-cutting visual constraints: `docs/z.guidelines/visual-guidelines-abstract.md`

## Development

| Task | Command |
|------|---------|
| Start admin app | `pnpm dev:admin` |
| Start mobile app | `pnpm dev:mobile` |
| Start Storybook | `pnpm dev:design-system` |
| Start appointment booking prototype | `pnpm dev:appointment-v1` |
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

## License

Private - All rights reserved.
