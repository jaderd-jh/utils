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
   * - 过期后存储数据将被清除
   * - 应当用于特定时间点，例如：今天10点后切换回默认主题
   */
  expiresAt?: dayjs.ConfigType
  /**
   * 有效时间 ms
   * - 优先级低于 `expiresAt`
   * - 过期后若设置 `writeDefaults` = true 存储数据将被替换为默认值
   * - 应当用于有效时间，例如：本地草稿将保存 7 天
   */
  validTime?: number
  /**
   * 是否加解密
   */
  crypto?: boolean
}

/**
 * 类似 Storage
 */
export interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

/**
 * 类似 StorageEvent
 */
export interface StorageEventLike extends Pick<StorageEvent, 'key' | 'oldValue' | 'newValue'> {
  storageArea: StorageLike | null
}

declare global {
  interface WindowEventMap {
    'jade-storage': CustomEvent<StorageEventLike>
  }
}
