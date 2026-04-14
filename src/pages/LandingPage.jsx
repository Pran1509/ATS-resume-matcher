import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, CheckCircle, ArrowRight, Star, FileText, Target, Sparkles, Mail, Upload } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { signInWithGoogle } from '../utils/firebase'

const FEATURES = [
  { icon: Target, title: 'ATS Score Analyzer', desc: 'Get a real-time compatibility score and see exactly which keywords are missing.' },
  { icon: Sparkles, title: 'AI Resume Optimizer', desc: 'One click to rewrite your resume with all missing keywords naturally included.' },
  { icon: FileText, title: 'Resume Builder', desc: 'Build beautiful resumes with professional templates. Download as PDF or DOCX.' },
  { icon: Mail, title: 'Cover Letter Generator', desc: 'AI writes a tailored cover letter matching your resume to the job description.' },
  { icon: Upload, title: 'PDF & DOCX Upload', desc: 'Upload your existing resume — every space, period, and line is preserved perfectly.' },
  { icon: Star, title: 'Sample Resumes', desc: '5 industry-specific sample resumes to use as starting points.' },
]

const STATS = [
  { value: '3x', label: 'More interviews' },
  { value: '95%', label: 'ATS pass rate' },
  { value: '< 2min', label: 'To optimize' },
  { value: 'Free', label: 'To get started' },
]

export default function LandingPage() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  async function handleGetStarted() {
    if (isLoggedIn) { navigate('/dashboard'); return }
    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (e) {
      navigate('/ats')
    }
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ background: 'var(--brand-light)', color: 'var(--brand-text)', border: '1px solid var(--brand)' }}>
          <Zap size={12} />
          Powered by Claude AI
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl mb-6 leading-tight" style={{ color: 'var(--text)' }}>
          Beat the ATS.<br />
          <span style={{ color: 'var(--brand-text)' }}>Land the Interview.</span>
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text2)' }}>
          Upload your resume, paste a job description, and get an instant ATS score with AI-powered optimization. Build, analyze, and download professional resumes in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button onClick={handleGetStarted} className="btn-brand text-base px-8 py-3.5">
            Get Started Free <ArrowRight size={18} />
          </button>
          <Link to="/ats" className="btn-ghost text-base px-8 py-3.5">
            Try Without Account
          </Link>
        </div>

        <p className="text-sm" style={{ color: 'var(--text3)' }}>
          2 free analyses · No credit card · Sign in with Google for unlimited access
        </p>
      </section>

      {/* Stats */}
      <section className="border-y py-12" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--brand-text)' }}>{s.value}</div>
              <div className="text-sm" style={{ color: 'var(--text2)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display font-bold text-3xl text-center mb-4" style={{ color: 'var(--text)' }}>Everything you need to get hired</h2>
        <p className="text-center mb-14" style={{ color: 'var(--text2)' }}>All tools in one place — no switching between apps</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--brand-light)' }}>
                <Icon size={20} style={{ color: 'var(--brand-text)' }} />
              </div>
              <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl text-center mb-14" style={{ color: 'var(--text)' }}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Upload your PDF or DOCX resume, or paste text directly.' },
              { step: '02', title: 'Add Job Description', desc: 'Paste the job description you want to apply for.' },
              { step: '03', title: 'Get Results', desc: 'Instant ATS score, missing keywords, and AI-optimized version ready to download.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="font-display font-bold text-5xl mb-4" style={{ color: 'var(--border2)' }}>{s.step}</div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-4xl mb-6" style={{ color: 'var(--text)' }}>Ready to land your dream job?</h2>
          <button onClick={handleGetStarted} className="btn-brand text-base px-10 py-4">
            Start for Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold" style={{ color: 'var(--text)' }}>
            <Zap size={16} style={{ color: 'var(--brand-text)' }} />
            ResumeAI
          </div>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>Powered by Claude AI · Free to use</p>
        </div>
      </footer>
    </div>
  )
}
