export interface HostEnv {
  /**
   * 是否是浙里办
   */
  readonly zlb: boolean
  /**
   * 是否是专有钉
   */
  readonly zyd: boolean
  /**
   * 是否是浙政钉
   */
  readonly zzd: boolean
  /**
   * 是否是钉钉/专有钉/浙政钉
   */
  readonly dd: boolean
  /**
   * 是否是微信
   */
  readonly wx: boolean
  /**
   * 是否是支付宝
   */
  readonly zfb: boolean
  /**
   * 是否是小程序
   */
  readonly mini: boolean
}
