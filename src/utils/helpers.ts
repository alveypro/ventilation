/**
 * 通用工具函数
 */

const PRICE_BANDS = [
  { max: 4000, label: '¥2,000–4,000' },
  { max: 8000, label: '¥4,000–8,000' },
  { max: 12000, label: '¥8,000–12,000' },
  { max: 18000, label: '¥12,000–18,000' },
  { max: 25000, label: '¥18,000–25,000' },
  { max: 35000, label: '¥25,000–35,000' },
  { max: 50000, label: '¥35,000–50,000' },
]

export function getPriceBand(price: number): string {
  if (!price || price <= 0) return '待补充'
  const band = PRICE_BANDS.find(item => price <= item.max)
  return band ? band.label : '¥50,000+'
}

export function formatPriceRange(price: number): string {
  const band = getPriceBand(price)
  if (band === '待补充') return '价格区间：待补充'
  return `价格区间：${band}`
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall >= wait) {
      func(...args)
      lastCall = now
    }
  }
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any
  }

  if (obj instanceof Object) {
    const clonedObj: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 验证邮箱
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 验证电话号码
 */
export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 获取 URL 参数
 */
export function getUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(new URL(url).search)
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}
