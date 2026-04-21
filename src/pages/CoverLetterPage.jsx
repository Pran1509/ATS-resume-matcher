import React, { useState, useRef } from 'react'
import { Sparkles, Copy, Check, Download, FileText, Type, Upload } from 'lucide-react'
import { generateCoverLetter } from '../utils/api'
import { extractTextFromFile, downloadTXT, downloadDOCX } from '../utils/fileParser'

const TONES = [
  { value: 'professional', label: '💼 Professional' },
  { value: 'enthusiastic', label: '🔥 Enthusiastic' },
  { value: 'formal', label: '🎩 Formal' },
  { value: 'conversational', label: '💬 Conversational' },
]

function InputToggle({ label, value, onChange }) {
  const [mode, setMode] = useState('paste') // 'paste' | 'upload'
  const [loading, setLoading] = useState(false)
  const [fname, setFname] = useState('')
  const ref = useRef()

  async function handleFile(file) {
    setLoading(true); setFname(file.name)
    try { onChange(await extractTextFromFile(file)) }
    catch (e) { alert(e.message); setFname('') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="lbl">{label}</label>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setMode('paste')} className="flex items-center gap-1 px-2.5 py-1 text-xs transition-colors"
            style={{ background: mode === 'paste' ? 'var(--brand)' : 'var(--bg3)', color: mode === 'paste' ? 'white' : 'var(--text2)' }}>
            <Type size={11} />Paste
          </button>
          <button onClick={() => setMode('upload')} className="flex items-center gap-1 px-2.5 py-1 text-xs transition-colors"
            style={{ background: mode === 'upload' ? 'var(--brand)' : 'var(--bg3)', color: mode === 'upload' ? 'white' : 'var(--text2)' }}>
            <Upload size={11} />Upload
          </button>
        </div>
      </div>

      {mode === 'paste' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          placeholder={`Paste ${label.toLowerCase()} here...`}
          rows={8} className="inp" />
      ) : (
        <div>
          <input ref={ref} type="file" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files[0])} className="hidden" />
          {loading ? (
            <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
              <div className="w-5 h-5 border-2 rounded-full spin mx-auto mb-2" style={{ borderColor: 'var(--bg4)', borderTopColor: 'var(--brand)' }} />
              <p className="text-xs" style={{ color: 'var(--brand)' }}>Reading {fname}...</p>
            </div>
          ) : value ? (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
              <div className="px-3 py-2 border-b flex items-center gap-1.5" style={{ borderColor: 'var(--border)' }}>
                <FileText size={11} style={{ color: 'var(--brand)' }} />
                <span className="text-xs" style={{ color: 'var(--brand)' }}>{fname}</span>
                <button onClick={() => { onChange(''); setFname('') }} className="ml-auto text-xs" style={{ color: 'var(--text3)' }}>✕ Clear</button>
              </div>
              <textarea value={value} onChange={e => onChange(e.target.value)} rows={7}
                className="w-full bg-transparent px-3 pb-3 text-xs font-mono leading-relaxed focus:outline-none"
                style={{ color: 'var(--text2)' }} spellCheck={false} />
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer"
              style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}
              onClick={() => ref.current?.click()}>
              <Upload size={22} className="mx-auto mb-2" style={{ color: 'var(--text3)' }} />
              <p className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Drop or <span style={{ color: 'var(--brand)' }}>browse</span></p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>PDF · DOCX · TXT</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CoverLetterPage() {
  const [resume, setResume] = useState('')
  const [jd, setJd] = useState('')
  const [tone, setTone] = useState('professional')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!resume.trim() || !jd.trim()) { setError('Please provide both resume and job description.'); return }
    setError(''); setLoading(true); setLetter('')
    try { setLetter(await generateCoverLetter(resume, jd, tone)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function handleCopy() { navigator.clipboard.writeText(letter); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Cover Letter Generator</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>AI writes a tailored cover letter from your resume and job description</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <InputToggle label="Your Resume" value={resume} onChange={setResume} />
        <InputToggle label="Job Description" value={jd} onChange={setJd} />
      </div>

      {/* Tone */}
      <div className="card p-4 mb-5">
        <label className="lbl mb-3">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            <button key={t.value} onClick={() => setTone(t.value)}
              className="px-4 py-2 rounded-xl text-sm border transition-all"
              style={{ borderColor: tone === t.value ? 'var(--brand)' : 'var(--border)', background: tone === t.value ? 'var(--brand-bg)' : 'var(--bg3)', color: tone === t.value ? 'var(--brand)' : 'var(--text2)', fontWeight: tone === t.value ? 600 : 400 }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

      <button onClick={handleGenerate} disabled={loading || !resume.trim() || !jd.trim()} className="btn btn-primary mb-8">
        {loading ? (
          <><div className="w-4 h-4 border-2 rounded-full spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Writing cover letter...</>
        ) : (
          <><Sparkles size={15} />Generate Cover Letter</>
        )}
      </button>

      {loading && (
        <div className="card p-6 fade-up space-y-2">
          <div className="flex items-center gap-2 text-sm mb-3" style={{ color: 'var(--brand)' }}>
            <div className="w-2 h-2 rounded-full pulse" style={{ background: 'var(--brand)' }} />
            Crafting your personalized cover letter...
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 rounded-full pulse" style={{ width: `${55 + Math.random() * 40}%`, background: 'var(--bg3)' }} />
          ))}
        </div>
      )}

      {letter && !loading && (
        <div className="fade-up">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="lbl" style={{ color: 'var(--brand)' }}>Your Cover Letter</span>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn btn-ghost text-xs py-1.5 px-3">
                {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
              </button>
              <button onClick={() => downloadTXT(letter, 'cover-letter.txt')} className="btn btn-ghost text-xs py-1.5 px-3">
                <Download size={12} />.txt
              </button>
              <button onClick={() => downloadDOCX(letter, 'cover-letter.docx')} className="btn btn-outline text-xs py-1.5 px-3" style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }}>
                <Download size={12} />.docx
              </button>
            </div>
          </div>
          <div className="card p-6">
            <textarea value={letter} onChange={e => setLetter(e.target.value)} rows={22}
              className="w-full bg-transparent focus:outline-none text-sm leading-relaxed"
              style={{ color: 'var(--text)', fontFamily: 'Inter, sans-serif', resize: 'vertical' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text3)' }}>You can edit directly above before downloading.</p>
        </div>
      )}
    </div>
  )
}
