# Proto MedAlpha Workspace

Polyrepo workspace for the MedAlpha healthcare product prototype.

## Quick Start (New Team Members)

```bash
# 1. Clone the workspace meta repo
git clone git@github.com:tini-works/proto-medalpha.git
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
| [proto-medalpha](https://github.com/tini-works/proto-medalpha) | Workspace meta repo |
| [meda-design-system](https://github.com/tini-works/meda-design-system) | Design tokens + UI components |
| [ma-admin](https://github.com/tini-works/ma-admin) | Admin web application |
| [ma-mobile](https://github.com/tini-works/ma-mobile) | Mobile application |

## Architecture

See [docs/plans/2026-01-15-polyrepo-workspace-design.md](docs/plans/2026-01-15-polyrepo-workspace-design.md) for full architecture documentation.
