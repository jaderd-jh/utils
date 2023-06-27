import { isJSONStr } from './validate'

/**
 * Json字符串转对象
 * @param str
 * @param reviver
 */
export const parseToJSON = <T = any>(str: string, reviver?: (this: any, key: string, value: any) => any): T | null =>
  isJSONStr(str) ? JSON.parse(str, reviver) : null

/**
 * JSON.stringify() second param
 * @param _
 * @param value
 */
export const replacer = (_: any, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value],
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
  }
  return value
}

/**
 * 过滤obj中仅包括keys的部分
 * @param {Record<string,any>} obj 对象
 * @param {string[]} keys 属性
 * @param {boolean} reverse 为true时过滤取反
 */
export const filterObj = (obj: Record<string, any>, keys: string[], reverse = false) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => (reverse ? !keys.includes(key) : keys.includes(key))))
