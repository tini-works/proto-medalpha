/**
 * Semantic Input Tokens
 *
 * Role-scoped design tokens for form inputs.
 * Maps to @meda/tokens color palette.
 *
 * Usage in Tailwind classes:
 * - border-[var(--color-border-default)]
 * - focus:ring-[var(--color-ring-focus)]
 */

export const inputTokens = {
  // Border colors
  border: {
    default: 'var(--color-border-default, #E8E3DB)', // cream-400
    focus: 'var(--color-border-focus, #13A3B5)', // teal-500
    error: 'var(--color-border-error, #E06A4F)', // coral-600
  },

  // Focus ring colors
  ring: {
    focus: 'var(--color-ring-focus, #13A3B5)', // teal-500
    error: 'var(--color-ring-error, #E88A73)', // coral-500
  },

  // Text colors
  text: {
    label: 'var(--color-text-label, #5E7A86)', // slate-500
    placeholder: 'var(--color-text-placeholder, #7C939D)', // slate-400
    hint: 'var(--color-text-hint, #5E7A86)', // slate-500
    error: 'var(--color-text-error, #A03D2D)', // coral-800
    required: 'var(--color-text-required, #E06A4F)', // coral-600
    disabled: 'var(--color-text-disabled, #5E7A86)', // slate-500
  },

  // Background colors
  bg: {
    input: 'var(--color-bg-input, #FFFFFF)', // white
    disabled: 'var(--color-bg-disabled, #F5F3EF)', // cream-200
  },

  // Sizing
  size: {
    height: '42px',
    paddingX: '12px',
    paddingY: '10px',
    borderRadius: '8px',
    fontSize: '16px',
    ringWidth: '2px',
    ringOffset: '0px',
  },
} as const

/**
 * CSS custom properties for input tokens.
 * Import this in your global CSS or inject via style tag.
 */
export const inputTokensCSS = `
:root {
  /* Border colors */
  --color-border-default: #E8E3DB;
  --color-border-focus: #13A3B5;
  --color-border-error: #E06A4F;

  /* Focus ring colors */
  --color-ring-focus: #13A3B5;
  --color-ring-error: #E88A73;

  /* Text colors */
  --color-text-label: #5E7A86;
  --color-text-placeholder: #7C939D;
  --color-text-hint: #5E7A86;
  --color-text-error: #A03D2D;
  --color-text-required: #E06A4F;
  --color-text-disabled: #5E7A86;

  /* Background colors */
  --color-bg-input: #FFFFFF;
  --color-bg-disabled: #F5F3EF;

  /* Sizing */
  --input-height: 42px;
  --input-padding-x: 12px;
  --input-padding-y: 10px;
  --input-border-radius: 8px;
  --input-font-size: 16px;
  --input-ring-width: 2px;
  --input-ring-offset: 0px;
}
`

export type InputTokens = typeof inputTokens
