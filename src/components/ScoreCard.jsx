import React, { useEffect, useRef } from 'react'

const GRADE_COLORS = {
  A: '#c8f135',
  B: '#7dd3fc',
  C: '#fbbf24',
  D: '#fb923c',
  F: '#f87171',
}

const CIRCUMFERENCE = 339 // 2 * π * 54

function SectionBar({ label, score, delay }) {
  return (
    <div className="space-y-1" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-mist uppercase tracking-widest">{label}</span>
        <span className="text-sm font-semibold" style={{ color: scoreColor(score) }}>{score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-ink-600 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: scoreColor(score),
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}

function scoreColor(score) {
  if (score >= 80) return '#c8f135'
  if (score >= 60) return '#7dd3fc'
  if (score >= 40) return '#fbbf24'
  return '#f87171'
}

export default function ScoreCard({ result }) {
  const ringRef = useRef(null)

  useEffect(() => {
    if (!ringRef.current || !result) return
    const offset = CIRCUMFERENCE - (CIRCUMFERENCE * result.overallScore) / 100
    setTimeout(() => {
      if (ringRef.current) ringRef.current.style.strokeDashoffset = offset
    }, 100)
  }, [result])

  if (!result) return null

  const gradeColor = GRADE_COLORS[result.grade] || '#8888aa'
  const { sections } = result

  return (
    <div className="animate-slide-up space-y-6">
      {/* Overall score ring */}
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="#1c1c28" strokeWidth="10" />
            {/* Fill */}
            <circle
              ref={ringRef}
              cx="60" cy="60" r="54"
              fill="none"
              stroke={gradeColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              transform="rotate(-90 60 60)"
              className="score-ring-fill"
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            />
            {/* Score text */}
            <text x="60" y="54" textAnchor="middle" fill={gradeColor} fontSize="28" fontWeight="700" fontFamily="Syne">
              {result.overallScore}
            </text>
            <text x="60" y="72" textAnchor="middle" fill="#8888aa" fontSize="11" fontFamily="DM Sans">
              / 100
            </text>
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-4xl font-display font-bold"
              style={{ color: gradeColor }}
            >
              {result.grade}
            </span>
            <span className="text-sm text-mist">ATS Grade</span>
          </div>
          <p className="text-sm text-frost-dim leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="bg-ink-700 rounded-xl p-4 space-y-3 stagger">
        <p className="text-xs font-mono text-mist uppercase tracking-widest mb-4">Section Breakdown</p>
        <SectionBar label="Skills" score={sections.skills.score} delay={0} />
        <SectionBar label="Experience" score={sections.experience.score} delay={80} />
        <SectionBar label="Education" score={sections.education.score} delay={160} />
        <SectionBar label="Keywords" score={sections.keywords.score} delay={240} />
      </div>

      {/* Section comments */}
      <div className="space-y-2 stagger">
        {Object.entries(sections).map(([key, val]) => (
          <div key={key} className="flex gap-3 text-sm">
            <span className="text-mist font-mono capitalize min-w-[80px]">{key}</span>
            <span className="text-frost-dim">{val.comment}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
