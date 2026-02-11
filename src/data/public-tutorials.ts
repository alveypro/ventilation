export const publicTutorialsData = [
  {
    id: 6001,
    title: 'PAP治疗入门：10分钟快速上手',
    category: 'beginner',
    difficulty: '基础',
    duration: '10分钟',
    views: 1200,
    rating: 4.8,
    sources: [
      {
        title: 'CPAP',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
    ],
    content: `
## 一句话目标
在 10 分钟内完成开机、面罩佩戴与首次适应，建立正确的使用习惯。

## 准备清单
- 机器、电源、管路、面罩与水箱。
- 干净的蒸馏水或清洁水源（按说明）。
- 安静、平躺的体验环境。

## 快速步骤
1. 检查电源、管路与水箱是否连接牢固。
2. 佩戴面罩并调整松紧，确保不压痛。
3. 开机适应 5-10 分钟，观察漏气与舒适度。
4. 记录不适与漏气，便于后续调整。

## 正确姿势
- 仰卧与侧卧各体验 2-3 分钟。
- 呼气时放松，避免紧绷与屏气。

## 常见问题
- 觉得憋气：尝试呼气减压或降低压力。
- 鼻干：适当提高湿化，必要时加温管路。
- 面罩压痕：重新调整头带或更换尺寸。

## 随访建议
- 首周以适应为主，逐步延长使用时长。
- 记录 AHI/漏气变化与主观感受。
    `,
  },
  {
    id: 6002,
    title: '面罩适配与漏气处理',
    category: 'mask',
    difficulty: '基础',
    duration: '15分钟',
    views: 980,
    rating: 4.7,
    sources: [
      {
        title: 'CPAP',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
    ],
    content: `
## 适配步骤
1. 选择合适面罩类型（鼻枕/鼻罩/全脸罩）。
2. 按尺寸表匹配并试戴。
3. 调整头带，避免过紧或过松。
4. 开机观察漏气与舒适度。

## 漏气排查顺序
- 先调面罩位置，再调头带松紧。
- 检查鼻阻塞或口漏。
- 仍不适时考虑更换面罩类型或尺寸。

## 舒适度优化
- 面罩边缘不要压到鼻梁。
- 夜间翻身后重新调整贴合度。

## 常见错误
- 头带拉得过紧，导致皮肤压痕。
- 忽视口漏，导致 AHI 下降不明显。

## 随访记录
- 记录漏气数值与不适位置。
- 若连续 1-2 周无法改善，考虑重新评估面罩。
    `,
  },
  {
    id: 6003,
    title: 'PSG报告速读',
    category: 'psg',
    difficulty: '基础',
    duration: '20分钟',
    views: 860,
    rating: 4.6,
    sources: [
      {
        title: 'Scoring Manual',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
    ],
    content: `
## 关键指标
- AHI：暂停+低通气次数/小时
- ODI：血氧下降次数
- T90：SpO2 < 90% 时间占比
- ArI：觉醒指数

## 阅读顺序
睡眠结构 → 事件指标 → 低氧负荷 → 体位/REM

## 判读提示
- 阻塞性事件：胸腹带仍在努力。
- 中枢性事件：努力消失。
- 流量受限：鼻压波形“削顶”。

## 常见误区
- 仅看 AHI 忽略低氧负荷。
- 不考虑体位与 REM 加重。
    `,
  },
  {
    id: 6004,
    title: '滴定与调参基础',
    category: 'titration',
    difficulty: '中级',
    duration: '30分钟',
    views: 760,
    rating: 4.7,
    sources: [
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
      {
        title: 'Scoring Manual',
        date: '持续更新',
      },
    ],
    content: `
## 调参逻辑
1. 先解决阻塞（EPAP/CPAP）。
2. 再解决通气不足（IPAP/PS）。
3. 最后优化舒适度与漏气。

## 参数记录
- 记录每次调整后的 AHI、漏气与主观感受。
- 以最差体位/REM 期为目标覆盖。

## 风险提示
- 过快提升压力可能导致不耐受。
- 未处理漏气时调参效果不可靠。
    `,
  },
  {
    id: 6005,
    title: '依从性管理指南',
    category: 'followup',
    difficulty: '基础',
    duration: '15分钟',
    views: 680,
    rating: 4.5,
    sources: [
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
      {
        title: 'CPAP',
        date: '持续更新',
      },
    ],
    content: `
## 依从性口径
常用口径为每晚 ≥4 小时、每周 ≥5 晚。

## 提升策略
- 适配面罩
- 改善舒适度
- 设定随访提醒
 
## 行为建议
- 首周以适应为主，逐步延长时长。
- 记录嗜睡、夜尿、晨起头痛等变化。
    `,
  },
  {
    id: 6006,
    title: '家用NIV入门',
    category: 'niv',
    difficulty: '中级',
    duration: '25分钟',
    views: 540,
    rating: 4.6,
    sources: [
      {
        title: 'Statements & Guidelines',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
    ],
    content: `
## 核心要点
- 适应证评估与禁忌证排查。
- IPAP/EPAP 设定与压力支持理解。
- 备份频率与触发灵敏度。

## 参数设置流程
1. 明确目标（改善通气/降低 CO2）。
2. 设定 EPAP 解决阻塞。
3. 通过 IPAP/PS 改善通气。

## 随访
2-4 周复盘数据与症状，必要时调整参数。
    `,
  },
  {
    id: 6007,
    title: '加湿与结露处理',
    category: 'comfort',
    difficulty: '基础',
    duration: '10分钟',
    views: 520,
    rating: 4.5,
    sources: [
      {
        title: 'CPAP',
        date: '持续更新',
      },
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
    ],
    content: `
## 结露原因
湿度高 + 环境温度低。

## 解决方式
- 降低湿化档位。
- 使用加热管路。
- 保持室温与管路保温。

## 清洁与维护
- 水箱每日清洁并晾干。
- 定期更换过滤棉，避免霉菌滋生。
    `,
  },
  {
    id: 6008,
    title: '安全红线与就医提示',
    category: 'safety',
    difficulty: '基础',
    duration: '8分钟',
    views: 450,
    rating: 4.8,
    sources: [
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
      {
        title: 'CPAP',
        date: '持续更新',
      },
    ],
    content: `
## 必须就医的情况
- 意识改变
- 持续低氧（SpO2<90%）
- 严重胸痛或咯血

## 居家红线
- 设备出现异常报警
- 参数无法解释的波动
- 出现严重不适

## 合规提示
- 本教程不替代医疗诊断。
- 高风险模式需专业评估与随访。
    `,
  },
  {
    id: 6009,
    title: '加温湿化与鼻干处理',
    category: 'comfort',
    difficulty: '基础',
    duration: '12分钟',
    views: 520,
    rating: 4.7,
    sources: [
      {
        title: 'Clinical Practice Guidelines',
        date: '持续更新',
      },
      {
        title: 'Sleep Education',
        date: '持续更新',
      },
    ],
    content: `
## 一句话目标
通过湿化和环境调整缓解鼻干、咽干与鼻塞，提高依从性。

## 常见原因
- 湿化不足或水箱缺水。
- 室内过于干燥（空调/暖气）。
- 面罩漏气导致气流刺激。

## 操作步骤
1. 检查水箱是否有足够水量。
2. 逐级提升湿化档位（每次 1 档）。
3. 如有加温管路，优先启用以减少冷凝。
4. 同步检查面罩漏气情况。

## 注意事项
- 湿化过高会产生冷凝水，需下调或加温管路。
- 鼻塞明显先处理鼻部问题，再评估压力。

## 随访建议
- 连续 3-5 天记录湿化档位与鼻干变化。
    `,
  },
  {
    id: 6010,
    title: '滤网与管路清洁清单',
    category: 'maintenance',
    difficulty: '基础',
    duration: '10分钟',
    views: 490,
    rating: 4.8,
    sources: [
      {
        title: 'Manufacturer Instructions',
        date: '持续更新',
      },
    ],
    content: `
## 一句话目标
用可执行清单降低异味、堵塞与感染风险。

## 每日清洁
- 水箱清洗并晾干。
- 面罩擦拭，避免油脂堆积。

## 每周清洁
- 管路用温水清洗并晾干。
- 过滤棉取出轻拍除尘。

## 更换周期参考
- 过滤棉：1-3 个月（视灰尘）。
- 面罩硅胶：3-6 个月。
- 管路：6-12 个月。

## 常见误区
- 用酒精/强酸碱清洗硅胶部件。
- 清洗后未完全晾干直接使用。
    `,
  },
  {
    id: 6011,
    title: '旅行/外出使用准备',
    category: 'travel',
    difficulty: '基础',
    duration: '8分钟',
    views: 410,
    rating: 4.6,
    sources: [
      {
        title: 'CPAP Travel Checklist',
        date: '持续更新',
      },
    ],
    content: `
## 一句话目标
确保外出也能稳定使用，避免断档影响疗效。

## 出行清单
- 电源与转换插头。
- 备用面罩/滤网。
- 水箱与管路。

## 机场/酒店注意
- 询问电源位置，避免插座不足。
- 飞行中使用需提前咨询航空公司规则。

## 便携建议
- 轻量机型优先。
- 减少配件体积，注意防护。
    `,
  },
]
