import { type Nullable, isFunction, isSymbol, isUndefined, parseToJSON, stringifyFromJSON } from '@jhqn/utils-core'
import { aes } from '@jhqn/utils-crypto/aes'
import type { StorageConfig, StorageObj } from '../types'
import { STORAGE_EVENT_NAME, STORAGE_VERSION } from './const'

export { aes }

/**
 * 触发自定义 storage 事件
 * @param {CustomEvent<Partial<StorageEvent>>['detail']} detail - 自定义事件参数
 */
export function dispatchCustomStorageEvent(detail: CustomEvent<Partial<StorageEvent>>['detail']) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<Partial<StorageEvent>>(STORAGE_EVENT_NAME, { detail }))
  }
}

/**
 * 判断当前值是否能够被 JSON.stringify() 方法序列化
 * @param data 需要判断的值
 * @returns 当前参数是否可以序列化
 */
function serializable(data: any): boolean {
  return !(isSymbol(data) || isFunction(data) || isUndefined(data))
}

/**
 * 用于存储的带时间戳的序列化方法
 * @param {any} data - 需要序列化的数据
 * @param {StorageConfig} [config] - 序列化配置
 * @returns {string} 序列化后的字符串
 */
export function storageStringify(data: any, config: StorageConfig = {}): string {
  const rawData: StorageObj = {
    data,
    expiresAt: config.expiresAt
      ? Math.max(config.expiresAt, Date.now()) // 过期时间需大于当前时间
      : Date.now() + +(config.validTime || 0), // 当前时间 + 有效时间 = 过期时间
    version: STORAGE_VERSION,
  }
  return config?.crypto ? aes.encrypt(stringifyFromJSON(rawData)) : stringifyFromJSON(rawData)
}

/**
 * 用于存储的反序列化方法
 * @template T - 反序列化后的数据类型
 * @param {string} data - 需要反序列化的字符串
 * @param {StorageConfig} config - 存储配置项
 * @returns {T} 返回反序列化后的数据
 */
export function storageParse<T = any>(data: string, config: StorageConfig = {}): Nullable<T> {
  let deserializedData = parseToJSON<StorageObj<T>>(config.crypto ? aes.decrypt(data) : data)
  if (deserializedData) {
    // 配置了过期时间或者有效时间 并且数据过期了
    if ((config.expiresAt || config.validTime) && Date.now() - deserializedData.expiresAt >= 0) {
      deserializedData = null
    }
    // 数据格式版本不一致
    if (deserializedData?.version !== STORAGE_VERSION) {
      deserializedData = null
    }
  }
  return deserializedData && !isUndefined(deserializedData?.data) ? deserializedData.data : null
}

/**
 * 判断存储中是否已经存在
 * @param storage
 * @param key
 */
export function hasStorage(storage: Storage, key: string): boolean {
  return storage.getItem(key) !== null
}

/**
 * 判断存储中是否已经存在
 * @param key
 */
export const hasLocal = (key: string) => hasStorage(localStorage, key)

/**
 * 判断存储中是否已经存在
 * @param key
 */
export const hasSession = (key: string) => hasStorage(sessionStorage, key)

/**
 * 移除数据
 * @param storage
 * @param key
 */
export function removeStorage(storage: Storage, key: string) {
  storage.removeItem(key)
}

/**
 * 移除数据
 * @param storage
 * @param regex
 */
export function removeStorageAll(storage: Storage, regex?: RegExp) {
  Object.getOwnPropertyNames(storage).forEach(key => {
    if (regex ? regex.test(key) : true) {
      removeStorage(storage, key)
    }
  })
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
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export function setStorage<T = any>(storage: Storage, key: string, value: T, config: StorageConfig = {}) {
  if (serializable(value)) {
    storage.setItem(key, storageStringify(value, config))
  } else {
    throw new TypeError('待写入数据不支持 JSON.stringify()', { cause: value })
  }
}

/**
 * 设置数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export const setLocal = <T = any>(key: string, value: T, config?: StorageConfig) =>
  setStorage(localStorage, key, value, config)

/**
 * 设置数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export const setSession = <T = any>(key: string, value: T, config?: StorageConfig) =>
  setStorage(sessionStorage, key, value, config)

/**
 * 获取数据
 * @param storage
 * @param {string} key 获取当前数据key
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export function getStorage<T = any>(storage: Storage, key: string, config: StorageConfig = {}): Nullable<T> {
  return hasStorage(storage, key) ? storageParse<T>(<string>storage.getItem(key), config) : null
}

/**
 * 获取数据
 * @param {string} key 当前数据键名
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export const getLocal = <T = any>(key: string, config?: StorageConfig) => getStorage<T>(localStorage, key, config)

/**
 * 获取数据
 * @param {string} key - 当前数据键名
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export const getSession = <T = any>(key: string, config?: StorageConfig) => getStorage<T>(sessionStorage, key, config)
