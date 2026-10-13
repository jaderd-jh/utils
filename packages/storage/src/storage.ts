import type { Nullable } from '@jhqn/utils-core'
import type { StorageObj } from '../types'
import { parseJSON, replacer, stringifyJSON } from '@jhqn/utils-core'
import { aes } from '@jhqn/utils-crypto/aes'
import { STORAGE_VERSION, StorageStatus } from './const'

export { aes }

/**
 * 读写通用的配置
 */
export interface StorageConfig {
  /**
   * 是否使用加密算法
   */
  crypto?: boolean
}

/**
 * 写入配置
 */
export interface SetStorageConfig extends StorageConfig {
  /**
   * 数据过期的绝对时刻（ms 时间戳）
   * - 到达该时刻后数据即失效
   * - 不传或传 `null` 表示永不过期
   */
  expiredAt?: number | null
}

/**
 * 兼容老版本的 `crypto?: boolean` 简写，统一归一化为配置对象
 * @param config 布尔简写或配置对象
 * @returns {SetStorageConfig} 归一化后的配置对象
 */
export function resolveStorageConfig(config?: boolean | SetStorageConfig): SetStorageConfig {
  return typeof config === 'boolean' ? { crypto: config } : { ...config }
}

const UNSERIALIZABLE_MESSAGE = '需要存储的 data 不支持 JSON.stringify 方法，请检查当前数据'

/**
 * 抛出统一的「不可序列化」错误
 * - 顶层数据与嵌套数据共用同一份报错，避免出现「顶层抛 Error、嵌套抛原生 TypeError」的分裂
 */
function throwUnserializable(): never {
  throw new Error(UNSERIALIZABLE_MESSAGE)
}

/**
 * 判断当前类型是否是Symbol
 * @param val 需要判断的值
 * @returns 当前参数是否是symbol
 */
function isSymbol(val: any): boolean {
  return typeof val === 'symbol'
}

/**
 * 判断当前值能否被 JSON.stringify 正确还原
 * - `undefined` / `Function` / `Symbol` / `BigInt` 会被 stringify 丢弃或直接抛错
 * - `Date` 会被 core 的 `replacer` 序列化成可还原的标记对象，因此是可存储的
 * @param data 需要判断的值
 * @returns 当前参数是否可以 string 化
 */
function hasStringify(data: any): boolean {
  if (data === undefined) {
    return false
  }

  if (data instanceof Function) {
    return false
  }

  // JSON.stringify 对 BigInt 会抛出原生 TypeError，这里提前拦截以给出统一报错
  if (typeof data === 'bigint') {
    return false
  }

  return !isSymbol(data)
}

/**
 * 存储用的 JSON replacer
 * - 复用 core 的 `replacer` 处理 `Date` / `Map` / `Set`
 * - 额外拦截嵌套的 `BigInt` / `Symbol` / `Function`：`JSON.stringify` 对 BigInt 会抛原生 TypeError，
 *   对 Symbol / Function 则静默丢弃，静默丢数据比报错更危险，因此统一抛出与顶层一致的错误
 * @param key JSON key
 * @param value JSON value
 */
function storageReplacer(this: any, key: string, value: any) {
  // 同 core 的 replacer：Date 会先被 `Date.prototype.toJSON` 改写，只能取持有者上的原始值来判断
  // JSON.stringify 一定会带上持有者（顶层是 `{ '': value }`），所以直接读 `this[key]` 即可
  const rawValue = this[key]

  if (typeof rawValue === 'bigint' || typeof rawValue === 'symbol' || typeof rawValue === 'function') {
    throwUnserializable()
  }

  return replacer.call(this, key, value)
}

/**
 * 归一化过期时刻
 * - 只有有限数字才是有效时刻，`NaN` / `±Infinity` 等非法值按「永不过期」处理
 * - 否则会被 `JSON.stringify` 静默写成 `null`，出现「写入的是非法值、读到的却是 null」的语义分裂
 * @param expiredAt 数据过期的绝对时刻（ms）
 */
function normalizeExpiredAt(expiredAt: Nullable<number>): Nullable<number> {
  return typeof expiredAt === 'number' && Number.isFinite(expiredAt) ? expiredAt : null
}

/**
 * 用于存储的序列化方法
 * @param {T} data 需要序列化的数据
 * @param {number | null} expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 * @returns {string} 返回序列化后的字符串
 */
export function storageStringify<T>(data: T, expiredAt: number | null = null): string {
  if (!hasStringify(data)) {
    throwUnserializable()
  }
  const saveData: StorageObj<T> = {
    data,
    expiredAt: normalizeExpiredAt(expiredAt),
    version: STORAGE_VERSION,
  }
  return stringifyJSON(saveData, storageReplacer)
}

/**
 * 用于存储的反序列化方法
 * - 只负责把字符串解析成对象，不校验信封结构（`version`/`expiredAt` 由 `getStorage`、`parseStorageData` 负责）
 * @param {string} data 需要反序列化的字符串
 * @returns {Nullable<StorageObj<T>>} 返回反序列化后的对象，非 JSON 对象返回 null
 */
export function storageParse<T>(data: string): Nullable<StorageObj<T>> {
  const content = parseJSON<StorageObj<T>>(data)
  // 只有对象才可能是信封结构，避免把 `123` 这类合法 JSON 当作 StorageObj 返回
  return content && typeof content === 'object' && !Array.isArray(content) ? content : null
}

/**
 * 判断存储中是否已经存在
 * @param storage
 * @param key
 */
export function hasStorage(storage: Storage, key: string): boolean {
  // 不能用 Object.hasOwn：key 与 Storage 成员（key/length/getItem/...）重名时不会被当作 own property
  return storage.getItem(key) !== null
}

/**
 * 判断本地存储中是否已经存在
 * @param key
 */
export const hasLocal = (key: string) => hasStorage(localStorage, key)

/**
 * 判断会话存储中是否已经存在
 * @param key
 */
export const hasSession = (key: string) => hasStorage(sessionStorage, key)

/**
 * 移除数据
 * @param storage
 * @param key
 */
export function removeStorage(storage: Storage, key: string) {
  if (hasStorage(storage, key)) storage.removeItem(key)
}

/**
 * 移除数据
 * @param storage
 * @param regex
 */
export function removeStorageAll(storage: Storage, regex?: RegExp) {
  if (!regex) {
    storage.clear()
    return
  }
  // `g` / `y` 会让 RegExp.test 携带 lastIndex 状态，导致命中间隔的 key 被跳过
  const pattern = regex.global || regex.sticky ? new RegExp(regex.source, regex.flags.replaceAll(/[gy]/g, '')) : regex
  // 必须用 key(i) + length 遍历：与 Storage 接口成员重名的 key（key/length/getItem…）
  // 不会被暴露为 own property，也就不会出现在 Object.keys 中
  for (let i = storage.length - 1; i >= 0; i -= 1) {
    const key = storage.key(i)
    if (key !== null && pattern.test(key)) {
      storage.removeItem(key)
    }
  }
}

/**
 * 移除数据
 * @param key
 */
export const removeLocal = (key: string) => removeStorage(localStorage, key)

/**
 * 移除数据
 * @param regex
 */
export const removeLocalAll = (regex?: RegExp) => removeStorageAll(localStorage, regex)

/**
 * 移除数据
 * @param key
 */
export const removeSession = (key: string) => removeStorage(sessionStorage, key)

/**
 * 移除数据
 * @param regex
 */
export const removeSessionAll = (regex?: RegExp) => removeStorageAll(sessionStorage, regex)

/**
 * 设置数据
 * @param storage
 * @param {string} key 设置当前存储key
 * @param {T} value 设置当前存储value
 * @param config
 * @param config.crypto 是否使用加密算法
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 */
export function setStorage<T>(storage: Storage, key: string, value: T, config: SetStorageConfig = {}) {
  const rawData = storageStringify(value, config.expiredAt ?? null)
  storage.setItem(key, config.crypto ? aes.encrypt(rawData) : rawData)
}

/**
 * 设置本地存储数据
 * @param {string} key 设置当前存储key
 * @param {T} value 设置当前存储value
 * @param config
 * @param config.crypto 是否使用加密算法
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 */
export const setLocal = <T = any>(key: string, value: T, config?: SetStorageConfig) =>
  setStorage(localStorage, key, value, config)

/**
 * 设置会话存储数据
 * @param {string} key 设置当前存储key
 * @param {T} value 设置当前存储value
 * @param config
 * @param config.crypto 是否使用加密算法
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 */
export const setSession = <T = any>(key: string, value: T, config?: SetStorageConfig) =>
  setStorage(sessionStorage, key, value, config)

/**
 * 解密并解析存储中的原始字符串
 * - 解密失败（未设置密钥 / 密钥不匹配 / 数据损坏）返回 null，不会抛错
 * @param raw 存储中的原始字符串
 * @param config
 * @param config.crypto 是否使用解密算法
 * @returns {Nullable<StorageObj<T>>} 原始信封结构，解析失败返回 null
 */
function decodeStorageObj<T>(raw: string, config: StorageConfig): Nullable<StorageObj<T>> {
  let json = raw
  if (config.crypto) {
    try {
      json = aes.decrypt(raw)
    } catch {
      return null
    }
  }

  return storageParse<T>(json)
}

/**
 * 判断信封结构是否已经到达过期时刻
 * @param expiredAt 到达该时刻（ms）数据即失效；`null` 或非法数值表示永不过期
 */
function isExpired(expiredAt: Nullable<number>): boolean {
  return typeof expiredAt === 'number' && Number.isFinite(expiredAt) && Date.now() >= expiredAt
}

/**
 * 判断解析结果是否本库写入的信封结构
 * - 必须同时带 `data` 字段与字符串 `version`，避免把其它库写在同名 key 上的 JSON 当成自己的数据
 * @param content 解析后的对象
 */
function isStorageEnvelope<T>(content: StorageObj<T>): boolean {
  return 'data' in content && typeof content.version === 'string'
}

/**
 * `readStorageRaw` 的解析结果
 * - `ok`：本库信封，且版本与有效期校验通过
 * - `stale`：本库信封，但版本不匹配或已过期，调用方可以安全清理
 * - `foreign`：不是本库信封，或解密失败（可能是其它库写入的数据，也可能是密钥尚未就绪），不应清理
 */
export type StorageReadResult<T> =
  | { data: Nullable<T>; status: typeof StorageStatus.Ok }
  | { status: typeof StorageStatus.Stale }
  | { status: typeof StorageStatus.Foreign }

/**
 * 解析存储中的原始字符串，并区分「可用 / 已失效 / 非本库数据」
 * - 只做解析，不会改动存储；由调用方根据状态决定是否清理失效数据
 * @param raw 存储中的原始字符串
 * @param config
 * @param config.crypto 是否使用解密算法
 */
export function readStorageRaw<T = any>(raw: Nullable<string>, config: StorageConfig = {}): StorageReadResult<T> {
  if (raw === null) {
    return { status: StorageStatus.Foreign }
  }

  const content = decodeStorageObj<T>(raw, config)
  if (!content || !isStorageEnvelope(content)) {
    return { status: StorageStatus.Foreign }
  }

  // 版本不匹配说明信封结构已经变更（通常由旧版本写入），过期则说明数据已失效
  if (content.version !== STORAGE_VERSION || isExpired(content.expiredAt)) {
    return { status: StorageStatus.Stale }
  }

  // 能通过信封校验就一定带 `data` 字段，JSON 里 `undefined` 也不会存在，直接取出即可
  return { data: content.data, status: StorageStatus.Ok }
}

/**
 * 解析原始字符串并返回其中的业务数据
 * - 数据不是本库写入的信封结构、版本不匹配或已过期时返回 null
 * - 解密失败按无数据处理，不会抛错
 * - 只做解析，不会清理存储中的原始数据
 * @param raw 存储中的原始字符串
 * @param config
 * @param config.crypto 是否使用解密算法
 * @returns {Nullable<T>} 业务数据
 */
export function parseStorageData<T = any>(raw: string, config: StorageConfig = {}): Nullable<T> {
  const result = readStorageRaw<T>(raw, config)
  return result.status === StorageStatus.Ok ? result.data : null
}

/**
 * 读取并校验存储中的信封结构
 * - 解密失败（未设置密钥/密钥不匹配/数据损坏）按无数据处理，且不会清理原始数据，避免误删
 * - 不是本库写入的信封结构（例如其它库写在同名 key 上的 JSON）不参与版本校验，也不会被清理
 * - 本库信封中版本不匹配（结构已变更）或已到达过期时刻的数据会被清理，并按无数据处理
 * @param storage
 * @param key
 * @param config
 */
function readStorageData<T>(storage: Storage, key: string, config: StorageConfig): Nullable<T> {
  const result = readStorageRaw<T>(storage.getItem(key), config)
  // 已失效的本库数据清理掉；不是本库的数据保持不动，避免误删其它库的数据
  if (result.status === StorageStatus.Stale) {
    removeStorage(storage, key)
  }

  return result.status === StorageStatus.Ok ? result.data : null
}

/**
 * 获取数据
 * @param storage
 * @param {string} key 获取当前数据key
 * @param config
 * @param config.crypto crypto 是否使用解密算法
 * @returns {Nullable<T>} 存储数据；key 不存在、数据已失效或 `data` 本身是 `null` 都返回 `null`
 *   （需要区分「key 不存在」时用 `hasStorage` 判断）
 */
export function getStorage<T = any>(storage: Storage, key: string, config: StorageConfig = {}): Nullable<T> {
  return readStorageData<T>(storage, key, config)
}

/**
 * 获取本地存储数据
 * @param {string} key 获取当前数据key
 * @param config
 * @param config.crypto crypto 是否使用解密算法
 * @returns {Nullable<T>} 存储数据
 */
export const getLocal = <T = any>(key: string, config: StorageConfig = {}) => getStorage<T>(localStorage, key, config)

/**
 * 获取会话存储数据
 * @param {string} key 获取当前数据key
 * @param config
 * @param config.crypto crypto 是否使用解密算法
 * @returns {Nullable<T>} 存储数据
 */
export const getSession = <T = any>(key: string, config: StorageConfig = {}) =>
  getStorage<T>(sessionStorage, key, config)
