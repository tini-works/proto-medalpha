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

## License

Private - All rights reserved.
