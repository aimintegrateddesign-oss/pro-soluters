'use client'

import { useEffect, useId, useMemo, useRef, useState, type ComponentProps, type KeyboardEvent } from 'react'

import { findCountryByName, normalizeCountrySearch, type CountryOption } from '@/data/countries'
import { cn } from '@/lib/utils'

type Props = Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'defaultValue' | 'type'> & {
  countries: readonly CountryOption[]
  defaultValue?: string
}

/** Searchable country names; the original named input remains the form's submitted value. */
export function CountryCombobox({
  countries,
  defaultValue = '',
  onBlur,
  onClick,
  onFocus,
  onKeyDown,
  ...inputProps
}: Props) {
  const [query, setQuery] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectingRef = useRef(false)
  const listId = useId() + '-countries'

  const matches = useMemo(() => {
    const search = normalizeCountrySearch(query)
    return countries.filter((country) =>
      normalizeCountrySearch(country.name).includes(search) || normalizeCountrySearch(country.code).includes(search),
    )
  }, [countries, query])
  const activeCountry = open ? matches[activeIndex] : undefined
  const optionId = (code: string) => listId + '-' + code

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  const activeCode = activeCountry?.code
  useEffect(() => {
    if (activeCode) document.getElementById(listId + '-' + activeCode)?.scrollIntoView?.({ block: 'nearest' })
  }, [activeCode, listId])

  const choose = (country: CountryOption) => {
    setQuery(country.name)
    setOpen(false)
    setActiveIndex(-1)
    // A pointer selection can focus an option first; return focus without reopening the list.
    selectingRef.current = true
    inputRef.current?.focus()
    selectingRef.current = false
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.nativeEvent.isComposing) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (!matches.length) return setActiveIndex(-1)
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => {
        if (!open || index < 0) return direction > 0 ? 0 : matches.length - 1
        return (index + direction + matches.length) % matches.length
      })
    } else if (open && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault()
      setActiveIndex(matches.length ? (event.key === 'Home' ? 0 : matches.length - 1) : -1)
    } else if (open && event.key === 'Enter') {
      event.preventDefault()
      if (activeCountry) choose(activeCountry)
    } else if (open && event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
    } else if (event.key === 'Tab') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <input
        {...inputProps}
        ref={inputRef}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        value={query}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={activeCountry ? optionId(activeCountry.code) : undefined}
        onChange={(event) => {
          setQuery(event.currentTarget.value)
          setOpen(true)
          setActiveIndex(0)
        }}
        onFocus={(event) => {
          onFocus?.(event)
          if (selectingRef.current) return
          setOpen(true)
          setActiveIndex(-1)
        }}
        onClick={(event) => {
          onClick?.(event)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          if (event.relatedTarget instanceof Node && wrapperRef.current?.contains(event.relatedTarget)) return
          setOpen(false)
          setActiveIndex(-1)
          const country = findCountryByName(query, countries)
          if (country) setQuery(country.name)
          onBlur?.(event)
        }}
      />
      {open && (
        <ul id={listId} role="listbox" aria-label="Countries" className="absolute inset-x-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-[4px] border border-line bg-card py-1 shadow-xl">
          {matches.length ? matches.map((country, index) => (
            <li key={country.code} role="presentation">
              <button
                id={optionId(country.code)}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={index === activeIndex}
                onPointerMove={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(country)}
                className={cn('block min-h-11 w-full px-3 py-2.5 text-left text-[14px] text-ink', index === activeIndex ? 'bg-btn text-white' : 'hover:bg-alt')}
              >
                {country.name}
              </button>
            </li>
          )) : (
            <li role="presentation" className="px-3 py-3 text-sm text-muted">
              <span role="status">No countries found.</span>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

