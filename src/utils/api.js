const IS_DEV = import.meta.env.DEV

// In dev, call Anthropic directly (needs VITE_ANTHROPIC_API_KEY in .env)
// In production, call our secure backend /api/claude
async function callClaude(system, userMessage, maxTokens = 2000) {
  if (IS_DEV) {
    const key = import.meta.env.VITE_ANTHROPIC_API_KEY
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error?.message || 'API error')
    return data.content.map(b => b.text || '').join('')
  } else {
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system,
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: maxTokens,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'API error')
    return data.text
  }
}

// ── ATS Analysis ──
export async function analyzeATS(resume, jobDescription) {
  const system = `You are an expert ATS analyst. Respond ONLY with valid JSON, no markdown.`
  const prompt = `Analyze this resume against the job description. Return JSON:
{
  "overallScore": <0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "summary": <2-3 sentence summary>,
  "sections": {
    "skills": { "score": <0-100>, "comment": <string> },
    "experience": { "score": <0-100>, "comment": <string> },
    "education": { "score": <0-100>, "comment": <string> },
    "keywords": { "score": <0-100>, "comment": <string> }
  },
  "keywords": {
    "matched": [<string>],
    "missing": [<string>],
    "partial": [<string>]
  },
  "tips": [{ "priority": <"high"|"medium"|"low">, "category": <string>, "tip": <string> }]
}

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}`

  const raw = await callClaude(system, prompt)
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

// ── Optimize Resume ──
export async function optimizeResume(resume, jobDescription, analysis) {
  const missing = analysis?.keywords?.missing?.join(', ') || ''
  const system = `You are an expert resume writer specializing in ATS optimization. Rewrite resumes to maximize ATS compatibility while keeping all facts accurate.`
  const prompt = `Rewrite this resume to be fully ATS-optimized for the job description.
Rules:
- Keep all facts accurate — never invent experience
- Naturally incorporate these missing keywords: ${missing}
- Use strong action verbs for every bullet
- Quantify achievements where possible
- Include a tailored Professional Summary
- Output clean plain text only

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return only the optimized resume text.`

  return callClaude(system, prompt, 2500)
}

// ── Generate 3 ATS-optimized resume variations ──
export async function generateResumeVariations(resume, jobDescription) {
  const system = `You are an expert resume writer. Generate multiple ATS-optimized resume variations. Respond ONLY with valid JSON, no markdown.`
  const prompt = `Given this resume and job description, generate 3 different ATS-optimized resume variations.
Each variation should:
- Keep all facts from the original resume accurate
- Use different emphasis/framing to match the job description
- Naturally include keywords from the JD
- Have a different angle: 1) Skills-focused, 2) Achievement-focused, 3) Leadership-focused

Return JSON:
{
  "variations": [
    {
      "id": "skills",
      "title": "Skills-Focused",
      "description": "Emphasizes technical skills and expertise",
      "atsScore": <estimated 0-100>,
      "resumeText": <full optimized resume as plain text>
    },
    {
      "id": "achievement",
      "title": "Achievement-Focused", 
      "description": "Leads with quantified accomplishments",
      "atsScore": <estimated 0-100>,
      "resumeText": <full optimized resume as plain text>
    },
    {
      "id": "leadership",
      "title": "Leadership-Focused",
      "description": "Highlights leadership and impact",
      "atsScore": <estimated 0-100>,
      "resumeText": <full optimized resume as plain text>
    }
  ]
}

ORIGINAL RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return only the JSON.`

  const raw = await callClaude(system, prompt, 4000)
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

// ── Cover Letter ──
export async function generateCoverLetter(resume, jobDescription, tone = 'professional') {
  const system = `You are an expert cover letter writer. Write compelling, tailored cover letters. Use a ${tone} tone.`
  const prompt = `Write a complete cover letter for this candidate.
- 3-4 paragraphs
- Tailored to the specific job
- References specific experience from resume
- Sign with candidate's name

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Write the complete cover letter now.`

  return callClaude(system, prompt, 1500)
}
