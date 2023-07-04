import type { NullOrUndefinable, Numeric, PageRes, Res } from '../types'

const cnPhoneRE = /^1[3-9]\d{9}$/
const cnTelRE = /^0\d{9,11}$/

/**
 * 是否有意义的值
 * @param val
 */
export const isDef = <T>(val: T): val is NonNullable<T> => val !== undefined && val !== null

/**
 * 是否是数字或字符
 * @param val
 */
export const isNumeric = (val: Numeric): val is string => typeof val === 'number' || /^\d+(?:\.\d+)?$/.test(val)

/**
 * 是否是需要的图片格式
 * @param ext
 */
export const checkImg = (ext?: string) => {
  return /\.(?:jpg|jpeg|png|gif)$/.test((ext || '').toLowerCase())
}

/**
 * 判断是否合法JSON字符串
 * @param str
 */
export const isJSONStr = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 判断是否合法JSON数组字符串
 * @param str
 */
export const isArrStr = (str: string) => {
  try {
    return Array.isArray(JSON.parse(str))
  } catch (e) {
    return false
  }
}

export const isValidKey = (key: string | number | symbol, object: object): key is keyof typeof object => key in object

/**
 * 是否是中国手机号
 * @param val
 */
export const isPhone = (val: NullOrUndefinable<Numeric>) => {
  if (!isDef(val)) return false
  return cnPhoneRE.test(val.toString())
}

/**
 * 是否是中国座机号
 * @param val
 */
export const isTel = (val: NullOrUndefinable<Numeric>) => {
  if (!isDef(val)) return false
  return cnTelRE.test(val.toString())
}

/**
 * 包含非ASCII字符
 * @param text
 */
export const nonASCII = (text: string) => /[^\x20-\x7E]/.test(text)

/**
 * 校验接口返回内容
 * @param res
 */
export const isValidRes = (res: Res) => res.code === 200 && res.data

/**
 * 校验接口数组返回内容
 * @param res
 */
export const isValidArrRes = (res: Res<any[]>) => res.code === 200 && Array.isArray(res.data)

/**
 * 校验接口分页返回内容
 * @param res
 */
export const isValidPageRes = (res: PageRes) =>
  res.code === 200 && res.data && Array.isArray(res.data.list || res.data.records)
