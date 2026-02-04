# Unified Input Components - Implementation Plan

**Date:** 2026-02-04
**Status:** Draft
**Owner:** TBD

---

## Executive Summary

Consolidate 15 input components into a unified system in `@meda/ui` to eliminate styling drift, improve accessibility, and reduce maintenance burden.

### Goals

1. Single source of truth for input components
2. Consistent styling via semantic tokens
3. WCAG 2.1 AA accessibility baseline
4. Backward-compatible migration path
5. Comprehensive documentation

### Non-Goals

- Theming support (single palette for all apps)
- Breaking changes to existing components
- Forced migration timeline

---

## Architecture

```
packages/ui/src/
├── tokens/
│   └── inputs.css              # Semantic CSS variables
├── primitives/
│   ├── InputBase/
│   │   ├── InputBase.tsx       # Base input with focus ring
│   │   ├── useInputBase.ts     # Shared logic hook
│   │   └── index.ts
│   ├── Label/
│   │   └── Label.tsx           # Form label with required indicator
│   ├── HelperText/
│   │   └── HelperText.tsx      # Hint text below input
│   └── ErrorText/
│       └── ErrorText.tsx       # Error message with role="alert"
├── composed/
│   ├── Field/                  # TextField (text/email/number)
│   ├── PasswordField/          # Password with toggle + strength
│   ├── Select/                 # Dropdown select
│   ├── PhoneInput/             # Country code + phone
│   ├── DateInput/              # Native date picker
│   ├── TextareaField/          # Textarea with char count
│   ├── SearchInput/            # Search with icon
│   ├── RadioGroup/             # Radio button group
│   ├── OTPInput/               # (existing, update tokens)
│   └── Switch/                 # (existing, update tokens)
└── index.ts                    # Public exports
```

---

## Phase 1: Foundation

**Duration:** 1-2 weeks
**Risk:** None (additive only)
**Merge conflicts:** None

### Task 1.1: Semantic Tokens

Create `packages/ui/src/tokens/inputs.css`:

```css
:root {
  /* Borders */
  --color-border-default: theme('colors.cream.400');
  --color-border-focus: theme('colors.teal.500');
  --color-border-error: theme('colors.coral.600');

  /* Focus rings */
  --color-ring-focus: theme('colors.teal.500');
  --color-ring-error: theme('colors.coral.500');

  /* Text */
  --color-text-label: theme('colors.slate.700');
  --color-text-placeholder: theme('colors.slate.400');
  --color-text-hint: theme('colors.slate.500');
  --color-text-error: theme('colors.coral.800');
  --color-text-required: theme('colors.coral.600');

  /* Backgrounds */
  --color-bg-input: theme('colors.white');
  --color-bg-input-disabled: theme('colors.cream.200');

  /* Sizing */
  --input-height: 42px;
  --input-padding-x: 12px;
  --input-padding-y: 10px;
  --input-border-radius: 8px;
  --input-font-size: 16px;

  /* Focus ring */
  --input-ring-width: 2px;
  --input-ring-offset: 0px;
}
```

**Acceptance criteria:**
- [ ] Tokens defined in CSS variables
- [ ] Tokens documented in Storybook
- [ ] No changes to existing components

### Task 1.2: InputBase Primitive

Create `packages/ui/src/primitives/InputBase/InputBase.tsx`:

```typescript
import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  ({ hasError = false, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full h-[var(--input-height)]
          px-[var(--input-padding-x)] py-[var(--input-padding-y)]
          text-[var(--input-font-size)] leading-normal
          rounded-[var(--input-border-radius)]
          border bg-[var(--color-bg-input)]
          placeholder:text-[var(--color-text-placeholder)]
          disabled:bg-[var(--color-bg-input-disabled)]
          disabled:text-slate-500 disabled:cursor-not-allowed
          focus:outline-none focus:ring-[var(--input-ring-width)]
          focus:border-transparent
          transition-colors
          ${hasError
            ? 'border-[var(--color-border-error)] focus:ring-[var(--color-ring-error)]'
            : 'border-[var(--color-border-default)] focus:ring-[var(--color-ring-focus)]'
          }
          ${className}
        `}
        aria-invalid={hasError || undefined}
        {...props}
      />
    )
  }
)

InputBase.displayName = 'InputBase'
```

**Acceptance criteria:**
- [ ] InputBase renders with semantic token styling
- [ ] Supports `hasError` prop for error state
- [ ] Forwards ref correctly
- [ ] Unit tests pass
- [ ] Storybook story exists

### Task 1.3: Label Primitive

Create `packages/ui/src/primitives/Label/Label.tsx`:

```typescript
import { type LabelHTMLAttributes } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`
        block text-sm font-medium
        text-[var(--color-text-label)]
        ${className}
      `}
      {...props}
    >
      {children}
      {required && (
        <span className="text-[var(--color-text-required)] ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}
```

### Task 1.4: HelperText & ErrorText Primitives

```typescript
// HelperText.tsx
export function HelperText({ children, id, className = '' }: HelperTextProps) {
  return (
    <p id={id} className={`text-sm text-[var(--color-text-hint)] ${className}`}>
      {children}
    </p>
  )
}

// ErrorText.tsx
export function ErrorText({ children, id, className = '' }: ErrorTextProps) {
  return (
    <p
      id={id}
      role="alert"
      className={`text-sm text-[var(--color-text-error)] ${className}`}
    >
      {children}
    </p>
  )
}
```

### Task 1.5: Storybook Setup

Create stories for each primitive:
- `InputBase.stories.tsx`
- `InputBase.mdx` (usage docs)
- `Label.stories.tsx`
- `HelperText.stories.tsx`
- `ErrorText.stories.tsx`

**Acceptance criteria:**
- [ ] All primitives have stories
- [ ] MDX docs explain usage patterns
- [ ] Accessibility panel shows no violations

---

## Phase 2: Composed Components

**Duration:** 2-3 weeks
**Risk:** Low (additive only)
**Merge conflicts:** None

### Task 2.1: Field (TextField)

Create `packages/ui/src/composed/Field/Field.tsx`:

```typescript
import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { InputBase } from '../../primitives/InputBase'
import { Label } from '../../primitives/Label'
import { HelperText } from '../../primitives/HelperText'
import { ErrorText } from '../../primitives/ErrorText'

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, id, required, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    const describedBy = [
      error ? errorId : null,
      hint && !error ? hintId : null,
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className="space-y-1">
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <InputBase
          ref={ref}
          id={inputId}
          required={required}
          hasError={!!error}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          {...props}
        />
        {error && <ErrorText id={errorId}>{error}</ErrorText>}
        {hint && !error && <HelperText id={hintId}>{hint}</HelperText>}
      </div>
    )
  }
)

Field.displayName = 'Field'
```

**Acceptance criteria:**
- [ ] Props match existing Field interface
- [ ] aria-describedby links error/hint
- [ ] role="alert" on error message
- [ ] Unit tests for all states
- [ ] Integration test for form submission
- [ ] Storybook story + MDX docs

### Task 2.2: PasswordField

Migrate from `docliQ-mobile/src/components/forms/PasswordField.tsx` to `@meda/ui`.

Additions:
- Use InputBase primitive
- Use semantic tokens
- Add aria-describedby for strength indicator
- Keep showStrengthIndicator, showRequirements props

### Task 2.3: Select

Migrate from `docliQ-mobile/src/components/forms/Select.tsx`.

Additions:
- Create SelectBase primitive (optional)
- Use semantic tokens
- Add aria-describedby

### Task 2.4: PhoneInput

Migrate from `docliQ-mobile/src/components/forms/PhoneInput.tsx`.

Additions:
- Use InputBase for phone number field
- Use semantic tokens
- Improve a11y for country selector

### Task 2.5: DateInput

Migrate from `docliQ-mobile/src/components/forms/DateInput.tsx`.

Additions:
- Use InputBase
- Use semantic tokens

### Task 2.6: TextareaField

Migrate from `docliQ-mobile/src/components/forms/ReasonTextarea.tsx`.

Additions:
- Create TextareaBase primitive
- Use semantic tokens
- Add aria-describedby for character count

### Task 2.7: SearchInput

Migrate from `docliQ-mobile/src/components/forms/SpecialtySearchInput.tsx`.

Additions:
- Use InputBase
- Add required aria-label prop
- Use semantic tokens

### Task 2.8: RadioGroup

Migrate from `docliQ-mobile/src/components/forms/RadioGroup.tsx`.

Additions:
- Use semantic tokens
- Ensure proper fieldset/legend structure

### Task 2.9: Update OTPInput & Switch

Update existing components to use semantic tokens:
- Replace `neutral-*` with token variables
- Replace `primary-*` with token variables
- Replace `error-*` with token variables

---

## Phase 3: Migration

**Duration:** Ongoing
**Risk:** Low (one screen at a time)
**Merge conflicts:** Minimal (small PRs)

### Migration Order (Simplest First)

| Order | Screen | Components | Complexity |
|-------|--------|------------|------------|
| 1 | ForgotPasswordScreen | 1 Field | Trivial |
| 2 | DeleteEmailConfirmScreen | 1 Field | Trivial |
| 3 | SignInScreen | 1 Field, 1 PasswordField | Low |
| 4 | ResetPasswordScreen | 2 PasswordField | Low |
| 5 | RegisterScreen | 2 Field, 2 PasswordField | Medium |
| 6 | ChangePasswordScreen | 3 PasswordField | Medium |
| 7 | EditProfileScreen | Multiple mixed | Medium |
| 8 | ProfileCompletionScreen | Multiple mixed | Medium |
| 9 | AddFamilyMemberSheet | Multiple mixed | High |
| 10 | ... remaining screens | ... | ... |

### Migration Steps Per Screen

```bash
# 1. Create migration branch
git checkout -b migrate/forgot-password-screen

# 2. Update imports
# Before:
import { Field } from '../../components/forms'

# After:
import { Field } from '@meda/ui'

# 3. Verify no prop changes needed (same interface)

# 4. Run tests
pnpm --filter docliQ-mobile test ForgotPasswordScreen

# 5. Visual check in dev
pnpm dev:docliQ

# 6. Commit and PR
git commit -m "refactor(docliQ): migrate ForgotPasswordScreen to @meda/ui Field"
```

### Deprecation Warnings

Add to old components in `docliQ-mobile/src/components/forms/`:

```typescript
// Field.tsx
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[Deprecated] Field from components/forms is deprecated. ' +
    'Use Field from @meda/ui instead. ' +
    'See: docs/docliQ/unified-inputs-plan.md'
  )
}
```

### Tracking Migration Progress

Create `docs/docliQ/migration-status.md`:

```markdown
# Input Migration Status

| Component | @meda/ui Ready | Screens Migrated | Old Component Removed |
|-----------|----------------|------------------|----------------------|
| Field | [ ] | 0/8 | [ ] |
| PasswordField | [ ] | 0/6 | [ ] |
| Select | [ ] | 0/5 | [ ] |
| PhoneInput | [ ] | 0/3 | [ ] |
| DateInput | [ ] | 0/4 | [ ] |
| TextareaField | [ ] | 0/2 | [ ] |
| SearchInput | [ ] | 0/1 | [ ] |
| RadioGroup | [ ] | 0/3 | [ ] |

Last updated: YYYY-MM-DD
```

---

## Testing Strategy

### Unit Tests (Per Component)

Location: `packages/ui/src/[Component]/__tests__/[Component].test.tsx`

```typescript
describe('Field', () => {
  it('renders label and input', () => {})
  it('shows required indicator when required', () => {})
  it('shows error message with role="alert"', () => {})
  it('shows hint when no error', () => {})
  it('links aria-describedby to error', () => {})
  it('links aria-describedby to hint', () => {})
  it('forwards ref to input', () => {})
  it('applies hasError styling on error', () => {})
  it('disables input when disabled', () => {})
})
```

### Integration Tests

Location: `packages/ui/src/__tests__/integration/`

```typescript
describe('Form with unified inputs', () => {
  it('validates and shows errors on submit', () => {})
  it('clears errors when user types', () => {})
  it('submits successfully with valid data', () => {})
  it('announces errors to screen readers', () => {})
})
```

### Visual Regression (Optional)

- Chromatic integration with Storybook
- Snapshot tests for each component state

---

## Documentation

### Storybook Structure

```
packages/ui/.storybook/
├── main.ts
└── preview.ts

packages/ui/src/
├── primitives/
│   └── InputBase/
│       ├── InputBase.stories.tsx
│       └── InputBase.mdx
├── composed/
│   └── Field/
│       ├── Field.stories.tsx
│       └── Field.mdx
└── docs/
    ├── GettingStarted.mdx
    ├── Migration.mdx
    └── Accessibility.mdx
```

### MDX Template

```mdx
# Field

Text input with label, error, and hint support.

## Usage

\`\`\`tsx
import { Field } from '@meda/ui'

<Field
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | required | Label text |
| error | string | - | Error message |
| hint | string | - | Helper text |
| required | boolean | false | Show required indicator |

## Accessibility

- Label associated via `htmlFor`
- Error linked via `aria-describedby`
- Error announced with `role="alert"`
- Required indicated with `aria-required`

## Migration

Replace imports:

\`\`\`diff
- import { Field } from '../../components/forms'
+ import { Field } from '@meda/ui'
\`\`\`

No prop changes required.
```

---

## Success Criteria

### Phase 1 Complete When:

- [ ] Semantic tokens defined and documented
- [ ] All 4 primitives implemented with tests
- [ ] Storybook stories for all primitives
- [ ] No changes to existing app code

### Phase 2 Complete When:

- [ ] All 10 composed components in @meda/ui
- [ ] Props match existing interfaces
- [ ] Full test coverage (unit + integration)
- [ ] Storybook stories + MDX docs
- [ ] Accessibility audit passes

### Phase 3 Complete When:

- [ ] All screens migrated to @meda/ui imports
- [ ] Old components have deprecation warnings
- [ ] Migration status doc shows 100%
- [ ] Old components can be safely removed

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Props mismatch | Low | Medium | New components accept superset of old props |
| Styling differences | Medium | Low | Visual regression tests, design review |
| Merge conflicts | Low | Low | Small PRs, one screen at a time |
| Team adoption | Medium | Medium | Clear docs, deprecation warnings |
| Performance regression | Low | Low | Bundle size monitoring |

---

## Timeline Estimate

| Phase | Duration | Parallel Work OK? |
|-------|----------|-------------------|
| Phase 1: Foundation | 1-2 weeks | Yes |
| Phase 2: Composed | 2-3 weeks | Yes |
| Phase 3: Migration | Ongoing | Yes (per screen) |

**Total to production-ready @meda/ui:** 3-5 weeks
**Total to full migration:** Depends on team velocity, no deadline required

---

## Appendix: File Checklist

### Phase 1 Files

- [ ] `packages/ui/src/tokens/inputs.css`
- [ ] `packages/ui/src/primitives/InputBase/InputBase.tsx`
- [ ] `packages/ui/src/primitives/InputBase/index.ts`
- [ ] `packages/ui/src/primitives/InputBase/__tests__/InputBase.test.tsx`
- [ ] `packages/ui/src/primitives/InputBase/InputBase.stories.tsx`
- [ ] `packages/ui/src/primitives/Label/Label.tsx`
- [ ] `packages/ui/src/primitives/Label/index.ts`
- [ ] `packages/ui/src/primitives/HelperText/HelperText.tsx`
- [ ] `packages/ui/src/primitives/HelperText/index.ts`
- [ ] `packages/ui/src/primitives/ErrorText/ErrorText.tsx`
- [ ] `packages/ui/src/primitives/ErrorText/index.ts`

### Phase 2 Files

- [ ] `packages/ui/src/composed/Field/Field.tsx`
- [ ] `packages/ui/src/composed/Field/__tests__/Field.test.tsx`
- [ ] `packages/ui/src/composed/Field/Field.stories.tsx`
- [ ] `packages/ui/src/composed/Field/Field.mdx`
- [ ] ... (repeat for each composed component)

### Phase 3 Files

- [ ] `docs/docliQ/migration-status.md`
- [ ] Deprecation warnings in old components
