export type RiskLevel = 'low' | 'medium' | 'high'

export interface RiskResult {
  level: RiskLevel
  tags: string[]
}

const HIGH_RISK_KEYWORDS = [
  'COPD',
  '慢阻肺',
  '肺气肿',
  '低氧',
  '血氧',
  'SpO2',
  '药物',
  '处方',
  '儿童',
  '孕期',
  '胸痛',
  '紫绀',
  '昏厥'
]

export const HIGH_RISK_TEMPLATE =
  '我可以提供睡眠呼吸相关的科普与设备使用指导，但无法替代医生评估。\n' +
  '你提到的情况属于需要专业判断的范围，建议尽快咨询医生。\n' +
  '如出现明显呼吸困难、胸痛、紫绀等症状，请及时前往医院或急诊。'

export function detectRisk(message: string): RiskResult {
  const tags = HIGH_RISK_KEYWORDS.filter((keyword) => message.includes(keyword))
  if (tags.length > 0) {
    return { level: 'high', tags }
  }
  return { level: 'low', tags: [] }
}
