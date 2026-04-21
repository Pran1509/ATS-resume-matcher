import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, Download, Sparkles, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { saveResume } from '../utils/firebase'
import { TEMPLATES, SAMPLES } from '../data/samples'
import { downloadTXT, downloadDOCX } from '../utils/fileParser'
import ResumePreview from '../components/resume/ResumePreview'

const uid = () => Math.random().toString(36).slice(2)

const EMPTY = {
  template: 'modern',
  personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  certifications: []
}

function resumeToText(r) {
  const p = r.personalInfo
  let t = `${p.fullName}${p.title ? ' — ' + p.title : ''}\n`
  if (p.email) t += `${p.email}  `
  if (p.phone) t += `${p.phone}  `
  if (p.location) t += `${p.location}\n`
  if (p.linkedin) t += `${p.linkedin}  `
  if (p.website) t += `${p.website}\n`
  if (p.summary) t += `\nSUMMARY\n${p.summary}\n`
  if (r.experience.length) {
    t += `\nEXPERIENCE\n`
    r.experience.forEach(e => {
      t += `\n${e.title} — ${e.company}${e.location ? ', ' + e.location : ''}\n`
      t += `${e.startDate}${e.current ? ' – Present' : e.endDate ? ' – ' + e.endDate : ''}\n`
      e.bullets.filter(b => b.trim()).forEach(b => { t += `• ${b}\n` })
    })
  }
  if (r.education.length) {
    t += `\nEDUCATION\n`
    r.education.forEach(e => { t += `${e.degree} — ${e.school}${e.location ? ', ' + e.location : ''}${e.graduationDate ? '  ' + e.graduationDate : ''}${e.gpa ? '  GPA: ' + e.gpa : ''}\n` })
  }
  if (r.skills.length) t += `\nSKILLS\n${r.skills.join(', ')}\n`
  if (r.certifications.length) t += `\nCERTIFICATIONS\n${r.certifications.join(', ')}\n`
  return t
}

function Inp({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="lbl">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="inp" />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="lbl">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="inp" />
    </div>
  )
}

export default function BuilderPage() {
  const { user, isLoggedIn } = useAuth()
  const [resume, setResume] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(true)
  const [showSamples, setShowSamples] = useState(true)
  const [newSkill, setNewSkill] = useState('')
  const [newCert, setNewCert] = useState('')
  const [openSections, setOpenSections] = useState({ personal: true, experience: true, education: true, skills: true, certs: true })

  function set(path, val) {
    setResume(r => {
      const copy = JSON.parse(JSON.stringify(r))
      const keys = path.split('.')
      let obj = copy
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = val
      return copy
    })
  }

  function p(field) { return { value: resume.personalInfo[field] || '', onChange: v => set(`personalInfo.${field}`, v) } }

  function addExp() { setResume(r => ({ ...r, experience: [...r.experience, { id: uid(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: ['', '', ''] }] })) }
  function updExp(id, field, val) { setResume(r => ({ ...r, experience: r.experience.map(e => e.id === id ? { ...e, [field]: val } : e) })) }
  function delExp(id) { setResume(r => ({ ...r, experience: r.experience.filter(e => e.id !== id) })) }
  function updBullet(id, i, val) { const e = resume.experience.find(x => x.id === id); const b = [...e.bullets]; b[i] = val; updExp(id, 'bullets', b) }
  function addBullet(id) { const e = resume.experience.find(x => x.id === id); updExp(id, 'bullets', [...e.bullets, '']) }
  function delBullet(id, i) { const e = resume.experience.find(x => x.id === id); updExp(id, 'bullets', e.bullets.filter((_, j) => j !== i)) }

  function addEdu() { setResume(r => ({ ...r, education: [...r.education, { id: uid(), degree: '', school: '', location: '', graduationDate: '', gpa: '' }] })) }
  function updEdu(id, field, val) { setResume(r => ({ ...r, education: r.education.map(e => e.id === id ? { ...e, [field]: val } : e) })) }
  function delEdu(id) { setResume(r => ({ ...r, education: r.education.filter(e => e.id !== id) })) }

  function addSkill() { if (newSkill.trim()) { setResume(r => ({ ...r, skills: [...r.skills, newSkill.trim()] })); setNewSkill('') } }
  function addCert() { if (newCert.trim()) { setResume(r => ({ ...r, certifications: [...r.certifications, newCert.trim()] })); setNewCert('') } }

  async function handleSave() {
    if (!isLoggedIn) { alert('Sign in to save resumes'); return }
    setSaving(true)
    await saveResume(user.uid, resume)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
    setSaving(false)
  }

  function handlePrint() {
    const el = document.getElementById('resume-preview')
    if (!el) return
    const w = window.open('', '_blank')
    w.document.write(`<html><head><title>Resume</title><style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
      body{margin:0;padding:0;background:white;}
      ${document.querySelector('style')?.textContent || ''}
    </style></head><body>${el.outerHTML}</body></html>`)
    w.document.close()
    setTimeout(() => { w.print(); w.close() }, 800)
  }

  const toggle = key => setOpenSections(s => ({ ...s, [key]: !s[key] }))

  const Section = ({ id, title, children, action }) => (
    <div className="card mb-3 overflow-hidden">
      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-3.5 text-left"
        style={{ background: 'var(--bg2)' }}>
        <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{title}</span>
        <div className="flex items-center gap-2">
          {action}
          {openSections[id] ? <ChevronUp size={15} style={{ color: 'var(--text3)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text3)' }} />}
        </div>
      </button>
      {openSections[id] && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  )

  const previewScale = 0.52

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Resume Builder</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Build a professional resume with live preview</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setPreview(!preview)} className="btn btn-ghost text-sm">
            {preview ? <EyeOff size={14} /> : <Eye size={14} />} {preview ? 'Hide' : 'Show'} Preview
          </button>
          <button onClick={() => downloadTXT(resumeToText(resume), 'resume.txt')} className="btn btn-ghost text-sm">
            <Download size={14} /> .txt
          </button>
          <button onClick={() => downloadDOCX(resumeToText(resume), 'resume.docx')} className="btn btn-outline text-sm" style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }}>
            <Download size={14} /> .docx
          </button>
          <button onClick={handlePrint} className="btn btn-outline text-sm">
            <Download size={14} /> PDF
          </button>
          {isLoggedIn && (
            <button onClick={handleSave} disabled={saving} className="btn btn-primary text-sm">
              <Save size={14} /> {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
            </button>
          )}
        </div>
      </div>

      <div className={`flex gap-6 ${preview ? 'flex-col xl:flex-row' : ''}`}>
        {/* Left: Form */}
        <div className={preview ? 'xl:w-[420px] flex-shrink-0' : 'w-full'}>
          {/* Sample picker */}
          <div className="card mb-3 overflow-hidden">
            <button onClick={() => setShowSamples(!showSamples)} className="w-full flex items-center justify-between px-5 py-3.5"
              style={{ background: 'var(--bg2)' }}>
              <span className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Sparkles size={14} style={{ color: 'var(--brand)' }} /> Start from Sample
              </span>
              {showSamples ? <ChevronUp size={15} style={{ color: 'var(--text3)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text3)' }} />}
            </button>
            {showSamples && (
              <div className="px-5 pb-4 pt-1">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {SAMPLES.map(s => (
                    <button key={s.id} onClick={() => { setResume({ ...EMPTY, ...s.data }); setShowSamples(false) }}
                      className="card p-3 text-center hover:shadow-md transition-all text-sm"
                      style={{ borderColor: 'var(--border)' }}>
                      <div className="text-2xl mb-1">{s.emoji}</div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text)' }}>{s.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Template picker */}
          <div className="card mb-3 px-5 py-4">
            <label className="lbl mb-2">Template</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setResume(r => ({ ...r, template: t.id }))}
                  className="p-2.5 rounded-xl text-center text-xs border transition-all"
                  style={{ borderColor: resume.template === t.id ? 'var(--brand)' : 'var(--border)', background: resume.template === t.id ? 'var(--brand-bg)' : 'var(--bg3)', color: resume.template === t.id ? 'var(--brand)' : 'var(--text2)', fontWeight: resume.template === t.id ? 600 : 400 }}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <Section id="personal" title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Inp label="Full Name" placeholder="Jane Smith" {...p('fullName')} />
              <Inp label="Job Title" placeholder="Software Engineer" {...p('title')} />
              <Inp label="Email" placeholder="jane@email.com" {...p('email')} />
              <Inp label="Phone" placeholder="(555) 000-0000" {...p('phone')} />
              <Inp label="Location" placeholder="Toronto, ON" {...p('location')} />
              <Inp label="LinkedIn" placeholder="linkedin.com/in/..." {...p('linkedin')} />
              <Inp label="Website" placeholder="yoursite.com" {...p('website')} />
            </div>
            <div className="mt-3">
              <Textarea label="Professional Summary" placeholder="2-3 sentences highlighting your top skills and value..." {...p('summary')} />
            </div>
          </Section>

          {/* Experience */}
          <Section id="experience" title={`Work Experience (${resume.experience.length})`}
            action={<button onClick={e => { e.stopPropagation(); addExp() }} className="btn btn-ghost text-xs py-1 px-2.5"><Plus size={12} />Add</button>}>
            {resume.experience.length === 0 && <p className="text-sm text-center py-3" style={{ color: 'var(--text3)' }}>No experience added yet</p>}
            {resume.experience.map((exp, idx) => (
              <div key={exp.id} className="border rounded-xl p-4 mb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>Position {idx + 1}</span>
                  <button onClick={() => delExp(exp.id)} style={{ color: 'var(--red)' }}><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                  <Inp label="Job Title" value={exp.title} onChange={v => updExp(exp.id, 'title', v)} placeholder="Software Engineer" />
                  <Inp label="Company" value={exp.company} onChange={v => updExp(exp.id, 'company', v)} placeholder="Company Name" />
                  <Inp label="Location" value={exp.location} onChange={v => updExp(exp.id, 'location', v)} placeholder="City, Province" />
                  <div className="grid grid-cols-2 gap-2">
                    <Inp label="Start" value={exp.startDate} onChange={v => updExp(exp.id, 'startDate', v)} placeholder="Jan 2022" />
                    <Inp label="End" value={exp.current ? 'Present' : exp.endDate} onChange={v => updExp(exp.id, 'endDate', v)} placeholder="Present" />
                  </div>
                </div>
                <label className="flex items-center gap-2 mb-3 text-xs cursor-pointer" style={{ color: 'var(--text2)' }}>
                  <input type="checkbox" checked={exp.current} onChange={e => updExp(exp.id, 'current', e.target.checked)} />
                  Currently working here
                </label>
                <label className="lbl mb-2">Accomplishments / Bullets</label>
                {exp.bullets.map((b, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--text3)' }}>•</span>
                    <input value={b} onChange={e => updBullet(exp.id, i, e.target.value)} placeholder="Achieved X by doing Y, resulting in Z..." className="inp text-sm flex-1" />
                    {exp.bullets.length > 1 && <button onClick={() => delBullet(exp.id, i)} style={{ color: 'var(--text3)' }}><Trash2 size={12} /></button>}
                  </div>
                ))}
                <button onClick={() => addBullet(exp.id)} className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--brand)' }}>
                  <Plus size={11} />Add bullet
                </button>
              </div>
            ))}
          </Section>

          {/* Education */}
          <Section id="education" title={`Education (${resume.education.length})`}
            action={<button onClick={e => { e.stopPropagation(); addEdu() }} className="btn btn-ghost text-xs py-1 px-2.5"><Plus size={12} />Add</button>}>
            {resume.education.length === 0 && <p className="text-sm text-center py-3" style={{ color: 'var(--text3)' }}>No education added yet</p>}
            {resume.education.map((edu, idx) => (
              <div key={edu.id} className="border rounded-xl p-4 mb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>Degree {idx + 1}</span>
                  <button onClick={() => delEdu(edu.id)} style={{ color: 'var(--red)' }}><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Inp label="Degree" value={edu.degree} onChange={v => updEdu(edu.id, 'degree', v)} placeholder="B.Sc. Computer Science" />
                  <Inp label="School" value={edu.school} onChange={v => updEdu(edu.id, 'school', v)} placeholder="University Name" />
                  <Inp label="Location" value={edu.location} onChange={v => updEdu(edu.id, 'location', v)} placeholder="City, Province" />
                  <Inp label="Graduation" value={edu.graduationDate} onChange={v => updEdu(edu.id, 'graduationDate', v)} placeholder="May 2023" />
                  <Inp label="GPA (optional)" value={edu.gpa} onChange={v => updEdu(edu.id, 'gpa', v)} placeholder="3.8" />
                </div>
              </div>
            ))}
          </Section>

          {/* Skills */}
          <Section id="skills" title={`Skills (${resume.skills.length})`}>
            <div className="flex flex-wrap gap-2 mb-3">
              {resume.skills.map(s => (
                <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text2)', background: 'var(--bg3)' }}>
                  {s}<button onClick={() => setResume(r => ({ ...r, skills: r.skills.filter(x => x !== s) }))} style={{ color: 'var(--text3)' }}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Type a skill and press Enter..." className="inp text-sm flex-1" />
              <button onClick={addSkill} className="btn btn-ghost px-3"><Plus size={14} /></button>
            </div>
          </Section>

          {/* Certifications */}
          <Section id="certs" title={`Certifications (${resume.certifications.length})`}>
            <div className="flex flex-wrap gap-2 mb-3">
              {resume.certifications.map(c => (
                <span key={c} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text2)', background: 'var(--bg3)' }}>
                  {c}<button onClick={() => setResume(r => ({ ...r, certifications: r.certifications.filter(x => x !== c) }))} style={{ color: 'var(--text3)' }}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCert()} placeholder="Add a certification..." className="inp text-sm flex-1" />
              <button onClick={addCert} className="btn btn-ghost px-3"><Plus size={14} /></button>
            </div>
          </Section>
        </div>

        {/* Right: Live Preview */}
        {preview && (
          <div className="flex-1 min-w-0">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: 'var(--text2)' }}>Live Preview</p>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>A4 · 794px wide</span>
              </div>
              <div className="overflow-auto rounded-xl border" style={{ borderColor: 'var(--border)', background: '#f0f0f0', padding: '16px' }}>
                <div style={{ width: `${794 * previewScale}px`, height: `${1123 * previewScale}px`, overflow: 'hidden', position: 'relative', borderRadius: '4px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                  <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: '794px' }}>
                    <ResumePreview data={resume} />
                  </div>
                </div>
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: 'var(--text3)' }}>Click "PDF" to download print-quality version</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
