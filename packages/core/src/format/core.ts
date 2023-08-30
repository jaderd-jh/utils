import { isArrStr, isJSONStr } from '../validate'
import type { NullOrUndefinable, Nullable } from '../../types'
import { getBaseAttachUrl } from './baseAttachUrl'

/**
 * 获取文件完整地址
 * @param url
 */
export const resUrl = (url?: string) => {
  if (typeof url !== 'string') return undefined
  if (url.includes('http://') || url.includes('https://')) {
    return url
  }
  const baseUrl = getBaseAttachUrl()
  if (!baseUrl) {
    throw new Error('请先设置环境变量VITE_BASE_ATTACH_URL')
  }
  return `${baseUrl}/${url}`
}

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
export const filterObj = (obj: Record<string, any>, keys: string[], reverse: boolean = false) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => (reverse ? !keys.includes(key) : keys.includes(key))))

/**
 * 千位分隔符
 * @param num
 */
export const toThousands = (num: number) => {
  const arr = num.toString().split('.')
  const integer = arr[0]?.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  if (arr.length > 1) return `${integer}.${arr[1]}`
  return integer
}

/**
 * 统一文件字段内容
 * @param fileList
 */
export const recoverFile = (fileList: Upload.Resource[]) =>
  fileList.map(file => {
    const { uri, url, ...item } = file
    return {
      ...item,
      url: resUrl(uri || url),
      content: resUrl(uri || url),
      uri: uri || url || '',
      status: 'done',
      percent: 100,
    }
  })

/**
 * 附件格式
 * @param data
 */
type ArrayLike<T = any> = T | Array<T>
export const attachFmt = (data: NullOrUndefinable<ArrayLike<Upload.Resource>> | string) => {
  let attachList: Upload.Resource[] = []
  const prototype = Object.prototype.toString.call(data)
  // null 或 undefined
  if (!data) attachList = []
  // Upload.Resource[]
  else if (Array.isArray(data)) attachList = data.filter(Boolean)
  // 字符串
  else if (typeof data === 'string') {
    // Upload.Resource[] string
    if (isArrStr(data)) {
      attachList = (parseToJSON<Upload.Resource[]>(data) || []).filter(Boolean)
    } else {
      const jsonData = parseToJSON<Upload.Resource | string>(data)
      const prototypeJson = Object.prototype.toString.call(jsonData)
      // Upload.Resource string
      if (prototypeJson === '[object Object]') attachList = [jsonData as Upload.Resource].filter(Boolean)
      // 单个uri string
      else attachList = [{ id: data, name: 'name', uri: data }]
    }
  }
  // Upload.Resource
  else if (prototype === '[object Object]') attachList = [data]
  return recoverFile(attachList)
}
