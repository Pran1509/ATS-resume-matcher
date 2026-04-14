import React, { useState } from 'react'
import { Plus, Trash2, Save, Download, ChevronDown, ChevronUp, Eye, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { saveResume } from '../utils/firebase'
import { SAMPLE_RESUMES, RESUME_TEMPLATES } from '../data/sampleResumes'
import { downloadAsDOCX, downloadAsTXT } from '../utils/fileParser'

const EMPTY_RESUME = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  template: 'modern'
}

function uid() { return Math.random().toString(36).slice(2) }

export default function BuilderPage() {
  const { user, isLoggedIn } = useAuth()
  const [resume, setResume] = useState(EMPTY_RESUME)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSamples, setShowSamples] = useState(!resume.personalInfo.fullName)
  const [newSkill, setNewSkill] = useState('')
  const [newCert, setNewCert] = useState('')

  function setPersonal(field, val) {
    setResume(r => ({ ...r, personalInfo: { ...r.personalInfo, [field]: val } }))
  }

  function addExp() {
    setResume(r => ({ ...r, experience: [...r.experience, { id: uid(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }] }))
  }
  function updateExp(id, field, val) {
    setResume(r => ({ ...r, experience: r.experience.map(e => e.id === id ? { ...e, [field]: val } : e) }))
  }
  function removeExp(id) { setResume(r => ({ ...r, experience: r.experience.filter(e => e.id !== id) })) }
  function addBullet(id) { updateExp(id, 'bullets', resume.experience.find(e => e.id === id).bullets.concat('')) }
  function updateBullet(id, i, val) { const e = resume.experience.find(x => x.id === id); const b = [...e.bullets]; b[i] = val; updateExp(id, 'bullets', b) }
  function removeBullet(id, i) { const e = resume.experience.find(x => x.id === id); updateExp(id, 'bullets', e.bullets.filter((_,idx) => idx !== i)) }

  function addEdu() {
    setResume(r => ({ ...r, education: [...r.education, { id: uid(), degree: '', school: '', location: '', graduationDate: '', gpa: '' }] }))
  }
  function updateEdu(id, field, val) { setResume(r => ({ ...r, education: r.education.map(e => e.id === id ? { ...e, [field]: val } : e) })) }
  function removeEdu(id) { setResume(r => ({ ...r, education: r.education.filter(e => e.id !== id) })) }

  function addSkill() { if (newSkill.trim()) { setResume(r => ({ ...r, skills: [...r.skills, newSkill.trim()] })); setNewSkill('') } }
  function removeSkill(s) { setResume(r => ({ ...r, skills: r.skills.filter(x => x !== s) })) }
  function addCert() { if (newCert.trim()) { setResume(r => ({ ...r, certifications: [...r.certifications, newCert.trim()] })); setNewCert('') } }
  function removeCert(c) { setResume(r => ({ ...r, certifications: r.certifications.filter(x => x !== c) })) }

  async function handleSave() {
    if (!isLoggedIn) { alert('Sign in to save resumes'); return }
    setSaving(true)
    await saveResume(user.uid, resume)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setSaving(false)
  }

  function loadSample(sample) {
    setResume({ ...EMPTY_RESUME, ...sample.data })
    setShowSamples(false)
  }

  function resumeToText() {
    const p = resume.personalInfo
    let txt = `${p.fullName}\n${p.email} | ${p.phone} | ${p.location}\n`
    if (p.linkedin) txt += `${p.linkedin}\n`
    if (p.summary) txt += `\nSUMMARY\n${p.summary}\n`
    if (resume.experience.length) {
      txt += `\nEXPERIENCE\n`
      resume.experience.forEach(e => {
        txt += `\n${e.title} — ${e.company} | ${e.location}\n${e.startDate} – ${e.current ? 'Present' : e.endDate}\n`
        e.bullets.forEach(b => { if(b) txt += `• ${b}\n` })
      })
    }
    if (resume.education.length) {
      txt += `\nEDUCATION\n`
      resume.education.forEach(e => { txt += `${e.degree} — ${e.school} | ${e.graduationDate}${e.gpa ? ` | GPA: ${e.gpa}` : ''}\n` })
    }
    if (resume.skills.length) txt += `\nSKILLS\n${resume.skills.join(', ')}\n`
    if (resume.certifications.length) txt += `\nCERTIFICATIONS\n${resume.certifications.join(', ')}\n`
    return txt
  }

  const Section = ({ title, children, action }) => (
    <div className="card p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )

  const Field = ({ label, value, onChange, placeholder, type = 'text', rows }) => (
    <div>
      <label className="section-label block mb-1">{label}</label>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="input" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input" />
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>Resume Builder</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>Build a professional ATS-friendly resume</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowSamples(!showSamples)} className="btn-ghost text-sm">
            <Sparkles size={14} /> Samples
          </button>
          <button onClick={() => downloadAsTXT(resumeToText(), 'resume.txt')} className="btn-ghost text-sm">
            <Download size={14} /> .txt
          </button>
          <button onClick={() => downloadAsDOCX(resumeToText(), 'resume.docx')} className="btn-ghost text-sm" style={{ color: 'var(--brand-text)', borderColor: 'var(--brand)' }}>
            <Download size={14} /> .docx
          </button>
          {isLoggedIn && (
            <button onClick={handleSave} disabled={saving} className="btn-brand text-sm">
              <Save size={14} /> {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Sample resumes */}
      {showSamples && (
        <div className="card p-5 mb-6 fade-up">
          <p className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Start from a sample resume</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SAMPLE_RESUMES.map(s => (
              <button key={s.id} onClick={() => loadSample(s)}
                className="card p-3 text-center hover:shadow-md transition-all text-sm"
                style={{ borderColor: 'var(--border)' }}>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="font-medium text-xs" style={{ color: 'var(--text)' }}>{s.title}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{s.industry}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template picker */}
      <div className="card p-4 mb-4">
        <p className="section-label mb-3">Template</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RESUME_TEMPLATES.map(t => (
            <button key={t.id} onClick={() => setResume(r => ({ ...r, template: t.id }))}
              className="p-3 rounded-xl text-center text-sm transition-all border"
              style={{
                borderColor: resume.template === t.id ? 'var(--brand)' : 'var(--border)',
                background: resume.template === t.id ? 'var(--brand-light)' : 'var(--bg3)',
                color: resume.template === t.id ? 'var(--brand-text)' : 'var(--text2)'
              }}>
              <div className="text-xl mb-1">{t.preview}</div>
              <div className="font-medium">{t.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name" value={resume.personalInfo.fullName} onChange={v => setPersonal('fullName', v)} placeholder="Jane Smith" />
          <Field label="Email" value={resume.personalInfo.email} onChange={v => setPersonal('email', v)} placeholder="jane@email.com" />
          <Field label="Phone" value={resume.personalInfo.phone} onChange={v => setPersonal('phone', v)} placeholder="(555) 000-0000" />
          <Field label="Location" value={resume.personalInfo.location} onChange={v => setPersonal('location', v)} placeholder="Toronto, ON" />
          <Field label="LinkedIn" value={resume.personalInfo.linkedin} onChange={v => setPersonal('linkedin', v)} placeholder="linkedin.com/in/..." />
          <Field label="Website" value={resume.personalInfo.website} onChange={v => setPersonal('website', v)} placeholder="yoursite.com" />
        </div>
        <div className="mt-3">
          <Field label="Professional Summary" value={resume.personalInfo.summary} onChange={v => setPersonal('summary', v)} placeholder="2-3 sentences highlighting your experience and value..." rows={3} />
        </div>
      </Section>

      {/* Experience */}
      <Section title="Work Experience" action={<button onClick={addExp} className="btn-ghost text-xs py-1.5 px-3"><Plus size={12} />Add</button>}>
        {resume.experience.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text3)' }}>No experience added yet</p>}
        {resume.experience.map((exp, idx) => (
          <div key={exp.id} className="border rounded-xl p-4 mb-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>Position {idx + 1}</span>
              <button onClick={() => removeExp(exp.id)} style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label="Job Title" value={exp.title} onChange={v => updateExp(exp.id, 'title', v)} placeholder="Software Engineer" />
              <Field label="Company" value={exp.company} onChange={v => updateExp(exp.id, 'company', v)} placeholder="Company Name" />
              <Field label="Location" value={exp.location} onChange={v => updateExp(exp.id, 'location', v)} placeholder="City, Province" />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start" value={exp.startDate} onChange={v => updateExp(exp.id, 'startDate', v)} placeholder="Jan 2022" />
                <Field label="End" value={exp.current ? 'Present' : exp.endDate} onChange={v => updateExp(exp.id, 'endDate', v)} placeholder="Present" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" checked={exp.current} onChange={e => updateExp(exp.id, 'current', e.target.checked)} id={`cur-${exp.id}`} />
              <label htmlFor={`cur-${exp.id}`} className="text-xs" style={{ color: 'var(--text2)' }}>Currently working here</label>
            </div>
            <label className="section-label block mb-2">Bullet Points</label>
            {exp.bullets.map((b, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="mt-2 text-xs" style={{ color: 'var(--text3)' }}>•</span>
                <input value={b} onChange={e => updateBullet(exp.id, i, e.target.value)} placeholder="Achieved X by doing Y, resulting in Z..." className="input text-sm flex-1" />
                {exp.bullets.length > 1 && <button onClick={() => removeBullet(exp.id, i)} style={{ color: 'var(--text3)' }}><Trash2 size={12} /></button>}
              </div>
            ))}
            <button onClick={() => addBullet(exp.id)} className="text-xs mt-1" style={{ color: 'var(--brand-text)' }}><Plus size={11} className="inline" /> Add bullet</button>
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section title="Education" action={<button onClick={addEdu} className="btn-ghost text-xs py-1.5 px-3"><Plus size={12} />Add</button>}>
        {resume.education.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text3)' }}>No education added yet</p>}
        {resume.education.map((edu, idx) => (
          <div key={edu.id} className="border rounded-xl p-4 mb-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between mb-3">
              <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>Degree {idx + 1}</span>
              <button onClick={() => removeEdu(edu.id)} style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Degree" value={edu.degree} onChange={v => updateEdu(edu.id, 'degree', v)} placeholder="B.Sc. Computer Science" />
              <Field label="School" value={edu.school} onChange={v => updateEdu(edu.id, 'school', v)} placeholder="University Name" />
              <Field label="Location" value={edu.location} onChange={v => updateEdu(edu.id, 'location', v)} placeholder="City, Province" />
              <Field label="Graduation Date" value={edu.graduationDate} onChange={v => updateEdu(edu.id, 'graduationDate', v)} placeholder="May 2023" />
              <Field label="GPA (optional)" value={edu.gpa} onChange={v => updateEdu(edu.id, 'gpa', v)} placeholder="3.8" />
            </div>
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-2 mb-3">
          {resume.skills.map(s => (
            <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text2)', background: 'var(--bg3)' }}>
              {s} <button onClick={() => removeSkill(s)} style={{ color: 'var(--text3)' }}>×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Add a skill..." className="input text-sm flex-1" />
          <button onClick={addSkill} className="btn-ghost text-sm px-3"><Plus size={14} /></button>
        </div>
      </Section>

      {/* Certifications */}
      <Section title="Certifications">
        <div className="flex flex-wrap gap-2 mb-3">
          {resume.certifications.map(c => (
            <span key={c} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text2)', background: 'var(--bg3)' }}>
              {c} <button onClick={() => removeCert(c)} style={{ color: 'var(--text3)' }}>×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCert()} placeholder="Add a certification..." className="input text-sm flex-1" />
          <button onClick={addCert} className="btn-ghost text-sm px-3"><Plus size={14} /></button>
        </div>
      </Section>
    </div>
  )
}
