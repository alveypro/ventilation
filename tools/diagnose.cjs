const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // 启用控制台消息和错误监听
  page.on('console', msg => console.log('LOG:', msg.text()))
  page.on('error', err => console.error('PAGE ERROR:', err))
  page.on('pageerror', err => console.error('UNCAUGHT ERROR:', err))

  await page.goto('http://localhost:5173/doctor', { waitUntil: 'networkidle' })

  // 检查 DOM 中是否有内容
  const content = await page.evaluate(() => {
    const doctorCenter = document.querySelector('.doctor-center-page')
    const sections = document.querySelectorAll('.content-section')
    return {
      hasDoctorCenter: !!doctorCenter,
      sectionCount: sections.length,
      pageHtml: document.body.innerHTML.slice(0, 500)
    }
  })

  console.log('诊断结果:', JSON.stringify(content, null, 2))

  await browser.close()
})()
