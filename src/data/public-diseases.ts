export const publicDiseasesData = [
  {
    id: 1,
    name: '睡眠呼吸暂停综合征 (OSA)',
    classification: 'sleep_apnea',
    severity: '常见',
    description: '睡眠期间反复出现呼吸暂停/低通气，常伴打鼾与白天嗜睡。',
    prevalence: '成人群体约10-15%',
    symptoms: [
      '大声打鼾',
      '夜间呼吸暂停',
      '白天嗜睡',
      '晨起头痛',
      '注意力不集中',
    ],
    causes: [
      '上气道塌陷',
      '肥胖与颈围增大',
      '鼻阻塞或解剖异常',
      '年龄增长',
    ],
    diagnosis: [
      '量表筛查（STOP-Bang/ESS）',
      'PSG或HSAT',
      'AHI/ODI/T90评估',
    ],
    treatment: [
      'PAP治疗（CPAP/APAP）',
      '体重管理与生活方式调整',
      '必要时口腔矫治或手术评估',
    ],
    sources: [
      {
        title: 'Sleep Apnea',
        org: 'Sleep Education by AASM',
        url: 'https://sleepeducation.org/sleep-disorders/sleep-apnea/',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        org: 'AASM',
        url: 'https://aasm.org/clinical-resources/practice-standards/practice-guidelines/',
        date: '持续更新',
      },
    ],
    longform: `
## 一句话定义
OSA 是睡眠期间因上气道塌陷导致反复呼吸暂停或低通气的常见疾病。

## 诊断路径
1. 风险筛查（STOP-Bang、ESS）。
2. PSG 或 HSAT 明确事件与低氧负荷。
3. 结合 AHI、T90 与症状完成分层。

## 关键指标表
| 指标 | 含义 | 临床提示 |
| --- | --- | --- |
| AHI | 暂停+低通气次数/小时 | 与症状/合并症综合判断 |
| ODI | 血氧下降次数 | 反映低氧负荷 |
| T90 | SpO2 < 90% 时间占比 | 低氧严重度 |
| ArI | 觉醒指数 | 反映睡眠碎片化 |

## 治疗策略
- 首选 PAP 治疗（CPAP/APAP），改善气道通畅。
- 合并肥胖者强调体重管理与生活方式干预。
- 部分患者可评估口腔矫治或手术。

## 随访与疗效
- 关注依从性（常用口径：每晚 ≥4 小时、每周 ≥5 晚）。
- 观察症状改善、AHI/ODI 下降与睡眠结构改善。

## 风险与提示
- 严重低氧、明显心肺合并症需优先就医评估。
- 参数调整需遵循医嘱与随访数据。
    `,
    prognosis: '规范治疗可显著改善症状与心血管风险。',
    complications: ['高血压', '心血管疾病', '认知受损'],
    recommendedMachines: [],
  },
  {
    id: 2,
    name: '慢性阻塞性肺疾病 (COPD)',
    classification: 'copd',
    severity: '严重',
    description: '气流受限不可完全逆转的慢性疾病。',
    prevalence: '全球常见慢病之一',
    symptoms: ['慢性咳嗽', '咳痰', '呼吸困难', '活动耐量下降'],
    causes: ['长期吸烟', '空气污染', '职业粉尘'],
    diagnosis: ['肺功能检查', '血气分析', '影像学检查'],
    treatment: [
      '药物治疗与戒烟',
      '氧疗与肺康复',
      '有适应证者使用NIV',
    ],
    sources: [
      {
        title: 'Global Strategy for the Diagnosis, Management, and Prevention of COPD (2024 Report)',
        org: 'GOLD',
        url: 'https://goldcopd.org/2024-gold-report-2/',
        date: '2024',
      },
      {
        title: 'Chronic obstructive pulmonary disease (COPD)',
        org: 'World Health Organization',
        url: 'https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)',
        date: '持续更新',
      },
    ],
    longform: `
## 一句话定义
COPD 是以不可逆气流受限为特征的慢性呼吸系统疾病。

## 诊断路径
1. 症状评估（慢性咳嗽、咳痰、气促）。
2. 肺功能检查明确阻塞程度。
3. 血气分析与影像学评估并发症。

## 治疗要点
- 药物治疗与戒烟是基础。
- 必要时氧疗与肺康复改善运动耐量。
- 高碳酸血症或通气不足者考虑 NIV。

## 家用NIV关注点
- 评估适应证与耐受性。
- 重点关注 IPAP/EPAP 与后备频率。
- 建立随访节奏，避免 CO2 潴留。

## 随访与风险
- 监测急性加重（AECOPD）频率与诱因。
- 注意感染、心肺并发症与营养状态。
    `,
    prognosis: '需长期管理，可改善症状与生活质量。',
    complications: ['呼吸衰竭', '肺心病', '急性加重'],
    recommendedMachines: [],
  },
  {
    id: 3,
    name: '肥胖低通气综合征 (OHS)',
    classification: 'ohs',
    severity: '常见',
    description: '肥胖相关的慢性低通气与高碳酸血症。',
    prevalence: '肥胖人群风险更高',
    symptoms: ['白天嗜睡', '晨起头痛', '呼吸困难'],
    causes: ['肥胖相关通气不足', '睡眠呼吸障碍共存'],
    diagnosis: ['血气分析', '睡眠监测', '排除其他原因'],
    treatment: [
      '体重管理',
      'PAP或NIV治疗',
      '随访与复诊',
    ],
    sources: [
      {
        title: 'Clinical Practice Guidelines',
        org: 'AASM',
        url: 'https://aasm.org/clinical-resources/practice-standards/practice-guidelines/',
        date: '持续更新',
      },
      {
        title: 'Statements & Guidelines',
        org: 'American Thoracic Society',
        url: 'https://www.thoracic.org/statements/',
        date: '持续更新',
      },
    ],
    longform: `
## 一句话定义
OHS 是肥胖相关的慢性低通气综合征，常伴高碳酸血症与睡眠呼吸障碍。

## 诊断路径
1. 评估肥胖程度与症状（嗜睡、气促）。
2. 血气分析确认高碳酸血症。
3. 结合睡眠监测排除或合并 OSA。

## 治疗策略
- 体重管理是长期基础措施。
- PAP 或 NIV 改善夜间通气与低氧。
- 建议建立随访与复诊机制。

## 随访重点
- CO2 与氧合改善情况。
- 依从性与面罩耐受度。
    `,
    prognosis: '规范治疗可改善通气与症状。',
    complications: ['高碳酸血症', '肺动脉高压'],
    recommendedMachines: [],
  },
  {
    id: 4,
    name: '神经肌肉疾病相关低通气',
    classification: 'neuromuscular',
    severity: '严重',
    description: '呼吸肌无力导致通气不足与夜间低氧。',
    prevalence: '相对少见',
    symptoms: ['夜间低氧', '白天嗜睡', '呼吸肌疲劳'],
    causes: ['ALS', '肌营养不良', '重症肌无力'],
    diagnosis: ['肺功能检查', '夜间监测', '症状评估'],
    treatment: [
      'NIV通气支持',
      '呼吸肌训练与康复',
      '随访评估',
    ],
    sources: [
      {
        title: 'Statements & Guidelines',
        org: 'American Thoracic Society',
        url: 'https://www.thoracic.org/statements/',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        org: 'AASM',
        url: 'https://aasm.org/clinical-resources/practice-standards/practice-guidelines/',
        date: '持续更新',
      },
    ],
    longform: `
## 一句话定义
神经肌肉疾病可导致呼吸肌无力，出现夜间低通气与呼吸衰竭风险。

## 诊断路径
1. 肺功能检查与呼吸肌评估。
2. 夜间监测与血氧/CO2 评估。
3. 结合症状与疾病进展判断支持策略。

## 治疗与管理
- NIV 通气支持是核心手段。
- 呼吸肌训练与康复辅助改善耐受。
- 关注排痰与气道廓清。

## 随访重点
- 通气参数与夜间监测数据。
- 感染与急性加重风险。
    `,
    prognosis: '通气支持可改善生活质量。',
    complications: ['呼吸衰竭', '肺部感染'],
    recommendedMachines: [],
  },
  {
    id: 5,
    name: '中枢性睡眠呼吸暂停 (CSA)',
    classification: 'csa',
    severity: '中度',
    description: '中枢驱动不足导致呼吸暂停。',
    prevalence: '与心衰、药物相关',
    symptoms: ['夜间呼吸不稳定', '白天疲劳'],
    causes: ['心衰', '脑干病变', '阿片类药物'],
    diagnosis: ['PSG判读中枢事件', '病因评估'],
    treatment: [
      '处理原发疾病',
      '专业评估后选择通气策略',
    ],
    sources: [
      {
        title: 'Scoring Manual',
        org: 'AASM',
        url: 'https://aasm.org/clinical-resources/scoring-manual/',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        org: 'AASM',
        url: 'https://aasm.org/clinical-resources/practice-standards/practice-guidelines/',
        date: '持续更新',
      },
    ],
    longform: `
## 一句话定义
CSA 由中枢驱动不足引起呼吸暂停，需先寻找并处理原发原因。

## 诊断路径
1. PSG 判读中枢事件比例。
2. 评估心衰、脑干病变、药物因素等。
3. 判断是否存在复杂性睡眠呼吸暂停。

## 治疗策略
- 优先处理原发疾病。
- 通气策略需专业评估与随访。
- 高风险模式需严格适应证控制。

## 风险提示
- 不建议自行调整高级模式参数。
- 出现心肺症状需及时就医。
    `,
    prognosis: '需针对病因管理。',
    complications: ['睡眠碎片化', '心血管风险'],
    recommendedMachines: [],
  },
  {
    id: 6,
    name: '上气道阻力综合征 (UARS)',
    classification: 'uars',
    severity: '中度',
    description: '气流受限导致觉醒，但 AHI 可能不高。',
    prevalence: '较常见但易漏诊',
    symptoms: ['疲劳', '睡眠质量差', '晨起不适'],
    causes: ['上气道阻力增加'],
    diagnosis: ['PSG判读RERA', '症状评估'],
    treatment: [
      'PAP治疗',
      '改善气道通畅',
    ],
    sources: [
      {
        title: 'Scoring Manual',
        org: 'AASM',
        url: 'https://aasm.org/clinical-resources/scoring-manual/',
        date: '持续更新',
      },
      {
        title: 'Sleep Apnea',
        org: 'Sleep Education by AASM',
        url: 'https://sleepeducation.org/sleep-disorders/sleep-apnea/',
        date: '持续更新',
      },
    ],
    longform: `
## 一句话定义
UARS 是上气道阻力增加导致觉醒增多的睡眠障碍，AHI 可能不高。

## 诊断路径
1. 症状评估（疲劳、睡眠质量差）。
2. PSG 判读 RERA 与流量受限。
3. 排除其他导致睡眠质量差的因素。

## 治疗策略
- 改善上气道阻力与鼻阻塞。
- 必要时尝试 PAP。
- 强调睡眠卫生与行为干预。
    `,
    prognosis: '改善气道后可缓解症状。',
    complications: ['睡眠碎片化'],
    recommendedMachines: [],
  },
]
