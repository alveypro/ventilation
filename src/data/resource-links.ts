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
        name: '临床指南资源 01',
        url: '#',
        description: '提供临床路径与诊疗共识的通用入口。',
      },
      {
        name: '临床指南资源 02',
        url: '#',
        description: '涵盖呼吸与睡眠相关的标准化建议。',
      },
    ],
  },
  {
    id: 'education',
    title: '专业教育与培训',
    subtitle: '课程与继续教育的通用入口',
    items: [
      {
        name: '继续教育资源 01',
        url: '#',
        description: '适用于医护与专业人员的学习资料。',
      },
      {
        name: '继续教育资源 02',
        url: '#',
        description: '提供学习框架与技能提升指引。',
      },
    ],
  },
  {
    id: 'research',
    title: '循证检索与研究',
    subtitle: '科研与论文检索的通用入口',
    items: [
      {
        name: '研究检索入口 01',
        url: '#',
        description: '用于查阅最新研究与系统综述。',
      },
      {
        name: '研究检索入口 02',
        url: '#',
        description: '适用于主题检索与证据筛选。',
      },
    ],
  },
  {
    id: 'patients',
    title: '患者支持与科普',
    subtitle: '面向患者与家属的通用资料',
    items: [
      {
        name: '患者教育资源 01',
        url: '#',
        description: '提供基础概念与使用指导。',
      },
      {
        name: '患者教育资源 02',
        url: '#',
        description: '聚焦常见问题与安全提示。',
      },
    ],
  },
]

export const resourceNotes = [
  '以上资源用于学习与参考，不替代医疗决策。',
  '任何治疗方案需由专业人员评估后执行。',
]
