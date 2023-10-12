type VantUploadFileStatus = '' | 'uploading' | 'done' | 'failed'
type AntdUploadFileStatus = 'removed' | 'uploading' | 'done' | 'error'
type ElementPlusUploadFileStatus = 'ready' | 'uploading' | 'success' | 'fail'

export type UploadUiType = 'vant' | 'antd' | 'el'

export interface Resource {
  /** origin */
  group: string
  id: string
  name: string
  uri: string
  /** extend */
  url?: string
  size?: number
}

export interface VantResource extends Resource {
  isImage?: boolean
  deletable?: boolean
  reupload?: boolean
  status?: VantUploadFileStatus
}
export interface AntdResource extends Resource {
  uid?: string
  percent?: number
  thumbUrl?: string
  status?: AntdUploadFileStatus
}

export interface ElResource extends Resource {
  percentage?: number
  status?: ElementPlusUploadFileStatus
}
