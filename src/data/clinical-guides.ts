export const clinicalGuides = [
  {
    id: 'pap-path',
    title: 'PAP 模式与滴定路径',
    subtitle: 'OSA/SDB 的模式选择、参数设定与随访路径。',
    sections: [
      {
        id: 'indications',
        title: '适应证与分层',
        summary: '以事件类型、低氧负荷与症状分层决定治疗策略。',
        points: [
          'AHI/ODI/T90 与症状必须合并评估。',
          '体位与 REM 期加重需覆盖最差期。',
          '合并心血管风险决定干预强度。',
        ],
      },
      {
        id: 'mode-selection',
        title: '模式选择',
        summary: '模式选择以适应证为先，舒适度与依从性为核心。',
        points: [
          'CPAP 适合压力需求稳定的 OSA。',
          'APAP 适合体位或 REM 波动明显者。',
          'BiPAP 适合高压不耐受或通气不足人群。',
        ],
        table: {
          title: '模式对照',
          headers: ['模式', '核心用途', '适用人群', '风险提示'],
          rows: [
            ['CPAP', '固定压力控阻塞', '轻中度 OSA', '不耐受需调整'],
            ['APAP', '自动调压应对波动', '体位/REM波动明显', '算法差异需评估'],
            ['BiPAP (S)', '吸呼双水平提高耐受', '高压不耐受', '漏气影响疗效'],
            ['BiPAP (ST)', '后备频率兜底', '触发不足', '需专业评估'],
          ],
        },
      },
      {
        id: 'titration',
        title: '滴定与调参逻辑',
        summary: '阻塞优先，通气其次，舒适度与漏气最后。',
        points: [
          '先提升 EPAP/CPAP 控制阻塞事件。',
          '再调整 IPAP/PS 改善通气不足。',
          '最后优化漏气、湿化与舒适度。',
        ],
      },
      {
        id: 'monitoring',
        title: '监测与随访',
        summary: '疗效评估基于数据趋势与症状改善一致性。',
        points: [
          '核心指标：AHI、漏气、使用时长趋势。',
          '症状未改善需复查睡眠结构与低氧负荷。',
          '随访节奏：2-4 周复盘，稳定后 1-3 个月随访。',
        ],
      },
      {
        id: 'risk',
        title: '风险与红线',
        summary: '不适、漏气与不耐受是依从性下降的核心风险。',
        points: [
          '漏气会导致事件误判与疗效下降。',
          '持续胸闷/低氧需复诊评估。',
          'ASV 等高级模式必须专科评估。',
        ],
      },
    ],
  },
  {
    id: 'psg-diagnosis',
    title: 'PSG 判读与 SDB 诊断路径',
    subtitle: '从通道到事件类型，形成标准化诊断流程。',
    sections: [
      {
        id: 'channels',
        title: '关键通道与判读',
        summary: '通道完整性决定事件类型判读准确性。',
        points: [
          'EEG/EOG/EMG 决定分期与觉醒。',
          '气流/胸腹带区分阻塞与中枢。',
          'SpO2 与体位决定低氧负荷。',
        ],
        table: {
          title: '通道与用途',
          headers: ['通道', '用途', '判读重点'],
          rows: [
            ['EEG/EOG/EMG', '睡眠分期', '觉醒与分期比例'],
            ['气流/胸腹带', '事件类型', '阻塞 vs 中枢'],
            ['SpO2', '低氧负荷', 'ODI/T90'],
          ],
        },
      },
      {
        id: 'grading',
        title: '严重度分层',
        summary: 'AHI 只是分层起点，需结合低氧与症状。',
        points: [
          'AHI 5-14 轻度，15-29 中度，≥30 重度。',
          'T90 与最低血氧可上调风险等级。',
          'REM/体位加重必须记录。',
        ],
      },
      {
        id: 'path',
        title: '诊断路径',
        summary: '筛查→监测→判读→分层→治疗建议。',
        flow: {
          title: 'SDB 诊断路径',
          steps: [
            '量表筛查（STOP-Bang/ESS）',
            'PSG 或 HSAT 监测',
            '事件类型与低氧负荷判读',
            '分层与治疗路径制定',
          ],
        },
      },
      {
        id: 'pitfalls',
        title: '判读误区',
        summary: '常见误区集中在伪迹与漏气干扰。',
        points: [
          '伪迹与传感器脱落导致事件漏判。',
          '漏气会影响事件类型识别。',
          '只看 AHI 忽略低氧负荷。',
        ],
      },
    ],
  },
  {
    id: 'niv-acute',
    title: 'NIV 与急性呼衰路径',
    subtitle: 'NIV 启动评估、参数策略与升级时机。',
    sections: [
      {
        id: 'assessment',
        title: '启动评估',
        summary: '适应证与禁忌证必须优先评估。',
        points: [
          '评估意识、气道保护与分泌物负担。',
          '血气与氧合趋势是启动依据。',
          '禁忌证存在需升级处理。',
        ],
      },
      {
        id: 'parameters',
        title: '关键参数',
        summary: 'EPAP 控阻塞，IPAP 提供通气支持。',
        points: [
          '触发/循环设置决定同步性。',
          '备份频率用于触发失败兜底。',
          '漏气需优先处理。',
        ],
      },
      {
        id: 'monitor',
        title: '疗效监测',
        summary: '疗效评估窗口要短，避免延误升级。',
        points: [
          '症状改善与血气改善需同步。',
          '持续恶化需及时升级。',
          '同步性差多由漏气导致。',
        ],
      },
      {
        id: 'upgrade',
        title: '升级时机',
        summary: '不以 NIV 反复试错延误治疗。',
        points: [
          '血气持续恶化是升级信号。',
          '意识恶化或呼吸功增加需升级。',
          '评估窗口短，动态复评。',
        ],
      },
    ],
  },
  {
    id: 'copd-longterm',
    title: 'COPD 稳定期与长期 NIV',
    subtitle: '稳定期通气支持与随访管理路径。',
    sections: [
      {
        id: 'indications',
        title: '适应证',
        summary: '稳定期高碳酸血症是核心适应证。',
        points: [
          '反复急性加重者优先评估。',
          '血气与症状需长期追踪。',
        ],
      },
      {
        id: 'strategy',
        title: '长期管理策略',
        summary: '通气支持与康复管理并行。',
        points: [
          '优化通气后提升耐量与生活质量。',
          '教育与依从性管理是长期核心。',
        ],
      },
      {
        id: 'followup',
        title: '随访指标',
        summary: '随访强调趋势与症状一致性。',
        points: [
          '血气趋势与夜间症状改善。',
          '漏气与使用时长作为依从性指标。',
        ],
      },
    ],
  },
  {
    id: 'oxygen-hfnc',
    title: '氧疗与 HFNC 管理',
    subtitle: '氧合目标、风险与高流量路径。',
    sections: [
      {
        id: 'targets',
        title: '氧合目标',
        summary: '目标需个体化，COPD 需谨慎设定。',
        points: [
          '低氧纠正不足与过度氧疗均有风险。',
          'CO2 潴留风险需重点关注。',
        ],
      },
      {
        id: 'hfnc',
        title: 'HFNC 适用场景',
        summary: '低氧性呼衰与拔管后支持常用。',
        points: [
          '监测呼吸功与SpO2趋势。',
          '无效需及时升级评估。',
        ],
      },
      {
        id: 'monitor',
        title: '监测与风险',
        summary: '强调趋势与病情动态评估。',
        points: [
          '症状改善与指标改善需一致。',
          '延误升级会影响转归。',
        ],
      },
    ],
  },
  {
    id: 'ards-weaning',
    title: 'ARDS 保护性通气与撤机',
    subtitle: '保护性通气策略与撤机评估流程。',
    sections: [
      {
        id: 'protective',
        title: '保护性通气策略',
        summary: '低潮气量与平台压控制是核心。',
        points: [
          'PEEP 策略需结合顺应性评估。',
          '避免以氧合为唯一目标。',
        ],
      },
      {
        id: 'weaning',
        title: '撤机评估',
        summary: 'SBT 通过不等于可拔管。',
        points: [
          '评估呼吸功与气道保护能力。',
          '分泌物管理决定拔管风险。',
        ],
      },
      {
        id: 'post',
        title: '拔管后监测',
        summary: '早期失败需快速识别与干预。',
        points: [
          '监测呼吸频率与氧合趋势。',
          '出现疲劳迹象需及时复评。',
        ],
      },
    ],
  },
  {
    id: 'airway-infection',
    title: '气道管理与感染防控',
    subtitle: 'VAP 预防、吸痰流程与分泌物管理。',
    sections: [
      {
        id: 'vap',
        title: 'VAP 预防',
        summary: '头高位、口腔护理与尽早撤机是核心。',
        points: [
          '流程化管理优于单一措施。',
          '气道湿化与分泌物管理必不可少。',
        ],
      },
      {
        id: 'suction',
        title: '吸痰流程',
        summary: '以评估为先，规范无菌操作。',
        points: [
          '吸痰频率需按痰量与症状决定。',
          '吸痰后观察氧合变化。',
        ],
      },
      {
        id: 'clearance',
        title: '气道廓清',
        summary: '体位引流、PEP 与机械排痰联合应用。',
        points: [
          '排痰能力决定干预强度。',
          '合并肌无力需咳嗽辅助。',
        ],
      },
    ],
  },
  {
    id: 'followup-adherence',
    title: '随访与依从性管理',
    subtitle: '数据闭环与患者教育的核心流程。',
    sections: [
      {
        id: 'metrics',
        title: '核心指标',
        summary: '依从性与症状改善需一致。',
        points: [
          'AHI、漏气、使用时长趋势为核心指标。',
          '数据改善但症状无改善需复评。',
        ],
      },
      {
        id: 'workflow',
        title: '管理闭环',
        summary: '评估 → 调整 → 复盘形成闭环。',
        flow: {
          title: '随访流程',
          steps: [
            '收集数据与症状',
            '评估问题根因',
            '调整参数与设备',
            '复盘与教育',
          ],
        },
      },
      {
        id: 'education',
        title: '患者教育',
        summary: '沟通目标与风险可提升依从性。',
        points: [
          '先解决不适，再谈使用时长。',
          '明确红线与复诊时机。',
        ],
      },
    ],
  },
]
