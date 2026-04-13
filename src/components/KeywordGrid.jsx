import React from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

function Pill({ word, type }) {
  const styles = {
    matched: 'bg-acid/10 text-acid border border-acid/30',
    missing: 'bg-red-500/10 text-red-400 border border-red-500/25',
    partial: 'bg-amber-400/10 text-amber-400 border border-amber-400/25',
  }

  return (
    <span className={`keyword-pill ${styles[type]}`}>
      {word}
    </span>
  )
}

function Section({ title, icon: Icon, iconColor, words, type, emptyMsg }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: iconColor }} />
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: iconColor }}>
          {title}
        </span>
        <span className="text-xs text-mist ml-auto">{words.length}</span>
      </div>
      {words.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {words.map((w) => <Pill key={w} word={w} type={type} />)}
        </div>
      ) : (
        <p className="text-xs text-mist italic">{emptyMsg}</p>
      )}
    </div>
  )
}

export default function KeywordGrid({ keywords }) {
  if (!keywords) return null
  const { matched = [], missing = [], partial = [] } = keywords

  return (
    <div className="animate-slide-up space-y-5">
      <Section
        title="Matched"
        icon={CheckCircle}
        iconColor="#c8f135"
        words={matched}
        type="matched"
        emptyMsg="No direct matches found."
      />
      <div className="border-t border-ink-600" />
      <Section
        title="Partially Matched"
        icon={AlertCircle}
        iconColor="#fbbf24"
        words={partial}
        type="partial"
        emptyMsg="No partial matches."
      />
      <div className="border-t border-ink-600" />
      <Section
        title="Missing — Add These"
        icon={XCircle}
        iconColor="#f87171"
        words={missing}
        type="missing"
        emptyMsg="Great — no critical keywords missing!"
      />
    </div>
  )
}
