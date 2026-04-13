import React from 'react'
import { Zap, Minus, ChevronDown } from 'lucide-react'

const PRIORITY_STYLES = {
  high: { bg: 'bg-red-500/10 border-red-500/25', dot: '#f87171', label: 'High' },
  medium: { bg: 'bg-amber-400/10 border-amber-400/25', dot: '#fbbf24', label: 'Medium' },
  low: { bg: 'bg-sky-400/10 border-sky-400/25', dot: '#7dd3fc', label: 'Low' },
}

export default function TipsPanel({ tips }) {
  if (!tips?.length) return null

  const sorted = [...tips].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
  })

  return (
    <div className="animate-slide-up space-y-3 stagger">
      {sorted.map((tip, i) => {
        const s = PRIORITY_STYLES[tip.priority] || PRIORITY_STYLES.low
        return (
          <div
            key={i}
            className={`rounded-xl border p-4 ${s.bg}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: s.dot }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: s.dot }}>
                    {s.label}
                  </span>
                  <span className="text-xs text-mist">·</span>
                  <span className="text-xs text-mist">{tip.category}</span>
                </div>
                <p className="text-sm text-frost-dim leading-relaxed">{tip.tip}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
