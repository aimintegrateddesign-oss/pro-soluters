export { cn } from '@/utilities/ui'

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso))
}

export function formatUsdK(value: number): string {
  return `${value.toLocaleString('en-US')}k`
}
