import type { Numeric, UnDef } from '../../types'

/**
 * 检测变量类型
 * @param {any} val 检测的目标
 */
export const getVariableType = (val: any) => {
  const value = Object.prototype.toString.call(val)
  const result = value.match(/\[object (\S*)\]/)?.[1]
  return result?.toLocaleLowerCase()
}

/**
 * 是否是数字
 * @param {any} val 检测的目标
 */
export const isNumber = (val: any): val is number => getVariableType(val) === 'number'

/**
 * 是否是任意精度整数
 * @param {any} val 检测的目标
 */
export const isBigInt = (val: any): val is bigint => getVariableType(val) === 'bigint'

/**
 * 是否是字符串
 * @param {any} val 检测的目标
 */
export const isString = (val: any): val is string => getVariableType(val) === 'string'

/**
 * 是否是布尔值
 * @param {any} val 检测的目标
 */
export const isBoolean = (val: any): val is boolean => getVariableType(val) === 'boolean'

/**
 * 是否是null
 * @param {any} val 检测的目标
 */
export const isNull = (val: any): val is null => getVariableType(val) === 'null'

/**
 * 是否是undefined
 * @param {any} val 检测的目标
 */
export const isUndefined = (val: any): val is undefined => getVariableType(val) === 'undefined'

/**
 * 是否是symbol
 * @param {any} val 检测的目标
 */
export const isSymbol = (val: any): val is symbol => getVariableType(val) === 'symbol'

/**
 * 是否是对象
 * @param {any} val 检测的目标
 */
export const isObject = (val: any): val is Record<any, any> => getVariableType(val) === 'object'

/**
 * 是否是数组
 * @param {any} val 检测的目标
 */
export const isArray = (val: any): val is Array<any> => getVariableType(val) === 'array'

/**
 * 是否是函数，但也有可能是Class
 * @param {any} val 检测的目标
 */
export const isFunction = (val: any): val is Function => getVariableType(val) === 'function'

/**
 * 是否是日期
 * @param {any} val 检测的目标
 */
export const isDate = (val: any): val is Date => getVariableType(val) === 'date'

/**
 * 是否是正则
 * @param {any} val 检测的目标
 */
export const isRegExp = (val: any): val is RegExp => getVariableType(val) === 'regexp'

/**
 * 是否是期望（Promise）
 * @param {any} val 检测的目标
 */
export const isPromise = (val: any): val is Promise<any> => getVariableType(val) === 'promise'

/**
 * 是否是集合（Set）
 * @param {any} val 检测的目标
 */
export const isSet = (val: any): val is Set<any> => getVariableType(val) === 'set'

/**
 * 是否是映射（Map）
 * @param {any} val 检测的目标
 */
export const isMap = (val: any): val is Map<any, any> => getVariableType(val) === 'map'

/**
 * 是否是弱集合（WeakSet）
 * @param {any} val 检测的目标
 */
export const isWeakSet = (val: any): val is WeakSet<any> => getVariableType(val) === 'weakset'

/**
 * 是否是弱映射（WeakMap）
 * @param {any} val 检测的目标
 */
export const isWeakMap = (val: any): val is WeakMap<any, any> => getVariableType(val) === 'weakmap'

/**
 * 是否是File
 * @param {any} val 检测的目标
 */
export const isFile = (val: any): val is File => getVariableType(val) === 'file'

/**
 * 是否是Blob
 * @param {any} val 检测的目标
 */
export const isBlob = (val: any): val is Blob => getVariableType(val) === 'blob'

/**
 * 是否是URL
 * @param {any} val 检测的目标
 */
export const isURL = (val: any): val is URL => getVariableType(val) === 'url'

/**
 * 是否是错误（Error）
 * @param {any} val 检测的目标
 */
export const isError = (val: any): val is Error => getVariableType(val) === 'error'

/**
 * 是否既不是 null 也不是 undefined
 * @param {any} val 检测的目标
 */
export const isDef = <T>(val: T): val is NonNullable<T> => !isNull(val) && !isUndefined(val)

/**
 * 判断是否合法JSON字符串
 * @param str
 */
export const isJSONStr = (str: UnDef<string>) => {
  if (isDef(str))
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  return false
}

/**
 * 判断是否合法JSON数组字符串
 * @param str
 */
export const isArrStr = (str: UnDef<string>) => {
  if (isDef(str))
    try {
      return Array.isArray(JSON.parse(str))
    } catch (e) {
      return false
    }
  return false
}

/**
 * 判断是否有效的key
 * @param {string | number | symbol} key 键名
 * @param {object} object 对象
 * @example
 *
 * ```ts
 * const obj = { a: 1, b: 2 }
 * isValidKey('a', obj) // true
 * ```
 * @returns {boolean} boolean
 */
export const isValidKey = (key: string | number | symbol, object: object): key is keyof typeof object => key in object

/**
 * 是否是空值/空数组/空对象 null undefined '' [] {} Set Map
 * @param val
 */
export const isEmpty = (val: UnDef<Numeric | boolean | Record<any, any> | Array<any> | Set<any> | Map<any, any>>) => {
  return (
    !isDef(val) ||
    val === '' ||
    (isArray(val) && val.length === 0) ||
    (isObject(val) && Object.keys(val).length === 0) ||
    (isMap(val) && val.size === 0) ||
    (isSet(val) && val.size === 0)
  )
}
