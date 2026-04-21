import React, { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system')

  useEffect(() => {
    const root = document.documentElement
    const apply = t => {
      if (t === 'dark') root.classList.add('dark')
      else if (t === 'light') root.classList.remove('dark')
      else window.matchMedia('(prefers-color-scheme: dark)').matches ? root.classList.add('dark') : root.classList.remove('dark')
    }
    apply(theme); localStorage.setItem('theme', theme)
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', () => apply('system'))
      return () => mq.removeEventListener('change', () => apply('system'))
    }
  }, [theme])

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>
}

export function useTheme() { return useContext(Ctx) }
