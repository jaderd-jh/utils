import type { Nullable } from '../../types'
import { isDate, isJSONStr, isMap, isSet } from '../validate'

/**
 * Json字符串转对象
 * @param str
 * @param reviver
 */
export const parseToJSON = <T = any>(
  str: string,
  reviver?: (this: any, key: string, value: any) => any
): Nullable<T> => (isJSONStr(str) ? JSON.parse(str, reviver) : null)

/**
 * JSON.stringify() second param
 * @param _
 * @param value
 */
export const replacer = (_: any, value: any) => {
  if (isMap(value)) {
    return {
      dataType: 'Map',
      value: [...value],
    }
  }
  if (isSet(value)) {
    return {
      dataType: 'Set',
      value: [...value],
    }
  }
  if (isDate(value)) {
    return {
      dataType: 'Date',
      value: value.toISOString(),
    }
  }
  return value
}

/**
 * JSON.parse() second param
 * @param _
 * @param value
 */
export const reviver = (_: any, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value)
    }
    if (value.dataType === 'Set') {
      return new Set(value.value)
    }
    if (value.dataType === 'Date') {
      return new Date(value.value)
    }
  }
  return value
}

/**
 * 过滤obj中仅包括keys的部分
 * @param {Record<string,any>} obj 对象
 * @param {string[]} keys 属性
 * @param {boolean} reverse 为true时过滤取反
 */
export const filterObj = (obj: Record<string, any>, keys: string[], reverse: boolean = false) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => (reverse ? !keys.includes(key) : keys.includes(key))))
