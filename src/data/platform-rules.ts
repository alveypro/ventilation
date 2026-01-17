// 自动从规则引擎 YAML 生成
export const platformRules = [
  {
    "id": "HM_RES_01",
    "type": "hard",
    "pattern": "(airsense\\s*10|\\bs10\\b).*aut(oset)?",
    "modelId": 1,
    "platformId": 1,
    "confidence": 95
  },
  {
    "id": "HM_RES_02",
    "type": "hard",
    "pattern": "(airsense\\s*11|\\bs11\\b).*aut(oset)?",
    "modelId": 2,
    "platformId": 1,
    "confidence": 95
  },
  {
    "id": "HM_RES_03",
    "type": "hard",
    "pattern": "(aircurve\\s*10).*vauto",
    "modelId": 3,
    "platformId": 2,
    "confidence": 95
  },
  {
    "id": "HM_RES_04",
    "type": "hard",
    "pattern": "(aircurve\\s*10).*\\bst\\b",
    "modelId": 4,
    "platformId": 2,
    "confidence": 92
  },
  {
    "id": "HM_RES_05",
    "type": "hard",
    "pattern": "(lumis\\s*150|lumis150).*\\bst\\b",
    "modelId": 5,
    "platformId": 2,
    "confidence": 92
  },
  {
    "id": "HM_RES_06",
    "type": "hard",
    "pattern": "\\bairmini\\b|air\\s*mini",
    "modelId": 6,
    "platformId": 1,
    "confidence": 92
  },
  {
    "id": "HM_PHI_01",
    "type": "hard",
    "pattern": "dreamstation\\s*2|\\bds2\\b",
    "modelId": 8,
    "platformId": 3,
    "confidence": 90
  },
  {
    "id": "HM_PHI_02",
    "type": "hard",
    "pattern": "dreamstation(?!\\s*2)|\\bds\\b.*auto",
    "modelId": 7,
    "platformId": 3,
    "confidence": 85
  },
  {
    "id": "HM_PHI_03",
    "type": "hard",
    "pattern": "bipap.*s/?t|\\bst\\b.*bipap",
    "modelId": 9,
    "platformId": 4,
    "confidence": 85
  },
  {
    "id": "HM_PHI_04",
    "type": "hard",
    "pattern": "trilogy\\s*100|trilogy100",
    "modelId": 10,
    "platformId": 4,
    "confidence": 90
  },
  {
    "id": "HM_BMC_01",
    "type": "hard",
    "pattern": "\\bg3a\\s*20\\b|g3\\s*a20",
    "modelId": 13,
    "platformId": 7,
    "confidence": 90
  },
  {
    "id": "HM_BMC_02",
    "type": "hard",
    "pattern": "\\bg3b\\s*25a\\b|g3\\s*b25a",
    "modelId": 14,
    "platformId": 7,
    "confidence": 90
  },
  {
    "id": "HM_BMC_03",
    "type": "hard",
    "pattern": "\\bg3b\\s*30vt\\b|g3\\s*b30vt",
    "modelId": 15,
    "platformId": 7,
    "confidence": 90
  },
  {
    "id": "HM_YUW_01",
    "type": "hard",
    "pattern": "yh[-\\s]?680d|680d.*鱼跃|鱼跃.*680d",
    "modelId": 16,
    "platformId": 9,
    "confidence": 88
  },
  {
    "id": "HM_YUW_02",
    "type": "hard",
    "pattern": "yh[-\\s]?730st|730st.*鱼跃|鱼跃.*730st",
    "modelId": 17,
    "platformId": 9,
    "confidence": 88
  },
  {
    "id": "HM_LOW_01",
    "type": "hard",
    "pattern": "prisma\\s*smart|prismasmart",
    "modelId": 11,
    "platformId": 5,
    "confidence": 85
  },
  {
    "id": "HM_BRE_01",
    "type": "hard",
    "pattern": "vivo\\s*45|vivo45",
    "modelId": 12,
    "platformId": 6,
    "confidence": 80
  },
  {
    "id": "PF_RES_10",
    "type": "platform",
    "pattern": "airsense\\s*(10|11)|\\bs10\\b|\\bs11\\b|aut(oset)?",
    "modelId": null,
    "platformId": 1,
    "confidence": 70
  },
  {
    "id": "PF_RES_NIV",
    "type": "platform",
    "pattern": "aircurve\\s*10|lumis|vpap",
    "modelId": null,
    "platformId": 2,
    "confidence": 70
  },
  {
    "id": "PF_PHI_DS",
    "type": "platform",
    "pattern": "dreamstation|\\bds2\\b|remstar",
    "modelId": null,
    "platformId": 3,
    "confidence": 65
  },
  {
    "id": "PF_PHI_NIV",
    "type": "platform",
    "pattern": "bipap|trilogy|avaps|autosv",
    "modelId": null,
    "platformId": 4,
    "confidence": 65
  },
  {
    "id": "PF_LOW",
    "type": "platform",
    "pattern": "prisma|lowenstein|weinmann|somno",
    "modelId": null,
    "platformId": 5,
    "confidence": 60
  },
  {
    "id": "PF_BRE",
    "type": "platform",
    "pattern": "breas|\\bvivo\\b",
    "modelId": null,
    "platformId": 6,
    "confidence": 60
  },
  {
    "id": "PF_BMC",
    "type": "platform",
    "pattern": "\\bbmc\\b|瑞迈特|\\bg3\\b|\\bgii\\b|\\by-\\d+\\b|\\bu-\\d+\\b",
    "modelId": null,
    "platformId": 7,
    "confidence": 60
  },
  {
    "id": "PF_YUW",
    "type": "platform",
    "pattern": "鱼跃|\\byh[-\\s]?\\d+\\b",
    "modelId": null,
    "platformId": 9,
    "confidence": 55
  },
  {
    "id": "RK_ASV_OVERCLAIM",
    "type": "platform",
    "pattern": "",
    "modelId": null,
    "platformId": null,
    "confidence": null
  },
  {
    "id": "RK_VT_OVERCLAIM",
    "type": "platform",
    "pattern": "",
    "modelId": null,
    "platformId": null,
    "confidence": null
  },
  {
    "id": "RK_PRICE_TOO_LOW",
    "type": "platform",
    "pattern": "",
    "modelId": null,
    "platformId": null,
    "confidence": null
  },
  {
    "id": "RK_KEYWORDS_REFURB",
    "type": "platform",
    "pattern": "",
    "modelId": null,
    "platformId": null,
    "confidence": null
  },
  {
    "id": "EV_NAMEPLATE_MATCH",
    "type": "platform",
    "pattern": "制造商.*resmed|philips|bmc|yuwell|lowenstein|breas",
    "modelId": null,
    "platformId": null,
    "confidence": null
  },
  {
    "id": "EV_SDCARD_SIGNATURE",
    "type": "platform",
    "pattern": "STR\\.edf|IDENTIFY|DATALOG|BMC",
    "modelId": null,
    "platformId": null,
    "confidence": null
  },
  {
    "id": "EV_UI_SIGNATURE",
    "type": "platform",
    "pattern": "(rotary|旋钮).*menu|prisma",
    "modelId": null,
    "platformId": 10,
    "confidence": 50
  }
]
