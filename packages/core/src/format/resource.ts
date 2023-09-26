import { parseToJSON } from './core'
import { checkImg, isArrStr, isDef } from '../validate'
import type { MaybeArray, UnDef, Undefinable } from '../../types'
import type { AntdResource, ElResource, Resource, VantResource } from '../../types/upload'
import { getBaseAttachUrl } from './baseAttachUrl'

/**
 * 获取文件完整地址
 * @param url
 */
export const resUrl = (url: Undefinable<string>) => {
  if (!isDef(url)) return undefined
  if (/^https?:\/\//.test(url) || /^blob:/.test(url) || /^data:/.test(url)) {
    return url
  }
  const baseUrl = getBaseAttachUrl()
  if (!isDef(baseUrl)) {
    throw new Error('请先设置 import.meta\u200B.env.VITE_BASE_ATTACH_URL')
  }
  return `${baseUrl}/${url}`.replace(/([^:]\/)\/+/g, '$1')
}

/**
 * 统一文件字段内容
 * @param resource
 * @param type
 */
export const recoverFile = (resource: Resource, type?: 'vant' | 'antd' | 'el') => {
  const { uri, ...item } = resource
  if (type === 'vant')
    return {
      ...item,
      uri,
      url: resUrl(uri),
      content: resUrl(uri),
      isImage: checkImg(resource.name),
      message: '',
      deletable: false,
      reupload: false,
      status: 'done',
    } as VantResource
  if (type === 'el') return { ...item, uri, url: resUrl(uri), percentage: 100, status: 'success' } as ElResource
  return {
    ...item,
    uri,
    url: resUrl(uri),
    uid: uri,
    percent: 100,
    thumbUrl: resUrl(uri),
    status: 'done',
  } as AntdResource
}

/**
 * 附件格式
 * @param data
 * @param type 格式类型：'vant' | 'antd' | 'el'
 */
export const attachFmt = (data: UnDef<MaybeArray<Resource>> | string, type?: 'vant' | 'antd' | 'el') => {
  let attachList: Resource[] = []
  const prototype = Object.prototype.toString.call(data)
  // null 或 undefined
  if (!data) attachList = []
  // Upload.Resource[]
  else if (Array.isArray(data)) attachList = data.filter(Boolean)
  // 字符串
  else if (typeof data === 'string') {
    // Upload.Resource[] string
    if (isArrStr(data)) {
      attachList = (parseToJSON<Resource[]>(data) || []).filter(Boolean)
    } else {
      const jsonData = parseToJSON<Resource | string>(data)
      const prototypeJson = Object.prototype.toString.call(jsonData)
      // Upload.Resource string
      if (prototypeJson === '[object Object]') attachList = [jsonData as Resource].filter(Boolean)
      // 单个uri string
      else attachList = [{ id: data, name: 'name', uri: data, group: 'default' }]
    }
  }
  // Upload.Resource
  else if (prototype === '[object Object]') attachList = [data]
  return attachList.map(item => recoverFile(item, type || 'antd'))
}
