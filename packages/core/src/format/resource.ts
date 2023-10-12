import { parseToJSON } from './core'
import { checkImg, isArrStr, isDef, isEmpty, isObject } from '../validate'
import type { MaybeArray, UnDef, Undefinable, UploadUiType } from '../../types'
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
    } as VantResource
  if (type === 'el') return { ...common, percentage: 100, status: 'success' } as ElResource
  return { ...common, uid: uri, percent: 100, thumbUrl: resUrl(uri), status: 'done' } as AntdResource
}

/**
 * 原始附件格式
 * @param data
 */
export function attachToArray(data: UnDef<MaybeArray<Partial<Resource>>> | string) {
  let attachList: Partial<Resource>[] = []
  // null 或 undefined
  if (!data) attachList = []
  // Upload.Resource[]
  else if (Array.isArray(data)) attachList = data
  // 字符串
  else if (typeof data === 'string') {
    // Upload.Resource[] string
    if (isArrStr(data)) {
      attachList = parseToJSON<Resource[]>(data) || []
    } else {
      const jsonData = parseToJSON<Resource | string>(data)
      // Upload.Resource string
      if (isObject(jsonData)) attachList = [jsonData as Resource]
      // 单个uri string
      else attachList = [{ id: data, name: data, uri: data, group: 'default' }]
    }
  }
  // Upload.Resource
  else if (isObject(data)) attachList = [data]
  return attachList.filter(item => !isEmpty(item))
}

export function attachFmt(data: UnDef<MaybeArray<Partial<Resource>>> | string): AntdResource[]

export function attachFmt(data: UnDef<MaybeArray<Partial<Resource>>> | string, type?: 'vant'): VantResource[]

export function attachFmt(data: UnDef<MaybeArray<Partial<Resource>>> | string, type?: 'antd'): AntdResource[]

export function attachFmt(data: UnDef<MaybeArray<Partial<Resource>>> | string, type?: 'el'): ElResource[]

/**
 * 附件格式
 * @param data
 * @param type 格式类型：'vant' | 'antd' | 'el' ，默认 antd
 */
export function attachFmt(data: UnDef<MaybeArray<Partial<Resource>>> | string, type?: UploadUiType) {
  const attachArr = attachToArray(data)
  return attachArr.map(item => recoverFile(item, type || 'antd'))
}
