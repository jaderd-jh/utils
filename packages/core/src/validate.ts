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
 * 是否是邮箱
 * @param val
 */
export const isEmail = (val: NullOrUndefinable<string>) => {
  if (!isDef(val)) return false
  const reg = /^[a-zA-Z\d](?:\w|-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,5}$/
  return reg.test(val)
}

/**
 * 是否是身份证
 * @param val 身份证号
 */
export const isIdCard = (val: NullOrUndefinable<string>) => {
  if (!isDef(val)) return false
  const card15 = /^[1-9]\d{7}(?:0[1-9]|10|11|12)(?:[0-2][1-9]|10|20|30|31)\d{2}[\dXx]$/
  const card18 = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:[0-2][1-9]|10|20|30|31)\d{3}[\dXx]$/
  return card15.test(val) || card18.test(val)
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
export const isValidRes = (res: Res) => res.code === 200 && isDef(res.data)

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
