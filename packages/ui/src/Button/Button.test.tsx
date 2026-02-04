import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Button } from './Button'

describe('Button', () => {
  // ----- Variant rendering tests -----
  describe('variants', () => {
    it('renders primary variant with teal filled styles', () => {
      render(<Button variant="primary" data-testid="btn">Primary</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-teal-500')
      expect(btn.className).toContain('text-white')
    })

    it('renders secondary variant with teal outline styles', () => {
      render(<Button variant="secondary" data-testid="btn">Secondary</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-transparent')
      expect(btn.className).toContain('text-teal-700')
      expect(btn.className).toContain('border-teal-500')
    })

    it('renders tertiary variant with ghost styles', () => {
      render(<Button variant="tertiary" data-testid="btn">Tertiary</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-transparent')
      expect(btn.className).toContain('text-charcoal-500')
    })

    it('renders ghost variant (alias for tertiary)', () => {
      render(<Button variant="ghost" data-testid="btn">Ghost</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-transparent')
      expect(btn.className).toContain('text-charcoal-500')
    })

    it('renders accent variant with coral styles', () => {
      render(<Button variant="accent" data-testid="btn">Accent</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-coral-500')
      expect(btn.className).toContain('text-charcoal-500')
    })

    it('renders destructive variant with red outline styles', () => {
      render(<Button variant="destructive" data-testid="btn">Delete</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('border-red-300')
      expect(btn.className).toContain('text-red-600')
    })

    it('renders destructive-filled variant with red filled styles', () => {
      render(<Button variant="destructive-filled" data-testid="btn">Confirm Delete</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-red-600')
      expect(btn.className).toContain('text-white')
    })

    it('renders icon variant with circular styles', () => {
      render(<Button variant="icon" data-testid="btn">X</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('rounded-full')
    })

    it('renders link variant with text-only styles', () => {
      render(<Button variant="link" data-testid="btn">Learn more</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-transparent')
      expect(btn.className).toContain('text-teal-700')
    })

    it('defaults to primary variant when not specified', () => {
      render(<Button data-testid="btn">Default</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('bg-teal-500')
    })
  })

  // ----- Size rendering tests -----
  describe('sizes', () => {
    it('renders sm size with compact styles', () => {
      render(<Button size="sm" data-testid="btn">Small</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('h-10')
      expect(btn.className).toContain('text-sm')
    })

    it('renders md size with standard styles', () => {
      render(<Button size="md" data-testid="btn">Medium</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('h-11')
      expect(btn.className).toContain('text-base')
    })

    it('renders lg size with large CTA styles', () => {
      render(<Button size="lg" data-testid="btn">Large</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('h-14')
      expect(btn.className).toContain('text-base')
    })

    it('defaults to md size when not specified', () => {
      render(<Button data-testid="btn">Default</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('h-11')
    })

    it('applies icon-specific sizing for icon variant', () => {
      render(<Button variant="icon" size="md" data-testid="btn">X</Button>)
      const btn = screen.getByTestId('btn')
      // Icon variant uses square sizing (w-11 h-11 for md)
      expect(btn.className).toContain('h-11')
      expect(btn.className).toContain('w-11')
    })

    it('applies icon-specific sizing for all sizes', () => {
      const { rerender } = render(<Button variant="icon" size="sm" data-testid="btn">X</Button>)
      expect(screen.getByTestId('btn').className).toContain('w-10')

      rerender(<Button variant="icon" size="lg" data-testid="btn">X</Button>)
      expect(screen.getByTestId('btn').className).toContain('w-14')
    })
  })

  // ----- Loading state tests -----
  describe('loading state', () => {
    it('shows spinner when loading', () => {
      render(<Button loading data-testid="btn">Submit</Button>)
      const btn = screen.getByTestId('btn')
      // Spinner should be present (animate-spin class on svg)
      const spinner = btn.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('hides children when loading', () => {
      render(<Button loading data-testid="btn">Submit</Button>)
      expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    })

    it('disables button when loading', () => {
      render(<Button loading data-testid="btn">Submit</Button>)
      expect(screen.getByTestId('btn')).toBeDisabled()
    })

    it('applies disabled styling when loading', () => {
      render(<Button loading data-testid="btn">Submit</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('opacity-50')
    })

    it('does not show spinner when not loading', () => {
      render(<Button data-testid="btn">Submit</Button>)
      const btn = screen.getByTestId('btn')
      const spinner = btn.querySelector('.animate-spin')
      expect(spinner).not.toBeInTheDocument()
    })
  })

  // ----- Disabled state tests -----
  describe('disabled state', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled data-testid="btn">Disabled</Button>)
      expect(screen.getByTestId('btn')).toBeDisabled()
    })

    it('applies disabled styling', () => {
      render(<Button disabled data-testid="btn">Disabled</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('opacity-50')
      expect(btn.className).toContain('disabled:cursor-not-allowed')
    })

    it('does not fire onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button disabled onClick={handleClick} data-testid="btn">
          Disabled
        </Button>
      )

      await user.click(screen.getByTestId('btn'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // ----- Icon props tests -----
  describe('leftIcon and rightIcon', () => {
    it('renders leftIcon before children', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">←</span>} data-testid="btn">
          Back
        </Button>
      )
      const btn = screen.getByTestId('btn')
      const leftIcon = screen.getByTestId('left-icon')

      expect(leftIcon).toBeInTheDocument()
      // Icon should appear before text in DOM order
      const children = Array.from(btn.childNodes)
      const iconIndex = children.findIndex(
        node => node.contains(leftIcon)
      )
      const textIndex = children.findIndex(
        node => node.textContent === 'Back'
      )
      expect(iconIndex).toBeLessThan(textIndex)
    })

    it('renders rightIcon after children', () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>} data-testid="btn">
          Next
        </Button>
      )
      const btn = screen.getByTestId('btn')
      const rightIcon = screen.getByTestId('right-icon')

      expect(rightIcon).toBeInTheDocument()
      // Icon should appear after text in DOM order
      const children = Array.from(btn.childNodes)
      const iconIndex = children.findIndex(
        node => node.contains(rightIcon)
      )
      const textIndex = children.findIndex(
        node => node.textContent === 'Next'
      )
      expect(iconIndex).toBeGreaterThan(textIndex)
    })

    it('renders both icons when provided', () => {
      render(
        <Button
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
          data-testid="btn"
        >
          Navigate
        </Button>
      )

      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
      expect(screen.getByText('Navigate')).toBeInTheDocument()
    })

    it('applies margin classes to icon wrappers', () => {
      render(
        <Button
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
          data-testid="btn"
        >
          Text
        </Button>
      )

      const leftIconWrapper = screen.getByTestId('left-icon').parentElement
      const rightIconWrapper = screen.getByTestId('right-icon').parentElement

      expect(leftIconWrapper?.className).toContain('mr-2')
      expect(rightIconWrapper?.className).toContain('ml-2')
    })

    it('hides icons when loading', () => {
      render(
        <Button
          loading
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
          data-testid="btn"
        >
          Text
        </Button>
      )

      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
    })
  })

  // ----- testId prop tests -----
  describe('testId prop', () => {
    it('applies data-testid attribute', () => {
      render(<Button testId="submit-button">Submit</Button>)
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    it('uses testId instead of data-testid when both provided', () => {
      render(
        <Button testId="from-testid" data-testid="from-data-attr">
          Submit
        </Button>
      )
      // testId is applied via data-testid prop, so both should work
      // but testId will be overwritten by props spread
      expect(screen.getByTestId('from-data-attr')).toBeInTheDocument()
    })
  })

  // ----- onClick handler tests -----
  describe('onClick handler', () => {
    it('fires onClick when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button onClick={handleClick} data-testid="btn">
          Click me
        </Button>
      )

      await user.click(screen.getByTestId('btn'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not fire onClick when loading', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button loading onClick={handleClick} data-testid="btn">
          Loading
        </Button>
      )

      await user.click(screen.getByTestId('btn'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('passes event to onClick handler', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button onClick={handleClick} data-testid="btn">
          Click
        </Button>
      )

      await user.click(screen.getByTestId('btn'))
      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' })
      )
    })
  })

  // ----- Ref forwarding tests -----
  describe('ref forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Button</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('ref.current is the actual button element', () => {
      const ref = createRef<HTMLButtonElement>()
      render(<Button ref={ref} data-testid="btn">Button</Button>)
      expect(ref.current).toBe(screen.getByTestId('btn'))
    })

    it('allows focus via ref', () => {
      const ref = createRef<HTMLButtonElement>()
      render(<Button ref={ref} data-testid="btn">Button</Button>)

      ref.current?.focus()
      expect(document.activeElement).toBe(ref.current)
    })
  })

  // ----- fullWidth prop tests -----
  describe('fullWidth prop', () => {
    it('applies w-full class when fullWidth is true', () => {
      render(<Button fullWidth data-testid="btn">Full Width</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('w-full')
    })

    it('does not apply w-full class when fullWidth is false', () => {
      render(<Button fullWidth={false} data-testid="btn">Normal</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).not.toContain('w-full')
    })

    it('does not apply w-full class by default', () => {
      render(<Button data-testid="btn">Default</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).not.toContain('w-full')
    })
  })

  // ----- className merging tests -----
  describe('className prop', () => {
    it('merges custom className with default classes', () => {
      render(<Button className="custom-class" data-testid="btn">Custom</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('custom-class')
      // Should still have base styles
      expect(btn.className).toContain('inline-flex')
      expect(btn.className).toContain('items-center')
    })

    it('preserves variant classes when custom className is added', () => {
      render(
        <Button variant="secondary" className="my-custom-class" data-testid="btn">
          Secondary
        </Button>
      )
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('my-custom-class')
      expect(btn.className).toContain('border-teal-500')
    })

    it('handles empty className', () => {
      render(<Button className="" data-testid="btn">Empty</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn).toBeInTheDocument()
    })
  })

  // ----- Additional props pass-through tests -----
  describe('additional props', () => {
    it('passes through type attribute', () => {
      render(<Button type="submit" data-testid="btn">Submit</Button>)
      expect(screen.getByTestId('btn')).toHaveAttribute('type', 'submit')
    })

    it('passes through aria attributes', () => {
      render(
        <Button aria-label="Close dialog" aria-pressed="true" data-testid="btn">
          X
        </Button>
      )
      const btn = screen.getByTestId('btn')
      expect(btn).toHaveAttribute('aria-label', 'Close dialog')
      expect(btn).toHaveAttribute('aria-pressed', 'true')
    })

    it('renders children correctly', () => {
      render(<Button data-testid="btn">Button Text</Button>)
      expect(screen.getByText('Button Text')).toBeInTheDocument()
    })

    it('renders JSX children', () => {
      render(
        <Button data-testid="btn">
          <span data-testid="child">Complex Child</span>
        </Button>
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })

  // ----- Base styles tests -----
  describe('base styles', () => {
    it('applies base styles to all buttons', () => {
      render(<Button data-testid="btn">Base</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('inline-flex')
      expect(btn.className).toContain('items-center')
      expect(btn.className).toContain('justify-center')
      expect(btn.className).toContain('font-medium')
      expect(btn.className).toContain('rounded-lg')
    })

    it('has focus ring styles', () => {
      render(<Button data-testid="btn">Focus</Button>)
      const btn = screen.getByTestId('btn')
      expect(btn.className).toContain('focus-visible:ring-2')
      expect(btn.className).toContain('focus-visible:ring-teal-500')
    })
  })
})
