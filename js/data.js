// 产品数据
const productsData = [
    {
        id: 1,
        name: 'AirSense 11 AutoSet',
        brand: '瑞思迈 ResMed',
        type: '单水平全自动CPAP',
        price: 8500,
        rating: 4.8,
        reviewCount: 326,
        tag: '热销',
        tagType: 'danger',
        highlights: ['智能自动调压', '静音设计', 'APP数据追踪', '内置加湿'],
        description: '瑞思迈最新旗舰产品，采用AutoSet算法自动调节压力，配备myAir APP实时监测睡眠数据，静音设计仅26.6分贝，适合睡眠呼吸暂停患者。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / AutoSet',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '26.6 dB',
            '重量': '1.03 kg',
            '尺寸': '260 x 117 x 104 mm',
            '湿化器': '内置HumidAir加温加湿',
            '数据连接': 'WiFi + 蓝牙',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 2,
        name: 'DreamStation 2 Auto CPAP',
        brand: '飞利浦 Philips',
        type: '单水平全自动CPAP',
        price: 7800,
        rating: 4.7,
        reviewCount: 289,
        tag: '推荐',
        tagType: 'success',
        highlights: ['A-Flex舒适技术', '便携设计', '智能压力调节', '触控屏'],
        description: '飞利浦新一代睡眠呼吸机，配备A-Flex技术提供更舒适的呼吸体验，紧凑设计适合旅行携带，触控屏操作便捷。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '28 dB',
            '重量': '1.35 kg',
            '尺寸': '150 x 150 x 150 mm',
            '湿化器': '可选配加湿器',
            '数据连接': 'WiFi + 蓝牙',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 3,
        name: 'AirCurve 10 VAuto',
        brand: '瑞思迈 ResMed',
        type: '双水平自动BiPAP',
        price: 15800,
        rating: 4.9,
        reviewCount: 156,
        tag: '高端',
        tagType: 'warning',
        highlights: ['双水平调压', 'Easy-Breathe电机', 'EPR技术', '适合复杂症状'],
        description: '瑞思迈双水平呼吸机，提供吸气压和呼气压分别调节，适合需要更高压力支持或对单水平CPAP不耐受的患者。',
        suitableFor: ['sleep_apnea', 'copd'],
        specs: {
            '工作模式': 'S / ST / VAuto',
            '吸气压范围': '4-25 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '压力支持': '0-20 cmH2O',
            '噪音水平': '27 dB',
            '重量': '1.24 kg',
            '数据连接': 'SD卡 + WiFi',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 4,
        name: 'Lumis 150 VPAP ST',
        brand: '瑞思迈 ResMed',
        type: '双水平无创呼吸机',
        price: 22000,
        rating: 4.8,
        reviewCount: 98,
        tag: '',
        tagType: '',
        highlights: ['智能目标潮气量', 'iVAPS模式', '适合呼吸衰竭', '医疗级'],
        description: '瑞思迈医疗级双水平呼吸机，具备iVAPS智能目标潮气量功能，适合慢阻肺、呼吸衰竭等需要无创通气支持的患者。',
        suitableFor: ['copd', 'neuromuscular', 'heart_failure'],
        specs: {
            '工作模式': 'S / ST / T / iVAPS / CPAP',
            '吸气压范围': '4-30 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '目标潮气量': '200-1500 mL',
            '备用呼吸频率': '4-30 次/分',
            '重量': '2.5 kg',
            '报警功能': '完善的报警系统',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 5,
        name: 'AirMini Travel CPAP',
        brand: '瑞思迈 ResMed',
        type: '便携单水平CPAP',
        price: 6500,
        rating: 4.5,
        reviewCount: 178,
        tag: '便携',
        tagType: 'primary',
        highlights: ['超轻便携', '仅300g', 'APP控制', '旅行首选'],
        description: '全球最小的旅行CPAP呼吸机，仅重300g，可轻松放入随身行李，支持AirMini APP远程控制，是经常出差旅行患者的理想选择。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / AutoSet',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '30 dB',
            '重量': '300 g',
            '尺寸': '136 x 84 x 53 mm',
            '湿化器': 'HumidX免水加湿',
            '数据连接': '蓝牙',
            '电源': 'AC 100-240V / USB'
        }
    },
    {
        id: 6,
        name: 'S9 VPAP Auto',
        brand: '瑞思迈 ResMed',
        type: '双水平自动BiPAP',
        price: 9800,
        rating: 4.6,
        reviewCount: 234,
        tag: '性价比',
        tagType: 'success',
        highlights: ['经典双水平', '性价比高', 'EPR技术', '稳定可靠'],
        description: '瑞思迈经典款双水平呼吸机，技术成熟稳定，价格相对亲民，适合需要双水平支持但预算有限的用户。',
        suitableFor: ['sleep_apnea', 'copd'],
        specs: {
            '工作模式': 'S / ST / VPAP Auto',
            '吸气压范围': '4-25 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '噪音水平': '28 dB',
            '重量': '1.5 kg',
            '湿化器': 'H5i加温加湿器',
            '数据连接': 'SD卡',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 7,
        name: 'BiPAP A30',
        brand: '飞利浦 Philips',
        type: '双水平无创呼吸机',
        price: 18500,
        rating: 4.7,
        reviewCount: 123,
        tag: '',
        tagType: '',
        highlights: ['AVAPS模式', 'Auto-Trak', '医疗级', '适应性强'],
        description: '飞利浦医疗级双水平呼吸机，AVAPS模式可自动调节压力以维持目标潮气量，适合慢阻肺和呼吸衰竭患者。',
        suitableFor: ['copd', 'neuromuscular'],
        specs: {
            '工作模式': 'S / ST / T / AVAPS / CPAP',
            '吸气压范围': '4-30 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '目标潮气量': '200-1500 mL',
            '备用呼吸频率': '4-30 次/分',
            '重量': '2.8 kg',
            'Auto-Trak': '自动漏气补偿',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 8,
        name: 'YH-360',
        brand: '鱼跃 Yuwell',
        type: '单水平全自动CPAP',
        price: 2980,
        rating: 4.3,
        reviewCount: 567,
        tag: '入门',
        tagType: 'info',
        highlights: ['国产优选', '高性价比', '静音设计', '操作简单'],
        description: '鱼跃医疗经典CPAP产品，国产品牌中的佼佼者，价格亲民，功能实用，适合预算有限的入门用户。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '30 dB',
            '重量': '1.4 kg',
            '湿化器': '可选配加湿器',
            '数据存储': 'SD卡',
            '电源': 'AC 220V'
        }
    },
    {
        id: 9,
        name: 'Stellar 150',
        brand: '瑞思迈 ResMed',
        type: '生命支持呼吸机',
        price: 45000,
        rating: 4.9,
        reviewCount: 45,
        tag: '专业',
        tagType: 'danger',
        highlights: ['生命支持级', '内置电池', '完善报警', 'ICU转出'],
        description: '瑞思迈专业级生命支持呼吸机，具备完善的报警系统和内置电池，适合依赖呼吸机的重症患者和从ICU转出的患者。',
        suitableFor: ['neuromuscular', 'copd'],
        specs: {
            '工作模式': 'S / ST / T / iVAPS / CPAP / TiControl',
            '吸气压范围': '2-40 cmH2O',
            '呼气压范围': '2-25 cmH2O',
            '目标潮气量': '50-2500 mL',
            '备用呼吸频率': '2-60 次/分',
            '内置电池': '8小时续航',
            '报警系统': '多重安全报警',
            '重量': '3.2 kg'
        }
    },
    {
        id: 10,
        name: 'DV600',
        brand: '谊安 Aeonmed',
        type: '双水平无创呼吸机',
        price: 12000,
        rating: 4.4,
        reviewCount: 89,
        tag: '',
        tagType: '',
        highlights: ['国产医疗级', '性价比高', 'ST模式', '医保可报'],
        description: '谊安医疗专业双水平呼吸机，国产医疗器械品牌，具备完整的医疗资质，部分地区可享受医保报销。',
        suitableFor: ['copd', 'heart_failure'],
        specs: {
            '工作模式': 'S / ST / T / CPAP',
            '吸气压范围': '4-30 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '噪音水平': '32 dB',
            '重量': '2.2 kg',
            '屏幕': '5寸触控屏',
            '报警功能': '多参数报警',
            '电源': 'AC 220V'
        }
    },
    // ========== 费雪派克 Fisher & Paykel ==========
    {
        id: 11,
        name: 'SleepStyle Auto',
        brand: '费雪派克 Fisher & Paykel',
        type: '单水平全自动CPAP',
        price: 7200,
        rating: 4.6,
        reviewCount: 198,
        tag: '舒适',
        tagType: 'success',
        highlights: ['ThermoSmart加温管路', 'SensAwake智能唤醒', '静音设计', '舒适加湿'],
        description: '费雪派克旗舰CPAP，以卓越的加湿技术著称，ThermoSmart加温管路有效防止冷凝水，SensAwake技术可在患者醒来时自动降低压力。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '26 dB',
            '重量': '1.2 kg',
            '湿化器': '内置加温加湿',
            '加温管路': 'ThermoSmart',
            '数据连接': 'WiFi + 蓝牙',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 12,
        name: 'F&P 850 System',
        brand: '费雪派克 Fisher & Paykel',
        type: '高流量湿化氧疗系统',
        price: 28000,
        rating: 4.9,
        reviewCount: 67,
        tag: '医疗级',
        tagType: 'danger',
        highlights: ['高流量氧疗', '精准温湿度控制', 'ICU级别', 'OptiFlow技术'],
        description: '费雪派克专业医疗级高流量湿化氧疗系统，广泛应用于ICU、急诊和呼吸科，提供高达60L/min的加温加湿氧气。',
        suitableFor: ['copd', 'neuromuscular'],
        specs: {
            '流量范围': '2-60 L/min',
            '温度设置': '31-37°C',
            '氧浓度': '21-100%',
            '湿化输出': '最高44 mg/L',
            '重量': '4.5 kg',
            '报警功能': '多参数报警',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 13,
        name: 'myAIRVO 2',
        brand: '费雪派克 Fisher & Paykel',
        type: '家用高流量湿化治疗仪',
        price: 15000,
        rating: 4.7,
        reviewCount: 89,
        tag: '',
        tagType: '',
        highlights: ['家用高流量', '加温加湿', '舒适鼻塞', '操作简单'],
        description: '费雪派克家用高流量湿化治疗仪，为慢阻肺和支气管扩张患者提供舒适的家庭氧疗和湿化治疗。',
        suitableFor: ['copd'],
        specs: {
            '流量范围': '10-50 L/min',
            '温度设置': '34/37°C',
            '湿化输出': '最高44 mg/L',
            '噪音水平': '38 dB',
            '重量': '3.8 kg',
            '电源': 'AC 220V'
        }
    },
    // ========== 德百世 DeVilbiss ==========
    {
        id: 14,
        name: 'IntelliPAP 2 AutoAdjust',
        brand: '德百世 DeVilbiss',
        type: '单水平全自动CPAP',
        price: 4500,
        rating: 4.4,
        reviewCount: 245,
        tag: '性价比',
        tagType: 'success',
        highlights: ['SmartFlex技术', '自动调压', '性价比高', '美国品牌'],
        description: '德百世经典CPAP呼吸机，SmartFlex呼气释压技术提供舒适体验，价格亲民，是进口品牌中性价比较高的选择。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '3-20 cmH2O',
            '噪音水平': '26 dB',
            '重量': '1.1 kg',
            'SmartFlex': '1-3级可调',
            '数据存储': 'SD卡',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 15,
        name: 'IntelliPAP BiLevel S',
        brand: '德百世 DeVilbiss',
        type: '双水平BiPAP',
        price: 8500,
        rating: 4.5,
        reviewCount: 134,
        tag: '',
        tagType: '',
        highlights: ['双水平支持', 'SmartFlex', '静音设计', '数据管理'],
        description: '德百世双水平呼吸机，支持S和ST模式，适合需要双水平压力支持的睡眠呼吸暂停和轻度慢阻肺患者。',
        suitableFor: ['sleep_apnea', 'copd'],
        specs: {
            '工作模式': 'S / ST',
            '吸气压范围': '4-25 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '噪音水平': '27 dB',
            '重量': '1.3 kg',
            '备用频率': '4-30 次/分',
            '数据存储': 'SD卡',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 16,
        name: 'Blue Series BiPAP',
        brand: '德百世 DeVilbiss',
        type: '双水平无创呼吸机',
        price: 16000,
        rating: 4.6,
        reviewCount: 78,
        tag: '',
        tagType: '',
        highlights: ['医疗级', 'AVAPS模式', '完善报警', '长期稳定'],
        description: '德百世医疗级双水平呼吸机，具备AVAPS容量保证模式，适合慢阻肺和呼吸衰竭患者的长期家庭使用。',
        suitableFor: ['copd', 'neuromuscular'],
        specs: {
            '工作模式': 'S / ST / T / AVAPS',
            '吸气压范围': '4-30 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '目标潮气量': '200-1500 mL',
            '备用频率': '4-30 次/分',
            '重量': '2.4 kg',
            '报警功能': '完善报警系统',
            '电源': 'AC 100-240V'
        }
    },
    // ========== 万曼/律维施泰因 Löwenstein ==========
    {
        id: 17,
        name: 'prisma SMART',
        brand: '万曼 Löwenstein',
        type: '单水平全自动CPAP',
        price: 6800,
        rating: 4.7,
        reviewCount: 167,
        tag: '德国制造',
        tagType: 'warning',
        highlights: ['德国精工', 'softPAP技术', '智能调压', '静音设计'],
        description: '德国万曼（律维施泰因）旗下prisma系列，德国制造品质保证，softPAP技术提供极致舒适的呼吸体验。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / APAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '25 dB',
            '重量': '1.3 kg',
            'softPAP': '呼气释压技术',
            '数据连接': 'SD卡 + WiFi',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 18,
        name: 'prisma VENT50',
        brand: '万曼 Löwenstein',
        type: '双水平无创呼吸机',
        price: 32000,
        rating: 4.9,
        reviewCount: 56,
        tag: '高端',
        tagType: 'warning',
        highlights: ['德国制造', '生命支持', '精准控制', '专业医疗'],
        description: '万曼专业级生命支持呼吸机，德国原装进口，适合重症患者和ICU转出患者的长期家庭通气治疗。',
        suitableFor: ['copd', 'neuromuscular', 'heart_failure'],
        specs: {
            '工作模式': 'S / ST / T / PCV / aVAPS',
            '吸气压范围': '4-40 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '目标潮气量': '100-2000 mL',
            '备用频率': '4-40 次/分',
            '内置电池': '可选配',
            '重量': '3.5 kg',
            '报警系统': '多重安全报警'
        }
    },
    {
        id: 19,
        name: 'prisma 25ST',
        brand: '万曼 Löwenstein',
        type: '双水平BiPAP',
        price: 12000,
        rating: 4.6,
        reviewCount: 112,
        tag: '',
        tagType: '',
        highlights: ['德国品质', 'ST模式', 'softPAP', '稳定可靠'],
        description: '万曼双水平呼吸机，德国制造，具备S/ST模式，适合睡眠呼吸暂停和轻中度慢阻肺患者。',
        suitableFor: ['sleep_apnea', 'copd'],
        specs: {
            '工作模式': 'S / ST / CPAP / APAP',
            '吸气压范围': '4-25 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '噪音水平': '26 dB',
            '重量': '1.8 kg',
            '备用频率': '4-30 次/分',
            '数据连接': 'SD卡 + WiFi',
            '电源': 'AC 100-240V'
        }
    },
    // ========== 瑞迈特 BMC ==========
    {
        id: 20,
        name: 'RESmart GII Auto',
        brand: '瑞迈特 BMC',
        type: '单水平全自动CPAP',
        price: 2680,
        rating: 4.4,
        reviewCount: 876,
        tag: '热销',
        tagType: 'danger',
        highlights: ['国产优选', '性价比之王', 'iCode算法', 'APP管理'],
        description: '瑞迈特（BMC）畅销产品，国产呼吸机领导品牌，iCode智能算法精准调压，价格亲民功能全面，是国产CPAP首选。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '28 dB',
            '重量': '1.2 kg',
            '湿化器': '可选配加湿器',
            '数据连接': '蓝牙APP',
            '电源': 'AC 220V'
        }
    },
    {
        id: 21,
        name: 'RESmart BPAP 25A',
        brand: '瑞迈特 BMC',
        type: '双水平自动BiPAP',
        price: 5800,
        rating: 4.5,
        reviewCount: 456,
        tag: '推荐',
        tagType: 'success',
        highlights: ['双水平自动', '高性价比', 'iCode算法', 'APP数据'],
        description: '瑞迈特双水平自动呼吸机，自动调节吸呼气压力，适合对单水平CPAP不耐受或需要更高压力支持的患者。',
        suitableFor: ['sleep_apnea', 'copd'],
        specs: {
            '工作模式': 'S / Auto S',
            '吸气压范围': '4-25 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '噪音水平': '28 dB',
            '重量': '1.5 kg',
            '数据连接': '蓝牙APP',
            '电源': 'AC 220V'
        }
    },
    {
        id: 22,
        name: 'RESmart BPAP 30ST',
        brand: '瑞迈特 BMC',
        type: '双水平无创呼吸机',
        price: 9800,
        rating: 4.5,
        reviewCount: 234,
        tag: '',
        tagType: '',
        highlights: ['ST模式', 'T模式', '医疗级', '国产优质'],
        description: '瑞迈特医疗级双水平呼吸机，支持S/ST/T多种模式，适合慢阻肺、呼吸衰竭等需要无创通气的患者。',
        suitableFor: ['copd', 'neuromuscular'],
        specs: {
            '工作模式': 'S / ST / T / CPAP',
            '吸气压范围': '4-30 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '备用频率': '4-30 次/分',
            '噪音水平': '30 dB',
            '重量': '2.0 kg',
            '报警功能': '多参数报警',
            '电源': 'AC 220V'
        }
    },
    {
        id: 23,
        name: 'Luna G3 Auto',
        brand: '瑞迈特 BMC',
        type: '单水平全自动CPAP',
        price: 3580,
        rating: 4.5,
        reviewCount: 567,
        tag: '',
        tagType: '',
        highlights: ['新一代算法', '彩色触屏', 'APP互联', '静音升级'],
        description: '瑞迈特Luna系列新品，升级算法和降噪设计，彩色触控屏操作便捷，支持手机APP远程查看数据。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '26 dB',
            '重量': '1.1 kg',
            '屏幕': '3.5寸彩色触屏',
            '数据连接': 'WiFi + 蓝牙',
            '电源': 'AC 100-240V'
        }
    },
    // ========== 怡和嘉业 ==========
    {
        id: 24,
        name: 'BreathCare PAP-S20',
        brand: '怡和嘉业',
        type: '单水平全自动CPAP',
        price: 2480,
        rating: 4.3,
        reviewCount: 345,
        tag: '入门',
        tagType: 'info',
        highlights: ['价格实惠', '操作简单', '静音设计', '国产品牌'],
        description: '怡和嘉业入门级CPAP呼吸机，价格亲民，功能实用，适合预算有限的入门用户。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '30 dB',
            '重量': '1.3 kg',
            '湿化器': '可选配',
            '数据存储': 'SD卡',
            '电源': 'AC 220V'
        }
    },
    {
        id: 25,
        name: 'BreathCare BPAP-ST30',
        brand: '怡和嘉业',
        type: '双水平无创呼吸机',
        price: 8800,
        rating: 4.4,
        reviewCount: 167,
        tag: '',
        tagType: '',
        highlights: ['ST模式', '性价比高', '医保报销', '国产医疗'],
        description: '怡和嘉业医疗级双水平呼吸机，支持医保报销，适合慢阻肺和呼吸衰竭患者的家庭使用。',
        suitableFor: ['copd', 'heart_failure'],
        specs: {
            '工作模式': 'S / ST / T / CPAP',
            '吸气压范围': '4-30 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '备用频率': '4-30 次/分',
            '噪音水平': '32 dB',
            '重量': '2.3 kg',
            '报警功能': '低压/高压/断电报警',
            '电源': 'AC 220V'
        }
    },
    // ========== 凯迪泰 Curative ==========
    {
        id: 26,
        name: 'Floton ST-30F',
        brand: '凯迪泰 Curative',
        type: '双水平无创呼吸机',
        price: 11000,
        rating: 4.5,
        reviewCount: 198,
        tag: '',
        tagType: '',
        highlights: ['医疗认证', '稳定可靠', 'ST模式', '国产专业'],
        description: '凯迪泰专业双水平呼吸机，国内较早从事无创呼吸机研发的企业，产品稳定可靠，临床应用广泛。',
        suitableFor: ['copd', 'neuromuscular'],
        specs: {
            '工作模式': 'S / ST / T / CPAP',
            '吸气压范围': '4-30 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '备用频率': '5-30 次/分',
            '噪音水平': '30 dB',
            '重量': '2.5 kg',
            '报警功能': '完善报警系统',
            '电源': 'AC 220V'
        }
    },
    {
        id: 27,
        name: 'Floton Auto',
        brand: '凯迪泰 Curative',
        type: '单水平全自动CPAP',
        price: 3200,
        rating: 4.3,
        reviewCount: 289,
        tag: '',
        tagType: '',
        highlights: ['自动调压', '国产品质', '售后完善', '医院合作'],
        description: '凯迪泰单水平全自动CPAP，与多家医院睡眠中心合作，售后服务网络完善。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '28 dB',
            '重量': '1.4 kg',
            '湿化器': '可选配',
            '数据存储': 'SD卡',
            '电源': 'AC 220V'
        }
    },
    // ========== 和普乐 Hoffrichter ==========
    {
        id: 28,
        name: 'TREND II Auto',
        brand: '和普乐 Hoffrichter',
        type: '单水平全自动CPAP',
        price: 4200,
        rating: 4.4,
        reviewCount: 178,
        tag: '',
        tagType: '',
        highlights: ['德国技术', '自动调压', 'SmartFlex', '性价比'],
        description: '和普乐与德国Hoffrichter合作，采用德国技术，产品质量可靠，价格适中。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '27 dB',
            '重量': '1.25 kg',
            '呼气释压': '1-3级',
            '数据存储': 'SD卡',
            '电源': 'AC 100-240V'
        }
    },
    {
        id: 29,
        name: 'TREND II ST25',
        brand: '和普乐 Hoffrichter',
        type: '双水平BiPAP',
        price: 7500,
        rating: 4.4,
        reviewCount: 134,
        tag: '',
        tagType: '',
        highlights: ['德国技术', 'ST模式', '稳定可靠', '性价比高'],
        description: '和普乐双水平呼吸机，德国Hoffrichter技术支持，适合需要双水平支持的患者。',
        suitableFor: ['sleep_apnea', 'copd'],
        specs: {
            '工作模式': 'S / ST / CPAP',
            '吸气压范围': '4-25 cmH2O',
            '呼气压范围': '4-25 cmH2O',
            '备用频率': '5-30 次/分',
            '噪音水平': '28 dB',
            '重量': '1.8 kg',
            '电源': 'AC 100-240V'
        }
    },
    // ========== 迈卓诺 ==========
    {
        id: 30,
        name: 'Micomme P1 Auto',
        brand: '迈卓诺 Micomme',
        type: '单水平全自动CPAP',
        price: 2380,
        rating: 4.2,
        reviewCount: 234,
        tag: '平价',
        tagType: 'info',
        highlights: ['价格亲民', '功能齐全', '国产新锐', 'APP支持'],
        description: '迈卓诺入门CPAP呼吸机，价格实惠，基本功能完善，适合预算有限的入门用户。',
        suitableFor: ['sleep_apnea'],
        specs: {
            '工作模式': 'CPAP / Auto CPAP',
            '压力范围': '4-20 cmH2O',
            '噪音水平': '30 dB',
            '重量': '1.3 kg',
            '数据连接': '蓝牙APP',
            '电源': 'AC 220V'
        }
    }
];

// 疾病数据
const diseasesData = [
    {
        id: 1,
        name: '阻塞性睡眠呼吸暂停(OSA)',
        shortDesc: '睡眠时上气道反复塌陷导致的呼吸暂停',
        icon: 'el-icon-moon-night',
        color: '#409EFF',
        description: '阻塞性睡眠呼吸暂停综合征是指睡眠时上气道塌陷阻塞引起的呼吸暂停和通气不足，通常伴有打鼾、睡眠结构紊乱、频繁发生血氧饱和度下降、白天嗜睡等症状。',
        symptoms: [
            '响亮且不规律的打鼾',
            '睡眠中呼吸暂停，被呛醒',
            '白天嗜睡、疲劳',
            '晨起头痛',
            '注意力不集中、记忆力下降',
            '夜尿增多'
        ],
        recommendedTypes: ['单水平CPAP', '单水平全自动CPAP', '双水平BiPAP(重症)'],
        parameterGuide: [
            { param: '治疗压力', range: '6-14 cmH2O', note: '根据AHI指数和滴定结果确定' },
            { param: 'EPR/Flex', range: '1-3', note: '提高舒适度，减少呼气阻力感' },
            { param: '升压时间', range: '15-45分钟', note: '从低压逐渐升到治疗压力' },
            { param: '加湿等级', range: '3-5级', note: '根据季节和个人感受调节' }
        ],
        recommendedProducts: [1, 2, 5, 8, 11, 14, 17, 20, 23, 24, 27, 30]
    },
    {
        id: 2,
        name: '中枢性睡眠呼吸暂停(CSA)',
        shortDesc: '大脑呼吸中枢驱动减少导致的呼吸暂停',
        icon: 'el-icon-cpu',
        color: '#E6A23C',
        description: '中枢性睡眠呼吸暂停是由于中枢神经系统对呼吸肌的控制异常，导致呼吸驱动降低或消失而引起的呼吸暂停。常见于心衰患者、使用阿片类药物者及高原环境。',
        symptoms: [
            '睡眠中反复醒来',
            '呼吸暂停（无打鼾或轻度打鼾）',
            '失眠',
            '白天嗜睡',
            '呼吸困难感',
            '陈施呼吸（潮式呼吸）'
        ],
        recommendedTypes: ['ASV自适应伺服通气', '双水平ST模式', '特殊中枢算法CPAP'],
        parameterGuide: [
            { param: 'EPAP压力', range: '4-10 cmH2O', note: '保持上气道开放' },
            { param: 'PS压力支持', range: '0-10 cmH2O', note: '根据需要提供通气支持' },
            { param: '备用呼吸频率', range: '12-15 次/分', note: '确保最低通气量' },
            { param: '最小/最大PS', range: '自动调节', note: 'ASV模式自动调节' }
        ],
        recommendedProducts: [3, 4, 7, 18, 19]
    },
    {
        id: 3,
        name: '慢性阻塞性肺疾病(COPD)',
        shortDesc: '慢性支气管炎和肺气肿导致的气流受限',
        icon: 'el-icon-first-aid-kit',
        color: '#67C23A',
        description: '慢性阻塞性肺疾病是一种以气流受限为特征的慢性呼吸系统疾病。包括慢性支气管炎和肺气肿。严重者会出现呼吸衰竭和二氧化碳潴留。',
        symptoms: [
            '慢性咳嗽、咳痰',
            '活动后气短、呼吸困难',
            '喘息、胸闷',
            '晚期出现桶状胸',
            '呼吸衰竭',
            '肺心病表现'
        ],
        recommendedTypes: ['双水平ST模式', '双水平iVAPS/AVAPS', '高流量氧疗'],
        parameterGuide: [
            { param: 'IPAP吸气压', range: '14-24 cmH2O', note: '提供足够的通气支持' },
            { param: 'EPAP呼气压', range: '4-8 cmH2O', note: '克服内源性PEEP' },
            { param: '备用呼吸频率', range: '12-16 次/分', note: '保证最低通气' },
            { param: '吸气时间', range: '0.8-1.2秒', note: 'COPD患者可适当延长呼气' },
            { param: '目标潮气量', range: '8-10 mL/kg', note: 'iVAPS/AVAPS模式设置' }
        ],
        recommendedProducts: [4, 7, 9, 10, 12, 13, 16, 18, 22, 25, 26]
    },
    {
        id: 4,
        name: '肥胖低通气综合征(OHS)',
        shortDesc: '严重肥胖导致的慢性低通气和高碳酸血症',
        icon: 'el-icon-s-custom',
        color: '#F56C6C',
        description: '肥胖低通气综合征是指BMI≥30的肥胖患者出现清醒时的低通气（PaCO2>45mmHg），且排除其他导致低通气的原因。常与阻塞性睡眠呼吸暂停合并存在。',
        symptoms: [
            '严重肥胖（BMI≥30）',
            '白天嗜睡',
            '呼吸困难',
            '晨起头痛',
            '下肢水肿',
            '清醒时血氧低/二氧化碳高'
        ],
        recommendedTypes: ['双水平ST模式', '双水平AVAPS/iVAPS', '高压力CPAP'],
        parameterGuide: [
            { param: 'IPAP吸气压', range: '18-30 cmH2O', note: '需要较高压力克服胸壁顺应性降低' },
            { param: 'EPAP呼气压', range: '8-14 cmH2O', note: '维持气道开放并改善氧合' },
            { param: '目标潮气量', range: '8 mL/kg理想体重', note: '按理想体重而非实际体重计算' },
            { param: '备用呼吸频率', range: '14-18 次/分', note: '保证足够的分钟通气量' }
        ],
        recommendedProducts: [3, 4, 7, 16, 18, 19]
    },
    {
        id: 5,
        name: '神经肌肉疾病(NMD)',
        shortDesc: '肌营养不良、ALS等导致的呼吸肌无力',
        icon: 'el-icon-s-opportunity',
        color: '#909399',
        description: '神经肌肉疾病包括肌营养不良、肌萎缩侧索硬化(ALS)、脊髓性肌萎缩(SMA)等，这些疾病会导致呼吸肌力量下降，最终需要无创或有创通气支持。',
        symptoms: [
            '渐进性呼吸困难',
            '端坐呼吸',
            '睡眠质量差',
            '晨起头痛',
            '说话声音变弱',
            '咳嗽无力、排痰困难'
        ],
        recommendedTypes: ['双水平ST/T模式', '生命支持呼吸机', '带容量保证的双水平'],
        parameterGuide: [
            { param: 'IPAP吸气压', range: '12-25 cmH2O', note: '逐渐增加以适应疾病进展' },
            { param: 'EPAP呼气压', range: '4-8 cmH2O', note: '保持气道开放' },
            { param: '备用呼吸频率', range: '14-20 次/分', note: '根据病情可能需要较高' },
            { param: '吸气时间', range: '1.0-1.4秒', note: '保证足够吸气' },
            { param: '升压时间', range: '最短', note: '快速达到目标压力' }
        ],
        recommendedProducts: [4, 9, 7, 12, 16, 18, 22, 26]
    },
    {
        id: 6,
        name: '心力衰竭相关睡眠呼吸障碍',
        shortDesc: '心衰患者常伴发的中枢性睡眠呼吸暂停',
        icon: 'el-icon-s-help',
        color: '#F56C6C',
        description: '心力衰竭患者常合并睡眠呼吸障碍，主要表现为中枢性睡眠呼吸暂停和陈施呼吸。适当的呼吸机治疗可改善症状，但需在医生指导下使用。',
        symptoms: [
            '夜间阵发性呼吸困难',
            '端坐呼吸',
            '潮式呼吸（陈施呼吸）',
            '睡眠质量差',
            '疲劳',
            '下肢水肿'
        ],
        recommendedTypes: ['ASV自适应伺服通气', '双水平ST模式', 'CPAP（排除OSA后）'],
        parameterGuide: [
            { param: 'EPAP压力', range: '4-8 cmH2O', note: '轻度心衰，需谨慎避免过高' },
            { param: 'PS压力支持', range: '自动或0-6 cmH2O', note: 'ASV模式优先' },
            { param: '备用呼吸频率', range: '与自主呼吸匹配', note: 'ASV自动调节' }
        ],
        recommendedProducts: [4, 10, 18, 25]
    }
];

// 测评数据 - 三维度评测体系：临床效果、用户体验、技术质量
const reviewsData = [
    {
        id: 1,
        title: '瑞思迈AirSense 11深度测评：新旗舰全方位评测',
        category: '单品测评',
        tagType: 'primary',
        author: '呼吸机评测团队',
        date: '2024-01-15',
        views: 5680,
        coverColor: '#409EFF',
        summary: '从临床效果、用户体验、技术质量三大维度，全面评测瑞思迈最新旗舰AirSense 11...',
        overallScore: 9.2,
        // 三维度评分体系
        clinicalScores: {
            ahiControl: 9.5,        // AHI控制效果
            oxygenImprovement: 9.3, // 血氧改善
            leakCompensation: 9.4,  // 漏气补偿能力
            eventDetection: 9.6     // 事件检测准确性
        },
        userScores: {
            comfort: 9.0,           // 佩戴舒适度
            noise: 9.4,             // 静音表现
            easeOfUse: 9.2,         // 易用性
            sleepQuality: 9.1,      // 睡眠质量改善
            portability: 8.5        // 便携性
        },
        techScores: {
            algorithm: 9.6,         // 算法性能
            buildQuality: 9.3,      // 做工品质
            reliability: 9.4,       // 稳定可靠性
            dataManagement: 9.5,    // 数据管理
            humidification: 9.2     // 加湿系统
        },
        content: `
            <h4>一、临床效果评测</h4>
            <p><strong>测试方法：</strong>选取20名中重度OSA患者，使用AirSense 11进行为期4周的治疗，记录AHI变化、血氧饱和度、睡眠结构等指标。</p>

            <p><strong>AHI控制效果（9.5分）</strong></p>
            <p>测试组患者平均AHI从治疗前的32.5次/小时降至2.8次/小时，控制率达91.4%。AutoSet算法能够精准识别阻塞性和中枢性事件，压力响应时间约200ms，较上代产品提升15%。</p>

            <p><strong>血氧改善（9.3分）</strong></p>
            <p>患者平均最低血氧饱和度从78%提升至92%，ODI（氧减指数）下降明显。夜间血氧波动减少，整体氧合状态显著改善。</p>

            <p><strong>漏气补偿（9.4分）</strong></p>
            <p>在模拟30L/min大漏气情况下，机器能在0.5秒内完成压力补偿，维持有效治疗压力。漏气补偿算法较前代更加平滑，不会造成患者不适。</p>

            <h4>二、用户体验评测</h4>
            <p><strong>测试方法：</strong>邀请50名不同年龄段用户进行为期2周的使用体验，收集主观感受评分。</p>

            <p><strong>舒适度（9.0分）</strong></p>
            <p>EPR呼气释压技术升级到3.0版本，呼气时压力释放更加自然。升压曲线可个性化设置，适应不同用户入睡习惯。但部分用户反映高压力时仍有轻微憋气感。</p>

            <p><strong>噪音表现（9.4分）</strong></p>
            <p>实测工作噪音26.6dB，在安静卧室环境下几乎不可察觉。新款Easy-Breathe电机采用无刷设计，消除了机械噪音。加湿器运行时略有水流声，但不影响睡眠。</p>

            <p><strong>易用性（9.2分）</strong></p>
            <p>顶置彩色触控屏操作直观，开机即用设计适合老年用户。myAir APP界面友好，数据可视化做得很好。但首次配对蓝牙需要一定学习成本。</p>

            <h4>三、技术质量评测</h4>
            <p><strong>测试方法：</strong>拆机分析硬件用料，压力测试稳定性，长期运行可靠性测试。</p>

            <p><strong>算法性能（9.6分）</strong></p>
            <p>AutoSet算法采用机器学习优化，能够学习用户呼吸模式，提供个性化压力调节。事件检测采用多参数融合算法，误报率低于3%。</p>

            <p><strong>做工品质（9.3分）</strong></p>
            <p>外壳采用医疗级ABS材料，阻燃性能符合UL94 V-0标准。内部PCB板布局合理，关键元器件均采用知名品牌。水箱密封性良好，长期使用无渗漏风险。</p>

            <p><strong>数据管理（9.5分）</strong></p>
            <p>支持WiFi自动上传数据，配合myAir APP可查看详细睡眠报告。SD卡可存储365天完整数据，支持OSCAR等第三方软件解析。</p>
        `,
        testData: {
            sampleSize: 20,
            testDuration: '4周',
            avgAhiBefore: 32.5,
            avgAhiAfter: 2.8,
            ahiControlRate: '91.4%',
            avgSpO2Before: '78%',
            avgSpO2After: '92%',
            noiseLevel: '26.6 dB',
            pressureResponse: '200ms'
        },
        pros: [
            'AutoSet算法精准，AHI控制率超90%',
            '静音表现出色，仅26.6dB',
            'myAir APP数据管理强大',
            'EPR 3.0呼气更舒适',
            '做工品质优秀，可靠性高'
        ],
        cons: [
            '价格较高，约8500元',
            '必须使用原装配件',
            '高压力时仍有轻微憋气感',
            '蓝牙配对有学习成本'
        ],
        productId: 1
    },
    {
        id: 2,
        title: '2024年度CPAP呼吸机横评：八款主流产品临床对比',
        category: '横向对比',
        tagType: 'success',
        author: '呼吸机评测团队',
        date: '2024-01-10',
        views: 12350,
        coverColor: '#67C23A',
        summary: '集合进口、国产八大品牌主流CPAP产品，从临床效果、用户体验、技术质量三维度全方位对比...',
        overallScore: 0,
        clinicalScores: {
            comprehensiveness: 10,
            objectivity: 9.5,
            practicality: 9.8
        },
        content: `
            <h4>横评产品</h4>
            <ul>
                <li>瑞思迈 AirSense 11（进口旗舰）</li>
                <li>飞利浦 DreamStation 2（进口主流）</li>
                <li>费雪派克 SleepStyle（进口舒适）</li>
                <li>万曼 prisma SMART（德国精工）</li>
                <li>瑞迈特 RESmart GII（国产热销）</li>
                <li>鱼跃 YH-360（国产入门）</li>
                <li>德百世 IntelliPAP 2（进口性价比）</li>
                <li>怡和嘉业 PAP-S20（国产平价）</li>
            </ul>

            <h4>一、临床效果对比</h4>
            <table border="1" style="width:100%; text-align:center;">
                <tr><th>产品</th><th>AHI控制率</th><th>漏气补偿</th><th>事件检测</th></tr>
                <tr><td>AirSense 11</td><td>91.4%</td><td>优秀</td><td>优秀</td></tr>
                <tr><td>DreamStation 2</td><td>89.2%</td><td>优秀</td><td>良好</td></tr>
                <tr><td>SleepStyle</td><td>88.5%</td><td>良好</td><td>良好</td></tr>
                <tr><td>prisma SMART</td><td>90.1%</td><td>优秀</td><td>优秀</td></tr>
                <tr><td>RESmart GII</td><td>85.3%</td><td>良好</td><td>良好</td></tr>
                <tr><td>YH-360</td><td>82.6%</td><td>一般</td><td>一般</td></tr>
                <tr><td>IntelliPAP 2</td><td>86.8%</td><td>良好</td><td>良好</td></tr>
                <tr><td>PAP-S20</td><td>81.2%</td><td>一般</td><td>一般</td></tr>
            </table>

            <h4>二、用户体验对比</h4>
            <table border="1" style="width:100%; text-align:center;">
                <tr><th>产品</th><th>噪音(dB)</th><th>舒适度</th><th>易用性</th></tr>
                <tr><td>AirSense 11</td><td>26.6</td><td>9.0</td><td>9.2</td></tr>
                <tr><td>DreamStation 2</td><td>28.0</td><td>8.8</td><td>9.0</td></tr>
                <tr><td>SleepStyle</td><td>26.0</td><td>9.2</td><td>8.8</td></tr>
                <tr><td>prisma SMART</td><td>25.0</td><td>9.1</td><td>8.5</td></tr>
                <tr><td>RESmart GII</td><td>28.0</td><td>8.2</td><td>8.5</td></tr>
                <tr><td>YH-360</td><td>30.0</td><td>7.8</td><td>8.0</td></tr>
                <tr><td>IntelliPAP 2</td><td>26.0</td><td>8.5</td><td>8.3</td></tr>
                <tr><td>PAP-S20</td><td>30.0</td><td>7.5</td><td>7.8</td></tr>
            </table>

            <h4>三、性价比分析</h4>
            <p>综合临床效果和价格，性价比排名：</p>
            <ol>
                <li><strong>瑞迈特 RESmart GII</strong> - 2680元，临床效果达到进口中端水平</li>
                <li><strong>德百世 IntelliPAP 2</strong> - 4500元，进口品牌中性价比最高</li>
                <li><strong>万曼 prisma SMART</strong> - 6800元，德国品质，效果接近顶级</li>
                <li><strong>瑞思迈 AirSense 11</strong> - 8500元，综合表现最佳</li>
            </ol>
        `,
        pros: ['对比维度全面，涵盖三大评测体系', '数据客观真实，均为实测结果', '性价比分析实用'],
        cons: ['部分小众品牌未纳入测试']
    },
    {
        id: 3,
        title: '飞利浦DreamStation 2临床实测：三个月跟踪报告',
        category: '用户评测',
        tagType: 'warning',
        author: '资深用户 张先生',
        date: '2024-01-05',
        views: 3420,
        coverColor: '#E6A23C',
        summary: '作为一名重度OSA患者，记录使用DreamStation 2三个月的临床数据和真实感受...',
        overallScore: 8.5,
        clinicalScores: {
            ahiControl: 8.8,
            oxygenImprovement: 8.5,
            leakCompensation: 8.6,
            eventDetection: 8.7
        },
        userScores: {
            comfort: 8.5,
            noise: 8.0,
            easeOfUse: 9.0,
            sleepQuality: 8.6,
            portability: 9.0
        },
        techScores: {
            algorithm: 8.7,
            buildQuality: 8.5,
            reliability: 8.8,
            dataManagement: 8.5,
            humidification: 8.2
        },
        content: `
            <h4>个人背景</h4>
            <p>本人45岁男性，BMI 28，确诊重度OSA，治疗前AHI 65次/小时，最低血氧68%。之前使用瑞思迈S9三年，因机器老化更换为飞利浦DreamStation 2。</p>

            <h4>一、临床效果（自我监测数据）</h4>
            <p><strong>第1个月：</strong>AHI从65降至8.2，适应期压力设置为8-15cmH2O。有3晚因面罩漏气AHI偏高。</p>
            <p><strong>第2个月：</strong>AHI稳定在4.5左右，调整压力为9-16cmH2O。血氧监测仪显示最低血氧提升至89%。</p>
            <p><strong>第3个月：</strong>AHI维持在3.2，最低血氧92%。白天嗜睡症状明显改善，ESS评分从18分降至6分。</p>

            <h4>二、用户体验感受</h4>
            <p><strong>舒适度：</strong>A-Flex呼气释压技术确实比瑞思迈EPR更柔和，呼气时几乎感觉不到阻力。但升压速度固定，无法自定义。</p>
            <p><strong>噪音：</strong>比老款S9安静一些，但比宣传的28dB略高，实测约30dB。枕边人表示可以接受。</p>
            <p><strong>便携性：</strong>体积比AirSense 11小，重量1.35kg，出差携带方便。</p>

            <h4>三、技术观察</h4>
            <p><strong>算法：</strong>自动调压响应速度适中，偶尔有压力波动但不影响睡眠。</p>
            <p><strong>做工：</strong>整体做工良好，但水箱卡扣略松，需要注意安装到位。</p>
            <p><strong>APP：</strong>DreamMapper APP功能较基础，数据展示不如myAir详细。</p>
        `,
        testData: {
            userAge: 45,
            bmi: 28,
            ahiBefore: 65,
            ahiAfter: 3.2,
            spO2Before: '68%',
            spO2After: '92%',
            essBefore: 18,
            essAfter: 6,
            testDuration: '3个月'
        },
        pros: [
            'A-Flex呼气释压柔和自然',
            'AHI控制效果良好',
            '体积紧凑便于携带',
            '触控屏操作直观'
        ],
        cons: [
            '实际噪音比标称略高',
            '加湿器需单独购买',
            'APP功能较简单',
            '水箱卡扣设计一般'
        ],
        productId: 2
    },
    {
        id: 4,
        title: '双水平呼吸机临床选择指南：BiPAP技术深度解析',
        category: '单品测评',
        tagType: 'primary',
        author: '呼吸机评测团队',
        date: '2023-12-28',
        views: 8900,
        coverColor: '#909399',
        summary: '从临床适应症、技术原理、参数设置三方面，详解双水平呼吸机的选择和使用...',
        overallScore: 0,
        content: `
            <h4>一、临床适应症分析</h4>
            <p><strong>适合使用双水平呼吸机的情况：</strong></p>
            <ul>
                <li>单水平CPAP治疗效果不佳或不耐受</li>
                <li>需要较高治疗压力（>15cmH2O）</li>
                <li>合并慢阻肺、肥胖低通气综合征</li>
                <li>存在中枢性睡眠呼吸暂停</li>
                <li>神经肌肉疾病导致的呼吸功能不全</li>
            </ul>

            <h4>二、技术原理对比</h4>
            <table border="1" style="width:100%;">
                <tr><th>模式</th><th>原理</th><th>适用人群</th></tr>
                <tr><td>S模式</td><td>患者触发，吸气给IPAP，呼气给EPAP</td><td>自主呼吸良好的OSA患者</td></tr>
                <tr><td>ST模式</td><td>S模式+备用呼吸频率</td><td>可能出现中枢性暂停的患者</td></tr>
                <tr><td>T模式</td><td>完全由机器控制呼吸节律</td><td>自主呼吸微弱的患者</td></tr>
                <tr><td>AVAPS/iVAPS</td><td>自动调节PS以维持目标潮气量</td><td>慢阻肺、OHS患者</td></tr>
            </table>

            <h4>三、主流产品临床对比</h4>
            <p><strong>瑞思迈 AirCurve 10 VAuto：</strong></p>
            <ul>
                <li>临床效果：VAuto算法可自动调节IPAP和EPAP，适应性强</li>
                <li>技术特点：Easy-Breathe电机，压力输出平稳</li>
                <li>适用场景：复杂OSA、轻度慢阻肺</li>
            </ul>

            <p><strong>飞利浦 BiPAP A30：</strong></p>
            <ul>
                <li>临床效果：AVAPS模式维持潮气量稳定，适合肺功能下降患者</li>
                <li>技术特点：Auto-Trak算法优化人机同步</li>
                <li>适用场景：中重度慢阻肺、OHS</li>
            </ul>

            <p><strong>万曼 prisma VENT50：</strong></p>
            <ul>
                <li>临床效果：德国制造，精度高，适合长期依赖患者</li>
                <li>技术特点：aVAPS模式，压力控制精准</li>
                <li>适用场景：神经肌肉疾病、重症患者</li>
            </ul>

            <h4>四、参数设置建议</h4>
            <table border="1" style="width:100%;">
                <tr><th>参数</th><th>OSA患者</th><th>慢阻肺患者</th><th>OHS患者</th></tr>
                <tr><td>IPAP</td><td>10-16 cmH2O</td><td>14-24 cmH2O</td><td>18-30 cmH2O</td></tr>
                <tr><td>EPAP</td><td>4-8 cmH2O</td><td>4-8 cmH2O</td><td>8-14 cmH2O</td></tr>
                <tr><td>PS</td><td>4-8 cmH2O</td><td>8-16 cmH2O</td><td>10-16 cmH2O</td></tr>
                <tr><td>备用频率</td><td>12-14次/分</td><td>12-16次/分</td><td>14-18次/分</td></tr>
            </table>
        `,
        pros: ['临床分型清晰', '参数设置指导具体', '产品对比客观'],
        cons: ['需要一定专业基础才能完全理解']
    },
    {
        id: 5,
        title: '便携呼吸机实测对比：AirMini vs 瑞迈特G3 Mini',
        category: '横向对比',
        tagType: 'success',
        author: '呼吸机评测团队',
        date: '2023-12-20',
        views: 6780,
        coverColor: '#67C23A',
        summary: '两款热门便携呼吸机的临床效果、便携性、性价比全面对比...',
        overallScore: 0,
        content: `
            <h4>测试产品</h4>
            <ul>
                <li><strong>瑞思迈 AirMini</strong> - 进口便携旗舰，6500元</li>
                <li><strong>瑞迈特 G3 Mini</strong> - 国产便携新品，2980元</li>
            </ul>

            <h4>一、临床效果对比</h4>
            <p>选取10名中度OSA患者，分别使用两款机器各1周，交叉对比。</p>
            <table border="1" style="width:100%; text-align:center;">
                <tr><th>指标</th><th>AirMini</th><th>G3 Mini</th></tr>
                <tr><td>平均AHI</td><td>3.8次/小时</td><td>5.2次/小时</td></tr>
                <tr><td>漏气补偿</td><td>优秀</td><td>良好</td></tr>
                <tr><td>压力稳定性</td><td>优秀</td><td>良好</td></tr>
                <tr><td>事件检测</td><td>精准</td><td>基本准确</td></tr>
            </table>

            <h4>二、便携性对比</h4>
            <table border="1" style="width:100%; text-align:center;">
                <tr><th>指标</th><th>AirMini</th><th>G3 Mini</th></tr>
                <tr><td>重量</td><td>300g</td><td>450g</td></tr>
                <tr><td>尺寸</td><td>136×84×53mm</td><td>150×95×60mm</td></tr>
                <tr><td>电池续航</td><td>需外接（约8小时）</td><td>内置（约6小时）</td></tr>
                <tr><td>加湿方式</td><td>HumidX免水加湿</td><td>无加湿</td></tr>
            </table>

            <h4>三、技术质量对比</h4>
            <p><strong>AirMini：</strong>采用与AirSense系列相同的AutoSet算法，压缩机性能出色，噪音控制在30dB以内。HumidX免水加湿片是创新设计，但需要定期更换（约30天/片）。</p>
            <p><strong>G3 Mini：</strong>采用瑞迈特自研iCode算法，基本能满足中轻度患者需求。内置电池是优势，但机身相对较大。做工尚可，性价比突出。</p>

            <h4>四、选购建议</h4>
            <ul>
                <li><strong>选AirMini：</strong>重度患者、对治疗效果要求高、预算充足</li>
                <li><strong>选G3 Mini：</strong>中轻度患者、偶尔出差、追求性价比</li>
            </ul>
        `,
        pros: ['便携性数据详实', '临床效果有对照', '选购建议实用'],
        cons: ['测试样本量较小'],
        productId: 5
    },
    {
        id: 6,
        title: '国产呼吸机临床评测：瑞迈特RESmart GII深度体验',
        category: '用户评测',
        tagType: 'warning',
        author: '普通用户 李女士',
        date: '2023-12-15',
        views: 4560,
        coverColor: '#E6A23C',
        summary: '作为预算有限的用户，记录使用国产瑞迈特呼吸机的临床数据和真实感受...',
        overallScore: 8.3,
        clinicalScores: {
            ahiControl: 8.5,
            oxygenImprovement: 8.2,
            leakCompensation: 7.8,
            eventDetection: 8.0
        },
        userScores: {
            comfort: 8.0,
            noise: 7.8,
            easeOfUse: 8.5,
            sleepQuality: 8.2,
            portability: 8.0
        },
        techScores: {
            algorithm: 8.0,
            buildQuality: 7.8,
            reliability: 8.5,
            dataManagement: 8.2,
            humidification: 7.5
        },
        content: `
            <h4>个人背景</h4>
            <p>本人38岁女性，BMI 26，确诊中度OSA，治疗前AHI 22次/小时。因预算有限，选择了国产瑞迈特RESmart GII Auto，价格2680元。</p>

            <h4>一、临床效果（2个月数据）</h4>
            <p><strong>AHI变化：</strong></p>
            <ul>
                <li>治疗前：22次/小时</li>
                <li>第1周：7.5次/小时（适应期）</li>
                <li>第1个月：4.8次/小时</li>
                <li>第2个月：3.5次/小时</li>
            </ul>
            <p>控制效果达到预期，虽然不如进口顶级产品，但对于中度患者完全够用。</p>

            <p><strong>血氧改善：</strong>最低血氧从82%提升至90%，晨起头痛症状消失。</p>

            <h4>二、用户体验</h4>
            <p><strong>舒适度：</strong>呼气释压功能有效，但高压时（>12cmH2O）略有不适感。建议从低压开始适应。</p>
            <p><strong>噪音：</strong>实测约28-30dB，比宣传略高，但不影响睡眠。老公表示可以接受。</p>
            <p><strong>APP：</strong>瑞迈特的手机APP功能还不错，可以查看每晚数据，但界面设计比较朴素。</p>

            <h4>三、技术感受</h4>
            <p><strong>算法：</strong>iCode算法基本准确，但偶尔有压力波动，需要2-3秒才能稳定。</p>
            <p><strong>做工：</strong>整体做工中规中矩，塑料感较强，但结构稳固。用了2个月没有任何故障。</p>
            <p><strong>性价比：</strong>2680元的价格，能达到这个效果，非常满意！</p>
        `,
        testData: {
            userAge: 38,
            bmi: 26,
            ahiBefore: 22,
            ahiAfter: 3.5,
            spO2Before: '82%',
            spO2After: '90%',
            price: 2680,
            testDuration: '2个月'
        },
        pros: [
            '性价比极高，不到3000元',
            'AHI控制效果满足中度患者需求',
            'APP功能基本完善',
            '稳定可靠，2个月无故障'
        ],
        cons: [
            '高压时舒适度一般',
            '噪音比进口品牌略大',
            '外观设计较普通',
            '漏气补偿响应稍慢'
        ],
        productId: 20
    },
    {
        id: 7,
        title: '德国万曼prisma SMART临床评测：静音与算法的完美平衡',
        category: '单品测评',
        tagType: 'primary',
        author: '呼吸机评测团队',
        date: '2024-01-20',
        views: 4230,
        coverColor: '#409EFF',
        summary: '德国制造的万曼prisma SMART，以25dB超静音和softPAP技术著称，临床效果如何？',
        overallScore: 9.0,
        clinicalScores: {
            ahiControl: 9.3,
            oxygenImprovement: 9.0,
            leakCompensation: 9.2,
            eventDetection: 9.4
        },
        userScores: {
            comfort: 9.3,
            noise: 9.6,
            easeOfUse: 8.5,
            sleepQuality: 9.2,
            portability: 8.2
        },
        techScores: {
            algorithm: 9.4,
            buildQuality: 9.5,
            reliability: 9.3,
            dataManagement: 8.8,
            humidification: 9.0
        },
        content: `
            <h4>产品背景</h4>
            <p>万曼（Löwenstein）是德国专业呼吸机制造商，prisma系列是其家用产品线的代表。prisma SMART定位中高端市场，售价6800元。</p>

            <h4>一、临床效果评测</h4>
            <p><strong>测试方案：</strong>15名中重度OSA患者，使用prisma SMART进行3周治疗。</p>

            <p><strong>AHI控制（9.3分）</strong></p>
            <p>平均AHI从28.6次/小时降至2.5次/小时，控制率91.3%。德国算法对呼吸事件的识别非常精准，几乎没有误报。</p>

            <p><strong>softPAP技术（9.3分）</strong></p>
            <p>这是万曼的特色技术，在呼气初期快速降低压力，呼气末期平缓回升，呼吸感受极为自然。用户普遍反映比EPR/A-Flex更舒适。</p>

            <h4>二、用户体验评测</h4>
            <p><strong>静音表现（9.6分）</strong></p>
            <p>实测噪音仅25dB，是目前市场上最安静的CPAP之一。即使在安静的卧室环境中，也几乎听不到机器运行的声音。</p>

            <p><strong>易用性（8.5分）</strong></p>
            <p>操作界面是德语风格，比较简洁但需要学习。APP功能基本，不如瑞思迈myAir强大。</p>

            <h4>三、技术质量评测</h4>
            <p><strong>做工品质（9.5分）</strong></p>
            <p>德国制造品质，外壳用料扎实，内部结构紧凑合理。拆机发现PCB板布局工整，元器件品质上乘。</p>

            <p><strong>可靠性（9.3分）</strong></p>
            <p>万曼在欧洲有良好的口碑，产品返修率低。5年质保体现了厂家对品质的信心。</p>
        `,
        testData: {
            sampleSize: 15,
            testDuration: '3周',
            avgAhiBefore: 28.6,
            avgAhiAfter: 2.5,
            ahiControlRate: '91.3%',
            noiseLevel: '25 dB',
            warranty: '5年'
        },
        pros: [
            '超静音设计，仅25dB',
            'softPAP呼气技术体验极佳',
            '德国制造，做工品质优秀',
            'AHI控制效果出色',
            '5年质保，售后有保障'
        ],
        cons: [
            '价格较高，6800元',
            'APP功能相对简单',
            '操作界面需要学习',
            '国内售后网点较少'
        ],
        productId: 17
    },
    {
        id: 8,
        title: '费雪派克SleepStyle深度评测：加湿技术的标杆之作',
        category: '单品测评',
        tagType: 'primary',
        author: '呼吸机评测团队',
        date: '2024-01-25',
        views: 3890,
        coverColor: '#67C23A',
        summary: '以加湿技术闻名的费雪派克，SleepStyle如何解决口干、鼻塞等常见问题？',
        overallScore: 8.8,
        clinicalScores: {
            ahiControl: 8.8,
            oxygenImprovement: 8.7,
            leakCompensation: 8.5,
            eventDetection: 8.6
        },
        userScores: {
            comfort: 9.4,
            noise: 9.0,
            easeOfUse: 8.8,
            sleepQuality: 9.2,
            portability: 8.0
        },
        techScores: {
            algorithm: 8.6,
            buildQuality: 9.0,
            reliability: 9.0,
            dataManagement: 8.5,
            humidification: 9.8
        },
        content: `
            <h4>产品特色</h4>
            <p>费雪派克是新西兰医疗器械公司，以呼吸加湿技术闻名全球。SleepStyle是其最新家用CPAP产品，主打舒适加湿体验。</p>

            <h4>一、加湿系统深度测试</h4>
            <p><strong>ThermoSmart加温管路（9.8分）</strong></p>
            <p>这是费雪派克的看家技术。加温管路可将湿化气体温度保持在31°C，有效防止冷凝水（俗称"下雨"）。实测在室温15°C环境下，管路内无任何冷凝。</p>

            <p><strong>湿化效果：</strong>对于常见的口干、鼻塞问题，SleepStyle的解决效果是所有测试产品中最好的。30名用户中，28人表示口干问题明显改善。</p>

            <h4>二、临床效果</h4>
            <p><strong>AHI控制（8.8分）</strong></p>
            <p>算法水平中上，AHI控制率约88.5%。SensAwake功能可在用户醒来时自动降低压力，减少不适感。</p>

            <h4>三、用户体验</h4>
            <p><strong>舒适度（9.4分）</strong></p>
            <p>得益于优秀的加湿系统，整体舒适度评分很高。用户反馈早晨起床口腔、鼻腔湿润度明显好于其他品牌。</p>

            <p><strong>噪音（9.0分）</strong></p>
            <p>实测26dB，属于安静水平。加湿器运行时有轻微水声，但不影响睡眠。</p>
        `,
        testData: {
            sampleSize: 30,
            testDuration: '4周',
            ahiControlRate: '88.5%',
            noiseLevel: '26 dB',
            dryMouthImprovement: '93.3%'
        },
        pros: [
            'ThermoSmart加温管路杜绝冷凝水',
            '湿化效果业界标杆',
            '口干、鼻塞改善明显',
            'SensAwake智能降压功能',
            '做工品质优秀'
        ],
        cons: [
            'AHI控制不如瑞思迈精准',
            'APP功能较基础',
            '价格7200元偏高',
            '加温管路是额外成本'
        ],
        productId: 11
    }
];

// 教程数据
const tutorialsData = [
    {
        id: 1,
        title: '新手必读：呼吸机入门完全指南',
        category: 'beginner',
        level: '入门',
        icon: 'el-icon-reading',
        color: '#409EFF',
        duration: '15分钟',
        views: 15680,
        summary: '从零开始了解呼吸机，包括工作原理、种类区别、基本操作等入门知识',
        content: '<h4>什么是呼吸机？</h4><p>呼吸机是一种通过正压通气原理，帮助患者保持气道通畅或辅助呼吸的医疗设备...</p><h4>呼吸机的种类</h4><p>根据功能和适用范围，呼吸机主要分为以下几类：</p><ul><li><strong>CPAP（持续气道正压）</strong>：最常见的睡眠呼吸机类型</li><li><strong>BiPAP（双水平气道正压）</strong>：提供不同的吸气压和呼气压</li><li><strong>Auto CPAP</strong>：能够自动调节压力的智能CPAP</li><li><strong>ASV（自适应伺服通气）</strong>：用于中枢性睡眠呼吸暂停</li></ul>',
        steps: [
            { title: '了解自己的病情', desc: '首先要明确自己需要使用呼吸机的原因，是睡眠呼吸暂停还是慢阻肺等' },
            { title: '咨询专业医生', desc: '在医生指导下进行睡眠监测，确定需要的呼吸机类型和参数' },
            { title: '选择合适的机器', desc: '根据医生建议和自身需求选择合适的品牌和型号' },
            { title: '学习基本操作', desc: '阅读说明书，学会开关机、调节参数、连接管路等基本操作' },
            { title: '选配合适的面罩', desc: '面罩的选择对使用体验影响很大，需要根据脸型和习惯选择' }
        ]
    },
    {
        id: 2,
        title: '面罩选择全攻略：鼻罩vs鼻枕vs全脸罩',
        category: 'mask',
        level: '入门',
        icon: 'el-icon-s-custom',
        color: '#67C23A',
        duration: '10分钟',
        views: 12340,
        summary: '详解不同类型面罩的优缺点，帮你找到最适合自己的面罩',
        content: '<h4>面罩类型介绍</h4><p>面罩是呼吸机的重要配件，选择合适的面罩对治疗效果至关重要...</p>',
        steps: [
            { title: '了解面罩类型', desc: '熟悉鼻罩、鼻枕、全脸罩三种主要类型的特点' },
            { title: '评估呼吸习惯', desc: '如果习惯用嘴呼吸，可能需要全脸罩或下巴带' },
            { title: '考虑舒适性', desc: '试戴不同型号，选择密封性好且舒适的面罩' },
            { title: '检查漏气情况', desc: '使用时观察是否有漏气，适当调整' }
        ]
    },
    {
        id: 3,
        title: 'CPAP压力参数设置详解',
        category: 'settings',
        level: '进阶',
        icon: 'el-icon-setting',
        color: '#E6A23C',
        duration: '20分钟',
        views: 8920,
        summary: '深入了解CPAP各项参数的含义和调节方法，优化你的使用体验',
        content: '<h4>治疗压力</h4><p>治疗压力是CPAP最核心的参数...</p>',
        steps: [
            { title: '理解压力单位', desc: 'cmH2O是呼吸机压力的单位，1 cmH2O约等于0.98 hPa' },
            { title: '了解压力范围', desc: '大多数CPAP压力范围在4-20 cmH2O，实际使用通常在6-14之间' },
            { title: '设置升压时间', desc: '升压功能让压力从低逐渐升到治疗压力，帮助入睡' },
            { title: '调节EPR/Flex', desc: '呼气释压功能可以减轻呼气时的阻力感，提高舒适度' }
        ]
    },
    {
        id: 4,
        title: '双水平呼吸机（BiPAP）参数设置指南',
        category: 'settings',
        level: '进阶',
        icon: 'el-icon-s-operation',
        color: '#F56C6C',
        duration: '25分钟',
        views: 6780,
        summary: '掌握BiPAP的IPAP、EPAP、备用频率等关键参数的设置方法',
        content: '<h4>双水平呼吸机参数</h4><p>双水平呼吸机比CPAP更复杂，需要设置更多参数...</p>',
        steps: [
            { title: '理解IPAP和EPAP', desc: 'IPAP是吸气压，EPAP是呼气压，压力差(PS)提供通气支持' },
            { title: '设置压力支持', desc: '根据病情需要设置合适的压力差，通常在4-10 cmH2O' },
            { title: '配置备用频率', desc: 'ST模式下的备用呼吸频率，确保患者最低通气量' },
            { title: '调节吸呼比', desc: '根据疾病特点调整吸气时间和呼气时间的比例' }
        ]
    },
    {
        id: 5,
        title: '呼吸机日常清洁保养全攻略',
        category: 'maintenance',
        level: '入门',
        icon: 'el-icon-brush',
        color: '#909399',
        duration: '10分钟',
        views: 18650,
        summary: '保持呼吸机清洁对健康至关重要，学习正确的清洁方法和保养技巧',
        content: '<h4>为什么要定期清洁？</h4><p>呼吸机长期使用会积累灰尘、细菌和霉菌...</p>',
        steps: [
            { title: '每日清洁', desc: '每天早上用清水冲洗面罩和管路，晾干备用' },
            { title: '每周清洗', desc: '用温水加中性洗涤剂彻底清洗面罩、管路和加湿水盒' },
            { title: '每月检查', desc: '检查管路是否有破损，过滤棉是否需要更换' },
            { title: '定期更换配件', desc: '面罩垫每3-6个月更换，管路每6-12个月更换' }
        ]
    },
    {
        id: 6,
        title: '常见使用问题及解决方案',
        category: 'faq',
        level: '入门',
        icon: 'el-icon-question',
        color: '#409EFF',
        duration: '15分钟',
        views: 22340,
        summary: '汇总呼吸机使用中最常见的问题，提供实用的解决方案',
        content: '<h4>常见问题解答</h4><p>以下是用户最常遇到的问题...</p>',
        steps: [
            { title: '面罩漏气怎么办', desc: '调整头带松紧，检查面罩尺寸是否合适，考虑更换面罩类型' },
            { title: '感觉压力太大', desc: '使用升压功能，开启EPR/Flex，考虑降低压力（需医生同意）' },
            { title: '口干舌燥', desc: '增加加湿器等级，使用加温管路，检查是否存在口漏' },
            { title: '鼻塞不适', desc: '使用加湿功能，考虑使用鼻腔喷雾，严重时咨询医生' }
        ]
    },
    {
        id: 7,
        title: '呼吸机数据解读：看懂你的睡眠报告',
        category: 'settings',
        level: '进阶',
        icon: 'el-icon-data-line',
        color: '#67C23A',
        duration: '15分钟',
        views: 9870,
        summary: '学会解读呼吸机记录的AHI、漏气量、使用时长等数据，评估治疗效果',
        content: '<h4>关键数据指标</h4><p>现代呼吸机都具备数据记录功能...</p>',
        steps: [
            { title: '理解AHI指数', desc: 'AHI是每小时呼吸暂停和低通气的次数，治疗目标是降到5以下' },
            { title: '关注漏气量', desc: '漏气量过大会影响治疗效果，一般应控制在24L/min以下' },
            { title: '查看压力数据', desc: '95%压力值反映了大部分时间的实际治疗压力' },
            { title: '分析使用时长', desc: '每晚使用4小时以上才能获得良好的治疗效果' }
        ]
    },
    {
        id: 8,
        title: '旅行携带呼吸机注意事项',
        category: 'beginner',
        level: '入门',
        icon: 'el-icon-suitcase',
        color: '#E6A23C',
        duration: '8分钟',
        views: 7650,
        summary: '出差旅行时如何携带呼吸机？飞机安检、电压转换等问题一次解答',
        content: '<h4>旅行准备</h4><p>对于需要长期使用呼吸机的患者，出行时如何携带是个重要问题...</p>',
        steps: [
            { title: '选择便携机型', desc: '如果经常旅行，考虑购买专门的旅行款呼吸机' },
            { title: '了解航空规定', desc: 'CPAP作为医疗设备可以随身携带，不计入行李限额' },
            { title: '准备电源适配器', desc: '出国旅行注意目的地电压和插座类型' },
            { title: '携带医生证明', desc: '建议携带医生开具的诊断证明，以便安检时说明' }
        ]
    }
];

// FAQ数据
const faqsData = [
    {
        id: 1,
        question: '呼吸机需要终身使用吗？',
        answer: '对于睡眠呼吸暂停患者，如果是由肥胖等原因引起，减重后可能可以停用。但大多数患者需要长期使用。慢阻肺等疾病患者通常需要长期甚至终身使用。具体请咨询医生。'
    },
    {
        id: 2,
        question: '使用呼吸机会产生依赖吗？',
        answer: '呼吸机不会产生药物依赖性。但停用后，原有的呼吸暂停症状会恢复。这是因为呼吸机只能控制症状，并不能治愈疾病本身。'
    },
    {
        id: 3,
        question: '呼吸机可以用多久？',
        answer: '一台呼吸机的设计寿命通常为5-7年。但实际使用寿命取决于保养情况。面罩、管路等配件需要定期更换。'
    },
    {
        id: 4,
        question: '呼吸机治疗有副作用吗？',
        answer: '常见的不适包括：口干、鼻塞、面罩压痕、腹胀等。这些通常可以通过调整设置、更换面罩或使用加湿器来解决。严重问题请咨询医生。'
    },
    {
        id: 5,
        question: '如何知道治疗是否有效？',
        answer: '有效的治疗表现：白天嗜睡改善、睡眠质量提高、精力充沛、血压改善等。同时查看呼吸机数据，AHI降到5以下说明治疗有效。'
    },
    {
        id: 6,
        question: '呼吸机需要医生处方吗？',
        answer: '在中国，家用呼吸机属于二类医疗器械，购买时不强制要求处方。但强烈建议在医生指导下选购和使用，以确保选择合适的型号和正确的参数设置。'
    }
];

// 品牌列表
const brandsData = [
    '瑞思迈 ResMed',
    '飞利浦 Philips',
    '费雪派克 Fisher & Paykel',
    '德百世 DeVilbiss',
    '万曼 Löwenstein',
    '鱼跃 Yuwell',
    '瑞迈特 BMC',
    '谊安 Aeonmed',
    '怡和嘉业',
    '凯迪泰 Curative',
    '和普乐 Hoffrichter',
    '迈卓诺 Micomme'
];

// 产品类型
const productTypesData = [
    { value: 'cpap', label: '单水平CPAP' },
    { value: 'auto_cpap', label: '单水平全自动CPAP' },
    { value: 'bipap', label: '双水平BiPAP' },
    { value: 'bipap_st', label: '双水平无创呼吸机(ST)' },
    { value: 'portable', label: '便携呼吸机' },
    { value: 'life_support', label: '生命支持呼吸机' },
    { value: 'hfnc', label: '高流量湿化氧疗' }
];

// 轮播图数据
const bannersData = [
    {
        id: 1,
        title: '找到最适合你的呼吸机',
        desc: '智能选机功能，回答几个问题，为您推荐最合适的产品',
        btnText: '立即体验',
        color: '#409EFF',
        link: 'selector'
    },
    {
        id: 2,
        title: '专业测评，客观公正',
        desc: '深度测评各大品牌呼吸机，帮您做出明智选择',
        btnText: '查看测评',
        color: '#67C23A',
        link: 'reviews'
    },
    {
        id: 3,
        title: '从入门到精通',
        desc: '全面的使用教程，解答您的所有疑问',
        btnText: '开始学习',
        color: '#E6A23C',
        link: 'tutorials'
    }
];

// 快速入口数据
const quickEntriesData = [
    {
        id: 1,
        title: '产品库',
        desc: '浏览各大品牌呼吸机',
        icon: 'el-icon-goods',
        link: 'products'
    },
    {
        id: 2,
        title: '智能选机',
        desc: '个性化产品推荐',
        icon: 'el-icon-magic-stick',
        link: 'selector'
    },
    {
        id: 3,
        title: '疾病指南',
        desc: '了解适合您的机型',
        icon: 'el-icon-first-aid-kit',
        link: 'diseases'
    },
    {
        id: 4,
        title: '使用教程',
        desc: '从入门到精通',
        icon: 'el-icon-notebook-2',
        link: 'tutorials'
    }
];
