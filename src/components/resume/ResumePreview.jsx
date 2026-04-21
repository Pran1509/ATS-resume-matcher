import React from 'react'

function ContactItem({ icon, value }) {
  if (!value) return null
  return <span className="flex items-center gap-1">{icon} {value}</span>
}

export default function ResumePreview({ data, scale = 1 }) {
  if (!data) return null
  const { personalInfo: p, experience = [], education = [], skills = [], certifications = [], template = 'modern' } = data

  const style = scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: 'top left', width: `${794}px` } : {}

  return (
    <div className={`resume-page tpl-${template}`} style={style} id="resume-preview">
      {/* Header */}
      <div className="resume-header">
        <div className="resume-name">{p?.fullName || 'Your Name'}</div>
        {p?.title && <div className="resume-title">{p.title}</div>}
        <div className="resume-contact">
          {p?.email && <span>✉ {p.email}</span>}
          {p?.phone && <span>📞 {p.phone}</span>}
          {p?.location && <span>📍 {p.location}</span>}
          {p?.linkedin && <span>🔗 {p.linkedin}</span>}
          {p?.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {p?.summary && (
        <div className="resume-section">
          <div className="section-title">Professional Summary</div>
          <p className="resume-summary">{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="resume-section">
          <div className="section-title">Work Experience</div>
          {experience.map(exp => (
            <div key={exp.id} className="resume-entry">
              <div className="resume-entry-header">
                <div>
                  <div className="resume-entry-title">{exp.title}</div>
                  <div className="resume-entry-sub">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                </div>
                <div className="resume-entry-date">
                  {exp.startDate}{(exp.endDate || exp.current) ? ` – ${exp.current ? 'Present' : exp.endDate}` : ''}
                </div>
              </div>
              {exp.bullets?.filter(b => b.trim()).length > 0 && (
                <ul className="resume-bullets">
                  {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="resume-section">
          <div className="section-title">Education</div>
          {education.map(edu => (
            <div key={edu.id} className="resume-entry">
              <div className="resume-entry-header">
                <div>
                  <div className="resume-entry-title">{edu.degree}</div>
                  <div className="resume-entry-sub">{edu.school}{edu.location ? ` · ${edu.location}` : ''}</div>
                </div>
                <div className="resume-entry-date">{edu.graduationDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="resume-section">
          <div className="section-title">Skills</div>
          <div className="resume-skills-grid">
            {skills.map(s => <span key={s} className="resume-skill-tag">{s}</span>)}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="resume-section">
          <div className="section-title">Certifications</div>
          <div className="resume-skills-grid">
            {certifications.map(c => <span key={c} className="resume-skill-tag">{c}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}
