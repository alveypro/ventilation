const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const buildSystemPrompt = (context) => {
  const base = [
    'You are a respiratory sleep medicine assistant.',
    'Answer in Chinese, concise, and practical.',
    'If user asks for diagnosis or urgent symptoms, advise professional evaluation.',
  ]
  if (!context) return base.join(' ')
  return `${base.join(' ')}\n\nContext:\n${context}`
}

const parseReply = async (res) => {
  const data = await res.json()
  const message = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''
  return message.trim()
}

const callAliyun = async (payload) => {
  const apiKey = process.env.ALIYUN_API_KEY
  if (!apiKey) return ''
  const url = process.env.ALIYUN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
  const model = process.env.ALIYUN_MODEL || 'qwen-plus'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: payload.messages,
      temperature: 0.4,
    }),
  })
  if (!res.ok) return ''
  return parseReply(res)
}

const callZhipu = async (payload) => {
  const apiKey = process.env.ZHIPU_API_KEY
  if (!apiKey) return ''
  const url = process.env.ZHIPU_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  const model = process.env.ZHIPU_MODEL || 'glm-4'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: payload.messages,
      temperature: 0.4,
    }),
  })
  if (!res.ok) return ''
  return parseReply(res)
}

const pickProvider = () => {
  const raw = process.env.AI_PROVIDERS || 'aliyun,zhipu'
  return raw.split(',').map((item) => item.trim()).filter(Boolean)
}

exports.handler = async (event) => {
  const parsePayload = (raw) => {
    if (!raw) return {}
    const text = Buffer.isBuffer(raw) ? raw.toString('utf-8') : String(raw)
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed === 'object' && parsed.body) {
        const bodyText = parsed.isBase64Encoded || parsed.isBase64
          ? Buffer.from(parsed.body, 'base64').toString('utf-8')
          : parsed.body
        try {
          return JSON.parse(bodyText || '{}')
        } catch (error) {
          return {}
        }
      }
      return parsed
    } catch (error) {
      const parts = text.split('\r\n\r\n')
      const body = parts.slice(1).join('\r\n\r\n')
      if (!body) return {}
      try {
        return JSON.parse(body)
      } catch (err) {
        return {}
      }
    }
  }

  try {
    const method = event?.httpMethod || event?.method || 'POST'
    if (method === 'OPTIONS') {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) }
    }
    if (method !== 'POST') {
      return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ message: 'Method not allowed' }) }
    }

    let payload = {}
    if (event && typeof event === 'object' && event.messages) {
      payload = event
    } else if (event && typeof event === 'object' && typeof event.byteLength === 'number') {
      payload = parsePayload(Buffer.from(event))
    } else if (typeof event === 'string') {
      payload = parsePayload(event)
    } else {
      const rawBody = event?.body || ''
      const bodyText = event?.isBase64Encoded ? Buffer.from(rawBody, 'base64').toString('utf-8') : rawBody
      payload = parsePayload(bodyText)
    }
    if (!payload?.messages?.length) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: 'Missing messages' }) }
    }

    const systemPrompt = buildSystemPrompt(payload.context)
    const enriched = {
      ...payload,
      messages: [{ role: 'system', content: systemPrompt }, ...payload.messages],
    }

    let reply = ''
    const providers = pickProvider()
    for (const provider of providers) {
      if (provider === 'aliyun') {
        reply = await callAliyun(enriched)
      } else if (provider === 'zhipu') {
        reply = await callZhipu(enriched)
      }
      if (reply) break
    }

    if (!reply) {
      reply = 'AI 服务暂不可用，请稍后再试。'
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reply }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ reply: '服务异常，请稍后再试。' }),
    }
  }
}
