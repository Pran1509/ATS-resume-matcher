import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, Menu, X, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { logOut } from '../../utils/firebase'
import ThemeSwitcher from './ThemeSwitcher'

export default function Navbar() {
  const { user, isLoggedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/ats', label: 'ATS Matcher' },
    { to: '/builder', label: 'Resume Builder' },
    { to: '/cover-letter', label: 'Cover Letter' },
  ]

  async function handleLogout() {
    await logOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg" style={{ color: 'var(--text)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-light)', border: '1px solid var(--brand)' }}>
            <Zap size={14} style={{ color: 'var(--brand-text)' }} />
          </div>
          ResumeAI
        </Link>

        {/* Desktop links */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{
                  color: isActive(l.to) ? 'var(--brand-text)' : 'var(--text2)',
                  background: isActive(l.to) ? 'var(--brand-light)' : 'transparent',
                  fontWeight: isActive(l.to) ? 500 : 400
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 btn-ghost px-2 py-1.5"
              >
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                <span className="hidden sm:inline text-sm">{user.displayName?.split(' ')[0]}</span>
                <ChevronDown size={12} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1 card py-1 w-48 fade-up z-50">
                  <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{user.displayName}</p>
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-opacity-50 transition-colors" style={{ color: 'var(--text2)' }}>
                    <User size={14} /> My Resumes
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors" style={{ color: '#ef4444' }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-brand px-4 py-2 text-sm">
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && isLoggedIn && (
        <div className="md:hidden border-t px-4 py-3 space-y-1 fade-up" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm"
              style={{ color: isActive(l.to) ? 'var(--brand-text)' : 'var(--text2)', background: isActive(l.to) ? 'var(--brand-light)' : 'transparent' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
