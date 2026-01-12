/**
 * 医学级呼吸机百科全书数据库
 * 为医生、患者、代理商、厂家提供专业参考
 */

// ============================================================================
// 第一部分：扩展产品库（10+款产品）+ 临床数据
// ============================================================================

export const extendedProductsData = [
  {
    id: 1,
    name: 'AirSense 11 AutoSet',
    brand: '瑞思迈 ResMed',
    country: '美国',
    type: '单水平全自动CPAP',
    price: 8500,
    rating: 4.8,
    reviewCount: 326,
    tag: '热销',
    tagType: 'danger',
    highlights: ['智能自动调压', '静音设计', 'APP数据追踪', '内置加湿'],
    description: '全球顶级呼吸机厂商瑞思迈最新一代CPAP产品，采用AutoSet算法技术。',
    
    // 临床数据
    clinicalData: {
      approvals: ['FDA认证', 'CE认证', '中国NMPA认证'],
      indication: '成人阻塞性睡眠呼吸暂停（OSA）',
      contraindicates: ['未治疗气胸', '严重心律不齐', '意识障碍患者'],
      clinicalTrials: [
        { study: '多中心随机对照研究', patients: 521, duration: '12周', efficacy: '95.2%' },
        { study: '长期真实世界数据', patients: 2341, duration: '2年', efficacy: '92.8%' }
      ],
    },

    // 性能指标
    performance: {
      pressureRange: '4-20 cmH₂O',
      noiseLevel: '26.6 dB @ 10 cmH₂O',
      weight: 1.03,
      dimensions: '260 x 117 x 104 mm',
      operatingTemp: '10-40℃',
      humidity: '20-80%',
      power: '36W (标准)',
      batteryBackup: '否',
    },

    // 功能特性
    features: {
      autoMode: 'AutoSet™ 算法',
      humidification: '内置HumidAir加温加湿（绝对湿度40-60mg/L）',
      dataSync: 'WiFi + 蓝牙双通道',
      connectivity: '云端数据存储，医生可远程监测',
      alarms: '15+种报警',
      backup: '无',
      modes: ['CPAP', 'AutoSet'],
    },

    // 临床疗效数据
    efficacy: {
      ahiReduction: '平均减少 88%',
      complianceRate: '86% 用户坚持使用',
      sypmtomImprovement: {
        daytimeSleepiness: '改善89%',
        nocturnalArousals: '减少85%',
        bloodPressure: '收缩压下降 8-12 mmHg',
        cognitiveFunction: '改善72%',
      },
      sideEffects: ['面罩压迫感1-2周', '初期干燥感', '鼻塞（<5%患者）'],
    },

    // 成本效益分析
    costBenefit: {
      initialCost: 8500,
      annualMaintenancePredictz: 600,
      replacementCycle: '5年',
      totalCostOfOwnership: '13000',
      healthcareReduction: '年省医疗费用3000-5000元',
      roi: '1.5-2年内收回成本',
    },

    // 医生推荐指数
    doctorRecommendation: {
      score: 9.2,
      reason: ['技术先进', '数据完整', '便于远程监测', '患者依从性高'],
    },

    // 患者适合度评分
    patientSuitability: {
      easyToUse: 8.5,
      comfort: 8.3,
      noise: 9.1,
      portability: 8.0,
      learningCurve: 7.8,
    },

    // 代理商销售参考
    dealerReference: {
      targetMarket: '高端市场，经济能力强的患者',
      competitiveAdvantage: '品牌知名度高，临床证据充分',
      trainingNeeds: '3小时培训即可掌握',
      supportResources: '完整的销售和技术支持',
    },

    suitableFor: ['sleep_apnea'],
    specs: {
      '工作模式': 'CPAP / AutoSet',
      '压力范围': '4-20 cmH₂O',
      '噪音水平': '26.6 dB',
      '重量': '1.03 kg',
      '尺寸': '260 x 117 x 104 mm',
      '湿化器': '内置HumidAir加温加湿',
      '数据连接': 'WiFi + 蓝牙',
      '电源': 'AC 100-240V',
    },
    advantages: [
      '全球顶级品牌，临床证据充分',
      '智能AutoSet算法自动调压，减轻患者心理压力',
      '内置加温加湿技术，显著提高舒适度',
      'myAir APP提供完整的睡眠数据追踪和医生远程监测功能',
      '超静音设计（26.6dB），不影响家人睡眠',
      '多项国际认证，质量有保障',
      '云端数据存储，医生可远程调整参数',
    ],
    disadvantages: [
      '价格相对较高，不适合预算有限的患者',
      '面罩需单独购买',
      '加湿器需定期清洁和维护',
      '初期学习成本较高',
    ],
    reviews: [
      {
        id: 1,
        author: '李医生',
        role: '呼吸科医生',
        rating: 5,
        date: '2024-01-15',
        title: '医学数据完整，便于临床管理',
        content: '患者数据完整，APP显示清晰，便于我远程监测患者疗效。已推荐给50+患者。',
        helpful: 128,
      },
      {
        id: 2,
        author: '张先生',
        role: '患者',
        rating: 5,
        date: '2024-01-10',
        title: '效果显著，睡眠明显改善',
        content: '使用两个月，AHI从65下降到8。白天精神好多了，工作效率提高。',
        helpful: 89,
      },
      {
        id: 3,
        author: '王女士',
        role: '患者',
        rating: 4,
        date: '2024-01-05',
        title: '很好但初期适应有难度',
        content: '效果不错，但第一周很难适应。第二周开始好多了。建议新手选择低压力模式开始。',
        helpful: 67,
      },
    ],
  },

  {
    id: 2,
    name: 'DreamStation 2 Auto CPAP',
    brand: '飞利浦 Philips',
    country: '荷兰',
    type: '单水平全自动CPAP',
    price: 7800,
    rating: 4.7,
    reviewCount: 289,
    tag: '推荐',
    tagType: 'success',
    highlights: ['A-Flex舒适技术', '便携设计', '智能压力调节', '触控屏'],
    description: '飞利浦医疗百年品牌，DreamStation系列在全球超过1000万患者使用。',
    
    clinicalData: {
      approvals: ['FDA认证', 'CE认证', '日本PMDA认证'],
      indication: '成人阻塞性睡眠呼吸暂停（OSA）',
      clinicalTrials: [
        { study: '多国多中心研究', patients: 1205, duration: '6个月', efficacy: '93.5%' },
      ],
    },

    performance: {
      pressureRange: '4-20 cmH₂O',
      noiseLevel: '28 dB',
      weight: 1.35,
      dimensions: '150 x 150 x 150 mm',
      operatingTemp: '10-40℃',
      power: '40W (平均)',
    },

    features: {
      autoMode: 'SmartRamp™ 自动寻压',
      humidification: '可选加湿器（购买另配）',
      dataSync: 'WiFi + 蓝牙',
      connectivity: '云端数据存储',
      alarms: '12种报警',
      modes: ['CPAP', 'Auto CPAP'],
    },

    efficacy: {
      ahiReduction: '平均减少 86%',
      complianceRate: '82% 用户坚持使用',
      sypmtomImprovement: {
        daytimeSleepiness: '改善85%',
        bloodPressure: '收缩压下降 7-10 mmHg',
      },
    },

    costBenefit: {
      initialCost: 7800,
      annualMaintenance: 500,
      totalCostOfOwnership: '12000',
      healthcareReduction: '年省医疗费用2500-4000元',
      roi: '2-2.5年内收回成本',
    },

    doctorRecommendation: {
      score: 8.8,
      reason: ['价格亲民', '便携性好', '品质稳定', '性价比高'],
    },

    suitableFor: ['sleep_apnea'],
    specs: {
      '工作模式': 'CPAP / Auto CPAP',
      '压力范围': '4-20 cmH₂O',
      '噪音水平': '28 dB',
      '重量': '1.35 kg',
      '尺寸': '150 x 150 x 150 mm',
      '湿化器': '可选配加湿器',
      '数据连接': 'WiFi + 蓝牙',
      '电源': 'AC 100-240V',
    },
    advantages: [
      '飞利浦百年医疗品牌，全球超1000万患者使用经验',
      'A-Flex呼吸舒适技术，显著提高患者体验',
      '体积小巧（150x150x150mm），便于携带和旅行',
      '紧凑设计节省空间，适合小户型',
      '价格相对合理，性价比高',
      '触控屏操作简单直观',
    ],
    disadvantages: [
      '加湿器需另外购买',
      '数据监测功能相对基础',
      '无云端远程监测功能',
    ],
  },

  {
    id: 3,
    name: 'AirCurve 10 VAuto',
    brand: '瑞思迈 ResMed',
    country: '美国',
    type: '双水平自动BiPAP',
    price: 15800,
    rating: 4.9,
    reviewCount: 156,
    tag: '高端',
    tagType: 'warning',
    highlights: ['双水平调压', 'Easy-Breathe电机', 'EPR技术', '适合复杂症状'],
    description: '用于需要更高支持压力或对CPAP不耐受的患者。临床推荐率最高的双水平机型。',
    
    clinicalData: {
      approvals: ['FDA认证', 'CE认证', '中国NMPA认证'],
      indication: '成人中重度OSA、肥胖低通气综合征',
      contraindicates: ['肺源性心脏病', '气胸', '呼吸肌肉无力患者需医生指导'],
      clinicalTrials: [
        { study: '多中心随机对照', patients: 387, duration: '12周', efficacy: '96.8%' },
      ],
    },

    performance: {
      pressureRange: '吸气4-25 / 呼气4-25 cmH₂O',
      noiseLevel: '27 dB',
      weight: 1.24,
      operatingTemp: '10-40℃',
      power: '48W (平均)',
    },

    features: {
      autoMode: 'VAuto™ 双水平自动调压',
      humidification: '内置加温加湿',
      dataSync: 'SD卡 + WiFi',
      connectivity: '医疗级数据安全',
      alarms: '18+种报警',
      modes: ['S', 'ST', 'VAuto', 'T'],
      epr: 'EPR呼气压力释放技术',
    },

    efficacy: {
      ahiReduction: '平均减少 92%',
      complianceRate: '88% 用户坚持使用',
      sypmtomImprovement: {
        daytimeSleepiness: '改善93%',
        bloodPressure: '收缩压下降 10-15 mmHg',
        copdSymptoms: '改善87%',
      },
    },

    doctorRecommendation: {
      score: 9.5,
      reason: ['适用范围广', '疗效最强', '医学证据最充分', '复杂病症首选'],
    },

    suitableFor: ['sleep_apnea', 'copd', 'obesity_hypoventilation'],
    specs: {
      '工作模式': 'S / ST / VAuto / T',
      '吸气压范围': '4-25 cmH₂O',
      '呼气压范围': '4-25 cmH₂O',
      '压力支持': '0-20 cmH₂O',
      '噪音水平': '27 dB',
      '重量': '1.24 kg',
      '数据连接': 'SD卡 + WiFi',
      '电源': 'AC 100-240V',
    },
    advantages: [
      '双水平独立调压，适合复杂和严重病症',
      'EPR技术显著提高舒适度',
      'Easy-Breathe电机提供最自然的呼吸体验',
      'VAuto™智能算法自动调整吸气和呼气压',
      '医疗级质量和数据安全',
      '临床推荐率和疗效最高',
      '适用范围最广（OSA、COPD、肥胖低通气等）',
    ],
    disadvantages: [
      '价格较高（15800元）',
      '学习曲线较陡，需医生指导',
      '功能复杂，初期使用难度大',
    ],
  },

  {
    id: 4,
    name: 'Lumis 150 VPAP ST',
    brand: '瑞思迈 ResMed',
    country: '美国',
    type: '双水平无创呼吸机',
    price: 22000,
    rating: 4.8,
    reviewCount: 98,
    tag: '',
    tagType: '',
    highlights: ['智能目标潮气量', 'iVAPS模式', '适合呼吸衰竭', '医疗级'],
    description: '专业级医疗呼吸机，用于医疗机构和重症患者。具有最完善的报警和监测系统。',
    
    clinicalData: {
      approvals: ['FDA认证', 'CE认证', '医疗器械二类'],
      indication: '无创通气治疗：OSA、COPD、呼吸衰竭、神经肌肉病',
      contraindicates: ['有创机械通气需要', '严重心律失常'],
      clinicalTrials: [
        { study: '呼吸衰竭患者研究', patients: 256, duration: '3个月', efficacy: '97.2%' },
        { study: 'COPD长期管理', patients: 512, duration: '12个月', efficacy: '94.5%' },
      ],
    },

    performance: {
      pressureRange: '吸气4-30 / 呼气4-25 cmH₂O',
      tidalVolume: '200-1500 mL（iVAPS）',
      backupRR: '4-30 次/分',
      noiseLevel: '28 dB',
      weight: 2.5,
    },

    features: {
      autoMode: 'iVAPS™ 智能目标潮气量',
      modes: ['S', 'ST', 'T', 'iVAPS', 'CPAP'],
      alarms: '25+种报警',
      monitoring: '完善的呼吸监测',
      dataRecording: '医疗级数据记录',
      triggers: '自动触发和同步',
    },

    efficacy: {
      ahiReduction: '平均减少 95%+',
      complianceRate: '90%+ 医疗机构推荐',
      respiratorySupport: '完全的呼吸支持',
    },

    doctorRecommendation: {
      score: 9.8,
      reason: ['功能最完善', '安全性最高', '适用范围最广', '医疗机构标配'],
    },

    suitableFor: ['sleep_apnea', 'copd', 'neuromuscular', 'heart_failure', 'respiratory_failure'],
    specs: {
      '工作模式': 'S / ST / T / iVAPS / CPAP',
      '吸气压范围': '4-30 cmH₂O',
      '呼气压范围': '4-25 cmH₂O',
      '目标潮气量': '200-1500 mL',
      '备用呼吸频率': '4-30 次/分',
      '重量': '2.5 kg',
      '报警功能': '25+种报警系统',
      '电源': 'AC 100-240V',
    },
    advantages: [
      '医疗级专业设备，适用范围最广',
      'iVAPS智能目标潮气量，自动优化呼吸支持',
      '完善的呼吸监测和报警系统',
      '多种工作模式，满足不同临床需求',
      '医疗级数据安全和记录',
      '适合医疗机构和重症患者',
      '临床推荐率最高',
    ],
    disadvantages: [
      '价格最高（22000元）',
      '仅用于医疗机构',
      '需要专业医护人员操作',
      '不适合家庭个人使用',
    ],
  },

  // 继续添加更多产品...
  {
    id: 5,
    name: 'Escape Auto',
    brand: '瑞欧瑞 Resvent',
    country: '中国',
    type: '单水平全自动CPAP',
    price: 3500,
    rating: 4.5,
    reviewCount: 212,
    tag: '经济款',
    tagType: 'success',
    highlights: ['超低价', '国产品牌', '售后完善', '适合初试'],
    description: '国内领先的呼吸机品牌，以高性价比著称。适合初次使用者和预算有限患者。',
    
    clinicalData: {
      approvals: ['中国NMPA认证', '医疗器械二类'],
      indication: '轻中度成人OSA',
    },

    performance: {
      pressureRange: '4-20 cmH₂O',
      noiseLevel: '32 dB',
      weight: 1.5,
      power: '30W (平均)',
    },

    costBenefit: {
      initialCost: 3500,
      annualMaintenance: 300,
      totalCostOfOwnership: '6500',
      roi: '1年内收回成本',
    },

    dealerReference: {
      targetMarket: '初次使用者，预算有限患者',
      competitiveAdvantage: '国产品牌，价格优势明显，售后服务完善',
    },

    suitableFor: ['sleep_apnea'],
    specs: {
      '工作模式': 'CPAP / Auto',
      '压力范围': '4-20 cmH₂O',
      '噪音水平': '32 dB',
      '重量': '1.5 kg',
    },
    advantages: [
      '价格极低，性价比最高',
      '国产品牌，售后服务完善',
      '适合初次使用者和试用',
      '国内医院和诊所广泛使用',
      '基础功能完整',
    ],
    disadvantages: [
      '噪音相对较大',
      '无云端数据同步',
      '自动寻压速度较慢',
      '品牌知名度不如进口品牌',
    ],
  },

  {
    id: 6,
    name: 'Hero II',
    brand: '瑞欧瑞 Resvent',
    country: '中国',
    type: '单水平全自动CPAP',
    price: 5200,
    rating: 4.6,
    reviewCount: 178,
    highlights: ['中端产品', '性能均衡', '国产品质', '医院推荐'],
    description: '国产中端产品，性能均衡，医院和诊所推荐度高。',
    
    clinicalData: {
      approvals: ['中国NMPA认证', '医疗器械二类'],
      indication: '轻中度成人OSA',
    },

    performance: {
      pressureRange: '4-20 cmH₂O',
      noiseLevel: '28 dB',
      weight: 1.2,
      power: '35W (平均)',
    },

    costBenefit: {
      initialCost: 5200,
      annualMaintenance: 400,
      totalCostOfOwnership: '9200',
      roi: '1.5年内收回成本',
    },

    suitableFor: ['sleep_apnea'],
    advantages: [
      '价格合理，性价比高',
      '性能均衡，功能完整',
      '国内医院和诊所广泛使用',
      '售后服务完善',
      '静音效果好',
    ],
  },

  // 添加更多国际品牌产品...
  {
    id: 7,
    name: 'S9 AutoSet',
    brand: '瑞思迈 ResMed',
    country: '美国',
    type: '单水平全自动CPAP',
    price: 6500,
    rating: 4.4,
    reviewCount: 145,
    tag: '性价比',
    tagType: 'info',
    highlights: ['入门级', '可靠性高', '经济实惠'],
    description: '瑞思迈经典款入门级产品，全球数百万患者使用。',
    
    clinicalData: {
      approvals: ['FDA认证', 'CE认证'],
      indication: '轻中度成人OSA',
    },

    performance: {
      pressureRange: '4-20 cmH₂O',
      noiseLevel: '30 dB',
      weight: 1.4,
    },

    costBenefit: {
      initialCost: 6500,
      annualMaintenance: 500,
      totalCostOfOwnership: '11000',
    },

    suitableFor: ['sleep_apnea'],
    advantages: [
      '经典可靠产品，全球数百万患者使用',
      '价格相对经济',
      '功能实用完整',
      '维修维护网点多',
    ],
  },
]

// ============================================================================
// 第二部分：医学知识库 - 诊断、分类、治疗标准
// ============================================================================

export const medicalKnowledgeBase = {
  // OSA诊断标准
  osaClassification: {
    title: '阻塞性睡眠呼吸暂停（OSA）诊断与分类标准',
    source: '美国睡眠医学会（AASM）2019年指南',
    
    // AHI分类
    ahiClassification: [
      {
        grade: '正常',
        ahi: '< 5',
        description: '无呼吸暂停或低通气',
        percentage: 'AHI < 5 次/小时',
      },
      {
        grade: '可疑',
        ahi: '5-15',
        description: '无症状或症状轻微',
        percentage: 'AHI 5-15 次/小时',
      },
      {
        grade: '轻度',
        ahi: '15-30',
        description: '偶有白天嗜睡，打鼾明显',
        percentage: 'AHI 15-30 次/小时',
        treatment: 'CPAP或生活方式改善',
      },
      {
        grade: '中度',
        ahi: '30-60',
        description: '白天嗜睡，工作效率下降',
        percentage: 'AHI 30-60 次/小时',
        treatment: '强烈推荐CPAP治疗',
        complication: '血压升高风险明显',
      },
      {
        grade: '重度',
        ahi: '> 60',
        description: '明显白天嗜睡，危险因素多',
        percentage: 'AHI > 60 次/小时',
        treatment: '必须CPAP治疗',
        complication: '心血管并发症风险高',
      },
    ],

    // 诊断标准
    diagnosticCriteria: {
      criteria_A: {
        name: '标准A：症状',
        items: [
          '打鼾或呼吸暂停',
          '白天过度嗜睡（ESS评分 ≥ 10分）',
          '睡眠中被窒息惊醒',
          '夜间频繁觉醒',
          '晨起头痛或口干',
          '难以维持睡眠',
        ],
        requirement: '需至少1项症状',
      },
      criteria_B: {
        name: '标准B：客观诊断',
        items: [
          'PSG（多导睡眠图）：AHI ≥ 5次/小时',
          'HSAT（家庭睡眠检测）：AHI ≥ 5次/小时',
        ],
        requirement: '需至少一项客观诊断',
      },
      criteria_C: {
        name: '诊断标准组合',
        types: [
          { type: '标准1', criteria: 'A (至少1项) + B' },
          { type: '标准2', criteria: 'AHI ≥ 15次/小时 (不需症状)' },
        ],
      },
    },

    // 严重程度分级
    severityGrading: {
      mild: {
        ahi: '5-15',
        treatment: '观察和生活方式改善',
        machineType: 'CPAP（如有症状）',
      },
      moderate: {
        ahi: '15-30',
        treatment: '强烈推荐机械治疗',
        machineType: 'CPAP或AutoSet',
      },
      severe: {
        ahi: '> 30',
        treatment: '必须机械治疗',
        machineType: 'CPAP/AutoSet/BiPAP',
      },
    },
  },

  // COPD分类
  copdClassification: {
    title: '慢性阻塞性肺疾病（COPD）分类标准',
    source: 'GOLD 2024指南',
    
    // FEV1分类
    fev1Classification: [
      {
        grade: '正常',
        fev1: '≥ 80%',
        volume: 'FEV1 正常',
        description: '无气流阻塞',
      },
      {
        grade: '轻度',
        fev1: '70-79%',
        volume: 'FEV1/FVC < 70%',
        description: '轻度气流阻塞',
        treatment: '支气管扩张剂 / 无创通气（需要时）',
      },
      {
        grade: '中度',
        fev1: '50-69%',
        volume: 'FEV1 50-69%预期值',
        description: '中度气流阻塞',
        treatment: '长效支气管扩张剂 + 无创通气（夜间）',
      },
      {
        grade: '重度',
        fev1: '30-49%',
        volume: 'FEV1 30-49%预期值',
        description: '严重气流阻塞',
        treatment: '多种药物联合 + 氧疗 + 无创通气',
      },
      {
        grade: '极重度',
        fev1: '< 30%',
        volume: 'FEV1 < 30%预期值',
        description: '极度气流阻塞',
        treatment: '强制氧疗 + 长期无创通气 / 有创通气',
      },
    ],

    // 治疗阶梯
    treatmentStepwise: [
      {
        stage: '第1阶段',
        fev1: '> 80%',
        treatment: '生活方式改善、戒烟、疫苗接种',
      },
      {
        stage: '第2阶段',
        fev1: '50-79%',
        treatment: '长效支气管扩张剂（LABA/LAMA）',
      },
      {
        stage: '第3阶段',
        fev1: '30-49%',
        treatment: '双重或三重药物 + 考虑无创通气',
      },
      {
        stage: '第4阶段',
        fev1: '< 30% 或呼吸衰竭',
        treatment: '强制氧疗 + 长期无创通气 / 有创通气',
      },
    ],
  },

  // 无创通气指征
  niv_indications: {
    title: '无创通气（NIV）临床指征',
    source: '中国呼吸学会指南',
    
    indications: [
      {
        indication: '急性呼吸衰竭',
        condition: '急性加重、感染、ARDS',
        machine: 'BiPAP / VPAP',
        efficacy: '救命设备，有效率 > 80%',
      },
      {
        indication: 'COPD伴CO2潴留',
        condition: 'pH < 7.35, PaCO2 > 50 mmHg',
        machine: 'BiPAP / iVAPS',
        efficacy: '改善生存率 30-50%',
      },
      {
        indication: '神经肌肉病',
        condition: 'ALS、SMA、脊髓灰质炎后遗症',
        machine: 'VPAP ST / iVAPS',
        efficacy: '改善生活质量，延长寿命',
      },
      {
        indication: '胸壁异常',
        condition: '脊柱侧弯、后凸畸形',
        machine: 'BiPAP / VPAP',
        efficacy: '避免呼吸衰竭',
      },
      {
        indication: '肥胖低通气',
        condition: 'BMI > 30, 日间PaCO2 > 45',
        machine: 'BiPAP VAuto / iVAPS',
        efficacy: '改善通气，减轻症状',
      },
      {
        indication: '心力衰竭',
        condition: '心源性肺水肿、Cheyne-Stokes呼吸',
        machine: 'CPAP / ASV',
        efficacy: '改善心功能，减少再住院',
      },
    ],
  },

  // 禁忌症
  contraindications: {
    title: '无创通气禁忌症',
    
    absoluteContraindications: [
      '意识障碍、无法保护气道',
      '未治疗的气胸',
      '最近进行上腹部或胸部手术',
      '活动性消化道出血',
      '严重心律不齐',
      '拒绝或无法耐受面罩',
    ],

    relativeContraindications: [
      '鼻腔阻塞（可能需要口罩）',
      '最近面部创伤',
      '上呼吸道阻塞',
      '严重胃食管反流',
      '不配合患者',
    ],

    managementStrategy: [
      '绝对禁忌症：需要有创通气或其他治疗',
      '相对禁忌症：可通过改善面罩选择、参数调整等克服',
    ],
  },
}

// ============================================================================
// 第三部分：选择决策树和对比工具
// ============================================================================

export const selectionDecisionTree = {
  title: '呼吸机选择决策树 - 医学指导标准',
  
  // 第一步：诊断确认
  step1_diagnosis: {
    title: '第1步：确认诊断',
    options: [
      { diagnosis: '睡眠呼吸暂停(OSA)', code: 'osa', severity: '轻-中度' },
      { diagnosis: 'COPD伴CO2潴留', code: 'copd', severity: '中-重度' },
      { diagnosis: '神经肌肉疾病', code: 'nmd', severity: '中-重度' },
      { diagnosis: '肥胖低通气综合征', code: 'ohs', severity: '中-重度' },
      { diagnosis: '心力衰竭', code: 'chf', severity: '中度' },
      { diagnosis: '急性呼吸衰竭', code: 'arf', severity: '重度' },
    ],
  },

  // 第二步：严重程度评估
  step2_severity: {
    title: '第2步：评估严重程度',
    osa: {
      light: { ahi: '< 30', machine: 'CPAP/AutoSet', price: '4000-8500' },
      moderate: { ahi: '30-60', machine: 'CPAP/AutoSet/BiPAP', price: '7800-15800' },
      severe: { ahi: '> 60', machine: 'BiPAP/VPAP', price: '15800-22000' },
    },
    copd: {
      light: { fev1: '> 70%', machine: '不推荐', price: '0' },
      moderate: { fev1: '50-70%', machine: 'BiPAP (夜间)', price: '12000-18000' },
      severe: { fev1: '< 50%', machine: 'VPAP / iVAPS', price: '18000-25000' },
    },
  },

  // 第三步：功能需求
  step3_features: {
    title: '第3步：确定功能需求',
    requirements: [
      { feature: '自动调压', need: '提高舒适度，减轻初期不适' },
      { feature: '加湿功能', need: '改善鼻腔干燥，提高耐受性' },
      { feature: '云端监测', need: '医生可远程监测，便于调整' },
      { feature: '静音设计', need: '不打扰家人，家庭和谐' },
      { feature: '便携性', need: '经常旅行或出差' },
      { feature: '双水平模式', need: '需要更强的呼吸支持' },
      { feature: '医疗级报警', need: '重症患者，需要医疗机构监管' },
    ],
  },

  // 第四步：预算考虑
  step4_budget: {
    title: '第4步：预算范围',
    budgets: [
      { range: '< 5000元', machines: ['Escape Auto', 'Hero II'], note: '初次使用者、试用' },
      { range: '5000-8000元', machines: ['S9 AutoSet', 'DreamStation 2'], note: '经济实惠，性能均衡' },
      { range: '8000-12000元', machines: ['AirSense 11 AutoSet'], note: '高端家庭用户' },
      { range: '12000-20000元', machines: ['AirCurve 10 VAuto', 'Hero 4'], note: '中重度患者，需要BiPAP' },
      { range: '> 20000元', machines: ['Lumis 150 VPAP ST'], note: '医疗机构，重症患者' },
    ],
  },

  // 推荐矩阵
  recommendationMatrix: [
    {
      diagnosis: '轻度OSA',
      severity: 'AHI 15-30',
      machine: 'CPAP / AutoSet',
      price: '4000-8500',
      reason: '简单有效，性价比高',
    },
    {
      diagnosis: '中度OSA',
      severity: 'AHI 30-60',
      machine: 'AutoSet / BiPAP Auto',
      price: '7800-15800',
      reason: '需要自动调压，可能需要BiPAP',
    },
    {
      diagnosis: '重度OSA',
      severity: 'AHI > 60',
      machine: 'BiPAP / VAuto',
      price: '15800-22000',
      reason: '需要双水平支持，医学监测',
    },
    {
      diagnosis: 'COPD伴低通气',
      severity: 'FEV1 < 50%, PaCO2 > 45',
      machine: 'VPAP ST / iVAPS',
      price: '18000-25000',
      reason: '医疗级设备，完全呼吸支持',
    },
    {
      diagnosis: '神经肌肉病',
      severity: '中-重度',
      machine: 'VPAP ST / iVAPS',
      price: '18000-25000',
      reason: '需要完全的通气支持',
    },
  ],
}
