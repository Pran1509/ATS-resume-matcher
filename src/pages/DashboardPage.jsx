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
    if (user) {
      getUserResumes(user.uid).then(r => { setResumes(r); setLoading(false) })
    }
  }, [user])

  async function handleDelete(id) {
    if (!confirm('Delete this resume?')) return
    await deleteResume(user.uid, id)
    setResumes(r => r.filter(x => x.id !== id))
  }

  const QUICK_ACTIONS = [
    { to: '/builder', icon: Plus, label: 'New Resume', color: 'var(--brand-text)', bg: 'var(--brand-light)' },
    { to: '/ats', icon: Target, label: 'ATS Matcher', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { to: '/cover-letter', icon: Mail, label: 'Cover Letter', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <img src={user?.photoURL} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
              Welcome back, {user?.displayName?.split(' ')[0]}!
            </h1>
            <p className="text-sm" style={{ color: 'var(--text2)' }}>What would you like to do today?</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {QUICK_ACTIONS.map(({ to, icon: Icon, label, color, bg }) => (
          <Link key={to} to={to} className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <span className="font-medium" style={{ color: 'var(--text)' }}>{label}</span>
            <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text3)' }} />
          </Link>
        ))}
      </div>

      {/* Resumes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg" style={{ color: 'var(--text)' }}>My Resumes</h2>
          <Link to="/builder" className="btn-brand text-sm px-4 py-2">
            <Plus size={14} /> New Resume
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="card p-5 h-36 animate-pulse" style={{ background: 'var(--bg3)' }} />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={40} className="mx-auto mb-4" style={{ color: 'var(--text3)' }} />
            <p className="font-medium mb-2" style={{ color: 'var(--text)' }}>No resumes yet</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>Create your first resume or use one of our samples</p>
            <Link to="/builder" className="btn-brand inline-flex">
              <Plus size={15} /> Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map(r => (
              <div key={r.id} className="card p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-light)' }}>
                    <FileText size={16} style={{ color: 'var(--brand-text)' }} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/builder?id=${r.id}`} className="p-1.5 rounded-lg hover:bg-opacity-50 transition-colors" style={{ color: 'var(--text2)' }}>
                      <Edit size={14} />
                    </Link>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>
                  {r.personalInfo?.fullName || 'Untitled Resume'}
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text2)' }}>
                  {r.personalInfo?.email || ''}
                </p>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text3)' }}>
                  <Clock size={11} />
                  {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
