import type { Numeric, UnDef } from '../../types'
import { isDef } from './core'

const cnPhoneRE = /^1[3-9]\d{9}$/
const cnTelRE = /^0\d{9,11}$/

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
  return cnTelRE.test(val.toString())
}

/**
 * 是否是邮箱
 * @param val
 */
export const isEmail = (val: UnDef<string>) => {
  if (!isDef(val)) return false
  const reg = /^[a-zA-Z\d](?:\w|-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,5}$/
  return reg.test(val)
}

/**
 * 是否是身份证
 * @param {string|null|undefined} val 身份证号
 * @param {boolean} compatible 兼容15位
 */
export const isIdCard = (val: UnDef<string>, compatible = true) => {
  if (!isDef(val)) return false
  const card15 = /^[1-9]\d{7}(?:0[1-9]|10|11|12)(?:[0-2][1-9]|10|20|30|31)\d{2}[\dXx]$/
  const card18 = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:[0-2][1-9]|10|20|30|31)\d{3}[\dXx]$/
  return card18.test(val) || (compatible ? card15.test(val) : false)
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
