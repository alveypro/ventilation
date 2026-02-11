export type ResourceLink = {
  name: string
  url: string
  description: string
}

export type ResourceCategory = {
  id: string
  title: string
  subtitle: string
  items: ResourceLink[]
}

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'guides',
    title: '权威指南与共识',
    subtitle: '面向临床学习与路径对照的通用资源',
    items: [
      {
        name: 'AASM 睡眠医学临床指南',
        url: 'https://aasm.org/clinical-resources/practice-standards/',
        description: '睡眠医学与睡眠呼吸暂停相关指南与共识。',
      },
      {
        name: 'ERS/ATS 无创通气临床共识',
        url: 'https://www.thoracic.org/professionals/clinical-resources.php',
        description: '无创通气评估、启动与随访的共识框架。',
      },
      {
        name: 'GOLD 慢阻肺指南',
        url: 'https://goldcopd.org/gold-reports/',
        description: '慢阻肺诊疗与长期管理的权威指南。',
      },
    ],
  },
  {
    id: 'education',
    title: '专业教育与培训',
    subtitle: '课程与继续教育的通用入口',
    items: [
      {
        name: '睡眠医学继续教育课程',
        url: 'https://learn.aasm.org/',
        description: '面向临床人员的系统课程与案例学习。',
      },
      {
        name: '呼吸治疗技能培训',
        url: 'https://www.aarc.org/education/continuing-education/',
        description: '通气支持、设备管理与随访能力提升。',
      },
      {
        name: 'ERS 在线培训课程',
        url: 'https://ersnet.org/education/',
        description: '呼吸相关课程与在线学习资源。',
      },
    ],
  },
  {
    id: 'research',
    title: '循证检索与研究',
    subtitle: '科研与论文检索的通用入口',
    items: [
      {
        name: 'PubMed 检索入口',
        url: 'https://pubmed.ncbi.nlm.nih.gov/',
        description: '查阅最新研究、系统综述与临床试验。',
      },
      {
        name: 'Cochrane 证据库',
        url: 'https://www.cochranelibrary.com/',
        description: '高质量系统综述与证据总结入口。',
      },
      {
        name: 'ClinicalTrials 临床试验库',
        url: 'https://clinicaltrials.gov/',
        description: '查询相关临床试验进展与研究设计。',
      },
    ],
  },
  {
    id: 'patients',
    title: '患者支持与科普',
    subtitle: '面向患者与家属的通用资料',
    items: [
      {
        name: '睡眠呼吸暂停患者教育',
        url: 'https://medlineplus.gov/sleepapnea.html',
        description: '基础概念、风险提示与自我管理建议。',
      },
      {
        name: '呼吸机使用与随访指南',
        url: 'https://www.nhlbi.nih.gov/health/sleep-apnea/treatment',
        description: '使用要点、常见问题与安全红线提醒。',
      },
      {
        name: 'COPD 患者科普',
        url: 'https://medlineplus.gov/copd.html',
        description: '慢阻肺基础知识、治疗与日常管理建议。',
      },
    ],
  },
]

export const resourceNotes = [
  '以上资源用于学习与参考，不替代医疗决策。',
  '任何治疗方案需由专业人员评估后执行。',
]
