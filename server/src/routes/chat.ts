import { Router } from 'express'
import { llmClient, buildPrompt } from '../services/llm.js'
import { detectRisk, HIGH_RISK_TEMPLATE } from '../services/policy.js'
import { getCitations } from '../services/citations.js'
import { addMessage, getMessages } from '../store/db.js'

export const chatRouter = Router()

chatRouter.post('/', async (req, res) => {
  const { openid, session_id, message, context_turns } = req.body || {}

  if (!openid || !session_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const risk = detectRisk(message)
  const citations = getCitations(message)

  if (risk.level === 'high') {
    addMessage(openid, session_id, { role: 'user', text: message, timestamp: Date.now() })
    addMessage(openid, session_id, { role: 'ai', text: HIGH_RISK_TEMPLATE, timestamp: Date.now() })
    return res.json({
      answer: HIGH_RISK_TEMPLATE,
      citations,
      risk,
      suggested_questions: []
    })
  }

  const history = getMessages(openid, session_id)
  const turns = Number(context_turns || 6)
  const recent = history.slice(-turns).map((item) => `${item.role === 'user' ? '用户' : 'AI'}：${item.text}`)
  const prompt = buildPrompt(message, recent)

  try {
    const answer = await llmClient.generate(prompt)
    addMessage(openid, session_id, { role: 'user', text: message, timestamp: Date.now() })
    addMessage(openid, session_id, { role: 'ai', text: answer, timestamp: Date.now() })

    return res.json({
      answer,
      citations,
      risk,
      suggested_questions: []
    })
  } catch (error) {
    console.error('LLM request failed:', error)
    return res.status(500).json({
      error: 'LLM request failed',
      message: error instanceof Error ? error.message : String(error)
    })
  }
})
