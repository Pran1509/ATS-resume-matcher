import React, { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = OPTIONS.find(o => o.value === theme)
  const Icon = current?.icon || Monitor

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost flex items-center gap-1.5 px-3 py-2 text-sm"
        title="Change theme"
      >
        <Icon size={15} />
        <span className="hidden sm:inline">{current?.label}</span>
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 card py-1 w-36 z-50 fade-up">
          {OPTIONS.map(({ value, label, icon: Ic }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
              style={{
                color: theme === value ? 'var(--brand-text)' : 'var(--text2)',
                background: theme === value ? 'var(--brand-light)' : 'transparent'
              }}
            >
              <Ic size={14} />
              {label}
              {theme === value && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
