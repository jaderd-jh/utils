import type { Numeric, PageRes, Res, UnDef } from '../types'

const cnPhoneRE = /^1[3-9]\d{9}$/
const cnTelRE = /^0\d{9,11}$/

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
 * 是否是函数
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
 * 是否是空值/空数组/空对象 null undefined '' [] {} Set Map
 * @param val
 */
export const isEmpty = (val: UnDef<Numeric | boolean | Record<any, any> | Array<any> | Set<any> | Map<any, any>>) => {
  return (
    !isDef(val) ||
    val === '' ||
    (Array.isArray(val) && val.length === 0) ||
    (Object.prototype.toString.call(val) === '[object Object]' && Object.keys(val).length === 0) ||
    (val instanceof Map && val.size === 0) ||
    (val instanceof Set && val.size === 0)
  )
}

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
 * 包含非ASCII字符
 * @param text
 */
export const nonASCII = (text: string) => /[^\x20-\x7E]/.test(text)

/**
 * 校验接口返回code
 * @param res
 * @param code
 */
export const isValidResCode = (res: Res, code = 200) => res.code === code

/**
 * 校验接口返回内容
 * @param res
 * @param code
 */
export const isValidRes = (res: Res, code?: number) => isValidResCode(res, code) && isDef(res.data)

/**
 * 校验接口数组返回内容
 * @param res
 * @param code
 */
export const isValidArrRes = (res: Res<any[]>, code?: number) => isValidResCode(res, code) && Array.isArray(res.data)

/**
 * 校验接口分页返回内容
 * @param res
 * @param code
 */
export const isValidPageRes = (res: PageRes, code?: number) =>
  isValidResCode(res, code) && isDef(res.data) && Array.isArray(res.data.list || res.data.records)

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
