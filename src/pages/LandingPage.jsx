import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Target, Sparkles, FileText, Mail, Upload, Star, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { signInWithGoogle } from '../utils/firebase'

const FEATURES = [
  { icon: Target, title: 'ATS Score Analyzer', desc: 'Upload your resume + job description and get an instant compatibility score with keyword analysis.', to: '/ats', cta: 'Try Now' },
  { icon: Sparkles, title: 'AI Resume Optimizer', desc: 'One click to generate 3 ATS-optimized resume variations — pick the one you like best.', to: '/ats', cta: 'Optimize' },
  { icon: FileText, title: 'Visual Resume Builder', desc: 'Build beautiful resumes with 4 professional templates. See a live visual preview as you type.', to: '/builder', cta: 'Build Resume' },
  { icon: Mail, title: 'Cover Letter Generator', desc: 'AI writes a tailored cover letter from your resume and job description in seconds.', to: '/cover-letter', cta: 'Generate' },
  { icon: Upload, title: 'PDF & DOCX Upload', desc: 'Upload existing resumes — every character, space, and punctuation mark preserved perfectly.', to: '/ats', cta: 'Upload' },
  { icon: Star, title: '5 Sample Resumes', desc: 'Start from professionally written sample resumes across 5 industries.', to: '/builder', cta: 'View Samples' },
]

export default function LandingPage() {
  const { isLoggedIn } = useAuth()
  const nav = useNavigate()

  async function handleStart() {
    if (isLoggedIn) { nav('/dashboard'); return }
    try { await signInWithGoogle(); nav('/dashboard') }
    catch { nav('/ats') }
  }

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 border"
          style={{ background: 'var(--brand-bg)', color: 'var(--brand-text)', borderColor: 'var(--brand)' }}>
          <Zap size={11} /> Powered by Claude AI · 100% Free
        </div>
        <h1 className="font-bold text-5xl sm:text-6xl mb-5 leading-tight tracking-tight" style={{ color: 'var(--text)' }}>
          Beat the ATS.<br />
          <span style={{ color: 'var(--brand)' }}>Land the Interview.</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--text2)' }}>
          Upload your resume, match it to any job, get an ATS score, and download an AI-optimized version in under 2 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleStart} className="btn btn-primary text-base px-8 py-3">
            Get Started Free <ArrowRight size={17} />
          </button>
          <Link to="/ats" className="btn btn-outline text-base px-8 py-3">Try Without Account</Link>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--text3)' }}>2 free uses · No credit card · Sign in with Google for unlimited</p>
      </section>

      {/* Stats */}
      <div className="border-y py-10" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['3×', 'More interviews'], ['95%', 'ATS pass rate'], ['< 2 min', 'To optimize'], ['Free', 'Always']].map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--brand)' }}>{v}</div>
              <div className="text-sm" style={{ color: 'var(--text2)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3" style={{ color: 'var(--text)' }}>Everything you need to get hired</h2>
        <p className="text-center mb-12 text-sm" style={{ color: 'var(--text2)' }}>All tools in one place — no switching between apps</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, to, cta }) => (
            <div key={title} className="card p-6 flex flex-col gap-3 hover:shadow-[var(--shadow-md)] transition-shadow">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand-bg)' }}>
                <Icon size={18} style={{ color: 'var(--brand)' }} />
              </div>
              <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
              <p className="text-sm flex-1" style={{ color: 'var(--text2)' }}>{desc}</p>
              <Link to={to} className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--brand)' }}>
                {cta} <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t py-20" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>How it works</h2>
          <div className="space-y-6">
            {[
              ['01', 'Upload or paste your resume', 'Support for PDF, DOCX, TXT — or just paste text directly.'],
              ['02', 'Add the job description', 'Paste the job posting you want to apply for.'],
              ['03', 'Get your ATS score instantly', 'See your score, missing keywords, and exactly what to fix.'],
              ['04', 'Download optimized versions', 'Get 3 AI-optimized resume variations and pick the best one.'],
            ].map(([n, t, d]) => (
              <div key={n} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm" style={{ background: 'var(--brand-bg)', color: 'var(--brand)' }}>{n}</div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{t}</h3>
                  <p className="text-sm" style={{ color: 'var(--text2)' }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>Ready to land your dream job?</h2>
        <button onClick={handleStart} className="btn btn-primary text-base px-10 py-3.5">
          Start for Free <ArrowRight size={17} />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--text)' }}>
            <Zap size={15} style={{ color: 'var(--brand)' }} /> ResumeAI
          </div>
          <div className="flex gap-4 text-sm" style={{ color: 'var(--text3)' }}>
            <Link to="/privacy" style={{ color: 'var(--text3)' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--text3)' }}>Terms of Service</Link>
          </div>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>© 2025 ResumeAI · Free to use</p>
        </div>
      </footer>
    </div>
  )
}
