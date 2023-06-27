import { isDef, isPhone, isTel } from './validate'
import type { NullOrUndefinable } from '../types'

/**
 * 隐藏手机号
 * @param str
 */
export const hidePhone = (str: NullOrUndefinable<string>) => {
  if (str) {
    if (isPhone(str)) {
      return str.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    if (isTel(str)) {
      return str.replace(/^(\d{3,4})-?\d{3,4}(\d{4})$/, '$1****$2')
    }
    return str
  }
  return ''
}

/**
 * 隐藏身份证号
 * @param cardNo
 */
export const hideCardNo = (cardNo: NullOrUndefinable<string>) => {
  if (cardNo) {
    return cardNo.replace(/^(.{4})\d+(.{2})$/, '$1*******$2')
  }
  return ''
}

/**
 * 隐藏姓名
 * @param name
 */
export const hideName = (name: NullOrUndefinable<string>) => {
  if (name) {
    let res = ''
    for (let i = 0; i < name.length; i += 1) {
      if (i === 0) {
        res += '*'
      } else {
        res += name[i]
      }
    }
    return res
  }
  return ''
}
/**
 * 隐藏中间部分
 * @param str
 */
export const hideMiddle = (str: NullOrUndefinable<string>): string => {
  if (!isDef(str)) return ''
  const len = str.length
  if (len === 1) return '*'
  if (len === 2) return '**'
  return str[0] + '*'.repeat(len - 2) + str[len - 1]
}

/**
 * 隐藏首尾仅保留中间3分之1
 * @param str
 */
export const hideThird = (str: NullOrUndefinable<string>): string => {
  if (!isDef(str)) return ''
  const len = str.length
  const partLen = Math.round(len / 3)
  if (len === 1) return '*'
  if (len === 2) return '**'
  return str.slice(0, partLen) + '*'.repeat(len - 2 * partLen) + str.slice(len - partLen)
}
