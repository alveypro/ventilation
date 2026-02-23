import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { createWorker } from 'tesseract.js'

const uploadRouter = Router()

const uploadsDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req: unknown, _file: unknown, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadsDir)
  },
  filename: (
    _req: unknown,
    file: { originalname?: string },
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = path.extname(file.originalname || '')
    const name = `upload_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`
    cb(null, name)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
})

const OCR_LANG = process.env.OCR_LANG || 'chi_sim+eng'
const OCR_ENABLED = process.env.OCR_ENABLED !== '0'

async function ocrImage(filePath: string): Promise<string> {
  if (!OCR_ENABLED) return ''
  const worker = (await createWorker()) as unknown as {
    loadLanguage?: (lang: string) => Promise<void>
    initialize?: (lang: string) => Promise<void>
    recognize: (input: string) => Promise<{ data?: { text?: string } }>
    terminate: () => Promise<void>
  }
  try {
    if (worker.loadLanguage) {
      await worker.loadLanguage(OCR_LANG)
    }
    if (worker.initialize) {
      await worker.initialize(OCR_LANG)
    }
    const result = await worker.recognize(filePath)
    return result.data?.text || ''
  } finally {
    await worker.terminate()
  }
}

uploadRouter.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const url = `/uploads/${req.file.filename}`
  const ext = path.extname(req.file.originalname || '').toLowerCase()
  let extracted = ''
  let truncated = false
  let ocrUsed = false
  try {
    if (ext === '.pdf') {
      const buf = fs.readFileSync(req.file.path)
      const data = await pdfParse(buf)
      extracted = data.text || ''
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path })
      extracted = result.value || ''
    } else if (ext === '.doc') {
      extracted = ''
    } else if (ext === '.txt') {
      extracted = fs.readFileSync(req.file.path, 'utf8')
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'].includes(ext)) {
      extracted = await ocrImage(req.file.path)
      ocrUsed = true
    }
  } catch (_err) {
    extracted = ''
  }

  if (extracted && extracted.length > 4000) {
    extracted = extracted.slice(0, 4000)
    truncated = true
  }

  return res.json({
    url,
    filename: req.file.originalname,
    ext,
    text: extracted,
    textTruncated: truncated,
    ocrUsed
  })
})

export { uploadRouter }
