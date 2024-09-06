import type { dayjs } from '@jhqn/utils-core'

export interface StorageObj<T = any> {
  data: T
  expiresAt: number
  version: string
}

/**
 * 存储配置
 * @param {number} [expiresAt=undefined] - 过期时间 ms
 * @param {number} [validTime=undefined] - 有效时间 ms
 * @param {boolean} [crypto=false] - 是否加解密
 */
export interface StorageConfig {
  /**
   * 过期时间 ms
   * - 优先级高于 `validTime`
   * - 设置该属性后，一旦数据过期，将忽略设置的默认值并返回 `null`
   */
  expiresAt?: dayjs.ConfigType
  /**
   * 有效时间 ms
   * - 优先级低于 `expiresAt`
   */
  validTime?: number
  /**
   * 是否加解密
   */
  crypto?: boolean
}
