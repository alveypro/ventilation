import { Router } from 'express'
import { clearMessages, getMessages } from '../store/db.js'

export const historyRouter = Router()

historyRouter.get('/', (req, res) => {
  const openid = String(req.query.openid || '')
  const sessionId = String(req.query.session_id || '')
  if (!openid || !sessionId) {
    return res.status(400).json({ error: 'Missing openid or session_id' })
  }
  const messages = getMessages(openid, sessionId)
  return res.json({ messages })
})

historyRouter.delete('/', (req, res) => {
  const openid = String(req.query.openid || '')
  const sessionId = String(req.query.session_id || '')
  if (!openid || !sessionId) {
    return res.status(400).json({ error: 'Missing openid or session_id' })
  }
  clearMessages(openid, sessionId)
  return res.json({ success: true })
})
