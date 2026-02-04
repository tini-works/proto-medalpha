/**
 * Declaration for @meda/tokens/tailwind so tailwind.config.ts type-checks.
 * The package exports types from dist/generated/tailwind-preset.d.ts;
 * this fallback avoids resolution issues when that build artifact is missing.
 */
declare module '@meda/tokens/tailwind' {
  import type { Config } from 'tailwindcss'
  export const medaPreset: Config
}
