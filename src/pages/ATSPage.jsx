import React, { useState, useRef } from 'react'
import { Zap, Sparkles, RotateCcw, FileText, Briefcase, BarChart2, Tag, Lightbulb, Wand2, Lock, Upload, Check, Copy, Download } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { analyzeATS, optimizeResume, generateResumeVariations } from '../utils/api'
import { extractTextFromFile, downloadTXT, downloadDOCX } from '../utils/fileParser'

function ScoreRing({ score, grade }) {
  const C = 339
  const color = grade === 'A' ? '#22c55e' : grade === 'B' ? '#6366f1' : grade === 'C' ? '#f59e0b' : '#ef4444'
  const [on, setOn] = useState(false)
  React.useEffect(() => { setTimeout(() => setOn(true), 80) }, [])
  return (
    <svg width="108" height="108" viewBox="0 0 108 108">
      <circle cx="54" cy="54" r="46" fill="none" stroke="var(--bg3)" strokeWidth="8" />
      <circle cx="54" cy="54" r="46" fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={C}
        strokeDashoffset={on ? C - (C * score / 100) : C}
        transform="rotate(-90 54 54)"
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
      <text x="54" y="49" textAnchor="middle" fill={color} fontSize="24" fontWeight="700" fontFamily="Inter">{score}</text>
      <text x="54" y="63" textAnchor="middle" fill="var(--text3)" fontSize="10">/100</text>
    </svg>
  )
}

function UploadBox({ label, icon: Icon, value, onChange }) {
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fname, setFname] = useState('')
  const ref = useRef()

  async function handle(file) {
    setLoading(true); setFname(file.name)
    try { onChange(await extractTextFromFile(file)) }
    catch (e) { alert(e.message); setFname('') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="lbl flex items-center gap-1.5"><Icon size={11} />{label}</label>
        {value && <span className="lbl">{value.trim().split(/\s+/).length}w</span>}
      </div>
      <div onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
        className="rounded-xl border-2 border-dashed transition-all overflow-hidden"
        style={{ borderColor: drag ? 'var(--brand)' : 'var(--border)', background: 'var(--bg3)' }}>
        <input ref={ref} type="file" accept=".pdf,.docx,.txt" onChange={e => handle(e.target.files[0])} className="hidden" />
        {loading ? (
          <div className="p-6 text-center text-sm" style={{ color: 'var(--brand)' }}>
            <div className="w-5 h-5 border-2 rounded-full spin mx-auto mb-2" style={{ borderColor: 'var(--bg4)', borderTopColor: 'var(--brand)' }} />
            Reading {fname}...
          </div>
        ) : value ? (
          <div>
            {fname && (
              <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5 text-xs" style={{ color: 'var(--brand)' }}>
                <FileText size={11} />{fname}
                <button onClick={() => { onChange(''); setFname('') }} className="ml-auto" style={{ color: 'var(--text3)' }}>✕</button>
              </div>
            )}
            <textarea value={value} onChange={e => onChange(e.target.value)} rows={9}
              className="w-full bg-transparent px-3 pb-3 text-xs font-mono leading-relaxed focus:outline-none"
              style={{ color: 'var(--text2)' }} spellCheck={false} />
          </div>
        ) : (
          <div className="p-8 text-center cursor-pointer" onClick={() => ref.current?.click()}>
            <Upload size={22} className="mx-auto mb-2" style={{ color: 'var(--text3)' }} />
            <p className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Drop or <span style={{ color: 'var(--brand)' }}>browse</span></p>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>PDF · DOCX · TXT</p>
          </div>
        )}
      </div>
      {!value && (
        <button onClick={() => { const t = prompt('Paste text:'); if (t) { onChange(t); setFname('') } }}
          className="text-xs mt-1.5 underline" style={{ color: 'var(--text3)' }}>
          Or paste manually →
        </button>
      )}
    </div>
  )
}

const TABS = [
  { id: 'score', label: 'Score', icon: BarChart2 },
  { id: 'keywords', label: 'Keywords', icon: Tag },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
  { id: 'optimize', label: 'Optimize', icon: Wand2 },
  { id: 'variations', label: 'AI Variations', icon: Sparkles },
]

export default function ATSPage() {
  const { isLoggedIn, canUseAsGuest, incrementGuestUse, guestUses } = useAuth()
  const [resume, setResume] = useState('')
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [optimized, setOptimized] = useState('')
  const [variations, setVariations] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [generatingVars, setGeneratingVars] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('score')
  const [loginWall, setLoginWall] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedVar, setSelectedVar] = useState(null)

  async function handleAnalyze() {
    if (!resume.trim() || !jd.trim()) { setError('Please provide both resume and job description.'); return }
    if (!isLoggedIn && !canUseAsGuest) { setLoginWall(true); return }
    setError(''); setAnalyzing(true); setResult(null); setOptimized(''); setVariations(null); setTab('score')
    if (!isLoggedIn) incrementGuestUse()
    try { setResult(await analyzeATS(resume, jd)) }
    catch (e) { setError(e.message) }
    finally { setAnalyzing(false) }
  }

  async function handleOptimize() {
    if (!isLoggedIn && !canUseAsGuest) { setLoginWall(true); return }
    setOptimizing(true); setTab('optimize'); setOptimized('')
    try { setOptimized(await optimizeResume(resume, jd, result)) }
    catch (e) { setError(e.message) }
    finally { setOptimizing(false) }
  }

  async function handleVariations() {
    if (!isLoggedIn && !canUseAsGuest) { setLoginWall(true); return }
    setGeneratingVars(true); setTab('variations'); setVariations(null); setSelectedVar(null)
    try { const data = await generateResumeVariations(resume, jd); setVariations(data.variations); setSelectedVar(data.variations[0]) }
    catch (e) { setError(e.message) }
    finally { setGeneratingVars(false) }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (loginWall) return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="card p-10">
        <Lock size={36} className="mx-auto mb-4" style={{ color: 'var(--brand)' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Free uses used up</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>Sign in with Google for unlimited ATS analyses, resume optimization, and AI variations — all free.</p>
        <Link to="/login" className="btn btn-primary w-full justify-center text-base py-3">Sign in with Google</Link>
        <button onClick={() => setLoginWall(false)} className="btn btn-ghost w-full justify-center mt-2 text-sm">Go back</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>ATS Resume Matcher</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Upload your resume and a job description to get your ATS score</p>
        </div>
        {!isLoggedIn && (
          <span className="badge text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--brand-bg)', color: 'var(--brand-text)' }}>
            {2 - guestUses} free {2 - guestUses === 1 ? 'use' : 'uses'} remaining
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <UploadBox label="Your Resume" icon={FileText} value={resume} onChange={setResume} />
        <UploadBox label="Job Description" icon={Briefcase} value={jd} onChange={setJd} />
      </div>

      {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

      {/* Action buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button onClick={handleAnalyze} disabled={analyzing || !resume.trim() || !jd.trim()} className="btn btn-primary">
          {analyzing ? <><div className="w-4 h-4 border-2 rounded-full spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Analyzing...</> : <><Zap size={15} />Analyze Resume</>}
        </button>
        {result && <>
          <button onClick={handleOptimize} disabled={optimizing} className="btn btn-outline" style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }}>
            {optimizing ? <><div className="w-4 h-4 border-2 rounded-full spin" style={{ borderColor: 'var(--bg4)', borderTopColor: 'var(--brand)' }} />Optimizing...</> : <><Sparkles size={15} />Optimize Resume</>}
          </button>
          <button onClick={handleVariations} disabled={generatingVars} className="btn btn-ghost">
            {generatingVars ? <><div className="w-4 h-4 border-2 rounded-full spin" style={{ borderColor: 'var(--bg4)', borderTopColor: 'var(--text2)' }} />Generating...</> : <><Sparkles size={15} />AI Variations</>}
          </button>
          <button onClick={() => { setResult(null); setResume(''); setJd(''); setOptimized(''); setVariations(null) }} className="btn btn-ghost">
            <RotateCcw size={14} />Reset
          </button>
        </>}
      </div>

      {/* Results */}
      {(result || optimizing || generatingVars) && (
        <div className="fade-up">
          {/* Tabs */}
          <div className="flex gap-0.5 border-b mb-6 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors"
                style={{ borderColor: tab === id ? 'var(--brand)' : 'transparent', color: tab === id ? 'var(--brand)' : 'var(--text2)' }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>

          {/* Score tab */}
          {tab === 'score' && result && (
            <div className="max-w-2xl space-y-5 fade-up">
              <div className="flex items-center gap-5">
                <ScoreRing score={result.overallScore} grade={result.grade} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-4xl font-bold" style={{ color: result.grade === 'A' ? '#22c55e' : result.grade === 'B' ? 'var(--brand)' : result.grade === 'C' ? 'var(--amber)' : 'var(--red)' }}>{result.grade}</span>
                    <span className="text-sm" style={{ color: 'var(--text2)' }}>ATS Grade</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{result.summary}</p>
                </div>
              </div>
              <div className="card p-4 space-y-3">
                <p className="lbl">Section Breakdown</p>
                {Object.entries(result.sections || {}).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize" style={{ color: 'var(--text2)' }}>{key}</span>
                      <span style={{ color: val.score >= 70 ? '#22c55e' : val.score >= 50 ? 'var(--amber)' : 'var(--red)', fontWeight: 600 }}>{val.score}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val.score}%`, background: val.score >= 70 ? '#22c55e' : val.score >= 50 ? 'var(--amber)' : 'var(--red)' }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{val.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords tab */}
          {tab === 'keywords' && result && (
            <div className="max-w-2xl space-y-6 fade-up">
              {[['matched', '#22c55e', 'Matched Keywords'], ['missing', 'var(--red)', 'Missing — Add These'], ['partial', 'var(--amber)', 'Partially Matched']].map(([key, color, label]) => (
                <div key={key}>
                  <p className="lbl mb-2" style={{ color }}>{label} ({(result.keywords?.[key] || []).length})</p>
                  <div className="flex flex-wrap gap-2">
                    {(result.keywords?.[key] || []).map(w => (
                      <span key={w} className="text-xs font-mono px-2.5 py-1 rounded-full border"
                        style={{ color, borderColor: color + '50', background: color + '12' }}>{w}</span>
                    ))}
                    {(result.keywords?.[key] || []).length === 0 && <span className="text-xs" style={{ color: 'var(--text3)' }}>None</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips tab */}
          {tab === 'tips' && result && (
            <div className="max-w-2xl space-y-3 fade-up">
              {(result.tips || []).sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority])).map((t, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="badge text-xs px-2 py-0.5 rounded-full" style={{ color: t.priority === 'high' ? 'var(--red)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--brand)', background: t.priority === 'high' ? 'rgba(239,68,68,0.1)' : t.priority === 'medium' ? 'rgba(245,158,11,0.1)' : 'var(--brand-bg)' }}>
                      {t.priority}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text3)' }}>{t.category}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text2)' }}>{t.tip}</p>
                </div>
              ))}
            </div>
          )}

          {/* Optimize tab */}
          {tab === 'optimize' && (
            <div className="max-w-2xl fade-up">
              {optimizing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--brand)' }}>
                    <div className="w-2 h-2 rounded-full pulse" style={{ background: 'var(--brand)' }} />
                    Rewriting your resume with all missing keywords...
                  </div>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-3 rounded-full pulse" style={{ width: `${50 + Math.random() * 45}%`, background: 'var(--bg3)' }} />
                  ))}
                </div>
              ) : optimized ? (
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => copyText(optimized)} className="btn btn-ghost text-xs py-1.5 px-3">
                      {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
                    </button>
                    <button onClick={() => downloadTXT(optimized, 'optimized-resume.txt')} className="btn btn-ghost text-xs py-1.5 px-3">
                      <Download size={12} />.txt
                    </button>
                    <button onClick={() => downloadDOCX(optimized, 'optimized-resume.docx')} className="btn btn-outline text-xs py-1.5 px-3" style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }}>
                      <Download size={12} />.docx
                    </button>
                  </div>
                  <div className="card overflow-hidden">
                    <div className="px-4 py-2 border-b flex gap-1.5" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                      <span className="text-xs ml-2" style={{ color: 'var(--text3)' }}>optimized-resume.txt</span>
                    </div>
                    <pre className="p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto" style={{ color: 'var(--text2)' }}>{optimized}</pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles size={32} className="mx-auto mb-3" style={{ color: 'var(--text3)' }} />
                  <p className="text-sm" style={{ color: 'var(--text2)' }}>Click "Optimize Resume" to get an ATS-optimized version</p>
                </div>
              )}
            </div>
          )}

          {/* Variations tab */}
          {tab === 'variations' && (
            <div className="fade-up">
              {generatingVars ? (
                <div className="max-w-2xl space-y-2">
                  <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--brand)' }}>
                    <div className="w-2 h-2 rounded-full pulse" style={{ background: 'var(--brand)' }} />
                    Generating 3 ATS-optimized variations of your resume...
                  </div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-3 rounded-full pulse" style={{ width: `${50 + Math.random() * 45}%`, background: 'var(--bg3)' }} />
                  ))}
                </div>
              ) : variations ? (
                <div>
                  {/* Variation picker */}
                  <div className="flex gap-3 mb-5 flex-wrap">
                    {variations.map(v => (
                      <button key={v.id} onClick={() => setSelectedVar(v)}
                        className="card px-4 py-3 text-left transition-all"
                        style={{ borderColor: selectedVar?.id === v.id ? 'var(--brand)' : 'var(--border)', background: selectedVar?.id === v.id ? 'var(--brand-bg)' : 'var(--bg2)', minWidth: '160px' }}>
                        <div className="font-semibold text-sm mb-0.5" style={{ color: selectedVar?.id === v.id ? 'var(--brand)' : 'var(--text)' }}>{v.title}</div>
                        <div className="text-xs" style={{ color: 'var(--text3)' }}>{v.description}</div>
                        <div className="text-xs font-semibold mt-1.5" style={{ color: '#22c55e' }}>~{v.atsScore}% ATS</div>
                      </button>
                    ))}
                  </div>

                  {/* Selected variation */}
                  {selectedVar && (
                    <div className="max-w-2xl">
                      <div className="flex gap-2 flex-wrap mb-3">
                        <button onClick={() => copyText(selectedVar.resumeText)} className="btn btn-ghost text-xs py-1.5 px-3">
                          {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
                        </button>
                        <button onClick={() => downloadTXT(selectedVar.resumeText, `resume-${selectedVar.id}.txt`)} className="btn btn-ghost text-xs py-1.5 px-3">
                          <Download size={12} />.txt
                        </button>
                        <button onClick={() => downloadDOCX(selectedVar.resumeText, `resume-${selectedVar.id}.docx`)} className="btn btn-outline text-xs py-1.5 px-3" style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }}>
                          <Download size={12} />.docx
                        </button>
                      </div>
                      <div className="card overflow-hidden">
                        <div className="px-4 py-2 border-b flex items-center gap-2" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                          <span className="text-xs font-medium" style={{ color: 'var(--brand)' }}>{selectedVar.title}</span>
                          <span className="text-xs ml-auto" style={{ color: '#22c55e' }}>~{selectedVar.atsScore}% ATS Score</span>
                        </div>
                        <pre className="p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto" style={{ color: 'var(--text2)' }}>{selectedVar.resumeText}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles size={32} className="mx-auto mb-3" style={{ color: 'var(--text3)' }} />
                  <p className="text-sm" style={{ color: 'var(--text2)' }}>Click "AI Variations" to generate 3 optimized versions of your resume</p>
                </div>
              )}
            </div>
          )}
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
