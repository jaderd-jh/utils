/**
 * increase when storage data structure changed
 * - result in clearing storage when version unmatched
 *
 * 0.1.0: `expires`（写入时刻）改为 `expiredAt`（绝对过期时刻）；
 *        `version` 开始参与校验，不匹配的旧数据在读取时被清理；
 *        `Date` 改为标记对象落库，读取时还原为 `Date`
 */
export const STORAGE_VERSION = '0.1.0'

/**
 * 读取存储数据的状态
 * - 不用 TS `enum`：根 tsconfig 开了 `erasableSyntaxOnly`，`enum` 不是可擦除语法（Node 无法直接 type-strip）
 * - `as const` 对象即可获得 `StorageStatus.Ok` 的枚举式写法，取值仍是普通字符串，落库/传输无额外开销
 */
export const StorageStatus = {
  /** 本库写入的信封，且版本与有效期校验通过 */
  Ok: 'ok',
  /** 本库写入的信封，但版本不匹配或已过期，调用方可以安全清理 */
  Stale: 'stale',
  /** 不是本库写入的信封，或解密失败（其它库的数据、密钥尚未就绪），不应清理 */
  Foreign: 'foreign',
} as const

/**
 * 读取存储数据的状态取值
 * - 与 `StorageStatus` 不同名：`ts/no-redeclare` 不允许同名的值 + 类型声明合并
 */
export type StorageStatusValue = (typeof StorageStatus)[keyof typeof StorageStatus]
