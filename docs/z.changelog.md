# Changelog

All notable changes to this workspace will be documented in this file.

## [2026-01-21]

### Changed
- **Design tokens**: Updated color palette and typography scales to align with updated token system
  - Expanded color scales with full 50-900 ranges for brand-blue and brand-teal
  - Enhanced typography with KPI font size and specialized line heights
- **Configuration**: Updated `.gitignore` to use `docs/_ngan/` path pattern for personal documentation folders

### Merged
- **Branch integration**: Merged changes from `origin/lia-explore` branch
  - Preserved all existing documentation files (47 files) during merge
  - Integrated token updates while maintaining existing codebase structure

## [2026-01-15]

### Added
- **Monorepo migration**: Migrated from polyrepo to single pnpm workspaces monorepo structure
  - Consolidated all packages and apps into unified repository structure
  - Created `packages/` directory for shared libraries (@meda/tokens, @meda/ui)
  - Created `apps/` directory for deployable applications (admin, mobile, design-system)
  - Set up pnpm workspaces for automatic dependency linking
  - Added shared TypeScript, ESLint, and Prettier configurations at root
- **Monorepo infrastructure**: Root-level configuration files for unified development experience
  - `pnpm-workspace.yaml` for workspace package discovery
  - `tsconfig.base.json` for shared TypeScript compiler settings
  - `.eslintrc.js` and `.prettierrc` for consistent code formatting
- **Monorepo documentation**: Updated README with monorepo structure, development commands, and package descriptions

### Changed
- **Architecture**: Restructured entire workspace from polyrepo to monorepo pattern
  - All package.json files updated to use `workspace:*` dependencies
  - Removed linking scripts (replaced by pnpm workspace automatic linking)
  - Removed separate infrastructure directory (configs now at root)
- **Build system**: Unified build commands via root package.json scripts
  - `pnpm build:packages` to build all shared packages
  - `pnpm dev:*` commands for running individual apps
- **Documentation**: Updated README with Tech Stack section and License information

### Removed
- **Linking scripts**: Removed `dev-link.sh`, `clone-workspace.sh`, and `push-all.sh` (no longer needed with workspaces)
- **Infrastructure directory**: Moved shared configs from `infra/` to root level
- **Separate git repositories**: Consolidated into single monorepo with fresh git history
