import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chatRouter } from './routes/chat.js'
import { historyRouter } from './routes/history.js'
import { uploadRouter } from './routes/upload.js'

const envPath =
  process.env.ENV_PATH ||
  (fs.existsSync(path.resolve(process.cwd(), '.env'))
    ? path.resolve(process.cwd(), '.env')
    : fs.existsSync(path.resolve(process.cwd(), 'server/.env'))
      ? path.resolve(process.cwd(), 'server/.env')
      : undefined)
if (envPath) {
  dotenv.config({ path: envPath })
}

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.set('trust proxy', 1)

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

const uploadsDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

app.use('/api/chat', chatRouter)
app.use('/api/history', historyRouter)
app.use('/api/upload', uploadRouter)

const PORT = Number(process.env.PORT || 3443)
const keyPath = process.env.SSL_KEY_PATH
const certPath = process.env.SSL_CERT_PATH
const caPath = process.env.SSL_CA_PATH

if (keyPath && certPath) {
  const options: https.ServerOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  }

  if (caPath) {
    options.ca = fs.readFileSync(caPath)
  }

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on https://localhost:${PORT}`)
  })
} else if (process.env.ALLOW_HTTP === 'true') {
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`)
  })
} else {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  console.error(
    'Missing SSL_KEY_PATH or SSL_CERT_PATH. Set them for HTTPS, or set ALLOW_HTTP=true to run HTTP behind a reverse proxy.'
  )
  console.error(`Working directory: ${__dirname}`)
  process.exit(1)
}
