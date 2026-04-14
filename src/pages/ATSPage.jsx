import React, { useState } from 'react'
import { Zap, Sparkles, RotateCcw, Upload, FileText, Briefcase, BarChart2, Tag, Lightbulb, Wand2, Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { analyzeATS, optimizeResume } from '../utils/atsAnalyzer'
import { extractTextFromFile } from '../utils/fileParser'
import { downloadAsTXT, downloadAsDOCX } from '../utils/fileParser'
import { Link } from 'react-router-dom'

// Sub-components
function ScoreRing({ score, grade }) {
  const C = 339
  const colors = { A: '#22c55e', B: '#c8f135', C: '#f59e0b', D: '#f97316', F: '#ef4444' }
  const color = colors[grade] || '#6366f1'
  const offset = C - (C * score) / 100
  const [animated, setAnimated] = React.useState(false)
  React.useEffect(() => { setTimeout(() => setAnimated(true), 100) }, [])

  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r="54" fill="none" stroke="var(--bg3)" strokeWidth="8" />
      <circle cx="55" cy="55" r="54" fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={C}
        strokeDashoffset={animated ? offset : C}
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
      <text x="55" y="50" textAnchor="middle" fill={color} fontSize="26" fontWeight="700" fontFamily="Syne">{score}</text>
      <text x="55" y="64" textAnchor="middle" fill="var(--text3)" fontSize="10" fontFamily="DM Sans">/100</text>
    </svg>
  )
}

function FileUploadArea({ label, icon: Icon, value, onChange }) {
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const inputRef = React.useRef()

  async function handleFile(file) {
    setLoading(true)
    setFileName(file.name)
    try {
      const text = await extractTextFromFile(file)
      onChange(text)
    } catch(e) { alert(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="section-label flex items-center gap-1.5"><Icon size={11} />{label}</label>
        {value && <span className="section-label">{value.trim().split(/\s+/).length} words</span>}
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
        className="rounded-xl border-2 border-dashed transition-all"
        style={{ borderColor: drag ? 'var(--brand)' : 'var(--border)', background: drag ? 'var(--brand-light)' : 'var(--bg3)' }}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files[0])} className="hidden" />
        {loading ? (
          <div className="p-6 text-center text-sm" style={{ color: 'var(--brand-text)' }}>
            <div className="w-5 h-5 border-2 rounded-full spin mx-auto mb-2" style={{ borderColor: 'var(--border2)', borderTopColor: 'var(--brand-text)' }} />
            Extracting from {fileName}...
          </div>
        ) : value ? (
          <div>
            {fileName && <div className="px-4 pt-3 pb-1 text-xs font-mono flex items-center gap-1.5" style={{ color: 'var(--brand-text)' }}><FileText size={11} />{fileName} <button onClick={() => { onChange(''); setFileName('') }} className="ml-auto text-xs" style={{ color: 'var(--text3)' }}>✕</button></div>}
            <textarea value={value} onChange={e => onChange(e.target.value)} rows={9}
              className="w-full bg-transparent px-4 pb-3 text-xs font-mono leading-relaxed focus:outline-none"
              style={{ color: 'var(--text2)' }} spellCheck={false} />
          </div>
        ) : (
          <div className="p-8 text-center cursor-pointer" onClick={() => inputRef.current?.click()}>
            <Upload size={22} className="mx-auto mb-2" style={{ color: 'var(--text3)' }} />
            <p className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Drop file or <span style={{ color: 'var(--brand-text)' }}>browse</span></p>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>PDF, DOCX, TXT</p>
          </div>
        )}
      </div>
      {!value && <button onClick={() => { const t = window.prompt('Paste text:'); if(t) onChange(t) }} className="text-xs underline" style={{ color: 'var(--text3)' }}>Or paste manually →</button>}
    </div>
  )
}

const TABS = [
  { id: 'score', label: 'Score', icon: BarChart2 },
  { id: 'keywords', label: 'Keywords', icon: Tag },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
  { id: 'optimized', label: 'Optimized', icon: Wand2 },
]

export default function ATSPage() {
  const { isLoggedIn, canUseAsGuest, incrementGuestUse, guestUses } = useAuth()
  const [resume, setResume] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [optimized, setOptimized] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('score')
  const [showLoginWall, setShowLoginWall] = useState(false)

  async function handleAnalyze() {
    if (!resume.trim() || !jobDesc.trim()) { setError('Please provide both resume and job description.'); return }
    if (!isLoggedIn && !canUseAsGuest) { setShowLoginWall(true); return }
    setError(''); setAnalyzing(true); setResult(null); setOptimized(''); setTab('score')
    if (!isLoggedIn) incrementGuestUse()
    try {
      const data = await analyzeATS(resume, jobDesc)
      setResult(data)
    } catch(e) { setError(e.message) }
    finally { setAnalyzing(false) }
  }

  async function handleOptimize() {
    if (!isLoggedIn && !canUseAsGuest) { setShowLoginWall(true); return }
    setOptimizing(true); setTab('optimized'); setOptimized('')
    try {
      const text = await optimizeResume(resume, jobDesc, result)
      setOptimized(text)
    } catch(e) { setError(e.message) }
    finally { setOptimizing(false) }
  }

  if (showLoginWall) return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="card p-10">
        <Lock size={40} className="mx-auto mb-4" style={{ color: 'var(--brand-text)' }} />
        <h2 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--text)' }}>You've used your 2 free analyses</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>Sign in with Google to get unlimited ATS analyses, resume optimization, and more — all free.</p>
        <Link to="/login" className="btn-brand w-full justify-center text-base py-3">Sign in with Google</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>ATS Resume Matcher</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>Upload your resume and job description to get your ATS score</p>
        </div>
        {!isLoggedIn && (
          <div className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--brand-light)', color: 'var(--brand-text)' }}>
            {2 - guestUses} free {2 - guestUses === 1 ? 'use' : 'uses'} left
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <FileUploadArea label="Your Resume" icon={FileText} value={resume} onChange={setResume} />
        <FileUploadArea label="Job Description" icon={Briefcase} value={jobDesc} onChange={setJobDesc} />
      </div>

      {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

      <div className="flex gap-3 mb-8">
        <button onClick={handleAnalyze} disabled={analyzing || !resume.trim() || !jobDesc.trim()} className="btn-brand">
          {analyzing ? <><div className="w-4 h-4 border-2 rounded-full spin" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#000' }} />Analyzing...</> : <><Zap size={15} />Analyze Resume</>}
        </button>
        {result && (
          <button onClick={handleOptimize} disabled={optimizing} className="btn-ghost" style={{ color: 'var(--brand-text)', borderColor: 'var(--brand)' }}>
            {optimizing ? <><div className="w-4 h-4 border-2 rounded-full spin" style={{ borderColor: 'var(--border2)', borderTopColor: 'var(--brand-text)' }} />Optimizing...</> : <><Sparkles size={15} />Optimize Resume</>}
          </button>
        )}
        {result && <button onClick={() => { setResult(null); setResume(''); setJobDesc(''); setOptimized('') }} className="btn-ghost"><RotateCcw size={14} />Reset</button>}
      </div>

      {(result || optimizing) && (
        <div className="fade-up">
          <div className="flex gap-1 border-b mb-6" style={{ borderColor: 'var(--border)' }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
                style={{ borderColor: tab === id ? 'var(--brand-text)' : 'transparent', color: tab === id ? 'var(--brand-text)' : 'var(--text2)' }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl">
            {tab === 'score' && result && (
              <div className="space-y-5 fade-up">
                <div className="flex items-center gap-5">
                  <ScoreRing score={result.overallScore} grade={result.grade} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold text-4xl" style={{ color: result.grade === 'A' ? '#22c55e' : result.grade === 'B' ? 'var(--brand-text)' : result.grade === 'C' ? '#f59e0b' : '#ef4444' }}>{result.grade}</span>
                      <span className="text-sm" style={{ color: 'var(--text2)' }}>ATS Grade</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{result.summary}</p>
                  </div>
                </div>
                <div className="card p-4 space-y-3">
                  {Object.entries(result.sections || {}).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="section-label capitalize">{key}</span>
                        <span style={{ color: val.score >= 70 ? '#22c55e' : val.score >= 50 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{val.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--bg3)' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val.score}%`, background: val.score >= 70 ? '#22c55e' : val.score >= 50 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'keywords' && result && (
              <div className="space-y-5 fade-up">
                {[['matched','#22c55e','Matched'], ['missing','#ef4444','Missing — Add These'], ['partial','#f59e0b','Partially Matched']].map(([key, color, label]) => (
                  <div key={key}>
                    <p className="section-label mb-2" style={{ color }}>{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {(result.keywords?.[key] || []).map(w => (
                        <span key={w} className="text-xs font-mono px-2 py-1 rounded-full border" style={{ color, borderColor: color + '40', background: color + '15' }}>{w}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'tips' && result && (
              <div className="space-y-3 fade-up">
                {(result.tips || []).map((t, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono uppercase" style={{ color: t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#f59e0b' : '#6366f1' }}>{t.priority}</span>
                      <span className="text-xs" style={{ color: 'var(--text3)' }}>· {t.category}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text2)' }}>{t.tip}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'optimized' && (
              <div className="fade-up space-y-4">
                {optimizing ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--brand-text)' }}>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--brand-text)' }} />
                      Optimizing your resume...
                    </div>
                    {Array.from({length: 8}).map((_,i) => <div key={i} className="h-3 rounded-full animate-pulse mb-2" style={{ width: `${55+Math.random()*40}%`, background: 'var(--bg3)' }} />)}
                  </div>
                ) : optimized ? (
                  <>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => navigator.clipboard.writeText(optimized)} className="btn-ghost text-xs py-1.5 px-3">Copy</button>
                      <button onClick={() => downloadAsTXT(optimized)} className="btn-ghost text-xs py-1.5 px-3">Download .txt</button>
                      <button onClick={() => downloadAsDOCX(optimized)} className="btn-ghost text-xs py-1.5 px-3" style={{ color: 'var(--brand-text)', borderColor: 'var(--brand)' }}>Download .docx</button>
                    </div>
                    <div className="card overflow-hidden">
                      <div className="px-4 py-2 border-b flex gap-1.5" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                        <div className="w-3 h-3 rounded-full bg-red-400/50" /><div className="w-3 h-3 rounded-full bg-yellow-400/50" /><div className="w-3 h-3 rounded-full bg-green-400/50" />
                      </div>
                      <pre className="p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto" style={{ color: 'var(--text2)' }}>{optimized}</pre>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {!result && !analyzing && (
        <div className="text-center py-16">
          <Zap size={32} className="mx-auto mb-3" style={{ color: 'var(--text3)' }} />
          <p className="text-sm" style={{ color: 'var(--text2)' }}>Upload your resume and job description above to get started</p>
        </div>
      )}
    </div>
  )
}
