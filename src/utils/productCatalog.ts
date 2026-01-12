import { productCatalog } from '@/data/product-catalog'
import type { Product } from '@/types'

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, '')

const matchesModel = (productName: string, modelName: string, aliases?: string[]) => {
  const name = normalize(productName)
  const target = normalize(modelName)
  if (name.includes(target) || target.includes(name)) return true
  if (aliases?.some(alias => normalize(alias) === name || name.includes(normalize(alias)))) return true
  return false
}

export const enrichProductsWithCatalog = (products: Product[]) => {
  return products.map(product => {
    const matched = productCatalog.find(model => matchesModel(product.name, model.modelName, model.aliasNames))
    if (!matched) return product
    return {
      ...product,
      deviceType: matched.deviceType ?? product.deviceType,
      platformFamily: matched.platformFamily ?? product.platformFamily,
      status: matched.status ?? product.status,
      modeTags: matched.modeTags ?? product.modeTags,
      epapMin: matched.epapMin ?? product.epapMin,
      epapMax: matched.epapMax ?? product.epapMax,
      ipapMin: matched.ipapMin ?? product.ipapMin,
      ipapMax: matched.ipapMax ?? product.ipapMax,
      backupRate: matched.backupRate ?? product.backupRate,
      targetVentilation: matched.targetVentilation ?? product.targetVentilation,
      asv: matched.asv ?? product.asv,
      humidifier: matched.humidifier ?? product.humidifier,
      heatedTube: matched.heatedTube ?? product.heatedTube,
      noiseDb: matched.noiseDb ?? product.noiseDb,
      weightKg: matched.weightKg ?? product.weightKg,
      connectivity: matched.connectivity ?? product.connectivity,
      power: matched.power ?? product.power,
      channels: matched.channels ?? product.channels,
      refurbRisk: matched.refurbRisk ?? product.refurbRisk,
      overclaimRisk: matched.overclaimRisk ?? product.overclaimRisk,
    }
  })
}
