import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Trash2, Edit, Target, Mail, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getUserResumes, deleteResume } from '../utils/firebase'

export default function DashboardPage() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) getUserResumes(user.uid).then(r => { setResumes(r); setLoading(false) })
  }, [user])

  async function handleDelete(id) {
    if (!confirm('Delete this resume?')) return
    await deleteResume(user.uid, id)
    setResumes(r => r.filter(x => x.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <img src={user?.photoURL} alt="" className="w-10 h-10 rounded-full" />
        <div>
          <h1 className="font-bold text-2xl" style={{ color: 'var(--text)' }}>Welcome, {user?.displayName?.split(' ')[0]}!</h1>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>What would you like to do today?</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/builder', icon: Plus, label: 'New Resume', sub: 'Build from scratch or use a template', color: 'var(--brand)' },
          { to: '/ats', icon: Target, label: 'ATS Matcher', sub: 'Check resume against a job', color: '#22c55e' },
          { to: '/cover-letter', icon: Mail, label: 'Cover Letter', sub: 'Generate in seconds with AI', color: '#ec4899' },
        ].map(({ to, icon: Icon, label, sub, color }) => (
          <Link key={to} to={to} className="card p-5 flex items-center gap-4 hover:shadow-[var(--shadow-md)] transition-all group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>{sub}</p>
            </div>
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text3)' }} />
          </Link>
        ))}
      </div>

      {/* Saved resumes */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Saved Resumes</h2>
        <Link to="/builder" className="btn btn-primary text-sm py-2 px-4"><Plus size={13} />New</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-32 pulse" style={{ background: 'var(--bg3)' }} />)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText size={36} className="mx-auto mb-3" style={{ color: 'var(--text3)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>No resumes yet</p>
          <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>Create your first resume or start from a sample</p>
          <Link to="/builder" className="btn btn-primary inline-flex"><Plus size={14} />Create Resume</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map(r => (
            <div key={r.id} className="card p-5 group">
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-bg)' }}>
                  <FileText size={15} style={{ color: 'var(--brand)' }} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/builder?id=${r.id}`} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text2)' }}><Edit size={13} /></Link>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg" style={{ color: 'var(--red)' }}><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{r.personalInfo?.fullName || 'Untitled'}</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text2)' }}>{r.personalInfo?.title || r.personalInfo?.email || ''}</p>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text3)' }}>
                <Clock size={10} /> {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
