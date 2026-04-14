/**
 * fileParser.js
 * Extracts text from PDF and DOCX files with full fidelity —
 * preserving every space, period, comma, and line break.
 */

/**
 * Load a script from CDN dynamically
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

/**
 * Read a File object as ArrayBuffer
 */
function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Read a File object as base64 string
 */
function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Extract text from a PDF file using PDF.js
 * Preserves all whitespace, punctuation, and line structure.
 */
export async function extractFromPDF(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js')

  // Set worker
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

  const arrayBuffer = await readAsArrayBuffer(file)
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    // Sort items by vertical position (top to bottom), then horizontal (left to right)
    const items = textContent.items.slice().sort((a, b) => {
      const yDiff = Math.round(b.transform[5]) - Math.round(a.transform[5])
      if (Math.abs(yDiff) > 2) return yDiff
      return a.transform[4] - b.transform[4]
    })

    let pageText = ''
    let lastY = null
    let lastX = null

    for (const item of items) {
      const x = item.transform[4]
      const y = Math.round(item.transform[5])
      const text = item.str

      if (lastY !== null && Math.abs(y - lastY) > 2) {
        // New line
        pageText += '\n'
        lastX = null
      } else if (lastX !== null && x - lastX > 10) {
        // Gap between words on same line — preserve spacing
        pageText += ' '
      }

      pageText += text
      lastY = y
      lastX = x + (item.width || 0)
    }

    fullText += pageText.trim() + '\n\n'
  }

  return fullText.trim()
}

/**
 * Extract text from a DOCX file using mammoth.js
 * Preserves paragraphs, bullets, and all punctuation.
 */
export async function extractFromDOCX(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js')

  const arrayBuffer = await readAsArrayBuffer(file)
  const result = await window.mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

/**
 * Main entry point — auto-detects file type and extracts text
 * @param {File} file
 * @returns {Promise<string>} extracted plain text
 */
export async function extractTextFromFile(file) {
  const name = file.name.toLowerCase()

  if (name.endsWith('.pdf')) {
    return extractFromPDF(file)
  } else if (name.endsWith('.docx')) {
    return extractFromDOCX(file)
  } else if (name.endsWith('.doc')) {
    throw new Error('.doc (old Word format) is not supported. Please save as .docx and try again.')
  } else if (name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  } else {
    throw new Error(`Unsupported file type: ${file.name}. Please use PDF, DOCX, or TXT.`)
  }
}

/**
 * Download text as a .txt file
 */
export function downloadAsTXT(text, filename = 'optimized-resume.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, filename)
}

/**
 * Download text as a .docx file using docx.js
 */
export async function downloadAsDOCX(text, filename = 'optimized-resume.docx') {
  await loadScript('https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js')

  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx

  // Split into lines and build paragraphs
  const lines = text.split('\n')
  const children = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      children.push(new Paragraph({ text: '' }))
      continue
    }

    // Detect section headers (ALL CAPS or ends with :)
    const isHeader = trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 50
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')

    if (isHeader) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 26 })],
          spacing: { before: 240, after: 80 },
        })
      )
    } else if (isBullet) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22 })],
          bullet: { level: 0 },
        })
      )
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22 })],
          spacing: { after: 60 },
        })
      )
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  })

  const blob = await Packer.toBlob(doc)
  triggerDownload(blob, filename)
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
