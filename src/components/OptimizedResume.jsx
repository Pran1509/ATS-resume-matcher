import React, { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'

export default function OptimizedResume({ text, isLoading }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload() {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'optimized-resume.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-acid animate-pulse" />
          <span className="text-sm text-acid font-mono">Optimizing your resume…</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded-full bg-ink-600 animate-pulse"
              style={{ width: `${60 + Math.random() * 35}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!text) return null

  return (
    <div className="animate-slide-up space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-acid" />
          <span className="text-xs font-mono text-acid uppercase tracking-widest">ATS-Optimized</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-600 hover:bg-ink-700 text-xs text-frost-dim hover:text-frost transition-colors"
          >
            {copied ? <Check size={12} className="text-acid" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-acid/10 hover:bg-acid/20 text-xs text-acid border border-acid/30 transition-colors"
          >
            <Download size={12} />
            Download .txt
          </button>
        </div>
      </div>

      {/* Resume text */}
      <div className="bg-ink-700 rounded-xl border border-ink-600 p-5 max-h-[520px] overflow-y-auto">
        <pre className="text-sm text-frost-dim font-mono leading-relaxed whitespace-pre-wrap break-words">
          {text}
        </pre>
      </div>

      <p className="text-xs text-mist">
        💡 Paste this directly into your job application's text field or copy into your resume template.
      </p>
    </div>
  )
}
