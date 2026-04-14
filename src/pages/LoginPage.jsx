import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'
import { signInWithGoogle } from '../utils/firebase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleGoogle() {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (e) {
      setError('Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="card w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 font-display font-bold text-xl mb-8" style={{ color: 'var(--text)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-light)' }}>
            <Zap size={16} style={{ color: 'var(--brand-text)' }} />
          </div>
          ResumeAI
        </div>

        <h1 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>Welcome back</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text2)' }}>Sign in to access your resumes and unlimited analyses.</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border"
          style={{ background: 'var(--bg3)', color: 'var(--text)', borderColor: 'var(--border)' }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 rounded-full spin" style={{ borderColor: 'var(--border2)', borderTopColor: 'var(--brand-text)' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
          )}
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs mb-3" style={{ color: 'var(--text3)' }}>Don't want to sign in?</p>
          <Link to="/ats" className="btn-ghost text-sm px-4 py-2 w-full justify-center">
            Try 2 free analyses as guest
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text3)' }}>
            <ArrowLeft size={12} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
