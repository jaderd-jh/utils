import type { Numeric, UnDef } from '../../types'
import { isDef } from './core'

export const cnPhoneRE = /^1[3-9]\d{9}$/
export const cnTelRE = /^0\d{2,3}-?\d{7,8}$/
export const cnTelRE2 = /^\(0\d{2,3}\)\d{7,8}$/
export const cnUSCIRE = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
export const cnIdCard15Re = /^[1-9]\d{7}(?:0[1-9]|10|11|12)(?:[0-2][1-9]|10|20|30|31)\d{2}[\dX]$/i
export const cnIdCard18Re = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:[0-2][1-9]|10|20|30|31)\d{3}[\dX]$/i
export const emailRE = /^[a-z\d](?:\w|-)+@[a-z\d]+\.[a-z]{2,5}$/i

/**
 * 是否是[统一社会信用代码](https://zh.wikipedia.org/zh-cn/%E7%BB%9F%E4%B8%80%E7%A4%BE%E4%BC%9A%E4%BF%A1%E7%94%A8%E4%BB%A3%E7%A0%81)
 * @example
 * ```ts
 * isUSCI('91350100M000100Y43') // true
 * ```
 * @param {UnDef<string>} val - 待校验的值
 * @returns {boolean} 是否是统一社会信用代码
 */
export const isUSCI = (val: UnDef<string>): boolean => {
  if (!isDef(val)) return false
  return cnUSCIRE.test(val)
}

/**
 * 是否是中国手机号
 * @param val
 */
export const isPhone = (val: UnDef<Numeric>) => {
  if (!isDef(val)) return false
  return cnPhoneRE.test(val.toString())
}

/**
 * 是否是中国座机号
 * @param val
 */
export const isTel = (val: UnDef<Numeric>) => {
  if (!isDef(val)) return false
  const valStr = val.toString().replaceAll(' ', '')
  return cnTelRE.test(valStr) || cnTelRE2.test(valStr)
}

/**
 * 是否是邮箱
 * @param val
 */
export const isEmail = (val: UnDef<string>) => {
  if (!isDef(val)) return false
  return emailRE.test(val)
}

/**
 * 是否是身份证
 * @param {string|null|undefined} val 身份证号
 * @param {boolean} compatible 兼容15位
 */
export const isIdCard = (val: UnDef<string>, compatible = true) => {
  if (!isDef(val)) return false
  return cnIdCard18Re.test(val) || (compatible ? cnIdCard15Re.test(val) : false)
}

/**
 * 是否是数字或字符
 * @param val
 */
export const isNumeric = (val: UnDef<Numeric>): val is string => {
  if (isDef(val)) return typeof val === 'number' || /^\d+(?:\.\d+)?$/.test(val)
  return false
}

/**
 * 是否是需要的图片格式
 * @param ext
 */
export const checkImg = (ext?: string) => {
  return /\.(?:jpg|jpeg|png|gif)$/.test((ext || '').toLowerCase())
}

/**
 * 包含非ASCII字符
 * @param text
 */
export const nonASCII = (text: string) => /[^\x20-\x7E]/.test(text)

/**
 * 校验文件类型
 * 1. XXX/YYY 2. .xxx 3. XXX/* 4.*
 * @param {File} file 需要校验的文件
 * @param {string} type 文件类型, 与input.accept一致
 */
export const isValidFileType = (file: File, type: string) => {
  if (type === '*') return true

  const fileType = file.type
  const fileName = file.name

  /**
   * 校验
   * @param item
   */
  function validate(item: string) {
    if (item.startsWith('.')) {
      return fileName.endsWith(item)
    }
    if (item.endsWith('/*')) {
      return fileType.startsWith(item.replace('/*', ''))
    }
    if (item.includes('/')) {
      return fileType === item
    }
    return false
  }

  const typeArrStr = type.split(',').map(item => item.trim())
  if (typeArrStr.length > 1) {
    return typeArrStr.some(validate)
  }
  return validate(type)
}
