export interface Citation {
  title: string
  url: string
  snippet: string
}

const CITATION_MAP: { keywords: string[]; citation: Citation }[] = [
  {
    keywords: ['AHI', '睡眠监测', '监测', '呼吸暂停'],
    citation: {
      title: 'AHI 与睡眠监测基础',
      url: 'https://airivo.cn',
      snippet: '了解 AHI 指标与常见睡眠监测方式的基本概念。'
    }
  },
  {
    keywords: ['面罩', '漏气', '口干', '加湿'],
    citation: {
      title: '面罩与加湿常见问题',
      url: 'https://airivo.cn',
      snippet: '面罩佩戴、漏气与加湿相关的日常使用建议。'
    }
  },
  {
    keywords: ['单水平', '双水平', '模式', '自动'],
    citation: {
      title: '单水平与双水平模式',
      url: 'https://airivo.cn',
      snippet: '理解不同治疗模式的基本差异与适用场景。'
    }
  }
]

const DEFAULT_CITATION: Citation = {
  title: '呼吸机之家官方科普',
  url: 'https://airivo.cn',
  snippet: '睡眠呼吸暂停相关科普与设备使用建议。'
}

export function getCitations(message: string): Citation[] {
  const hits: Citation[] = []
  for (const item of CITATION_MAP) {
    if (item.keywords.some((keyword) => message.includes(keyword))) {
      hits.push(item.citation)
    }
  }
  if (hits.length === 0) {
    return [DEFAULT_CITATION]
  }
  return hits.slice(0, 3)
}
