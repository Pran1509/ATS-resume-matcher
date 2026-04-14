import React, { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { extractTextFromFile } from '../utils/fileParser'

const ACCEPTED = '.pdf,.docx,.txt'

export default function FileUpload({ label, icon: Icon, value, onChange, placeholder }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setError('')
    setLoading(true)
    setFileName(file.name)
    try {
      const text = await extractTextFromFile(file)
      onChange(text)
    } catch (e) {
      setError(e.message)
      setFileName('')
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  function handleClear() {
    onChange('')
    setFileName('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const charCount = value.length
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-mono text-mist uppercase tracking-widest">
          <Icon size={12} />
          {label}
        </label>
        {value && (
          <span className="text-xs text-mist font-mono">
            {wordCount} words · {charCount} chars
          </span>
        )}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !value && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${dragging ? 'border-acid/60 bg-acid/5' : 'border-ink-600 hover:border-acid/30'}
          ${value ? 'cursor-default' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          onChange={handleChange}
          className="hidden"
        />

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center gap-3 p-6">
            <Loader size={18} className="text-acid animate-spin" />
            <span className="text-sm text-acid">Extracting text from {fileName}…</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-4">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setError(''); setFileName('') }}
              className="ml-auto text-mist hover:text-frost-dim"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* File loaded — show textarea */}
        {!loading && !error && value && (
          <div className="relative">
            {/* File badge */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <CheckCircle size={13} className="text-acid flex-shrink-0" />
              <span className="text-xs font-mono text-acid truncate">{fileName || 'Text entered'}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleClear() }}
                className="ml-auto text-mist hover:text-red-400 transition-colors flex-shrink-0"
                title="Clear"
              >
                <X size={13} />
              </button>
            </div>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={10}
              className="w-full bg-transparent px-4 pb-3 text-xs text-frost-dim font-mono leading-relaxed focus:outline-none"
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !value && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 px-4">
            <div className="w-12 h-12 rounded-xl bg-ink-600 border border-ink-600 flex items-center justify-center">
              <Upload size={20} className="text-mist" />
            </div>
            <div className="text-center">
              <p className="text-sm text-frost-dim mb-1">
                Drop your file here or <span className="text-acid underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-mist">PDF, DOCX, or TXT supported</p>
            </div>
            <div className="flex gap-2 mt-1">
              {['PDF', 'DOCX', 'TXT'].map(f => (
                <span key={f} className="text-xs font-mono px-2 py-0.5 rounded bg-ink-600 text-mist border border-ink-600">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual paste option */}
      {!value && !loading && (
        <button
          onClick={() => {
            const text = window.prompt('Paste your text here:')
            if (text) { onChange(text); setFileName('') }
          }}
          className="text-xs text-mist hover:text-frost-dim underline underline-offset-2 transition-colors"
        >
          Or paste text manually →
        </button>
      )}
    </div>
  )
}
