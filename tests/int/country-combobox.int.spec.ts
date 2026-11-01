import { act, createElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { CountryCombobox } from '@/components/forms/CountryCombobox'
import type { CountryOption } from '@/data/countries'

const countries: CountryOption[] = [
  { code: 'AU', name: 'Australia' },
  { code: 'CI', name: 'Côte d’Ivoire' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
]
const renderings = new Set<{ unmount: () => void }>()
const reactTestEnvironment = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
const previousActEnvironment = reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT
beforeAll(() => { reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true })
afterAll(() => { reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment })

function render(element: ReactNode) {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const view = {
    container,
    rerender(next: ReactNode) { act(() => { root.render(next) }) },
    unmount() {
      act(() => { root.unmount() })
      container.remove()
      renderings.delete(view)
    },
  }
  renderings.add(view)
  view.rerender(element)
  return view
}

afterEach(() => { for (const view of renderings) view.unmount() })

function show(props: Partial<Parameters<typeof CountryCombobox>[0]> = {}) {
  return createElement('form', null,
    createElement('label', { htmlFor: 'country' }, 'Country'),
    createElement(CountryCombobox, { countries, id: 'country', name: 'country', className: 'min-h-11 border bg-bg', ...props }),
    createElement('button', { type: 'button', id: 'outside' }, 'Outside'),
  )
}
const input = () => document.querySelector<HTMLInputElement>('[role="combobox"]')!
const options = () => Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'))
const optionNames = () => options().map((option) => option.textContent)
const focus = () => act(() => { input().focus() })
function type(value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
  act(() => {
    setter.call(input(), value)
    input().dispatchEvent(new Event('input', { bubbles: true }))
  })
}
function key(value: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true, ...init })
  act(() => { input().dispatchEvent(event) })
  return event
}

describe('searchable country field', () => {
  it('keeps the original named input, supplied value, styling and validation linkage', () => {
    render(show({ defaultValue: 'Pakistan', 'aria-invalid': true, 'aria-describedby': 'country-error' }))

    expect(input().value).toBe('Pakistan')
    expect(input().id).toBe('country')
    expect(input().name).toBe('country')
    expect(input().className).toBe('min-h-11 border bg-bg')
    expect(input().getAttribute('aria-invalid')).toBe('true')
    expect(input().getAttribute('aria-describedby')).toBe('country-error')
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(input().autocomplete).toBe('off')
    expect(document.querySelector('[role="listbox"]')).toBeNull()
    expect(new FormData(document.querySelector('form')!).get('country')).toBe('Pakistan')
  })

  it('opens all provided options and filters names or country codes without case or accent sensitivity', () => {
    render(show())
    focus()
    expect(optionNames()).toEqual(countries.map(({ name }) => name))
    expect(input().getAttribute('aria-expanded')).toBe('true')
    expect(document.getElementById(input().getAttribute('aria-controls')!)?.getAttribute('role')).toBe('listbox')

    type('pK')
    expect(optionNames()).toEqual(['Pakistan'])
    type('cote')
    expect(optionNames()).toEqual(['Côte d’Ivoire'])
    type('  UNI  ')
    expect(optionNames()).toEqual(['United Kingdom', 'United States'])
  })

  it('selects a result by pointer and submits its canonical country name', () => {
    render(show())
    focus()
    type('pak')
    const result = options()[0]
    act(() => {
      result.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
      result.click()
    })

    expect(input().value).toBe('Pakistan')
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(input())
    expect(new FormData(document.querySelector('form')!).get('country')).toBe('Pakistan')
  })

  it('supports arrow navigation and Enter selection without submitting the form', () => {
    render(show())
    focus()
    type('uni')
    expect(options()[0].getAttribute('aria-selected')).toBe('true')
    key('ArrowDown')
    expect(options()[1].getAttribute('aria-selected')).toBe('true')
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[1].id)
    const enter = key('Enter')

    expect(enter.defaultPrevented).toBe(true)
    expect(input().value).toBe('United States')
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(input().getAttribute('aria-activedescendant')).toBeNull()
  })

  it('leaves composition Enter to the text input instead of prematurely choosing a country', () => {
    render(show())
    focus()
    type('uni')
    const enter = key('Enter', { isComposing: true })

    expect(enter.defaultPrevented).toBe(false)
    expect(input().value).toBe('uni')
    expect(input().getAttribute('aria-expanded')).toBe('true')
  })

  it('supports Home, End, upward navigation and Escape without changing the typed value', () => {
    render(show())
    focus()
    key('End')
    expect(options().at(-1)?.getAttribute('aria-selected')).toBe('true')
    key('Home')
    expect(options()[0].getAttribute('aria-selected')).toBe('true')
    key('ArrowUp')
    expect(options().at(-1)?.getAttribute('aria-selected')).toBe('true')
    const escape = key('Escape')

    expect(escape.defaultPrevented).toBe(true)
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(input().value).toBe('')
  })

  it('does not submit or select when no option is active or no results match', () => {
    render(show())
    focus()
    expect(key('Enter').defaultPrevented).toBe(true)
    expect(input().value).toBe('')
    type('Atlantis')

    expect(options()).toHaveLength(0)
    expect(document.querySelector('[role="status"]')?.textContent).toContain('No countries found')
    expect(input().getAttribute('aria-activedescendant')).toBeNull()
    expect(key('Enter').defaultPrevented).toBe(true)
    expect(input().value).toBe('Atlantis')
  })

  it('closes with Tab without trapping focus and preserves caller blur validation', () => {
    const onBlur = vi.fn()
    render(show({ onBlur }))
    focus()
    type('pakistan')
    const tab = key('Tab')
    expect(tab.defaultPrevented).toBe(false)
    expect(input().getAttribute('aria-expanded')).toBe('false')
    act(() => { document.getElementById('outside')!.focus() })

    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(input().value).toBe('Pakistan')
  })

  it('closes an open list when pressing outside the field', () => {
    render(show())
    focus()
    expect(input().getAttribute('aria-expanded')).toBe('true')
    act(() => { document.getElementById('outside')!.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true })) })

    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('[role="listbox"]')).toBeNull()
  })
})
