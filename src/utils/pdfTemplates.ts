import { buildKnowledgePack } from '@/utils/packs'

type PackRole = 'doctor' | 'patient' | 'agent' | 'manufacturer'

const titles: Record<PackRole, string> = {
  doctor: '医生知识包',
  patient: '患者知识包',
  agent: '代理商知识包',
  manufacturer: '厂家知识包',
}

export const openPdfTemplate = (role: PackRole) => {
  const title = titles[role]
  const body = buildKnowledgePack(role)
  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title} - PDF模板</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #1f2937; }
          h1 { font-size: 22px; margin-bottom: 16px; }
          pre { white-space: pre-wrap; line-height: 1.6; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>${title}（可保存为PDF）</h1>
        <pre>${body}</pre>
      </body>
    </html>
  `
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 300)
    return
  }

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${title}-模板.html`
  link.click()
  URL.revokeObjectURL(link.href)
}
