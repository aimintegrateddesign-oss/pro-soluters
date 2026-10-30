import { act, createElement, Fragment, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { StepReveal } from '@/components/motion/StepReveal'

const preferences = vi.hoisted(() => ({ inView: false, reducedMotion: false }))
vi.mock('motion/react', () => ({ useInView: () => preferences.inView }))
vi.mock('@/components/motion/useMediaQuery', () => ({ useMediaQuery: () => preferences.reducedMotion }))

const renderings = new Set<{ unmount: () => void }>()
const reactTestEnvironment = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
const previousActEnvironment = reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT
const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate')
const cancel = vi.fn()
const animate = vi.fn()

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

const cardClass = 'flex-1 rounded-[4px] border border-line bg-card px-5 py-4'
const show = (index = 0) => createElement(StepReveal, { index, className: cardClass, children: createElement('span', null, 'Civil Engineering') })

beforeEach(() => {
  preferences.inView = false
  preferences.reducedMotion = false
  cancel.mockReset()
  animate.mockReset().mockReturnValue({ cancel })
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, writable: true, value: animate })
})

afterEach(() => {
  for (const view of renderings) view.unmount()
  if (originalAnimate) Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate)
  else Reflect.deleteProperty(HTMLElement.prototype, 'animate')
})

describe('journey card reveal', () => {
  it('keeps server-rendered cards visible with their original classes and no extra wrapper', () => {
    const markup = renderToStaticMarkup(show())
    const view = render(show())
    const card = view.container.firstElementChild as HTMLElement

    expect(view.container.children).toHaveLength(1)
    expect(card.tagName).toBe('DIV')
    expect(card.className).toBe(cardClass)
    expect(card.children).toHaveLength(1)
    expect(card.firstElementChild?.tagName).toBe('SPAN')
    expect(card.textContent).toBe('Civil Engineering')
    expect(markup).not.toContain('style=')
    expect(markup).not.toContain('hidden')
    expect(animate).not.toHaveBeenCalled()
  })

  it('starts a short upward fade only on entry and does not restart on an ordinary render', () => {
    const view = render(show(2))
    expect(animate).not.toHaveBeenCalled()

    preferences.inView = true
    view.rerender(show(2))
    expect(animate).toHaveBeenCalledTimes(1)
    expect(animate).toHaveBeenCalledWith([
      { opacity: 0, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], expect.objectContaining({ duration: 500, delay: 240, fill: 'backwards' }))

    view.rerender(show(2))
    expect(animate).toHaveBeenCalledTimes(1)
  })

  it('staggers all four cards in order while keeping each as a direct flex item', () => {
    preferences.inView = true
    const cards = [0, 1, 2, 3].map((index) => createElement(StepReveal, { index, className: cardClass, key: index, children: 'Step ' + (index + 1) }))
    const view = render(createElement(Fragment, null, ...cards))

    expect(view.container.children).toHaveLength(4)
    expect(Array.from(view.container.children).every((card) => card.className === cardClass)).toBe(true)
    expect(animate.mock.calls.map(([, options]) => options.delay)).toEqual([0, 120, 240, 360])
  })

  it('keeps reduced-motion cards static and visible', () => {
    preferences.inView = true
    preferences.reducedMotion = true
    const view = render(show())

    expect(animate).not.toHaveBeenCalled()
    expect(view.container.textContent).toBe('Civil Engineering')
    expect((view.container.firstElementChild as HTMLElement).style.opacity).toBe('')
  })

  it('cancels an active reveal when reduced motion is enabled', () => {
    preferences.inView = true
    const view = render(show())
    expect(animate).toHaveBeenCalledTimes(1)

    preferences.reducedMotion = true
    view.rerender(show())
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(animate).toHaveBeenCalledTimes(1)
    expect(view.container.textContent).toBe('Civil Engineering')
  })

  it('cancels its animation when unmounted', () => {
    preferences.inView = true
    const view = render(show())
    view.unmount()
    expect(cancel).toHaveBeenCalledTimes(1)
  })

  it('safely keeps the original card when Web Animations is unavailable', () => {
    preferences.inView = true
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, writable: true, value: undefined })
    const view = render(show())

    expect(view.container.children).toHaveLength(1)
    expect(view.container.firstElementChild?.className).toBe(cardClass)
    expect(view.container.textContent).toBe('Civil Engineering')
    expect(animate).not.toHaveBeenCalled()
  })

  it('cleans up the previous reveal before using a changed card order', () => {
    preferences.inView = true
    const view = render(show(0))
    view.rerender(show(3))

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(animate).toHaveBeenCalledTimes(2)
    expect(animate.mock.calls[1][1].delay).toBe(360)
  })
})
