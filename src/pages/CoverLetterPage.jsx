import React, { useState } from 'react'
import { Mail, Sparkles, Copy, Check, Download, FileText } from 'lucide-react'
import { extractTextFromFile, downloadAsTXT, downloadAsDOCX } from '../utils/fileParser'

const API_URL = 'https://api.anthropic.com/v1/messages'

async function generateCoverLetter(resume, jobDesc, tone) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: `You are an expert cover letter writer. Write professional, compelling cover letters that are tailored to the specific job. Use a ${tone} tone. Keep it to 3-4 paragraphs. Do not use placeholders — write specific content based on the resume and job description provided.`,
      messages: [{
        role: 'user',
        content: `Write a cover letter for this candidate applying to this job.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDesc}

Write a complete, ready-to-send cover letter. Include a greeting, 3-4 paragraphs, and a professional closing. Sign off with the candidate's name from their resume.`
      }]
    })
  })
  const data = await res.json()
  return data.content.map(b => b.text || '').join('')
}

export default function CoverLetterPage() {
  const [resume, setResume] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [tone, setTone] = useState('professional')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loadingFile, setLoadingFile] = useState('')
  const resumeRef = React.useRef()
  const jdRef = React.useRef()

  async function handleFile(file, setter) {
    setLoadingFile(setter === setResume ? 'resume' : 'jd')
    try {
      const text = await extractTextFromFile(file)
      setter(text)
    } catch(e) { alert(e.message) }
    finally { setLoadingFile('') }
  }

  async function handleGenerate() {
    if (!resume.trim() || !jobDesc.trim()) { setError('Please provide both resume and job description.'); return }
    setError(''); setLoading(true); setLetter('')
    try {
      const text = await generateCoverLetter(resume, jobDesc, tone)
      setLetter(text)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function handleCopy() {
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const TONES = [
    { value: 'professional', label: 'Professional' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'formal', label: 'Formal' },
    { value: 'conversational', label: 'Conversational' },
  ]

  function UploadArea({ value, onChange, label, refEl, loadKey }) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="section-label">{label}</label>
          {value && <span className="section-label">{value.trim().split(/\s+/).length} words</span>}
        </div>
        <div className="rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
          <input ref={refEl} type="file" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files[0], onChange)} className="hidden" />
          {loadingFile === loadKey ? (
            <div className="p-4 text-center text-xs" style={{ color: 'var(--brand-text)' }}>Extracting...</div>
          ) : value ? (
            <div className="relative">
              <textarea value={value} onChange={e => onChange(e.target.value)} rows={6}
                className="w-full bg-transparent p-3 text-xs font-mono leading-relaxed focus:outline-none"
                style={{ color: 'var(--text2)' }} spellCheck={false} />
              <button onClick={() => onChange('')} className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>✕ Clear</button>
            </div>
          ) : (
            <div className="p-6 text-center cursor-pointer" onClick={() => refEl.current?.click()}>
              <FileText size={20} className="mx-auto mb-1" style={{ color: 'var(--text3)' }} />
              <p className="text-sm" style={{ color: 'var(--text2)' }}>Drop or <span style={{ color: 'var(--brand-text)' }}>browse</span></p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>PDF, DOCX, TXT</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>Cover Letter Generator</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>AI writes a tailored cover letter matching your resume to the job</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <UploadArea value={resume} onChange={setResume} label="Your Resume" refEl={resumeRef} loadKey="resume" />
        <UploadArea value={jobDesc} onChange={setJobDesc} label="Job Description" refEl={jdRef} loadKey="jd" />
      </div>

      {/* Tone selector */}
      <div className="card p-4 mb-5">
        <p className="section-label mb-3">Tone</p>
        <div className="flex flex-wrap gap-2">
          {TONES.map(t => (
            <button key={t.value} onClick={() => setTone(t.value)}
              className="px-4 py-2 rounded-xl text-sm border transition-all"
              style={{
                borderColor: tone === t.value ? 'var(--brand)' : 'var(--border)',
                background: tone === t.value ? 'var(--brand-light)' : 'var(--bg3)',
                color: tone === t.value ? 'var(--brand-text)' : 'var(--text2)'
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>{error}</div>}

      <button onClick={handleGenerate} disabled={loading || !resume.trim() || !jobDesc.trim()} className="btn-brand mb-8">
        {loading ? (
          <><div className="w-4 h-4 border-2 rounded-full spin" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#000' }} />Generating...</>
        ) : (
          <><Sparkles size={15} />Generate Cover Letter</>
        )}
      </button>

      {loading && (
        <div className="card p-6 fade-up">
          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--brand-text)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand-text)' }} />
            Writing your cover letter...
          </div>
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-3 rounded-full animate-pulse mb-3" style={{ width: `${60+Math.random()*35}%`, background: 'var(--bg3)' }} />)}
        </div>
      )}

      {letter && (
        <div className="fade-up">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Mail size={16} style={{ color: 'var(--brand-text)' }} />
              <span className="section-label" style={{ color: 'var(--brand-text)' }}>Your Cover Letter</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-ghost text-xs py-1.5 px-3">
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
              <button onClick={() => downloadAsTXT(letter, 'cover-letter.txt')} className="btn-ghost text-xs py-1.5 px-3">
                <Download size={12} /> .txt
              </button>
              <button onClick={() => downloadAsDOCX(letter, 'cover-letter.docx')} className="btn-ghost text-xs py-1.5 px-3" style={{ color: 'var(--brand-text)', borderColor: 'var(--brand)' }}>
                <Download size={12} /> .docx
              </button>
            </div>
          </div>

          <div className="card p-6">
            <textarea
              value={letter}
              onChange={e => setLetter(e.target.value)}
              rows={20}
              className="w-full bg-transparent focus:outline-none text-sm leading-relaxed"
              style={{ color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", resize: 'vertical' }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text3)' }}>You can edit the letter directly above before downloading.</p>
        </div>
      )}
    </div>
  )
}
