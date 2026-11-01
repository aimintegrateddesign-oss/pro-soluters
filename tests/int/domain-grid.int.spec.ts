import { act, createElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainGrid } from '@/components/who-we-serve/DomainGrid'

const motion = vi.hoisted(() => ({ inView: true, reducedMotion: false }))
vi.mock('motion/react', () => ({ useInView: () => motion.inView }))
vi.mock('@/components/motion/useMediaQuery', () => ({ useMediaQuery: () => motion.reducedMotion }))

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

const cards = () => Array.from(document.querySelectorAll('li'))
function textElement(text: string): HTMLElement {
  const element = Array.from(document.querySelectorAll<HTMLElement>('span, small')).find((node) => node.textContent === text)
  if (!element) throw new Error('Missing card text: ' + text)
  return element
}

const domains = [
  { name: 'Civil', note: '' },
  { name: 'Mechanical', note: '' },
  { name: 'Mechatronics', note: 'Coming soon' },
]

const show = (items = domains) => createElement(DomainGrid, { domains: items })
const advance = (milliseconds: number) => act(() => { vi.advanceTimersByTime(milliseconds) })
const expectActive = (index: number) => {
  const items = cards()
  expect(items.map((card) => card.classList.contains('bg-btn'))).toEqual(items.map((_, i) => i === index))
}

beforeEach(() => {
  motion.inView = true
  motion.reducedMotion = false
  vi.useFakeTimers()
})

afterEach(() => {
  for (const view of renderings) view.unmount()
  vi.useRealTimers()
})

describe('engineering domain highlights', () => {
  it('highlights only one card for each full second, then repeats in order', () => {
    render(show())
    expectActive(0)
    advance(999)
    expectActive(0)
    advance(1)
    expectActive(1)
    advance(1_000)
    expectActive(2)
    advance(1_000)
    expectActive(0)
  })

  it('waits until visible, pauses offscreen and restarts from the first card on return', () => {
    motion.inView = false
    const view = render(show())
    expect(vi.getTimerCount()).toBe(0)
    advance(5_000)
    expectActive(0)

    motion.inView = true
    view.rerender(show())
    advance(1_000)
    expectActive(1)

    motion.inView = false
    view.rerender(show())
    expect(vi.getTimerCount()).toBe(0)
    advance(5_000)
    expectActive(1)

    motion.inView = true
    view.rerender(show())
    expectActive(0)
    advance(999)
    expectActive(0)
    advance(1)
    expectActive(1)
  })

  it('respects reduced motion and stops an existing sequence when the preference changes', () => {
    motion.reducedMotion = true
    const view = render(show())
    expectActive(-1)
    expect(vi.getTimerCount()).toBe(0)

    motion.reducedMotion = false
    view.rerender(show())
    expectActive(0)
    advance(1_000)
    expectActive(1)

    motion.reducedMotion = true
    view.rerender(show())
    expectActive(-1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cleans up its timer when unmounted', () => {
    const view = render(show())
    expect(vi.getTimerCount()).toBe(1)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('uses the current CMS item count and resets safely when the list changes', () => {
    const view = render(show())
    advance(2_000)
    expectActive(2)

    view.rerender(show(domains.slice(0, 2)))
    expectActive(0)
    expect(vi.getTimerCount()).toBe(1)
    advance(1_000)
    expectActive(1)
    advance(1_000)
    expectActive(0)
  })

  it.each([0, 1])('does not create a timer for %s cards', (count) => {
    render(show(domains.slice(0, count)))
    expect(cards()).toHaveLength(count)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('preserves card labels, notes, grid and neutral borders while highlighting', () => {
    render(show())
    const list = document.querySelector('ul')!
    expect(list.classList.contains('grid-cols-2')).toBe(true)
    for (const card of cards()) {
      expect(card.classList.contains('border-line')).toBe(true)
      expect(card.classList.contains('border-l-btn')).toBe(false)
    }
    expect(textElement('01').classList.contains('text-white')).toBe(true)
    expect(textElement('Civil').classList.contains('text-white')).toBe(true)
    expect(textElement('Coming soon').classList.contains('text-muted')).toBe(true)
    advance(2_000)
    expect(textElement('Coming soon').classList.contains('text-white')).toBe(true)
    expect(textElement('Civil').classList.contains('text-heading')).toBe(true)
  })
})
