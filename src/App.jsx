import React, { useState } from 'react'
import { Zap, RotateCcw, Sparkles, FileText, Briefcase, BarChart2, Tag, Lightbulb, Wand2 } from 'lucide-react'
import { analyzeATS, optimizeResume } from './utils/atsAnalyzer'
import ScoreCard from './components/ScoreCard'
import KeywordGrid from './components/KeywordGrid'
import TipsPanel from './components/TipsPanel'
import OptimizedResume from './components/OptimizedResume'

const TABS = [
  { id: 'score', label: 'Score', icon: BarChart2 },
  { id: 'keywords', label: 'Keywords', icon: Tag },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
  { id: 'optimized', label: 'Optimized Resume', icon: Wand2 },
]

const SAMPLE_RESUME = `Jane Smith
jane@email.com | LinkedIn: linkedin.com/in/janesmith | (555) 123-4567

SUMMARY
Results-driven software engineer with 4 years of experience building web applications.

EXPERIENCE
Software Engineer — Acme Corp (2021–Present)
• Built React dashboards used by 10,000 users
• Wrote REST APIs with Node.js and Express
• Worked in an Agile team using Jira

Junior Developer — StartupXYZ (2019–2021)
• Maintained legacy PHP application
• Wrote unit tests with Jest

SKILLS
JavaScript, React, Node.js, HTML, CSS, Git, SQL

EDUCATION
B.Sc. Computer Science — State University, 2019`

const SAMPLE_JD = `Senior Frontend Engineer — TechCorp

We're looking for a Senior Frontend Engineer to join our growing team.

Requirements:
• 4+ years of experience with React and TypeScript
• Strong knowledge of modern CSS, Tailwind CSS, and responsive design
• Experience with REST APIs and GraphQL
• Familiarity with CI/CD pipelines and Docker
• Experience with testing frameworks (Jest, Cypress)
• Strong communication and collaboration skills in an Agile/Scrum environment
• Experience with performance optimization and Core Web Vitals
• Bonus: experience with Next.js or Remix`

export default function App() {
  const [resume, setResume] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [optimized, setOptimized] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('score')

  async function handleAnalyze() {
    if (!resume.trim() || !jobDesc.trim()) {
      setError('Please paste both your resume and the job description.')
      return
    }
    setError('')
    setAnalyzing(true)
    setResult(null)
    setOptimized('')
    setActiveTab('score')
    try {
      const data = await analyzeATS(resume, jobDesc)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleOptimize() {
    if (!result) return
    setOptimizing(true)
    setActiveTab('optimized')
    setOptimized('')
    try {
      const text = await optimizeResume(resume, jobDesc, result)
      setOptimized(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setOptimizing(false)
    }
  }

  function handleReset() {
    setResume('')
    setJobDesc('')
    setResult(null)
    setOptimized('')
    setError('')
    setActiveTab('score')
  }

  function loadSample() {
    setResume(SAMPLE_RESUME)
    setJobDesc(SAMPLE_JD)
    setError('')
  }

  return (
    <div className="min-h-screen bg-ink" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-ink-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-acid/15 border border-acid/30 flex items-center justify-center">
              <Zap size={16} className="text-acid" />
            </div>
            <span className="font-display font-bold text-lg text-frost">ATS Resume Matcher</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadSample}
              className="text-xs text-mist hover:text-frost-dim transition-colors px-3 py-1.5 rounded-lg hover:bg-ink-700"
            >
              Load Sample
            </button>
            {result && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-mist hover:text-frost-dim transition-colors px-3 py-1.5 rounded-lg hover:bg-ink-700"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Resume */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-mono text-mist uppercase tracking-widest">
              <FileText size={12} />
              Your Resume
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here (plain text)…"
              rows={12}
              className="w-full bg-ink-700 border border-ink-600 rounded-xl px-4 py-3 text-sm text-frost-dim placeholder-mist/50 focus:outline-none focus:border-acid/50 focus:ring-1 focus:ring-acid/20 transition-colors"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-mono text-mist uppercase tracking-widest">
              <Briefcase size={12} />
              Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description here…"
              rows={12}
              className="w-full bg-ink-700 border border-ink-600 rounded-xl px-4 py-3 text-sm text-frost-dim placeholder-mist/50 focus:outline-none focus:border-acid/50 focus:ring-1 focus:ring-acid/20 transition-colors"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Analyze button */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm bg-acid text-ink hover:bg-acid-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Zap size={15} />
                Analyze Resume
              </>
            )}
          </button>

          {result && (
            <button
              onClick={handleOptimize}
              disabled={optimizing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm bg-ink-700 border border-acid/30 text-acid hover:bg-acid/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {optimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-acid/30 border-t-acid rounded-full animate-spin" />
                  Optimizing…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Optimize Resume
                </>
              )}
            </button>
          )}
        </div>

        {/* Results */}
        {(result || optimizing) && (
          <div className="animate-slide-up">
            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-ink-700">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                const isOptTab = tab.id === 'optimized'
                const showDot = isOptTab && (optimizing || optimized)
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      isActive
                        ? 'border-acid text-acid'
                        : 'border-transparent text-mist hover:text-frost-dim'
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                    {showDot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div className="max-w-2xl">
              {activeTab === 'score' && <ScoreCard result={result} />}
              {activeTab === 'keywords' && <KeywordGrid keywords={result?.keywords} />}
              {activeTab === 'tips' && <TipsPanel tips={result?.tips} />}
              {activeTab === 'optimized' && (
                <OptimizedResume text={optimized} isLoading={optimizing} />
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !analyzing && (
          <div className="text-center py-16 text-mist">
            <div className="w-16 h-16 rounded-2xl bg-ink-700 border border-ink-600 flex items-center justify-center mx-auto mb-4">
              <Zap size={24} className="text-mist/50" />
            </div>
            <p className="text-sm">Paste your resume and a job description above to get started.</p>
            <button onClick={loadSample} className="mt-3 text-xs text-acid/70 hover:text-acid underline underline-offset-2">
              Or try with a sample →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
