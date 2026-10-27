import { Building2, Check, Cog, Compass, Cpu, Layers, TrainFront, Wind, Workflow, Zap } from 'lucide-react'

import { cn } from '@/lib/utils'

// Cell centres of the 3x3 grid in a 300 x 300 viewBox. Index 4 is the hub.
const CELLS: [number, number][] = [
  [50, 50],
  [150, 50],
  [250, 50],
  [50, 150],
  [150, 150],
  [250, 150],
  [50, 250],
  [150, 250],
  [250, 250],
]
// Eight discipline tiles around a central "engineering" hub. Icons only: the names are listed beside the visual.
const TILES = [Building2, Cog, Wind, Zap, null, Workflow, Cpu, TrainFront, Layers]

/**
 * One engineering ecosystem, eight disciplines: a hub connected to a tile for each discipline, on a blueprint grid.
 * Purely decorative (the disciplines are listed as text next to it), so it is hidden from assistive technology.
 */
export function DomainsVisual({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('theme-dark bg-blueprint relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[4px] border border-line border-t-[3px] border-t-accent bg-[#0b2038] p-6 sm:p-10', className)}>
      <div className="relative size-full">
        <svg viewBox="0 0 300 300" className="absolute inset-0 size-full text-accent/40" fill="none" stroke="currentColor" strokeWidth="1.2">
          {CELLS.filter((_, i) => i !== 4).map(([x, y], i) => (
            <line key={i} x1="150" y1="150" x2={x} y2={y} strokeDasharray="3 4" />
          ))}
          <circle cx="150" cy="150" r="62" strokeDasharray="2 5" />
        </svg>
        <div className="relative grid size-full grid-cols-3 grid-rows-3 place-items-center gap-3">
          {TILES.map((Icon, i) =>
            Icon ? (
              <span key={i} className="flex size-[4.25rem] items-center justify-center rounded-[4px] border border-accent/35 bg-[#0e2540] text-accent sm:size-[5rem]">
                <Icon className="size-7 sm:size-8" strokeWidth={1.6} />
              </span>
            ) : (
              <span key={i} className="flex size-[5.25rem] items-center justify-center rounded-full border-2 border-accent bg-btn text-white shadow-[0_0_0_8px_rgba(14,130,123,0.18)] sm:size-[6.25rem]">
                <Compass className="size-9 sm:size-11" strokeWidth={1.5} />
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

const SECTIONS = ['Engineering Solutions', 'Technical Analysis', 'Feasibility Studies', 'Data Alignment']

/**
 * Capability statement mockup: a front document with the four service areas, a second one partly visible behind it.
 * Decorative (the same points are written next to it), so hidden from assistive technology.
 */
export function CapabilityMockup() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[28rem] pb-4 pr-6 pt-6">
      <div className="absolute right-0 top-0 h-[92%] w-[84%] rotate-[4deg] rounded-[3px] border border-[#c5d2de] bg-[#eef3f8] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4a5d70]">Independent Feasibility Review</p>
        <span className="mt-3 block h-px bg-[#c5d2de]" />
      </div>
      <div className="relative rounded-[3px] border border-[#d3dde6] bg-white p-6 text-[#0a1626] shadow-[0_24px_50px_-26px_rgba(10,22,38,0.55)] sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight [font-family:var(--font-display)]">
            Pro<span className="text-[#0e7c75]">Solutors</span>
          </span>
          <span className="h-1.5 w-10 bg-[#0e7c75]" />
        </div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0e7c75]">Capability Statement</p>
        <p className="mt-1 text-[1.35rem] font-extrabold leading-tight [font-family:var(--font-display)]">Engineering, analysed and documented</p>
        <span className="mt-5 block h-0.5 bg-[#0e7c75]" />
        <ul className="mt-4 divide-y divide-[#e1e8ef]">
          {SECTIONS.map((s, i) => (
            <li key={s} className="flex items-center gap-3 py-3 text-[14px] font-semibold">
              <span className="w-5 text-[11px] text-[#4a5d70]">{String(i + 1).padStart(2, '0')}</span>
              {s}
              <Check className="ml-auto size-4 text-[#0e7c75]" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
