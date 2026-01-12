type PackRole = 'doctor' | 'patient' | 'agent' | 'manufacturer'

const headers: Record<PackRole, string> = {
  doctor: '医生知识包',
  patient: '患者知识包',
  agent: '代理商知识包',
  manufacturer: '厂家知识包',
}

const sections: Record<PackRole, string[]> = {
  doctor: [
    '诊断标准摘要（AHI/FEV1分级）',
    '治疗路径与处方参数清单',
    '随访清单与依从性提升策略',
    '病例记录模板与要点',
  ],
  patient: [
    '疾病认知与常见问题解答',
    '开箱/面罩/清洁/维护步骤',
    '适应期计划与生活管理建议',
    '复诊与数据记录表',
  ],
  agent: [
    '客户画像与需求访谈模板',
    '竞品对比清单（参数/卖点/价格带）',
    '方案推荐话术与成交建议',
    '报价与售后承诺模板',
  ],
  manufacturer: [
    '竞品功能矩阵与差异点',
    '研发关注点与核心指标',
    '合规清单与资料准备',
    '上市节奏与渠道策略',
  ],
}

export const buildKnowledgePack = (role: PackRole) => {
  const title = headers[role]
  const body = sections[role].map((item, idx) => `${idx + 1}. ${item}`).join('\n')
  return `${title}\n\n${body}\n\n生成时间：${new Date().toLocaleString()}\n\n请根据实际场景补充内容。`
}
