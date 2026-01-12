export type DeviceType = 'PAP_SLEEP' | 'NIV_HOME' | 'PAP_TRAVEL'

export type ProductModelMeta = {
  modelName: string
  aliasNames?: string[]
  platformFamily?: string
  deviceType: DeviceType
  status?: '在售' | '停产' | '不明'
  modeTags?: string[]
  epapMin?: number
  epapMax?: number
  ipapMin?: number
  ipapMax?: number
  backupRate?: boolean
  targetVentilation?: boolean
  asv?: boolean
  humidifier?: '无' | '一体' | '可选'
  heatedTube?: '不支持' | '支持' | '可选'
  noiseDb?: string
  weightKg?: number
  connectivity?: string[]
  power?: string[]
  channels?: string[]
  refurbRisk?: '低' | '中' | '高'
  overclaimRisk?: '低' | '中' | '高'
  notes?: string
}

export const productCatalog: ProductModelMeta[] = [
  {
    modelName: 'AirSense 10 AutoSet',
    platformFamily: 'ResMed AirSense',
    deviceType: 'PAP_SLEEP',
    modeTags: ['APAP', 'CPAP'],
    epapMin: 4,
    epapMax: 20,
    backupRate: false,
    targetVentilation: false,
    humidifier: '一体',
    heatedTube: '支持',
    connectivity: ['SD', '云'],
    channels: ['电商', '线下', '灰市', '二手'],
    refurbRisk: '中',
    overclaimRisk: '低',
  },
  {
    modelName: 'AirCurve 10 ST',
    platformFamily: 'ResMed AirCurve',
    deviceType: 'NIV_HOME',
    modeTags: ['S', 'ST'],
    ipapMax: 25,
    backupRate: true,
    targetVentilation: false,
    refurbRisk: '中',
    overclaimRisk: '低',
  },
  {
    modelName: 'Lumis 150 ST',
    platformFamily: 'ResMed Lumis',
    deviceType: 'NIV_HOME',
    modeTags: ['S', 'ST', 'iVAPS'],
    backupRate: true,
    targetVentilation: true,
    refurbRisk: '中',
    overclaimRisk: '低',
  },
]
