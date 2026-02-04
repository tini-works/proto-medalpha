import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'generated/tailwind-preset.ts', 'generated/tokens.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
})
