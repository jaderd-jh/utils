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
export const recoverFile = (resource: Partial<Resource>, type?: 'vant' | 'antd' | 'el') => {
  const { uri, ...item } = resource
  const common = { ...item, uri, url: resUrl(uri) }
  if (type === 'vant')
    return {
      ...common,
      isImage: checkImg(resource?.name),
      deletable: true,
      reupload: false,
      status: 'done',
    }
  if (type === 'el') return { ...common, percentage: 100, status: 'success' }
  return { ...common, uid: uri, percent: 100, thumbUrl: resUrl(uri), status: 'done' }
}

/**
 * 附件格式
 * @param data
 * @param type 格式类型：'vant' | 'antd' | 'el' ，默认 antd
 */
export const attachFmt = (data: UnDef<MaybeArray<Partial<Resource>>> | string, type?: 'vant' | 'antd' | 'el') => {
  let attachList: Partial<Resource>[] = []
  const prototype = Object.prototype.toString.call(data)
  // null 或 undefined
  if (!data) attachList = []
  // Upload.Resource[]
  else if (Array.isArray(data)) attachList = data.filter(item => Object.keys(item).length > 0)
  // 字符串
  else if (typeof data === 'string') {
    // Upload.Resource[] string
    if (isArrStr(data)) {
      attachList = (parseToJSON<Resource[]>(data) || []).filter(item => Object.keys(item).length > 0)
    } else {
      const jsonData = parseToJSON<Resource | string>(data)
      const prototypeJson = Object.prototype.toString.call(jsonData)
      // Upload.Resource string
      if (prototypeJson === '[object Object]')
        attachList = [jsonData as Resource].filter(item => Object.keys(item).length > 0)
      // 单个uri string
      else attachList = [{ id: data, name: data, uri: data, group: 'default' }]
    }
  }
  // Upload.Resource
  else if (prototype === '[object Object]') attachList = [data].filter(item => Object.keys(item).length > 0)
  return attachList.map(item => recoverFile(item, type || 'antd'))
}

export const vantAttachFmt = (data: UnDef<MaybeArray<Partial<Resource>>> | string) =>
  attachFmt(data, 'vant') as VantResource[]

export const antdAttachFmt = (data: UnDef<MaybeArray<Partial<Resource>>> | string) =>
  attachFmt(data, 'antd') as AntdResource[]

export const elAttachFmt = (data: UnDef<MaybeArray<Partial<Resource>>> | string) =>
  attachFmt(data, 'el') as ElResource[]
