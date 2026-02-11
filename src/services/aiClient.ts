export type AiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type AiChatRequest = {
  sessionId: string
  messages: AiMessage[]
  context?: string
  source?: string
}

export type AiChatResponse = {
  reply: string
  sources?: string[]
}

const DEFAULT_AI_BASE = 'https://ai.airivo.cn'
const AI_BASE = (import.meta.env.VITE_AI_API_BASE_URL || DEFAULT_AI_BASE).replace(/\/$/, '')
const AI_CHAT_PATH = import.meta.env.VITE_AI_CHAT_PATH || '/'
const AI_ENDPOINT = AI_BASE ? `${AI_BASE}${AI_CHAT_PATH}` : ''

export const sendAiChat = async (payload: AiChatRequest): Promise<AiChatResponse> => {
  if (!AI_ENDPOINT) {
    throw new Error('AI endpoint not configured')
  }
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status}`)
  }
  return res.json() as Promise<AiChatResponse>
}
