import React, { useState } from 'react'
import { Copy, Check, Download, FileText, File } from 'lucide-react'
import { downloadAsTXT, downloadAsDOCX } from '../utils/fileParser'

export default function OptimizedResume({ text, isLoading }) {
  const [copied, setCopied] = useState(false)
  const [downloadingDocx, setDownloadingDocx] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownloadTXT() {
    downloadAsTXT(text, 'optimized-resume.txt')
  }

  async function handleDownloadDOCX() {
    setDownloadingDocx(true)
    try {
      await downloadAsDOCX(text, 'optimized-resume.docx')
    } catch (e) {
      alert('Failed to generate DOCX: ' + e.message)
    } finally {
      setDownloadingDocx(false)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-acid animate-pulse" />
          <span className="text-sm text-acid font-mono">Optimizing your resume...</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded-full bg-ink-600 animate-pulse"
              style={{ width: `${55 + Math.random() * 40}%`, animationDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
        <p className="text-xs text-mist mt-4">
          Claude is rewriting your resume with all missing keywords and stronger phrasing...
        </p>
      </div>
    )
  }

  if (!text) return null

  const wordCount = text.trim().split(/\s+/).length
  const charCount = text.length

  return (
    <div className="animate-slide-up space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-acid" />
          <span className="text-xs font-mono text-acid uppercase tracking-widest">ATS-Optimized Resume</span>
          <span className="text-xs text-mist font-mono">· {wordCount} words · {charCount} chars</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-600 hover:bg-ink-700 text-xs text-frost-dim hover:text-frost transition-colors border border-ink-600"
        >
          {copied ? <Check size={12} className="text-acid" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>

        <button
          onClick={handleDownloadTXT}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-700 hover:bg-ink-600 text-xs text-frost-dim border border-ink-600 transition-colors"
        >
          <FileText size={12} />
          Download .txt
        </button>

        <button
          onClick={handleDownloadDOCX}
          disabled={downloadingDocx}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-acid/10 hover:bg-acid/20 text-xs text-acid border border-acid/30 transition-colors disabled:opacity-50"
        >
          {downloadingDocx ? (
            <>
              <div className="w-3 h-3 border border-acid/30 border-t-acid rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <File size={12} />
              Download .docx
            </>
          )}
        </button>
      </div>

      <div className="bg-ink-700 rounded-xl border border-ink-600 overflow-hidden">
        <div className="bg-ink-800 px-4 py-2 border-b border-ink-600 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-400/50" />
          <div className="w-3 h-3 rounded-full bg-acid/50" />
          <span className="text-xs text-mist font-mono ml-2">optimized-resume.txt</span>
        </div>
        <div className="p-5 max-h-[560px] overflow-y-auto">
          <pre className="text-sm text-frost-dim font-mono leading-relaxed whitespace-pre-wrap break-words">
            {text}
          </pre>
        </div>
      </div>

      <p className="text-xs text-mist">
        Download as .docx to open in Word and apply your own formatting, or use .txt to paste directly into job applications.
      </p>
    </div>
  )
}
