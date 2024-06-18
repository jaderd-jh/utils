export interface StorageObj<T = any> {
  data: T
  expires: number
}

/**
 * 存储配置
 * @param {number} [expires=undefined] - 过期时间 ms
 * @param {boolean} [crypto=false] - 是否加解密
 */
export interface StorageConfig {
  /**
   * 过期时间 ms
   */
  expires?: number
  /**
   * 是否加解密
   */
  crypto?: boolean
}
