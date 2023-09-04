import { isDef } from '../validate'
import type { NullOrUndefinable } from '../../types'

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
 * @param currency
 * @param fraction
 */
export const currencyFmt = (currency: NullOrUndefinable<number | bigint>, fraction = 0) => {
  if (!isDef(currency)) return ''
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: fraction }).format(
    currency
  )
}
