export type TopicDefinition = {
  id: string
  title: string
  description: string
  keywords: string[]
  query: string
}

export const topicCatalog: TopicDefinition[] = [
  {
    id: 'osa',
    title: 'OSA 睡眠呼吸暂停',
    description: '诊断要点、压力滴定与依从性管理。',
    keywords: ['OSA', '睡眠呼吸暂停', '呼吸暂停', '打鼾'],
    query: 'OSA',
  },
  {
    id: 'copd',
    title: 'COPD 慢阻肺',
    description: '无创通气策略与家庭管理路径。',
    keywords: ['COPD', '慢阻肺', '慢性阻塞性肺疾病'],
    query: 'COPD',
  },
  {
    id: 'niv',
    title: '无创通气 NIV',
    description: '适应证、模式选择与参数调节。',
    keywords: ['无创通气', 'NIV', 'BiPAP'],
    query: '无创通气',
  },
  {
    id: 'hfnc',
    title: 'HFNC 高流量氧疗',
    description: '氧合策略、流量设定与使用时机。',
    keywords: ['HFNC', '高流量', '经鼻高流量'],
    query: 'HFNC',
  },
  {
    id: 'sleep-study',
    title: '睡眠监测 PSG/AASM',
    description: '睡眠评分、设备搭建与判读规范。',
    keywords: ['PSG', '睡眠监测', 'AASM', '多导'],
    query: 'PSG',
  },
  {
    id: 'mask',
    title: '面罩与附件',
    description: '适配原则、舒适性与漏气处理。',
    keywords: ['面罩', '鼻罩', '口鼻罩', 'Mask'],
    query: '面罩',
  },
  {
    id: 'airway-clearance',
    title: '气道廓清与咳痰',
    description: '排痰设备与呼吸康复要点。',
    keywords: ['咳痰', '气道廓清', 'E70', '排痰'],
    query: '咳痰',
  },
  {
    id: 'oxygen',
    title: '氧疗与血氧监测',
    description: '氧疗设备选择与居家监测。',
    keywords: ['氧疗', '制氧', '血氧', '脉氧'],
    query: '氧疗',
  },
  {
    id: 'home-care',
    title: '家庭治疗与随访',
    description: '依从性、随访流程与维护清单。',
    keywords: ['家庭', '依从性', '随访', '维护'],
    query: '依从性',
  },
]
