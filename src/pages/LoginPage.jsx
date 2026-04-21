import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'
import { signInWithGoogle } from '../utils/firebase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function handleGoogle() {
    setLoading(true); setError('')
    try { await signInWithGoogle(); nav('/dashboard') }
    catch { setError('Sign in failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2 font-bold text-lg mb-8" style={{ color: 'var(--text)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-bg)' }}>
            <Zap size={14} style={{ color: 'var(--brand)' }} />
          </div>
          ResumeAI
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Welcome back</h1>
        <p className="text-sm mb-7" style={{ color: 'var(--text2)' }}>Sign in to access unlimited analyses and saved resumes.</p>

        {error && <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-xl border text-sm font-medium transition-colors"
          style={{ background: 'var(--bg3)', borderColor: 'var(--border2)', color: 'var(--text)' }}>
          {loading
            ? <div className="w-5 h-5 border-2 rounded-full spin" style={{ borderColor: 'var(--border2)', borderTopColor: 'var(--brand)' }} />
            : <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
          }
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="mt-5 pt-5 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <Link to="/ats" className="btn btn-ghost text-sm w-full justify-center">Try 2 free uses as guest</Link>
        </div>
        <div className="mt-3 text-center">
          <Link to="/" className="text-xs flex items-center justify-center gap-1" style={{ color: 'var(--text3)' }}>
            <ArrowLeft size={11} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
