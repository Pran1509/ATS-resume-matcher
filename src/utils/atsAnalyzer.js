/**
 * atsAnalyzer.js
 * Core Claude API integration for ATS scoring and resume optimization.
 */

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

function getApiKey() {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key || key === 'your_anthropic_api_key_here') {
    throw new Error('Please set your VITE_ANTHROPIC_API_KEY in the .env file.')
  }
  return key
}

async function callClaude(systemPrompt, userMessage) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getApiKey(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
  return text
}

/**
 * Analyze a resume against a job description and return structured ATS data.
 * @param {string} resume
 * @param {string} jobDescription
 * @returns {Promise<ATSResult>}
 */
export async function analyzeATS(resume, jobDescription) {
  const system = `You are an expert ATS (Applicant Tracking System) analyst and HR consultant.
You analyze resumes against job descriptions and provide detailed compatibility scores.
You MUST respond with valid JSON only — no markdown fences, no preamble, no explanation outside the JSON.`

  const prompt = `Analyze this resume against the job description and return a JSON object with EXACTLY this structure:

{
  "overallScore": <number 0-100>,
  "grade": <"A" | "B" | "C" | "D" | "F">,
  "summary": <string, 2-3 sentences>,
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
  "tips": [
    { "priority": <"high"|"medium"|"low">, "category": <string>, "tip": <string> }
  ]
}

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return only the JSON object.`

  const raw = await callClaude(system, prompt)

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse analysis response. Please try again.')
  }
}

/**
 * Rewrite the resume to be ATS-optimized for the given job description.
 * @param {string} resume
 * @param {string} jobDescription
 * @param {ATSResult} analysis - Previous analysis result for context
 * @returns {Promise<string>}
 */
export async function optimizeResume(resume, jobDescription, analysis) {
  const system = `You are an expert resume writer specializing in ATS optimization.
You rewrite resumes to maximize compatibility with Applicant Tracking Systems while keeping them honest and professional.
You incorporate missing keywords naturally, use strong action verbs, and follow ATS-friendly formatting.`

  const missingKeywords = analysis?.keywords?.missing?.join(', ') || ''
  const tips = analysis?.tips?.map((t) => `- ${t.tip}`).join('\n') || ''

  const prompt = `Rewrite the following resume to be fully ATS-optimized for the job description below.

RULES:
- Keep all facts accurate — do NOT invent experience or credentials
- Naturally incorporate these missing keywords: ${missingKeywords}
- Use clean, ATS-parseable formatting (no tables, no columns, no graphics)
- Start each bullet with a strong action verb
- Quantify achievements where possible (use placeholders like [X%] if not given)
- Include a tailored Professional Summary at the top
- Apply these improvement tips:
${tips}
- Output plain text only — no markdown headers like ##, no bold (**), just clean text with clear section names

ORIGINAL RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return only the optimized resume text.`

  return callClaude(system, prompt)
}
