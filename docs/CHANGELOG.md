# Changelog

All notable changes to this workspace will be documented in this file.

## [2026-01-15]

### Added
- **Workspace foundation**: Initialized polyrepo workspace structure with shared infrastructure configurations
  - TypeScript base configuration (`infra/tsconfig/base.json`)
  - ESLint base configuration (`infra/eslint/base.js`)
  - Prettier configuration (`infra/prettier/.prettierrc`)
- **Team onboarding automation**: Added `clone-workspace.sh` script to automate cloning all child repositories and setting up local development links
- **Batch operations**: Added `push-all.sh` script to push changes across all child repositories in a single command
- **Workspace documentation**: Created comprehensive README with quick start guide, daily workflow commands, and repository structure overview

### Changed
- Updated organization references to `tini-works` across repository URLs and documentation
