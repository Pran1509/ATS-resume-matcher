function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.onload = resolve; s.onerror = reject
    document.head.appendChild(s)
  })
}

export async function extractTextFromFile(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return extractPDF(file)
  if (name.endsWith('.docx')) return extractDOCX(file)
  if (name.endsWith('.txt')) return new Promise((res, rej) => {
    const r = new FileReader(); r.onload = e => res(e.target.result); r.onerror = rej; r.readAsText(file)
  })
  throw new Error(`Unsupported: ${file.name}. Use PDF, DOCX, or TXT.`)
}

async function extractPDF(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js')
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  const buf = await file.arrayBuffer()
  const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const items = content.items.slice().sort((a, b) => {
      const dy = Math.round(b.transform[5]) - Math.round(a.transform[5])
      return Math.abs(dy) > 2 ? dy : a.transform[4] - b.transform[4]
    })
    let pageText = '', lastY = null, lastX = null
    for (const item of items) {
      const x = item.transform[4], y = Math.round(item.transform[5])
      if (lastY !== null && Math.abs(y - lastY) > 2) { pageText += '\n'; lastX = null }
      else if (lastX !== null && x - lastX > 8) pageText += ' '
      pageText += item.str; lastY = y; lastX = x + (item.width || 0)
    }
    text += pageText.trim() + '\n\n'
  }
  return text.trim()
}

async function extractDOCX(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js')
  const buf = await file.arrayBuffer()
  const result = await window.mammoth.extractRawText({ arrayBuffer: buf })
  return result.value.trim()
}

export function downloadTXT(text, name = 'resume.txt') {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadDOCX(text, name = 'resume.docx') {
  await loadScript('https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js')
  const { Document, Packer, Paragraph, TextRun } = window.docx
  const lines = text.split('\n')
  const children = lines.map(line => {
    const t = line.trim()
    const isHeader = t === t.toUpperCase() && t.length > 2 && t.length < 50
    return new Paragraph({
      children: [new TextRun({ text: t, bold: isHeader, size: isHeader ? 24 : 22 })],
      spacing: { before: isHeader ? 240 : 0, after: 60 }
    })
  })
  const doc = new Document({ sections: [{ properties: {}, children }] })
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadResumePDF(elementId, name = 'resume.pdf') {
  window.print()
}
