import { isDef, isPhone, isTel } from './validate'
import type { NullOrUndefinable } from '../types'

/**
 * 隐藏手机号
 * @param {string} phone 手机号
 */
export const hidePhone = (phone: NullOrUndefinable<string>) => {
  if (phone) {
    if (isPhone(phone)) {
      return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    if (isTel(phone)) {
      return phone.replace(/^(\d{3,4})-?\d{3,4}(\d{4})$/, '$1****$2')
    }
    return phone
  }
  return ''
}

/**
 * 隐藏身份证号
 * @param {string} cardNo 身份证号
 */
export const hideCardNo = (cardNo: NullOrUndefinable<string>) => {
  if (cardNo) {
    return cardNo.replace(/^(.{4})\d+(.{2})$/, '$1*******$2')
  }
  return ''
}

/**
 * 隐藏姓名第一个字
 * @param {string} name 姓名
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
 * 隐藏邮箱
 * @param {string} email 邮箱
 */
export const hideEmail = (email: NullOrUndefinable<string>) => {
  if (email) {
    if (!email.includes('@')) return ''

    const arr = email.split('@')
    const name = arr[0]
    const domain = arr[1]
    const len = name?.length

    if (!len) return email

    if (len === 1) {
      return `*@${domain}`
    }
    if (len === 2) {
      return `${name[0]}*@${domain}`
    }
    return `${name[0] + '*'.repeat(len - 1)}@${domain}`
  }
  return ''
}

/**
 * 隐藏中间部分
 * @param {string} str 需要隐藏的字符串
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
 * @param {string} str 需要隐藏的字符串
 */
export const hideThird = (str: NullOrUndefinable<string>): string => {
  if (!isDef(str)) return ''
  const len = str.length
  const partLen = Math.round(len / 3)
  if (len === 1) return '*'
  if (len === 2) return '**'
  return str.slice(0, partLen) + '*'.repeat(len - 2 * partLen) + str.slice(len - partLen)
}
