export const renderMarkdown = (content: string) => {
  const lines = content.split('\n')
  const html: string[] = []
  let inUl = false
  let inOl = false
  let tableRows: string[][] | null = null

  const flushList = () => {
    if (inUl) {
      html.push('</ul>')
      inUl = false
    }
    if (inOl) {
      html.push('</ol>')
      inOl = false
    }
  }

  const flushTable = () => {
    if (!tableRows) return
    const [header, separator, ...rows] = tableRows
    if (header && separator && separator.every(cell => /^-+$/.test(cell))) {
      html.push('<table><thead><tr>')
      header.forEach(cell => html.push(`<th>${cell}</th>`))
      html.push('</tr></thead><tbody>')
      rows.forEach(row => {
        html.push('<tr>')
        row.forEach(cell => html.push(`<td>${cell}</td>`))
        html.push('</tr>')
      })
      html.push('</tbody></table>')
    } else {
      html.push('<table><tbody>')
      tableRows.forEach(row => {
        html.push('<tr>')
        row.forEach(cell => html.push(`<td>${cell}</td>`))
        html.push('</tr>')
      })
      html.push('</tbody></table>')
    }
    tableRows = null
  }

  const parseInline = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  const isTableLine = (line: string) => line.trim().startsWith('|') && line.includes('|')

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i]
    const line = raw.trim()
    if (!line) {
      flushList()
      flushTable()
      continue
    }

    if (isTableLine(raw)) {
      flushList()
      const cells = raw
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim())
      if (!tableRows) tableRows = []
      tableRows.push(cells)
      const next = lines[i + 1]
      if (!next || !isTableLine(next)) {
        flushTable()
      }
      continue
    }

    flushTable()

    if (line.startsWith('# ')) {
      flushList()
      html.push(`<h2>${parseInline(line.slice(2).trim())}</h2>`)
      continue
    }
    if (line.startsWith('## ')) {
      flushList()
      html.push(`<h3>${parseInline(line.slice(3).trim())}</h3>`)
      continue
    }
    if (line.startsWith('### ')) {
      flushList()
      html.push(`<h4>${parseInline(line.slice(4).trim())}</h4>`)
      continue
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.+)/)
    if (orderedMatch) {
      if (!inOl) {
        flushList()
        html.push('<ol>')
        inOl = true
      }
      html.push(`<li>${parseInline(orderedMatch[2])}</li>`)
      continue
    }

    if (line.startsWith('- ')) {
      if (!inUl) {
        flushList()
        html.push('<ul>')
        inUl = true
      }
      html.push(`<li>${parseInline(line.slice(2).trim())}</li>`)
      continue
    }

    flushList()
    html.push(`<p>${parseInline(line)}</p>`)
  }

  flushList()
  flushTable()
  return html.join('')
}
