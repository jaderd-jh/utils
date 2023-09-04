type VantUploadFileStatus = '' | 'uploading' | 'done' | 'failed'
type AntdUploadFileStatus = 'removed' | 'uploading' | 'done' | 'error'
type ElementPlusUploadFileStatus = 'ready' | 'uploading' | 'success' | 'fail'

export interface Resource {
  /** origin */
  group: string
  id: string
  name: string
  uri: string
  /** extend */
  url?: string
  size?: number
  uid?: string
  status?: VantUploadFileStatus | AntdUploadFileStatus | ElementPlusUploadFileStatus
  /** vant */
  objectUrl?: string
  content?: string
  isImage?: boolean
  message?: string
  deletable?: boolean
  reupload?: boolean
  /** antd */
  fileName?: string
  percent?: number
  thumbUrl?: string
  /** element-plus */
  percentage?: number
}
