import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, Sun, Moon, Monitor, Menu, X, LogOut, User, ChevronDown, LayoutDashboard, Target, FileText, Mail, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { logOut } from '../../utils/firebase'

function ThemeBtn() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])
  const opts = [{ v: 'light', l: 'Light', I: Sun }, { v: 'dark', l: 'Dark', I: Moon }, { v: 'system', l: 'System', I: Monitor }]
  const cur = opts.find(o => o.v === theme)
  const Icon = cur?.I || Monitor
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="btn btn-ghost py-2 px-3 text-sm gap-1.5">
        <Icon size={15} /><span className="hidden sm:inline">{cur?.l}</span><ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 card py-1 w-32 z-50 fade-up">
          {opts.map(({ v, l, I: Ic }) => (
            <button key={v} onClick={() => { setTheme(v); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
              style={{ color: theme === v ? 'var(--brand)' : 'var(--text2)', background: theme === v ? 'var(--brand-bg)' : 'transparent' }}>
              <Ic size={13} />{l}{theme === v && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user, isLoggedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef()
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    const h = e => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/ats', label: 'ATS Matcher', icon: Target },
    { to: '/builder', label: 'Resume Builder', icon: FileText },
    { to: '/cover-letter', label: 'Cover Letter', icon: Mail },
  ]

  const isActive = p => loc.pathname === p

  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-base" style={{ color: 'var(--text)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-bg)', border: '1px solid var(--brand)' }}>
            <Zap size={14} style={{ color: 'var(--brand)' }} />
          </div>
          ResumeAI
        </Link>

        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-0.5">
            {links.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{ color: isActive(to) ? 'var(--brand)' : 'var(--text2)', background: isActive(to) ? 'var(--brand-bg)' : 'transparent', fontWeight: isActive(to) ? 500 : 400 }}>
                <Icon size={13} />{label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeBtn />
          {isLoggedIn ? (
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserOpen(!userOpen)} className="btn btn-ghost py-1.5 px-2 gap-2">
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                <span className="hidden sm:inline text-sm">{user.displayName?.split(' ')[0]}</span>
                <ChevronDown size={11} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1 card py-1 w-52 z-50 fade-up">
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{user.displayName}</p>
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg3)] transition-colors" style={{ color: 'var(--text2)' }}><User size={13} />My Resumes</Link>
                  <Link to="/privacy" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg3)] transition-colors" style={{ color: 'var(--text2)' }}><Shield size={13} />Privacy Policy</Link>
                  <button onClick={async () => { await logOut(); nav('/') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors" style={{ color: 'var(--red)' }}><LogOut size={13} />Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary text-sm px-4 py-2">Sign In</Link>
          )}
          {isLoggedIn && (
            <button className="md:hidden btn btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {mobileOpen && isLoggedIn && (
        <div className="md:hidden border-t px-4 py-2 space-y-1 fade-up" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ color: isActive(to) ? 'var(--brand)' : 'var(--text2)', background: isActive(to) ? 'var(--brand-bg)' : 'transparent' }}>
              <Icon size={13} />{label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
