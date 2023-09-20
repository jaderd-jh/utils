import { isDef } from '../validate'
import type { Numeric, UnDef } from '../../types'

/**
 * 千位分隔符
 * @param num
 */
export const toThousands = (num: number) => {
  const arr = num.toString().split('.')
  const integer = arr[0]?.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  if (arr.length > 1) return `${integer}.${arr[1]}`
  return integer
}

/**
 * 货币格式化
 * @param {number | string | bigint} currency - 金额
 * @param {number} [maximumFractionDigits] - 小数位数
 */
export const currencyFmt = (currency: UnDef<Numeric | bigint>, maximumFractionDigits: number = 2) => {
  if (!isDef(currency)) return ''
  const num = Number(currency)
  if (Number.isNaN(num)) return ''
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits }).format(num)
}
