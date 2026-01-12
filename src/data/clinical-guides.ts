export const clinicalGuides = [
  {
    id: 'modes',
    title: '机型与模式全解',
    subtitle: 'CPAP/APAP/BiPAP/NIV 的选择逻辑与参数核心。',
    disclaimer: '本页面为教育信息，不替代医生诊断与个体化处方。',
    sections: [
      {
        id: 'definition',
        title: '一句话定义',
        plain: '不同模式的呼吸机，就是用不同的“压力策略”把气道撑开并帮助呼吸。',
        pro: 'PAP 与 NIV 模式通过不同的压力控制策略改善气道塌陷与通气不足。',
      },
      {
        id: 'analogy',
        title: '通俗比喻',
        plain: 'CPAP像固定撑杆；APAP像自动伸缩撑杆；双水平像“吸气帮一把、呼气松一点”。',
        pro: '固定压力、自动压力与双水平压力支持在舒适度与通气支持上差异显著。',
      },
      {
        id: 'use',
        title: '临床用途',
        plain: '睡眠打鼾/呼吸暂停多用PAP，慢阻肺或高碳酸血症多用NIV。',
        pro: 'OSA/SDB 以 PAP 为主，COPD/OHS/神经肌肉病以 NIV 为主。',
      },
      {
        id: 'parameters',
        title: '关键参数',
        plain: '关注压力范围、压力支持、后备频率、漏气与舒适度。',
        pro: 'EPAP/CPAP 解决阻塞；IPAP-EPAP=PS 解决通气不足；ST 的后备频率用于兜底。',
        diagram: {
          title: '压力层级示意',
          svg: `
<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="20" width="400" height="80" fill="#f8fafc" stroke="#e5e7eb"/>
  <rect x="30" y="60" width="160" height="20" fill="#c7d2fe"/>
  <rect x="30" y="35" width="260" height="20" fill="#a5b4fc"/>
  <line x1="30" y1="90" x2="390" y2="90" stroke="#94a3b8" stroke-dasharray="4 4"/>
  <text x="30" y="55" font-size="11" fill="#1f2937">EPAP/CPAP（基础压力）</text>
  <text x="30" y="30" font-size="11" fill="#1f2937">IPAP（吸气压力）</text>
  <text x="300" y="45" font-size="11" fill="#1f2937">PS = IPAP-EPAP</text>
</svg>
          `.trim(),
        },
      },
      {
        id: 'table-modes',
        title: '模式对照表',
        plain: '不同模式覆盖不同人群，重在匹配适应证。',
        pro: '对照表用于快速理解模式差异与风险提示。',
        table: {
          title: '常见模式对照',
          headers: ['模式', '主要用途', '核心参数', '适用人群', '风险提示'],
          rows: [
            ['CPAP', '固定压力撑开上气道', '固定压力', '轻中度 OSA', '不耐受需调整'],
            ['APAP', '自动调压应对波动', '最小/最大压力', '体位/REM波动明显', '算法差异较大'],
            ['BiPAP (S)', '吸呼双水平提升舒适度', 'IPAP/EPAP', '高压不耐受人群', '漏气影响效果'],
            ['BiPAP (ST)', '加后备频率兜底', 'IPAP/EPAP/备份率', '触发不足人群', '需专业评估'],
            ['AVAPS/iVAPS', '目标通气量控制', '目标通气/压力范围', '慢性低通气', '设定不当可过通气'],
            ['ASV', '处理中枢事件', '复杂算法', '严格适应证', '需专业评估与随访'],
          ],
        },
      },
      {
        id: 'table-params',
        title: '参数关注清单',
        plain: '选机时优先关注“压力、漏气、舒适度”。',
        pro: '参数清单用于补齐评估要素。',
        table: {
          title: '核心参数清单',
          headers: ['维度', '关注点', '说明'],
          rows: [
            ['压力范围', 'EPAP/IPAP', '覆盖最差体位与REM期'],
            ['舒适功能', '呼气减压/渐升', '影响依从性'],
            ['漏气管理', '面罩匹配', '降低事件误判'],
            ['数据能力', 'AHI/漏气/时长', '用于随访调整'],
          ],
        },
      },
      {
        id: 'waveform',
        title: '波形怎么看',
        plain: '看“气流曲线是否平滑、漏气是否突然上升、事件是否减少”。',
        pro: '重点观察流量受限、漏气曲线、呼吸事件簇与压力响应。',
      },
      {
        id: 'flow',
        title: '选择流程（简化）',
        plain: '先判断是否以阻塞为主，再考虑是否存在通气不足。',
        pro: '流程提示：阻塞优先解决，通气不足再引入压力支持与后备率。',
        flow: {
          title: '模式选择路径',
          steps: [
            '确认是否为 SDB（OSA/CSA/CompSA）',
            '以阻塞为主 → 优先 CPAP/APAP',
            '高压不耐受 → 考虑双水平',
            '通气不足/高 CO2 → NIV / ST',
            '中枢事件明显 → 专业评估后考虑 ASV',
          ],
        },
      },
      {
        id: 'diagram-priority',
        title: '调参优先级',
        plain: '先解决阻塞，再解决通气不足，最后优化舒适度。',
        pro: '以阻塞为先、通气为次、舒适度为后形成调整优先级。',
        diagram: {
          title: '优先级层级',
          svg: `
<svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="90" width="360" height="30" fill="#bfdbfe"/>
  <rect x="60" y="60" width="300" height="30" fill="#93c5fd"/>
  <rect x="90" y="30" width="240" height="30" fill="#60a5fa"/>
  <text x="40" y="110" font-size="11" fill="#1f2937">舒适度/漏气优化</text>
  <text x="70" y="80" font-size="11" fill="#1f2937">通气不足（PS/备份）</text>
  <text x="100" y="50" font-size="11" fill="#1f2937">阻塞优先（EPAP/CPAP）</text>
</svg>
          `.trim(),
        },
      },
      {
        id: 'diagram-branch',
        title: '模式选择决策树',
        plain: '通过“是否阻塞”“是否通气不足”形成模式决策。',
        pro: '决策树用于临床初筛与路径思考。',
        diagram: {
          title: '简化决策树',
          svg: `
<svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg">
  <rect x="150" y="10" width="120" height="28" fill="#dbeafe" stroke="#93c5fd"/>
  <text x="168" y="28" font-size="11">是否阻塞为主</text>
  <line x1="210" y1="38" x2="90" y2="70" stroke="#94a3b8"/>
  <line x1="210" y1="38" x2="330" y2="70" stroke="#94a3b8"/>
  <rect x="40" y="70" width="100" height="26" fill="#bfdbfe" stroke="#93c5fd"/>
  <rect x="280" y="70" width="100" height="26" fill="#fecaca" stroke="#fca5a5"/>
  <text x="60" y="88" font-size="11">是</text>
  <text x="300" y="88" font-size="11">否</text>
  <line x1="90" y1="96" x2="90" y2="125" stroke="#94a3b8"/>
  <line x1="330" y1="96" x2="330" y2="125" stroke="#94a3b8"/>
  <rect x="40" y="125" width="100" height="26" fill="#93c5fd" stroke="#60a5fa"/>
  <rect x="280" y="125" width="100" height="26" fill="#fcd34d" stroke="#f59e0b"/>
  <text x="52" y="143" font-size="11">CPAP/APAP</text>
  <text x="298" y="143" font-size="11">评估通气不足</text>
</svg>
          `.trim(),
        },
      },
      {
        id: 'indications',
        title: '适应证与禁忌证',
        plain: '轻中度 OSA 以 PAP 为主，慢性通气不足以 NIV 为主。',
        pro: '急性呼衰、意识障碍或气道保护不足为禁忌，需要急诊处理。',
      },
      {
        id: 'special',
        title: '特殊人群提示',
        plain: '心衰与中枢事件需要谨慎评估。',
        pro: '合并严重心衰/中枢事件时需严格评估适应证。',
      },
      {
        id: 'followup',
        title: '随访目标',
        plain: '症状改善、残余事件下降与依从性提升。',
        pro: '关注 AHI、T90、漏气与睡眠结构变化。',
      },
      {
        id: 'pitfalls',
        title: '常见坑',
        plain: '模式选对了但面罩漏气；参数太猛导致不适；忽略随访。',
        pro: '高压不耐受、漏气导致事件误判、忽视体位与 REM 加重。',
      },
      {
        id: 'risk',
        title: '风险提示',
        plain: 'ASV 等高级模式需要专业评估，不建议自行选择或购买。',
        pro: 'ASV/高级算法适应证严格，需心衰等禁忌筛查与随访。',
      },
      {
        id: 'faq',
        title: 'FAQ',
        plain: '睡眠机不是越贵越好，合适的模式与舒适度更关键。',
        pro: '选择应综合症状、低氧负荷与依从性，避免“以机型代替评估”。',
      },
    ],
  },
  {
    id: 'psg',
    title: 'PSG波形判读课',
    subtitle: '从通道到指标，读懂每一份睡眠报告。',
    disclaimer: '本页面为教育信息，不替代医生诊断与个体化处方。',
    sections: [
      {
        id: 'definition',
        title: '一句话定义',
        plain: 'PSG是“全套睡眠录像+心电+呼吸”的综合监测。',
        pro: 'PSG 同时记录睡眠分期、呼吸事件、觉醒与心律。',
      },
      {
        id: 'analogy',
        title: '通俗比喻',
        plain: '它像一台“睡眠行车记录仪”，把夜里发生的事完整记录下来。',
        pro: '通过多通道同步信号，重建整夜呼吸与觉醒结构。',
      },
      {
        id: 'use',
        title: '临床用途',
        plain: '用于诊断睡眠呼吸暂停、评估治疗前后变化。',
        pro: '用于 OSA/CSA/CompSA 的诊断与疗效评估。',
      },
      {
        id: 'parameters',
        title: '报告关键指标',
        plain: '重点看 AHI、最低血氧、T90、觉醒指数。',
        pro: 'AHI/RDI/ODI/T90/ArI 与分期比例共同决定风险等级。',
      },
      {
        id: 'table-channels',
        title: 'PSG通道速查',
        plain: '常用通道决定“睡眠结构 + 呼吸事件”。',
        pro: '通道完整性决定判读质量。',
        diagram: {
          title: '通道分层示意',
          svg: `
<svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="15" width="400" height="110" fill="#f8fafc" stroke="#e5e7eb"/>
  <rect x="30" y="30" width="360" height="20" fill="#dbeafe"/>
  <rect x="30" y="60" width="360" height="20" fill="#bfdbfe"/>
  <rect x="30" y="90" width="360" height="20" fill="#93c5fd"/>
  <text x="40" y="45" font-size="11" fill="#1f2937">睡眠分期：EEG / EOG / EMG</text>
  <text x="40" y="75" font-size="11" fill="#1f2937">呼吸事件：气流 / 胸腹带 / SpO2</text>
  <text x="40" y="105" font-size="11" fill="#1f2937">补充信息：体位 / 鼾声 / ECG</text>
</svg>
          `.trim(),
        },
        table: {
          title: '核心通道与用途',
          headers: ['通道', '用途', '判读重点'],
          rows: [
            ['EEG/EOG/EMG', '睡眠分期与觉醒', 'N1/N2/N3/REM'],
            ['鼻压/热敏气流', '气流变化', '阻塞/低通气'],
            ['胸腹带', '呼吸努力', '阻塞 vs 中枢'],
            ['SpO2', '低氧负荷', 'ODI/T90'],
            ['体位/鼾声', '事件聚集', '体位或鼾声关联'],
          ],
        },
      },
      {
        id: 'table-thresholds',
        title: '常用阈值表',
        plain: '阈值用于提示风险，不等同于最终诊断。',
        pro: '需结合症状与低氧负荷综合判断。',
        table: {
          title: 'OSA 常用阈值',
          headers: ['等级', 'AHI 常用阈值', '提示'],
          rows: [
            ['轻度', '5-15', '结合症状评估'],
            ['中度', '15-30', '考虑积极治疗'],
            ['重度', '>30', '需重点干预'],
          ],
        },
      },
      {
        id: 'waveform',
        title: '波形怎么看',
        plain: '阻塞像“努力但堵住”，中枢像“呼吸努力消失”。',
        pro: '胸腹带仍有努力提示阻塞性，中枢事件表现为努力同步消失。',
      },
      {
        id: 'flow',
        title: '诊断流程',
        plain: '量表筛查 → 监测 → 报告解读 → 治疗建议。',
        pro: '针对复杂病例需结合共病与多学科评估。',
        flow: {
          title: 'SDB诊断路径',
          steps: [
            '量表筛查（STOP-Bang/ESS）',
            '选择 PSG 或 HSAT',
            '报告解读与严重度分层',
            '结合症状与低氧负荷制定治疗',
          ],
        },
      },
      {
        id: 'diagram-events',
        title: '事件类型示意',
        plain: '阻塞是“努力但堵住”，中枢是“努力消失”。',
        pro: '区分阻塞/中枢是判读关键。',
        diagram: {
          title: '阻塞 vs 中枢',
          svg: `
<svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="180" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
  <rect x="220" y="20" width="180" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
  <path d="M30 90 Q70 30 110 90 T190 90" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <path d="M230 90 L390 90" fill="none" stroke="#ef4444" stroke-width="2"/>
  <text x="30" y="35" font-size="11" fill="#1f2937">阻塞：努力仍在</text>
  <text x="230" y="35" font-size="11" fill="#1f2937">中枢：努力消失</text>
</svg>
          `.trim(),
        },
      },
      {
        id: 'diagram-report',
        title: '报告解读路径',
        plain: '先睡眠结构，再事件，再低氧与体位。',
        pro: '按顺序可减少误判。',
        diagram: {
          title: '解读顺序',
          svg: `
<svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="40" width="80" height="30" fill="#bfdbfe" stroke="#93c5fd"/>
  <rect x="130" y="40" width="80" height="30" fill="#93c5fd" stroke="#60a5fa"/>
  <rect x="230" y="40" width="80" height="30" fill="#60a5fa" stroke="#3b82f6"/>
  <rect x="330" y="40" width="60" height="30" fill="#38bdf8" stroke="#0ea5e9"/>
  <text x="40" y="60" font-size="11">睡眠结构</text>
  <text x="140" y="60" font-size="11">事件指标</text>
  <text x="240" y="60" font-size="11">低氧负荷</text>
  <text x="335" y="60" font-size="11">体位/REM</text>
  <line x1="110" y1="55" x2="130" y2="55" stroke="#94a3b8"/>
  <line x1="210" y1="55" x2="230" y2="55" stroke="#94a3b8"/>
  <line x1="310" y1="55" x2="330" y2="55" stroke="#94a3b8"/>
</svg>
          `.trim(),
        },
      },
      {
        id: 'grading',
        title: '严重度分层',
        plain: '轻/中/重度通常按 AHI 分层，但需结合症状。',
        pro: '应综合 AHI、ODI、T90 与临床症状判定风险。',
      },
      {
        id: 'checklist',
        title: '报告解读清单',
        plain: '先看总睡眠时间，再看事件指数与低氧负荷。',
        pro: '建议按“睡眠结构→事件→低氧→体位/REM”顺序解读。',
      },
      {
        id: 'pitfalls',
        title: '常见坑',
        plain: '只看AHI不看症状与低氧负荷；把漏气当事件。',
        pro: '忽略 RERA、体位/REM 加重、伪迹与传感器脱落。',
      },
      {
        id: 'risk',
        title: '风险与局限',
        plain: 'HSAT 和单导血氧有局限，复杂病例仍需 PSG。',
        pro: '便携监测对中枢事件与觉醒结构评估有限，需结合临床判断。',
      },
      {
        id: 'faq',
        title: 'FAQ',
        plain: '单导血氧只能提示风险，不能替代 PSG。',
        pro: 'HSAT 适用于部分患者，复杂病例仍需 PSG。',
      },
    ],
  },
  {
    id: 'niv',
    title: 'NIV（ST/VT）临床应用',
    subtitle: '家用无创通气的适应证、参数与随访核心。',
    disclaimer: '本页面为教育信息，不替代医生诊断与个体化处方。',
    sections: [
      {
        id: 'definition',
        title: '一句话定义',
        plain: 'NIV 是“帮你呼吸、还能兜底”的无创通气方式。',
        pro: 'NIV 通过压力支持与后备频率改善通气不足。',
      },
      {
        id: 'analogy',
        title: '通俗比喻',
        plain: '像有节奏的“推一把”，在你呼吸变弱时帮你完成呼吸。',
        pro: 'ST 模式在触发失败时提供定时通气保障。',
      },
      {
        id: 'use',
        title: '临床用途',
        plain: '适用于慢阻肺、肥胖低通气、神经肌肉病等。',
        pro: '用于高碳酸血症、慢性低通气与夜间通气不稳定人群。',
      },
      {
        id: 'parameters',
        title: '关键参数',
        plain: '关注 IPAP/EPAP、PS、后备频率、目标通气量。',
        pro: 'IPAP/EPAP 组合决定通气与气道开放，VT/AVAPS/iVAPS 用于目标通气量控制。',
      },
      {
        id: 'table-niv',
        title: 'NIV参数要点表',
        plain: '关键在于稳定通气与舒适度平衡。',
        pro: '参数需结合血气、症状与夜间波形调整。',
        diagram: {
          title: '通气支持示意',
          svg: `
<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="20" width="400" height="80" fill="#f8fafc" stroke="#e5e7eb"/>
  <path d="M30 80 Q90 40 150 80 T270 80 T390 80" fill="none" stroke="#6366f1" stroke-width="2"/>
  <line x1="30" y1="90" x2="390" y2="90" stroke="#94a3b8" stroke-dasharray="4 4"/>
  <text x="30" y="35" font-size="11" fill="#1f2937">触发</text>
  <text x="120" y="35" font-size="11" fill="#1f2937">吸气支持</text>
  <text x="260" y="35" font-size="11" fill="#1f2937">循环</text>
</svg>
          `.trim(),
        },
        table: {
          title: '常见参数关注点',
          headers: ['参数', '作用', '注意点'],
          rows: [
            ['EPAP', '维持气道开放', '过高影响耐受'],
            ['IPAP', '提高通气量', '过高易不适'],
            ['PS', '通气支持', '过大可引发过度通气'],
            ['备份频率', '触发失败兜底', '过高影响睡眠'],
            ['目标通气量', '控制夜间通气', '需设置合理范围'],
          ],
        },
      },
      {
        id: 'table-trigger',
        title: '触发与循环要点',
        plain: '触发不足会导致通气不稳定。',
        pro: '人机同步性是舒适度与疗效关键。',
        table: {
          title: '触发/循环对照',
          headers: ['环节', '关注点', '提示'],
          rows: [
            ['触发', '灵敏度设置', '过敏易误触发'],
            ['循环', '呼气终止阈值', '过早影响潮气量'],
            ['备份频率', '兜底通气', '过高影响睡眠'],
          ],
        },
      },
      {
        id: 'waveform',
        title: '波形怎么看',
        plain: '看通气是否稳定、漏气是否影响触发。',
        pro: '关注触发/循环、潮气量稳定性与事件残余。',
      },
      {
        id: 'flow',
        title: '启动与随访流程',
        plain: '评估 → 初始设置 → 2-4周随访 → 调整。',
        pro: '血气、症状与依从性是随访核心。',
        flow: {
          title: 'NIV随访路径',
          steps: [
            '评估指征与禁忌证',
            '初始参数设定与面罩适配',
            '2-4周随访复盘数据',
            '根据 CO2 与症状调整',
          ],
        },
      },
      {
        id: 'diagram-niv',
        title: '参数联动示意',
        plain: 'IPAP/EPAP 与 PS 共同决定通气效果。',
        pro: '调整需兼顾通气量与舒适度。',
        diagram: {
          title: '参数联动关系',
          svg: `
<svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="25" width="380" height="90" fill="#f8fafc" stroke="#e5e7eb"/>
  <circle cx="100" cy="70" r="20" fill="#a5b4fc"/>
  <circle cx="210" cy="70" r="20" fill="#93c5fd"/>
  <circle cx="320" cy="70" r="20" fill="#86efac"/>
  <text x="86" y="74" font-size="11" fill="#1f2937">EPAP</text>
  <text x="196" y="74" font-size="11" fill="#1f2937">IPAP</text>
  <text x="306" y="74" font-size="11" fill="#1f2937">PS</text>
  <line x1="120" y1="70" x2="190" y2="70" stroke="#94a3b8"/>
  <line x1="230" y1="70" x2="300" y2="70" stroke="#94a3b8"/>
</svg>
          `.trim(),
        },
      },
      {
        id: 'diagram-loop',
        title: '调整闭环',
        plain: '评估 → 调整 → 复盘，形成闭环。',
        pro: '持续随访是长期疗效的核心。',
        diagram: {
          title: '随访闭环',
          svg: `
<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg">
  <circle cx="120" cy="75" r="30" fill="#dbeafe" stroke="#93c5fd"/>
  <circle cx="210" cy="40" r="30" fill="#bfdbfe" stroke="#60a5fa"/>
  <circle cx="300" cy="75" r="30" fill="#93c5fd" stroke="#3b82f6"/>
  <text x="98" y="79" font-size="11">评估</text>
  <text x="196" y="44" font-size="11">调整</text>
  <text x="286" y="79" font-size="11">复盘</text>
  <line x1="150" y1="65" x2="180" y2="50" stroke="#94a3b8"/>
  <line x1="240" y1="50" x2="270" y2="65" stroke="#94a3b8"/>
  <line x1="300" y1="105" x2="150" y2="105" stroke="#94a3b8"/>
</svg>
          `.trim(),
        },
      },
      {
        id: 'targets',
        title: '治疗目标',
        plain: '改善夜间通气、缓解症状与降低 CO2。',
        pro: '目标为稳定通气、改善血气与提升生活质量。',
      },
      {
        id: 'special',
        title: '特殊人群提示',
        plain: '神经肌肉病与肥胖低通气需更严密随访。',
        pro: '需关注咳嗽能力、通气量稳定与夜间低氧。',
      },
      {
        id: 'pitfalls',
        title: '常见坑',
        plain: '参数太高导致不适或过度通气；忽略 CO2 变化。',
        pro: '目标通气设定不当可能导致睡眠破坏或通气不足。',
      },
      {
        id: 'risk',
        title: '红线提示',
        plain: '急性呼衰或意识障碍需就医，不应依赖家用 NIV。',
        pro: '意识障碍、无法保护气道等情况需急救处理，NIV 仅在评估后使用。',
      },
      {
        id: 'faq',
        title: 'FAQ',
        plain: 'NIV 需要专业评估与随访，不建议自行盲调。',
        pro: '需结合血气、症状与依从性进行动态调整。',
      },
    ],
  },
  {
    id: 'safety',
    title: '安全红线与就医提示',
    subtitle: '明确哪些情况必须就医，哪些情况不适合家用治疗。',
    disclaimer: '本页面为教育信息，不替代医生诊断与个体化处方。',
    sections: [
      {
        id: 'definition',
        title: '一句话定义',
        plain: '出现急性呼衰或意识障碍时，家用设备不能替代急救。',
        pro: '急性呼衰、意识障碍或气道保护能力不足需急诊处理。',
      },
      {
        id: 'table-redlines',
        title: '红线清单',
        plain: '下列情况需立即就医。',
        pro: '出现红线症状时需立即转诊。',
        diagram: {
          title: '就医决策路径',
          svg: `
<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="380" height="110" fill="#fff7ed" stroke="#fed7aa"/>
  <rect x="40" y="35" width="140" height="30" fill="#fecaca"/>
  <rect x="220" y="35" width="160" height="30" fill="#fde68a"/>
  <rect x="140" y="85" width="140" height="30" fill="#bbf7d0"/>
  <text x="50" y="55" font-size="11" fill="#7f1d1d">严重气促/意识改变</text>
  <text x="230" y="55" font-size="11" fill="#92400e">持续低氧/胸痛</text>
  <text x="150" y="105" font-size="11" fill="#166534">立即就医/急诊</text>
  <line x1="110" y1="65" x2="180" y2="85" stroke="#94a3b8" />
  <line x1="300" y1="65" x2="240" y2="85" stroke="#94a3b8" />
</svg>
          `.trim(),
        },
        table: {
          title: '就医红线提示',
          headers: ['症状/体征', '风险', '建议'],
          rows: [
            ['严重气促/意识改变', '呼吸衰竭风险', '立即急救就医'],
            ['持续低氧（SpO2<90%）', '器官缺氧', '紧急评估'],
            ['胸痛/咯血/紫绀', '高危征象', '马上就医'],
            ['无法配合或保护气道', '误吸风险', '停止家用治疗'],
          ],
        },
      },
      {
        id: 'infection',
        title: '消毒与感染控制',
        plain: '清洁不当会增加感染风险。',
        pro: '过滤器、水箱与管路需按周期清洁更换。',
      },
      {
        id: 'faq',
        title: 'FAQ',
        plain: '家用设备不能替代急诊或 ICU。',
        pro: '危重症需专业监护与综合治疗。',
      },
    ],
  },
  {
    id: 'adherence',
    title: '随访与依从性管理',
    subtitle: '提升长期疗效的核心环节。',
    disclaimer: '本页面为教育信息，不替代医生诊断与个体化处方。',
    sections: [
      {
        id: 'definition',
        title: '一句话定义',
        plain: '依从性是决定治疗效果的关键。',
        pro: '依从性、残余事件与低氧负荷共同决定疗效。',
      },
      {
        id: 'table-metrics',
        title: '随访指标',
        plain: '看使用时长、AHI、漏气与症状改善。',
        pro: '指标需要结合症状与睡眠质量综合判断。',
        table: {
          title: '随访指标清单',
          headers: ['指标', '意义', '观察要点'],
          rows: [
            ['使用时长', '依从性核心', '持续低时长需干预'],
            ['残余 AHI', '疗效评估', '高值提示需要调整'],
            ['漏气', '舒适与准确性', '高漏气易误判'],
            ['T90/ODI', '低氧负荷', '用于风险评估'],
          ],
        },
      },
      {
        id: 'flow',
        title: '随访路径',
        plain: '2-4周复盘 → 3个月评估 → 长期维护。',
        pro: '结合数据、症状与设备日志调整。',
        diagram: {
          title: '随访时间线',
          svg: `
<svg viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="50" width="380" height="10" fill="#e5e7eb"/>
  <circle cx="60" cy="55" r="8" fill="#60a5fa"/>
  <circle cx="200" cy="55" r="8" fill="#34d399"/>
  <circle cx="340" cy="55" r="8" fill="#a78bfa"/>
  <text x="40" y="35" font-size="11" fill="#1f2937">2-4周</text>
  <text x="180" y="35" font-size="11" fill="#1f2937">3个月</text>
  <text x="320" y="35" font-size="11" fill="#1f2937">6-12个月</text>
  <text x="40" y="80" font-size="11" fill="#6b7280">适应期复盘</text>
  <text x="170" y="80" font-size="11" fill="#6b7280">疗效评估</text>
  <text x="300" y="80" font-size="11" fill="#6b7280">长期维护</text>
</svg>
          `.trim(),
        },
        flow: {
          title: '随访流程',
          steps: [
            '初始 2-4 周复盘适应情况',
            '3 个月综合评估疗效',
            '每 6-12 个月复查与维护',
          ],
        },
      },
      {
        id: 'pitfalls',
        title: '常见坑',
        plain: '只看 AHI，不看症状与低氧负荷。',
        pro: '需结合症状、低氧与睡眠结构。',
      },
    ],
  },
  {
    id: 'mask',
    title: '面罩与配件管理',
    subtitle: '适配与舒适度决定依从性。',
    disclaimer: '本页面为教育信息，不替代医生诊断与个体化处方。',
    sections: [
      {
        id: 'table-types',
        title: '面罩类型对照',
        plain: '不同面罩适用于不同人群。',
        pro: '面罩选择应结合漏气风险与舒适度。',
        diagram: {
          title: '面罩选择三角',
          svg: `
<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg">
  <polygon points="210,20 380,120 40,120" fill="#e0f2fe" stroke="#38bdf8"/>
  <text x="185" y="40" font-size="11" fill="#075985">舒适度</text>
  <text x="60" y="110" font-size="11" fill="#075985">密封性</text>
  <text x="310" y="110" font-size="11" fill="#075985">稳定性</text>
  <circle cx="210" cy="70" r="6" fill="#2563eb"/>
  <text x="225" y="74" font-size="11" fill="#1f2937">鼻罩</text>
</svg>
          `.trim(),
        },
        table: {
          title: '面罩类型',
          headers: ['类型', '优势', '注意点'],
          rows: [
            ['鼻枕', '轻便、视野好', '易口漏'],
            ['鼻罩', '平衡选择', '需良好鼻通气'],
            ['全脸罩', '口漏友好', '压痕风险高'],
          ],
        },
      },
      {
        id: 'flow',
        title: '选择路径',
        plain: '口漏多 → 全脸罩；鼻阻塞 → 先处理鼻通气。',
        pro: '从舒适度与漏气风险出发进行选择。',
        flow: {
          title: '面罩选择简流程',
          steps: [
            '评估是否口漏或鼻阻塞',
            '优先轻量化面罩',
            '漏气持续 → 调整或更换类型',
          ],
        },
      },
      {
        id: 'cleaning',
        title: '清洁与更换',
        plain: '面罩与管路需按周期清洁与更换。',
        pro: '避免交叉感染与材料老化。',
      },
    ],
  },
  {
    id: 'respiratory-therapy',
    title: '呼吸治疗百科',
    subtitle: '氧疗、雾化、气道廓清的临床要点。',
    disclaimer: '本页面为教育信息，不替代医生诊断与个体化处方。',
    sections: [
      {
        id: 'oxygen',
        title: '氧疗概览',
        plain: '氧疗需关注目标饱和度与过度氧疗风险。',
        pro: 'COPD 患者需避免过度氧疗导致 CO2 潴留。',
      },
      {
        id: 'table-therapy',
        title: '治疗手段对照',
        plain: '不同治疗手段面向不同问题。',
        pro: '需结合病因、症状与可及性选择。',
        diagram: {
          title: '呼吸治疗梯度',
          svg: `
<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="100" width="360" height="20" fill="#d1fae5"/>
  <rect x="70" y="70" width="280" height="20" fill="#bbf7d0"/>
  <rect x="110" y="40" width="200" height="20" fill="#86efac"/>
  <text x="40" y="115" font-size="11" fill="#166534">基础氧疗</text>
  <text x="80" y="85" font-size="11" fill="#166534">HFNC</text>
  <text x="120" y="55" font-size="11" fill="#166534">NIV/通气支持</text>
</svg>
          `.trim(),
        },
        table: {
          title: '呼吸治疗手段',
          headers: ['手段', '适用场景', '注意点'],
          rows: [
            ['氧疗', '低氧血症', '避免过度氧疗'],
            ['HFNC', '中度低氧', '流量与湿化'],
            ['雾化', '气道炎症', '粒径与沉积'],
            ['气道廓清', '分泌物多', '体位与设备配合'],
          ],
        },
      },
      {
        id: 'airway',
        title: '气道廓清',
        plain: '体位引流与机械排痰可改善排痰效率。',
        pro: '神经肌肉病人群需重视咳嗽辅助。',
      },
    ],
  },
]
