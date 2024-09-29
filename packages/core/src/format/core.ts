import type { Nullable } from '../../types'
import { isDate, isJSONStr, isMap, isSet } from '../validate'

/**
 * Json字符串转对象
 * @param str
 * @param reviverFn
 */
export const parseToJSON = <T = any>(
  str: string,
  reviverFn: (this: any, key: string, value: any) => any = reviver
): Nullable<T> => (isJSONStr(str) ? JSON.parse(str, reviverFn) : null)

/**
 * 对象转JSON字符串
 * @param value
 * @param replacerFn
 */
export const stringifyFromJSON = (
  value: any,
  replacerFn: (this: any, key: string, value: any) => any = replacer
): string => JSON.stringify(value, replacerFn)

/**
 * JSON.stringify() second param
 * @param _key
 * @param value
 */
export function replacer(_key: any, value: any) {
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
 * @param _key
 * @param value
 */
export function reviver(_key: any, value: any) {
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
