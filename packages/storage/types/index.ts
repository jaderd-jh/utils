export declare interface StorageObj<T = any> {
  data: T
  /**
   * 数据过期的绝对时刻（ms 时间戳）
   * - 到达该时刻后数据即失效
   * - `null` 表示永不过期
   */
  expiredAt: number | null
  version: string
}
