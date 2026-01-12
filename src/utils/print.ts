type PrintSection = {
  title: string
  items: string[]
}

export const openPrint = (title: string, sections: PrintSection[]) => {
  const body = sections
    .map(section => {
      const list = section.items.map(item => `<li>${item}</li>`).join('')
      return `<h2>${section.title}</h2><ul>${list}</ul>`
    })
    .join('')
  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #1f2937; }
          h1 { font-size: 22px; margin-bottom: 16px; }
          h2 { font-size: 16px; margin-top: 18px; }
          ul { padding-left: 18px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${body}
      </body>
    </html>
  `
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 300)
  }
}
