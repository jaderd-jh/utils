export interface StorageObj<T = any> {
  data: T
  expiresAt: number
  version: string
}

/**
 * 存储配置
 * @param {number} [expiresAt=undefined] - 过期时间 ms，优先级高于 validTime
 * @param {number} [validTime=undefined] - 有效时间 ms，优先级低于 expiresAt
 * @param {boolean} [crypto=false] - 是否加解密
 */
export interface StorageConfig {
  /**
   * 过期时间 ms，优先级高于 validTime
   */
  expiresAt?: number
  /**
   * 有效时间 ms，优先级低于 expiresAt
   */
  validTime?: number
  /**
   * 是否加解密
   */
  crypto?: boolean
}
