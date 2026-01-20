# Changelog

All notable changes to this workspace will be documented in this file.

## [2026-01-20]

### Changed
- **Design tokens**: Updated the canonical token sources to the “Modern Healthcare SaaS” palette and typography (brand blue/teal/mint scales, refreshed neutrals, Google Sans stack, KPI sizing/line-heights).
- **MedAlpha brief docs**: Expanded the Design page to showcase the full token color scales, and moved the feature matrix content from `index.html` into `product.html` for clearer information architecture.
- **Mobile demo**: Simplified the Expo app landing UI to a minimal “Home” placeholder.

## [2026-01-16]

### Added
- **Product documentation**: Added comprehensive product context documentation
  - Product vision and positioning for MedAlpha Connect healthcare app
  - User segment analysis and pain points
  - Feature overview and partner integrations
  - Multi-language support strategy (German-first, 14+ languages)
- **Copy guidelines**: Added copy and tone guidelines for healthcare app
  - Tone rules (professional, clear, accessible)
  - Language-specific guidance for German and English
  - Content patterns and examples for healthcare communications
  - Accessibility and inclusivity guidelines for copy

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
