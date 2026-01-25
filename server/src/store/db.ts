export interface ChatMessage {
  role: 'user' | 'ai'
  text: string
  timestamp: number
}

const store = new Map<string, ChatMessage[]>()

function buildKey(openid: string, sessionId: string) {
  return `${openid}:${sessionId}`
}

export function getMessages(openid: string, sessionId: string): ChatMessage[] {
  return store.get(buildKey(openid, sessionId)) || []
}

export function addMessage(openid: string, sessionId: string, message: ChatMessage) {
  const key = buildKey(openid, sessionId)
  const messages = store.get(key) || []
  messages.push(message)
  store.set(key, messages)
}

export function clearMessages(openid: string, sessionId: string) {
  store.delete(buildKey(openid, sessionId))
}
