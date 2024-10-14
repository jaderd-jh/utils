import type { Nullable } from '../../types'
import { isDate, isJSONStr, isMap, isSet } from '../validate'

/**
 * JSON 字符串转对象
 * @template T - 解析数据类型
 * @param {string} str - JSON字符串
 * @param {(this: any, key: string, value: any) => any} reviverFn - 解析函数
 * @returns {Nullable<T>} 解析后的对象
 * @deprecated 请使用 `parseJSON`
 */
export function parseToJSON<T = any>(
  str: string,
  reviverFn?: (this: any, key: string, value: any) => any
): Nullable<T> {
  return isJSONStr(str) ? JSON.parse(str, reviverFn) : null
}

/**
 * JSON 字符串转对象
 * @alias parseToJSON
 * @template T - 解析数据类型
 * @param {string} str - JSON字符串
 * @param {(this: any, key: string, value: any) => any} reviverFn - 解析函数
 * @returns {Nullable<T>} 解析后的对象
 */
export function parseJSON<T = any>(
  str: string,
  reviverFn: (this: any, key: string, value: any) => any = reviver
): Nullable<T> {
  return isJSONStr(str) ? JSON.parse(str, reviverFn) : null
}

/**
 * 对象转 JSON 字符串
 * @param {any} value - 对象
 * @param {(this: any, key: string, value: any) => any} replacerFn - 替换函数
 * @returns {string} JSON 字符串
 */
export function stringifyJSON(value: any, replacerFn: (this: any, key: string, value: any) => any = replacer): string {
  return JSON.stringify(value, replacerFn)
}

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
