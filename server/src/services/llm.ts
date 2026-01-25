const SYSTEM_PROMPT = `你是「呼吸机之家 AI 专家」，覆盖呼吸机相关的全领域（如 OSA、COPD、神经肌肉疾病、肥胖低通气等）的专业科普、设备使用指导与报告解读框架。

严格遵守（不可违背）：
- 不进行个体化诊断、不处方、不承诺疗效
- 不给具体压力参数或个体化治疗方案
- 高风险情形必须建议就医（持续严重低氧、白天嗜睡影响驾驶、胸痛/晕厥、儿童/孕期等）
- 只提供通用科普信息与阅读报告的方法

输出风格：
- 语气专业、清晰、可执行、不过度术语化
- 先安抚，再解释，再建议，最后强调就医时机

统一回答结构（固定）：
【结论】一句话安抚/概括
【通俗解释】用简洁语言解释核心概念
【可能含义（非诊断）】基于通用知识解释“指标/现象通常意味着什么”
【可操作建议（非处方）】生活方式、使用习惯、就医准备
【何时必须就医】列出危险信号与建议就医情形

当用户提供 PSG/呼吸机报告或参数时：
- 先列出“关键指标清单及解释”
- 然后给“通用解读框架”
- 不对个体下结论、不建议具体压力值

当用户上传图片/文件时：
- 说明无法直接读取图片内容
- 告知需要用户提供的关键文字信息清单（例如 AHI、ODI、最低血氧、压力范围、漏气、使用时长）
 - 若已提取到文本，基于文本做通用科普解读
`

export interface LLMClient {
  generate(prompt: string): Promise<string>
}

export class MockLLMClient implements LLMClient {
  async generate(prompt: string): Promise<string> {
    return `【结论】
这是一个睡眠呼吸相关的科普问题。

【通俗解释】
当前使用 Mock 模型返回，用于跑通系统流程。

【可能含义（非诊断）】
需要结合症状、检查与医生评估，才能明确具体情况。

【可操作建议（非处方）】
后续将接入真实大模型提供更准确的科普信息与使用建议。

【何时必须就医】
如涉及持续低氧、胸痛/晕厥、儿童/孕期等，请尽快就医。`
  }
}

export class BailianLLMClient implements LLMClient {
  async generate(prompt: string): Promise<string> {
    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      throw new Error('Missing DASHSCOPE_API_KEY')
    }

    const baseUrl =
      process.env.DASHSCOPE_BASE_URL ||
      'https://dashscope.aliyuncs.com/compatible-mode/v1'
    const model = process.env.DASHSCOPE_MODEL || 'qwen-plus'
    const url = `${baseUrl}/chat/completions`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: controller.signal
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Bailian HTTP ${res.status}: ${errText}`)
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[]
      }
      const content = data.choices?.[0]?.message?.content
      if (!content) {
        throw new Error('Bailian empty response')
      }
      return content
    } finally {
      clearTimeout(timeout)
    }
  }
}

export const llmClient: LLMClient =
  process.env.LLM_PROVIDER === 'bailian'
    ? new BailianLLMClient()
    : new MockLLMClient()

export function buildPrompt(message: string, history: string[]): string {
  const context = history.length ? `\n\n对话上下文：\n${history.join('\n')}` : ''
  return `${SYSTEM_PROMPT}\n\n用户问题：${message}${context}`
}
