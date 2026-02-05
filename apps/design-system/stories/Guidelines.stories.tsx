import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Guidelines/Visual Guidelines',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Visual Guideline - Main
export const VisualGuideline: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-8 text-neutral-800">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">
          DocliQ – Visual Guideline (Brand Guide 2025)
        </h1>
        <p className="text-neutral-600 mt-2">
          Strict visual system for DocliQ-aligned UI in this repo (incl. Booking N3).
        </p>
      </header>

      <section className="p-4 bg-brand-blue-50 border border-brand-blue-200 rounded-lg">
        <h3 className="font-semibold text-brand-blue-800">Sources of Truth</h3>
        <ul className="mt-2 text-sm text-brand-blue-700 list-disc list-inside">
          <li>Brand PDF: <code>docs/z.guidelines/Docliq Brand Guide 2025.pdf</code></li>
          <li>Tokens: <code>docs/z.guidelines/docliq-tokens.json</code></li>
          <li>Implementation: <code>apps/appointment-booking-N3/src/index.css</code></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">
          Design Intent (Non-Negotiable)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h4 className="font-semibold">Trust, Efficiency, Humanity</h4>
            <p className="text-sm text-neutral-600 mt-1">
              Professional healthcare tone; calm, not "startup flashy".
            </p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h4 className="font-semibold">Mobile-First</h4>
            <p className="text-sm text-neutral-600 mt-1">
              Single-column, one primary action per screen, predictable navigation.
            </p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h4 className="font-semibold">Germany + i18n-First</h4>
            <p className="text-sm text-neutral-600 mt-1">
              Support long German strings; avoid truncation; avoid idioms.
            </p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h4 className="font-semibold">White-Label Ready</h4>
            <p className="text-sm text-neutral-600 mt-1">
              Use semantic tokens (roles), not hard-coded colors.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">
          Color (Semantic Tokens Only)
        </h2>
        <p className="text-neutral-600 mb-4">
          Do not invent palettes. Use <code>docliq-tokens.json → color.semantic.*</code>
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">Core Surfaces</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="h-16 rounded-lg border" style={{ backgroundColor: '#FAF8F5' }} />
            <p className="text-xs mt-1 font-medium">background.primary</p>
            <p className="text-xs text-neutral-500">#FAF8F5 (Cream 100)</p>
          </div>
          <div>
            <div className="h-16 rounded-lg border" style={{ backgroundColor: '#FFFFFF' }} />
            <p className="text-xs mt-1 font-medium">background.secondary</p>
            <p className="text-xs text-neutral-500">#FFFFFF</p>
          </div>
          <div>
            <div className="h-16 rounded-lg border" style={{ backgroundColor: '#F5F3EF' }} />
            <p className="text-xs mt-1 font-medium">background.tertiary</p>
            <p className="text-xs text-neutral-500">#F5F3EF (Cream 200)</p>
          </div>
          <div>
            <div className="h-16 rounded-lg border" style={{ backgroundColor: '#1C2A30' }} />
            <p className="text-xs mt-1 font-medium">background.inverse</p>
            <p className="text-xs text-neutral-500">#1C2A30 (Charcoal 500)</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Primary Action</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="h-16 rounded-lg" style={{ backgroundColor: '#13A3B5' }} />
            <p className="text-xs mt-1 font-medium">interactive.primary</p>
            <p className="text-xs text-neutral-500">#13A3B5 (Teal 500)</p>
          </div>
          <div>
            <div className="h-16 rounded-lg" style={{ backgroundColor: '#0F8A99' }} />
            <p className="text-xs mt-1 font-medium">interactive.primaryHover</p>
            <p className="text-xs text-neutral-500">#0F8A99 (Teal 600)</p>
          </div>
          <div>
            <div className="h-16 rounded-lg" style={{ backgroundColor: '#0B6F7C' }} />
            <p className="text-xs mt-1 font-medium">interactive.primaryActive</p>
            <p className="text-xs text-neutral-500">#0B6F7C (Teal 700)</p>
          </div>
          <div>
            <div className="h-16 rounded-lg border flex items-center justify-center" style={{ backgroundColor: '#13A3B5' }}>
              <span className="text-white text-sm font-medium">text.onBrand</span>
            </div>
            <p className="text-xs mt-1 font-medium">Text on primary</p>
            <p className="text-xs text-neutral-500">#FFFFFF</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Text</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium" style={{ color: '#1C2A30' }}>text.primary</span>
            <code className="text-xs bg-neutral-100 px-2 py-1 rounded">#1C2A30</code>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg" style={{ color: '#5E7A86' }}>text.secondary</span>
            <code className="text-xs bg-neutral-100 px-2 py-1 rounded">#5E7A86</code>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg" style={{ color: '#7C939D' }}>text.tertiary (large text only)</span>
            <code className="text-xs bg-neutral-100 px-2 py-1 rounded">#7C939D</code>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg underline" style={{ color: '#0F8A99' }}>text.link</span>
            <code className="text-xs bg-neutral-100 px-2 py-1 rounded">#0F8A99</code>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Status (Never Color-Only)</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border" style={{ backgroundColor: '#E8F6F8', borderColor: '#13A3B5' }}>
            <span style={{ color: '#0B6F7C' }}>✓ Success: Teal-based</span>
          </div>
          <div className="p-3 rounded-lg border" style={{ backgroundColor: '#FDF3F0', borderColor: '#E06A4F' }}>
            <span style={{ color: '#A03D2D' }}>✕ Error: Coral-based</span>
          </div>
          <div className="p-3 rounded-lg border" style={{ backgroundColor: '#FAE0D9', borderColor: '#E88A73' }}>
            <span style={{ color: '#C9503A' }}>⚠ Warning: Coral-based</span>
          </div>
          <div className="p-3 rounded-lg border" style={{ backgroundColor: '#EEF1F3', borderColor: '#5E7A86' }}>
            <span style={{ color: '#3E5159' }}>ℹ Info: Slate-based</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">Typography (DM Sans)</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-500">Font Family</p>
            <p className="text-xl font-medium">DM Sans with system fallbacks</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500">Default Body</p>
              <p className="text-base">16px, line-height 1.5</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500">Labels/Navigation</p>
              <p className="text-base font-medium">Weight 500</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500">Headlines</p>
              <p className="text-xl font-bold leading-tight">Weight 600–700, tight line-height</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-500">Overlines</p>
              <p className="text-xs uppercase tracking-wider">Uppercase, wider tracking</p>
            </div>
          </div>
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-700">
              <strong>Rules:</strong> No fixed-height text containers. Prefer wrapping; allow hyphenation where appropriate (de-DE).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">Layout, Spacing & Density</h2>
        <p className="text-neutral-600 mb-4">Use <code>spacing.*</code> (4px base)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg text-center">
            <p className="text-2xl font-bold">16–24px</p>
            <p className="text-sm text-neutral-500">Page padding</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg text-center">
            <p className="text-2xl font-bold">20–24px</p>
            <p className="text-sm text-neutral-500">Card padding</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg text-center">
            <p className="text-2xl font-bold">24–32px</p>
            <p className="text-sm text-neutral-500">Section gaps</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg text-center">
            <p className="text-2xl font-bold">44px</p>
            <p className="text-sm text-neutral-500">Min tap target</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">Radius & Elevation</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Radius</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-200 rounded" style={{ borderRadius: '8px' }} />
                <span className="text-sm">radius.md (8px) - Buttons/inputs/cards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-200" style={{ borderRadius: '12px' }} />
                <span className="text-sm">radius.lg (12px) - Cards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-200" style={{ borderRadius: '16px' }} />
                <span className="text-sm">radius.xl (16px) - Modals/large surfaces</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Shadows</h4>
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg shadow-sm">shadow.sm</div>
              <div className="p-4 bg-white rounded-lg shadow-md">shadow.md</div>
              <p className="text-sm text-neutral-500">Avoid heavy elevation except dialogs</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">Motion</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg text-center">
            <p className="text-2xl font-bold">150ms</p>
            <p className="text-sm text-neutral-500">Micro interactions</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg text-center">
            <p className="text-2xl font-bold">200ms</p>
            <p className="text-sm text-neutral-500">Default transitions</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg text-center">
            <p className="text-2xl font-bold">300ms</p>
            <p className="text-sm text-neutral-500">Page/sheet transitions</p>
          </div>
        </div>
        <p className="text-sm text-neutral-500 mt-3">Always respect <code>prefers-reduced-motion</code></p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">Content & Tone</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-success-600">✓</span>
            <span>Prefer German, formal "Sie" for production strings</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-success-600">✓</span>
            <span>Short, direct, reassuring</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-error-600">✕</span>
            <span>No exclamation marks</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-error-600">✕</span>
            <span>No marketing claims</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-error-600">✕</span>
            <span>Avoid diagnostic language; describe actions and next steps</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-error-700 border-b border-error-200 pb-2 mb-4">Avoid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700">
            Arbitrary blues/greens that don't map to DocliQ tokens
          </div>
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700">
            Decorative gradients, glassmorphism, fintech "shine"
          </div>
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700">
            Dense dashboards on mobile
          </div>
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700">
            Too many CTAs per screen
          </div>
        </div>
      </section>
    </div>
  ),
}

// Abstract Guidelines
export const AbstractGuidelines: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-8 text-neutral-800">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Visual Guidelines – Abstract</h1>
        <p className="text-neutral-600 mt-2">
          Cross-cutting design constraints for Germany, i18n, mobile-first, and white-label.
        </p>
      </header>

      {/* German Market */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">
          1. German Market Considerations
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Cultural & Regulatory Sensibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium">Tone</h4>
                <ul className="mt-2 text-sm text-neutral-600 list-disc list-inside">
                  <li>More formal, less "friendly SaaS"</li>
                  <li>Reduce playful microcopy</li>
                  <li>Prefer neutral, factual phrasing</li>
                </ul>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium">Trust Signals</h4>
                <ul className="mt-2 text-sm text-neutral-600 list-disc list-inside">
                  <li>Trust signals matter more than delight</li>
                  <li>Clear provenance of data</li>
                  <li>Explicit labelling of metrics, sources, timeframes</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Visual Implications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                <h4 className="font-medium text-error-700">Lower Tolerance For</h4>
                <ul className="mt-2 text-sm text-error-600 list-disc list-inside">
                  <li>Excessive gradients</li>
                  <li>Decorative imagery without function</li>
                </ul>
              </div>
              <div className="p-4 bg-success-50 border border-success-500 rounded-lg">
                <h4 className="font-medium text-success-700">Higher Tolerance For</h4>
                <ul className="mt-2 text-sm text-success-600 list-disc list-inside">
                  <li>Structured layouts</li>
                  <li>Clear grouping</li>
                  <li>Slightly denser information (if logical)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Numbers & Formatting</h3>
            <div className="p-4 bg-brand-blue-50 border border-brand-blue-200 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Decimal</p>
                  <p className="font-mono font-medium">8,65 %</p>
                </div>
                <div>
                  <p className="text-neutral-500">Thousands</p>
                  <p className="font-mono font-medium">1.000.000 €</p>
                </div>
                <div>
                  <p className="text-neutral-500">Currency</p>
                  <p className="font-mono font-medium">Always explicit</p>
                </div>
                <div>
                  <p className="text-neutral-500">Date</p>
                  <p className="font-mono font-medium">DD.MM.YYYY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* i18n */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">
          2. Multi-Language Support (i18n-First)
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-coral-50 border border-coral-200 rounded-lg">
            <h4 className="font-semibold text-coral-800">Layout Resilience</h4>
            <p className="text-sm text-coral-700 mt-1">
              All components must assume <strong>30–40% text expansion</strong>. German strings will break tight layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium">Typography Strategy</h4>
              <ul className="mt-2 text-sm text-neutral-600 list-disc list-inside">
                <li>Full Latin Extended support</li>
                <li>Clear numerals and diacritics</li>
                <li>Numbers must not shrink</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium">UI Copy Rules</h4>
              <ul className="mt-2 text-sm text-neutral-600 list-disc list-inside">
                <li>Prefer nouns over verbs in labels</li>
                <li>Avoid idioms, metaphors</li>
                <li>No text baked into charts/images</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">
          3. Mobile-First Adaptation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Information Architecture</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Reframe dashboards as <strong>stacked insight modules</strong></li>
              <li>• One primary insight per screen</li>
              <li>• Secondary metrics behind taps</li>
              <li>• Mobile is for <strong>decisions</strong>, not audits</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Visualization</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-success-600">✓</span>
                <span className="text-sm">Spark lines, mini bar charts, delta indicators</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-error-600">✕</span>
                <span className="text-sm">Multi-axis charts, dense legends</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-error-600">✕</span>
                <span className="text-sm">Hover-dependent interactions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-brand-teal-50 border border-brand-teal-200 rounded-lg">
          <h4 className="font-semibold text-brand-teal-800">Touch Ergonomics</h4>
          <ul className="mt-2 text-sm text-brand-teal-700 list-disc list-inside">
            <li>Larger tap targets (44px minimum)</li>
            <li>Clear separation between scroll and tap zones</li>
            <li>No hidden gestures without visual cues</li>
          </ul>
        </div>
      </section>

      {/* White-Label */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">
          4. White-Label Requirements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-success-50 border border-success-500 rounded-lg">
            <h4 className="font-semibold text-success-700">Can Be Themed</h4>
            <ul className="mt-2 text-sm text-success-600 list-disc list-inside">
              <li>Primary and accent colours</li>
              <li>Logo placement</li>
              <li>Header treatment</li>
              <li>Card radius and surface tone</li>
              <li>Chart highlight colour</li>
            </ul>
          </div>
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <h4 className="font-semibold text-error-700">Must Remain Fixed</h4>
            <ul className="mt-2 text-sm text-error-600 list-disc list-inside">
              <li>Information hierarchy</li>
              <li>Accessibility contrast ratios</li>
              <li>Data semantics (positive/neutral/negative)</li>
              <li>Interaction patterns</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-neutral-100 rounded-lg">
          <h4 className="font-semibold">Visual Neutrality</h4>
          <p className="text-sm text-neutral-600 mt-1">
            Default theme should be conservative, non-opinionated, slightly "boring" in the best sense.
            Avoid strong brand personality leaking into structure.
          </p>
        </div>
      </section>

      {/* Healthcare Context */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 border-b pb-2 mb-4">
          5. Healthcare Context
        </h2>

        <div className="space-y-3">
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-error-700">
              <strong>Never</strong> imply causality where there is correlation
            </p>
          </div>
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-error-700">
              <strong>Avoid</strong> visual language that feels diagnostic or prescriptive
            </p>
          </div>
          <div className="p-4 bg-success-50 border border-success-500 rounded-lg">
            <p className="text-success-700">
              <strong>Data clarity beats visual flair every time</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Design North Star */}
      <section className="p-6 bg-brand-blue-50 border border-brand-blue-200 rounded-xl">
        <h2 className="text-xl font-bold text-brand-blue-900 mb-3">Design North Star</h2>
        <blockquote className="text-lg text-brand-blue-800 italic">
          "A configurable, regulation-aware healthcare analytics system that remains calm, precise,
          and legible across languages, brands, and devices."
        </blockquote>
      </section>
    </div>
  ),
}

// Component Rules
export const ComponentRules: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-8 text-neutral-800">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Component Rules (Booking N3)</h1>
        <p className="text-neutral-600 mt-2">Specific rules for UI components in the booking flow.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 bg-white border rounded-xl">
          <h3 className="text-lg font-bold mb-4">Primary CTA</h3>
          <div className="flex gap-4 mb-4">
            <button className="px-6 py-3 rounded-lg text-white" style={{ backgroundColor: '#13A3B5' }}>
              Primary Button
            </button>
            <button className="px-6 py-3 rounded-lg bg-neutral-100 text-neutral-400" disabled>
              Disabled State
            </button>
          </div>
          <p className="text-sm text-neutral-600">
            Teal background + white label. Disabled uses neutral surface + muted text (not "ghost teal").
          </p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h3 className="text-lg font-bold mb-4">Secondary CTA</h3>
          <div className="flex gap-4 mb-4">
            <button className="px-6 py-3 rounded-lg bg-white border border-neutral-300 text-neutral-700">
              Secondary Button
            </button>
          </div>
          <p className="text-sm text-neutral-600">
            Neutral surface with border. Avoid competing accents.
          </p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h3 className="text-lg font-bold mb-4">Forms</h3>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 border rounded-lg text-base"
                placeholder="you@example.com"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">With Error</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-error-500 rounded-lg text-base"
                defaultValue="Invalid input"
                style={{ fontSize: '16px' }}
              />
              <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                <span>⚠</span> Please enter a valid value
              </p>
            </div>
          </div>
          <p className="text-sm text-neutral-600">
            16px inputs (avoid iOS zoom). Clear error text with icon + message (not color-only).
          </p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h3 className="text-lg font-bold mb-4">Headers</h3>
          <p className="text-sm text-neutral-600">
            Sticky only when needed. Keep titles short. Provide back affordance.
          </p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h3 className="text-lg font-bold mb-4">Bottom Navigation</h3>
          <p className="text-sm text-neutral-600">
            Calm, neutral. Active state can use stronger text/underline, not aggressive brand blocks.
          </p>
        </div>

        <div className="p-6 bg-white border rounded-xl">
          <h3 className="text-lg font-bold mb-4">Bottom Sheets / Modals</h3>
          <div className="relative h-32 bg-neutral-100 rounded-lg overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-lg">
              <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
              <p className="text-center text-sm">Modal content here</p>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mt-4">
            Rounded top (radius.lg/xl), dim overlay, close button with 44px target.
          </p>
        </div>
      </div>
    </div>
  ),
}
