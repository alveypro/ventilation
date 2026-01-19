type Env = {
  ALIYUN_API_KEY?: string
  ALIYUN_BASE_URL?: string
  ALIYUN_MODEL?: string
  ZHIPU_API_KEY?: string
  ZHIPU_BASE_URL?: string
  ZHIPU_MODEL?: string
  AI_PROVIDERS?: string
  CHAT_KV?: KVNamespace
}

type AiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type AiChatRequest = {
  sessionId: string
  messages: AiMessage[]
  context?: string
  source?: string
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })

const buildSystemPrompt = (context?: string) => {
  const base = [
    'You are a respiratory sleep medicine assistant.',
    'Answer in Chinese, concise, and practical.',
    'If user asks for diagnosis or urgent symptoms, advise professional evaluation.',
  ]
  if (!context) return base.join(' ')
  return `${base.join(' ')}\n\nContext:\n${context}`
}

const parseReply = async (res: Response) => {
  const data = await res.json<any>()
  const message = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''
  return message.trim()
}

const callAliyun = async (payload: AiChatRequest, env: Env) => {
  if (!env.ALIYUN_API_KEY) return null
  const url = env.ALIYUN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
  const model = env.ALIYUN_MODEL || 'qwen-plus'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.ALIYUN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: payload.messages,
      temperature: 0.4,
    }),
  })
  if (!res.ok) return null
  return parseReply(res)
}

const callZhipu = async (payload: AiChatRequest, env: Env) => {
  if (!env.ZHIPU_API_KEY) return null
  const url = env.ZHIPU_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  const model = env.ZHIPU_MODEL || 'glm-4'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.ZHIPU_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: payload.messages,
      temperature: 0.4,
    }),
  })
  if (!res.ok) return null
  return parseReply(res)
}

const storeHistory = async (payload: AiChatRequest, reply: string, env: Env) => {
  if (!env.CHAT_KV || !payload.sessionId) return
  const record = {
    sessionId: payload.sessionId,
    source: payload.source || 'airivo-web',
    time: new Date().toISOString(),
    messages: payload.messages,
    reply,
  }
  await env.CHAT_KV.put(payload.sessionId, JSON.stringify(record))
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'OPTIONS') return json({ ok: true })
    if (request.method !== 'POST') return json({ message: 'Method not allowed' }, 405)

    let body: AiChatRequest
    try {
      body = await request.json()
    } catch (error) {
      return json({ message: 'Invalid JSON' }, 400)
    }

    if (!body?.messages?.length) {
      return json({ message: 'Missing messages' }, 400)
    }

    const systemPrompt = buildSystemPrompt(body.context)
    const enriched: AiChatRequest = {
      ...body,
      messages: [{ role: 'system', content: systemPrompt }, ...body.messages],
    }

    const providers = (env.AI_PROVIDERS || 'aliyun,zhipu')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    let reply = ''
    for (const provider of providers) {
      if (provider === 'aliyun') {
        reply = (await callAliyun(enriched, env)) || ''
      } else if (provider === 'zhipu') {
        reply = (await callZhipu(enriched, env)) || ''
      }
      if (reply) break
    }

    if (!reply) {
      return json({ reply: 'AI 服务暂不可用，请稍后再试。' }, 200)
    }

    await storeHistory(enriched, reply, env)
    return json({ reply }, 200)
  },
}
